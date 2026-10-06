#!/usr/bin/env python3
"""Build and verify the private attendee-photo publish inventory.

The source folders are deliberately outside this repository.  FullQuality and
QuickShare JPEGs are copied byte-for-byte; only the 640px thumbnail and 1600px
preview are encoded here as WebP.  Derived WebP files retain the source ICC
profile but contain no EXIF/XMP/GPS metadata.  The private inventory records
source paths and object keys; browser-manifest.json contains neither.

Examples:
  python pipeline.py build --source-root /path/FullQuality \
    --quick-root /path/QuickShare --output-root /path/photo-gallery-assets
  python pipeline.py verify --output-root /path/photo-gallery-assets
  python pipeline.py build --dry-run --source-root ... --quick-root ...
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops, ImageStat


PIPELINE_VERSION = "webp-v1-2026-10-06"
THUMBNAIL_EDGE = 640
PREVIEW_EDGE = 1600
EXPECTED_VARIANTS = ("full", "quick", "thumbnail", "preview")
JPEG_SUFFIXES = {".jpg", ".jpeg"}


def sha256_file(path: Path, block_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        while block := stream.read(block_size):
            digest.update(block)
    return digest.hexdigest()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def json_dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def atomic_copy(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.stat().st_size == source.stat().st_size:
        # Size is only a fast path; the caller verifies hashes after building.
        if sha256_file(destination) == sha256_file(source):
            return
    with tempfile.NamedTemporaryFile(prefix=destination.name + ".", dir=destination.parent, delete=False) as stream:
        temporary = Path(stream.name)
    try:
        shutil.copyfile(source, temporary)
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)


def atomic_write_bytes(destination: Path, payload: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() == payload:
        return
    with tempfile.NamedTemporaryFile(prefix=destination.name + ".", dir=destination.parent, delete=False) as stream:
        stream.write(payload)
        temporary = Path(stream.name)
    try:
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)


def image_dimensions(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        return image.size


def private_source_metadata(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        icc = image.info.get("icc_profile")
        return {
            "width": image.width,
            "height": image.height,
            "iccPresent": bool(icc),
            "iccSha256": sha256_bytes(icc) if icc else None,
            "format": image.format,
            "mode": image.mode,
        }


def encode_webp(source: Path, edge: int) -> tuple[bytes, tuple[int, int]]:
    """Encode a no-upscale, ICC-preserving, metadata-stripped WebP."""
    with Image.open(source) as opened:
        opened.load()
        icc = opened.info.get("icc_profile")
        image = opened.convert("RGB")
        image.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        dimensions = image.size
        with tempfile.NamedTemporaryFile(suffix=".webp") as stream:
            # Pillow writes only the supplied ICC profile.  Do not pass exif,
            # xmp, or comment fields from the source JPEG.
            image.save(stream, format="WEBP", quality=92, method=6, icc_profile=icc)
            stream.flush()
            stream.seek(0)
            return stream.read(), dimensions


def relative_source_files(root: Path) -> list[Path]:
    files = [path for path in root.rglob("*") if path.is_file() and path.suffix.lower() in JPEG_SUFFIXES]
    for path in files:
        relative = path.relative_to(root)
        if len(relative.parts) != 2:
            raise ValueError(f"source file must be directly inside a category folder: {relative}")
    return sorted(files, key=lambda path: path.relative_to(root).as_posix().casefold())


def validate_category_sets(full_root: Path, quick_root: Path, files: list[Path]) -> None:
    expected = {path.relative_to(full_root).as_posix() for path in files}
    actual = {path.relative_to(quick_root).as_posix() for path in relative_source_files(quick_root)}
    if expected != actual:
        missing = sorted(expected - actual)
        extra = sorted(actual - expected)
        raise ValueError(f"QuickShare mismatch: missing={missing[:3]} extra={extra[:3]}")


def variant_record(path: Path, object_key: str, *, source: str | None = None) -> dict[str, Any]:
    dimensions = image_dimensions(path)
    record: dict[str, Any] = {
        "objectKey": object_key,
        "contentType": "image/jpeg" if path.suffix.lower() in JPEG_SUFFIXES else "image/webp",
        "size": path.stat().st_size,
        "sha256": sha256_file(path),
        "dimensions": {"width": dimensions[0], "height": dimensions[1]},
    }
    if source is not None:
        record["source"] = source
    return record


def make_quality_sample(items: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Choose stable review samples by scene role, without face recognition."""
    wanted = {
        "face": ("Opening Ceremony", "DSC_3416.jpg"),
        "detail": ("CGI Event", "20260926_134438.jpg"),
        "projector": ("Opening Ceremony", "DSC_3414.jpg"),
    }
    lookup = {(item["category"], item["filename"]): item for item in items}
    samples: list[dict[str, str]] = []
    for role, (category, filename) in wanted.items():
        item = lookup.get((category, filename))
        if item:
            samples.append({"role": role, "category": category, "filename": filename, "id": item["id"]})
    return samples


