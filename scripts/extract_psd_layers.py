"""Export every pixel-bearing PSD leaf layer as a native-size WebP asset."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from psd_tools import PSDImage


OUTPUT_NAME_OVERRIDES = {
    "background": "sky",
    "bhill": "hill-near",
    "bhiill2": "hill-far",
    "cloud1": "cloud-1",
    "cloud2": "cloud-2",
    "cloud3": "cloud-3",
    "cloud4": "cloud-4",
    "cloud5": "cloud-5",
    "cloud6": "cloud-6",
    "parl-tower": "parliament-tower",
    "parl-roof-markers": "parliament-roof",
    "texture": "parliament-towers",
    "bush1": "bush-1",
    "bush2": "bush-2",
    "bush3": "bush-3",
    "bush4": "bush-4",
    "ice2": "ice-1",
    "ice": "ice-2",
    "footerwater": "footer-water",
}


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    return slug or "unnamed-layer"


def iter_leaf_layers(group, parent_names=(), parent_indices=()):
    for index, layer in enumerate(group):
        names = (*parent_names, layer.name or "Unnamed Layer")
        indices = (*parent_indices, index)
        if layer.is_group():
            yield from iter_leaf_layers(layer, names, indices)
        else:
            x1, y1, x2, y2 = layer.bbox
            if x2 > x1 and y2 > y1:
                yield layer, names, indices


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def export_layers(source_path: Path, output_dir: Path) -> None:
    psd = PSDImage.open(source_path)
    output_dir.mkdir(parents=True, exist_ok=True)

    leaves = list(iter_leaf_layers(psd))
    base_names = [
        OUTPUT_NAME_OVERRIDES.get(slugify(layer.name or ""), slugify(layer.name or ""))
        for layer, _, _ in leaves
    ]
    totals = Counter(base_names)
    occurrences: Counter[str] = Counter()
    stack_order: list[str] = []
    layers: dict[str, object] = {}

    for layer, names, indices in leaves:
        base_name = OUTPUT_NAME_OVERRIDES.get(
            slugify(layer.name or ""), slugify(layer.name or "")
        )
        occurrences[base_name] += 1
        output_name = (
            base_name
            if totals[base_name] == 1 or occurrences[base_name] == 1
            else f"{base_name}-{occurrences[base_name]}"
        )
        output_path = output_dir / f"{output_name}.webp"

        image = layer.composite(force=True)
        if image is None:
            raise RuntimeError(f"Unable to render layer {'/'.join(names)!r}")
        image = image.convert("RGBA")
        image.save(output_path, "WEBP", lossless=True, method=6, exact=True)

        x1, y1, x2, y2 = layer.bbox
        stack_order.append(output_name)
        layers[output_name] = {
            "file": f"/art/scene/{output_name}.webp",
            "sourceLayerName": layer.name,
            "sourceLayerPath": list(names),
            "photoshopIndexPath": list(indices),
            "bbox": {
                "x": x1,
                "y": y1,
                "width": x2 - x1,
                "height": y2 - y1,
            },
            "exported": {"width": image.width, "height": image.height},
            "visible": layer.is_visible(),
            "opacity": layer.opacity,
        }
        print(
            f"{output_name}.webp: {image.width}x{image.height} "
            f"from {'/'.join(names)}"
        )

    manifest = {
        "source": source_path.name,
        "sourceSha256": sha256(source_path),
        "exportedAt": datetime.now(timezone.utc).isoformat(),
        "canvas": {"width": psd.width, "height": psd.height},
        "format": "WebP lossless RGBA",
        "exportScale": 1,
        "layerCount": len(layers),
        "stackOrderBottomToTop": stack_order,
        # Retain the original key for compatibility with earlier consumers.
        "stackOrder": stack_order,
        "layers": layers,
    }
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    export_layers(args.source.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
