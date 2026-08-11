"""Export the PSD snowbank group as lossless sponsor background WebPs."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from psd_tools import PSDImage


def find_group(group, target_name: str):
    for layer in group:
        if layer.is_group() and (layer.name or "").strip().lower() == target_name:
            return layer
        if layer.is_group():
            match = find_group(layer, target_name)
            if match is not None:
                return match
    return None


def export_snowbanks(source_path: Path, output_dir: Path) -> None:
    psd = PSDImage.open(source_path)
    group = find_group(psd, "snowbank")
    if group is None:
        raise RuntimeError("PSD group 'snowbank' was not found")

    output_dir.mkdir(parents=True, exist_ok=True)
    exported = []
    for index, layer in enumerate(group, start=1):
        if layer.is_group():
            continue

        image = layer.composite(force=True)
        if image is None:
            raise RuntimeError(f"Unable to render snowbank/{layer.name or index}")

        image = image.convert("RGBA")
        output_name = f"snowbank-{index}.webp"
        image.save(output_dir / output_name, "WEBP", lossless=True, method=6, exact=True)

        x1, y1, x2, y2 = layer.bbox
        exported.append(
            {
                "file": f"/art/sponsors/{output_name}",
                "sourceLayerName": layer.name,
                "size": "large" if index <= 4 else "small",
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

    manifest = {
        "source": source_path.name,
        "canvas": {"width": psd.width, "height": psd.height},
        "snowbanks": exported,
    }
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    export_snowbanks(args.source.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