def quality_metrics(source: Path, generated: Path) -> dict[str, Any]:
    """Record objective checks useful for human review, not a quality score."""
    with Image.open(source) as original, Image.open(generated) as derived:
        original_rgb = original.convert("RGB")
        # Resize source to the output dimensions for a fair colour/difference
        # check.  This is deliberately diagnostic; it does not replace review.
        resized = original_rgb.resize(derived.size, Image.Resampling.LANCZOS)
        difference = ImageChops.difference(resized, derived.convert("RGB"))
        mean_delta = sum(ImageStat.Stat(difference).mean) / 3
        source_stat = ImageStat.Stat(resized)
        derived_stat = ImageStat.Stat(derived.convert("RGB"))
        return {
            "sourceDimensions": {"width": original.width, "height": original.height},
            "derivedDimensions": {"width": derived.width, "height": derived.height},
            "meanAbsoluteRgbDelta": round(mean_delta, 4),
            "sourceMeanRgb": [round(value, 3) for value in source_stat.mean],
            "derivedMeanRgb": [round(value, 3) for value in derived_stat.mean],
            "iccPreserved": bool(derived.info.get("icc_profile")),
            "iccSha256Matches": (
                sha256_bytes(derived.info.get("icc_profile")) == sha256_bytes(original.info.get("icc_profile"))
                if original.info.get("icc_profile") and derived.info.get("icc_profile") else False
            ),
            "metadataStripped": not any(key in derived.info for key in ("exif", "xmp", "comment")),
        }


