"""Export the leaves, snow, and bubbles PSD groups as particle WebPs."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from psd_tools import PSDImage


PARTICLE_GROUPS = {
    "leaves": "leaf",
    "snow": "snow",
    "bubbles": "bubble",
}


def find_group(group, target_name: str):
    for layer in group:
        if layer.is_group() and (layer.name or "").strip().lower() == target_name:
            return layer
        if layer.is_group():
            match = find_group(layer, target_name)
            if match is not None:
                return match
    return None


def export_particles(source_path: Path, output_dir: Path) -> None:
    psd = PSDImage.open(source_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, object] = {
        "source": source_path.name,
        "canvas": {"width": psd.width, "height": psd.height},
        "groups": {},
    }

    for group_name, file_prefix in PARTICLE_GROUPS.items():
        group = find_group(psd, group_name)
        if group is None:
            raise RuntimeError(f"PSD group {group_name!r} was not found")

        exported = []
        for index, layer in enumerate(group, start=1):
            if layer.is_group():
                continue

            image = layer.composite(force=True)
            if image is None:
                raise RuntimeError(
                    f"Unable to render {group_name}/{layer.name or index}"
                )

            image = image.convert("RGBA")
            output_name = f"{file_prefix}-{index}.webp"
            output_path = output_dir / output_name
            image.save(output_path, "WEBP", lossless=True, method=6, exact=True)

            x1, y1, x2, y2 = layer.bbox
            exported.append(
                {
                    "file": f"/art/particles/{output_name}",
                    "sourceLayerName": layer.name,
                    "bbox": {
                        "x": x1,
                        "y": y1,
                        "width": x2 - x1,
                        "height": y2 - y1,
                    },
                    "exported": {"width": image.width, "height": image.height},
                }
            )
            print(f"{output_name}: {image.width}x{image.height}")

        manifest["groups"][group_name] = exported

    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    export_particles(args.source.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
