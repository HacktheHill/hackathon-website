"""Export only wanchor.psd layers 15–20, preserving native bounds and stacking order."""
import argparse
import json
from pathlib import Path

from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
args = parser.parse_args()
out = Path(__file__).resolve().parents[1] / "public/art/presentation/anchor"
out.mkdir(parents=True, exist_ok=True)
psd = PSDImage.open(args.source)
requested = {f"Layer {number}" for number in range(15, 21)}
layers = [layer for layer in psd.descendants() if layer.name in requested]
if {layer.name for layer in layers} != requested:
    raise ValueError("The PSD must contain all six requested layers (15–20).")
manifest = {"canvas": {"width": psd.width, "height": psd.height}, "layers": []}
for layer in layers:
    layer.visible = True
    image = layer.composite()
    name = layer.name.lower().replace(" ", "-")
    image.save(out / f"{name}.webp", lossless=True)
    manifest["layers"].append({
        "name": name, "sourceName": layer.name,
        "x": layer.left, "y": layer.top,
        "width": image.width, "height": image.height,
    })
(out / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