def build(args: argparse.Namespace) -> int:
    full_root = Path(args.source_root).expanduser().resolve()
    quick_root = Path(args.quick_root).expanduser().resolve()
    output_root = Path(args.output_root).expanduser().resolve()
    if not full_root.is_dir() or not quick_root.is_dir():
        raise SystemExit("source-root and quick-root must be existing directories")
    files = relative_source_files(full_root)
    validate_category_sets(full_root, quick_root, files)
    if not files:
        raise SystemExit("no JPEG files found")
    categories = sorted({path.relative_to(full_root).parts[0] for path in files}, key=str.casefold)
    if args.dry_run:
        print(json.dumps({"photos": len(files), "categories": len(categories), "categoryNames": categories}, ensure_ascii=False, indent=2))
        return 0

    output_root.mkdir(parents=True, exist_ok=True)
    items: list[dict[str, Any]] = []
    generated_quality: list[dict[str, Any]] = []
    for source in files:
        relative = source.relative_to(full_root)
        category, filename = relative.parts
        quick = quick_root / relative
        source_hash = sha256_file(source)
        photo_id = hashlib.sha256(f"{category}/{filename}".encode("utf-8")).hexdigest()[:20]
        version = source_hash
        photo_root = output_root / "objects" / photo_id / version
        full_destination = photo_root / "full.jpg"
        quick_destination = photo_root / "quick.jpg"
        atomic_copy(source, full_destination)
        atomic_copy(quick, quick_destination)
        thumbnail_payload, thumbnail_dimensions = encode_webp(source, THUMBNAIL_EDGE)
        preview_payload, preview_dimensions = encode_webp(source, PREVIEW_EDGE)
        thumbnail_destination = photo_root / "thumbnail.webp"
        preview_destination = photo_root / "preview.webp"
        atomic_write_bytes(thumbnail_destination, thumbnail_payload)
        atomic_write_bytes(preview_destination, preview_payload)

        source_meta = private_source_metadata(source)
        variants = {
            "full": variant_record(full_destination, f"{photo_id}/{version}/full.jpg", source="FullQuality"),
            "quick": variant_record(quick_destination, f"{photo_id}/{version}/quick.jpg", source="QuickShare"),
            "thumbnail": variant_record(thumbnail_destination, f"{photo_id}/{version}/thumbnail.webp", source="derived"),
            "preview": variant_record(preview_destination, f"{photo_id}/{version}/preview.webp", source="derived"),
        }
        if variants["full"]["sha256"] != source_hash:
            raise ValueError(f"full copy changed source bytes: {relative}")
        quick_hash = sha256_file(quick)
        if variants["quick"]["sha256"] != quick_hash:
            raise ValueError(f"quick copy changed source bytes: {relative}")
        item = {
            "id": photo_id,
            "category": category,
            "filename": filename,
            "version": version,
            "versionHash": version,
            "sourcePath": str(source),
            "quickSourcePath": str(quick),
            "source": source_meta,
            "variants": variants,
            "dimensions": source_meta | {},
        }
        item["dimensions"] = {"width": source_meta["width"], "height": source_meta["height"]}
        items.append(item)
        if (category, filename) in {
            ("Opening Ceremony", "DSC_3416.jpg"),
            ("Opening Ceremony", "DSC_3414.jpg"),
            ("CGI Event", "20260926_134438.jpg"),
        }:
            generated_quality.append({
                "category": category,
                "filename": filename,
                "id": photo_id,
                "roles": [role for role, pair in {
                    "face": ("Opening Ceremony", "DSC_3416.jpg"),
                    "projector": ("Opening Ceremony", "DSC_3414.jpg"),
                    "detail": ("CGI Event", "20260926_134438.jpg"),
                }.items() if pair == (category, filename)],
                "thumbnail": quality_metrics(source, thumbnail_destination),
                "preview": quality_metrics(source, preview_destination),
            })

    items.sort(key=lambda item: (item["category"].casefold(), item["filename"].casefold()))
    private_inventory = {
        "schemaVersion": 1,
        "pipelineVersion": PIPELINE_VERSION,
        "sourceRoots": {"fullQuality": str(full_root), "quickShare": str(quick_root)},
        "counts": {"photos": len(items), "categories": len(categories), "variants": len(items) * 4},
        "categories": categories,
        "photos": items,
    }
    # Browser output intentionally excludes source paths, private source
    # metadata, hashes and object keys. The service resolves media routes after
    # authentication and publication checks.
    browser_photos = []
    for item in items:
        browser_photos.append({
            "id": item["id"],
            "category": item["category"],
            "filename": item["filename"],
            "version": item["version"],
            "width": item["dimensions"]["width"],
            "height": item["dimensions"]["height"],
            "thumbnail": {"url": f"/photos/media/{item['id']}/thumbnail", "bytes": item["variants"]["thumbnail"]["size"], **item["variants"]["thumbnail"]["dimensions"]},
            "preview": {"url": f"/photos/media/{item['id']}/preview", "bytes": item["variants"]["preview"]["size"], **item["variants"]["preview"]["dimensions"]},
            "downloads": {
                "full": {"width": item["variants"]["full"]["dimensions"]["width"], "height": item["variants"]["full"]["dimensions"]["height"], "bytes": item["variants"]["full"]["size"]},
                "quick": {"width": item["variants"]["quick"]["dimensions"]["width"], "height": item["variants"]["quick"]["dimensions"]["height"], "bytes": item["variants"]["quick"]["size"]},
            },
        })
    browser_manifest = {"version": PIPELINE_VERSION, "photos": browser_photos}
    json_dump(output_root / "pipeline-inventory.json", private_inventory)
    json_dump(output_root / "browser-manifest.json", browser_manifest)
    quality_report = {
        "pipelineVersion": PIPELINE_VERSION,
        "method": "Objective resized RGB delta and ICC/metadata checks; human review remains required for face readability, detail, projector lighting, crop and colour.",
        "samples": make_quality_sample(items),
        "comparisons": generated_quality,
    }
    json_dump(output_root / "quality-report.json", quality_report)
    print(json.dumps({"photos": len(items), "categories": len(categories), "variants": len(items) * 4, "output": str(output_root)}, ensure_ascii=False, indent=2))
    return 0


def verify(args: argparse.Namespace) -> int:
    output_root = Path(args.output_root).expanduser().resolve()
    inventory_path = output_root / "pipeline-inventory.json"
    if not inventory_path.exists():
        raise SystemExit(f"missing inventory: {inventory_path}")
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    photos = inventory.get("photos", [])
    errors: list[str] = []
    expected_keys: set[str] = set()
    for item in photos:
        if len(item.get("id", "")) != 20:
            errors.append(f"invalid id for {item.get('filename')}")
        expected_id = hashlib.sha256(f"{item['category']}/{item['filename']}".encode()).hexdigest()[:20]
        if item["id"] != expected_id:
            errors.append(f"unstable id for {item['category']}/{item['filename']}")
        source = Path(item["sourcePath"])
        quick_source = Path(item["quickSourcePath"])
        if not source.is_file() or not quick_source.is_file():
            errors.append(f"missing source for {item['category']}/{item['filename']}")
            continue
        if sha256_file(source) != item["versionHash"]:
            errors.append(f"source hash mismatch for {item['category']}/{item['filename']}")
        source_meta = private_source_metadata(source)
        if not source_meta["iccPresent"]:
            errors.append(f"source ICC missing for {item['category']}/{item['filename']}")
        for name in EXPECTED_VARIANTS:
            variant = item["variants"].get(name)
            if not variant:
                errors.append(f"missing variant record {name} for {item['id']}")
                continue
            key = variant["objectKey"]
            expected_keys.add(key)
            destination = output_root / "objects" / key
            if not destination.is_file():
                errors.append(f"missing object {key}")
                continue
            actual_size = destination.stat().st_size
            actual_hash = sha256_file(destination)
            if actual_size != variant["size"] or actual_hash != variant["sha256"]:
                errors.append(f"object hash/size mismatch {key}")
            dimensions = image_dimensions(destination)
            if tuple(variant["dimensions"].values()) != dimensions:
                errors.append(f"object dimensions mismatch {key}")
            if name in ("full", "quick") and destination.read_bytes() != (source if name == "full" else quick_source).read_bytes():
                errors.append(f"JPEG bytes were re-encoded for {key}")
            if name in ("thumbnail", "preview"):
                if destination.suffix.lower() != ".webp":
                    errors.append(f"derived variant is not WebP {key}")
                with Image.open(destination) as image:
                    if not image.info.get("icc_profile"):
                        errors.append(f"derived ICC missing {key}")
                    elif sha256_bytes(image.info["icc_profile"]) != source_meta["iccSha256"]:
                        errors.append(f"derived ICC changed {key}")
                    if any(tag in image.info for tag in ("exif", "xmp", "comment")):
                        errors.append(f"derived privacy metadata present {key}")
                    limit = THUMBNAIL_EDGE if name == "thumbnail" else PREVIEW_EDGE
                    if max(image.size) > min(limit, max(source_meta["width"], source_meta["height"])):
                        errors.append(f"derived variant upscaled {key}")
    actual_files = {
        path.relative_to(output_root / "objects").as_posix()
        for path in (output_root / "objects").rglob("*")
        if path.is_file()
    }
    if actual_files != expected_keys:
        errors.append(f"object set mismatch expected={len(expected_keys)} actual={len(actual_files)}")
    browser_manifest = json.loads((output_root / "browser-manifest.json").read_text(encoding="utf-8"))
    browser_text = json.dumps(browser_manifest, ensure_ascii=False)
    if "sourcePath" in browser_text or "quickSourcePath" in browser_text or "objectKey" in browser_text:
        errors.append("browser manifest contains private source/object paths")
    summary = {"photos": len(photos), "categories": len(inventory.get("categories", [])), "variants": len(expected_keys), "errors": errors}
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 1 if errors else 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    build_parser = subparsers.add_parser("build")
    build_parser.add_argument("--source-root", required=True)
    build_parser.add_argument("--quick-root", required=True)
    build_parser.add_argument("--output-root", required=True)
    build_parser.add_argument("--dry-run", action="store_true")
    build_parser.set_defaults(handler=build)
    verify_parser = subparsers.add_parser("verify")
    verify_parser.add_argument("--output-root", required=True)
    verify_parser.set_defaults(handler=verify)
    args = parser.parse_args()
    try:
        return args.handler(args)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
