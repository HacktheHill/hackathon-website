"""Export the requested original layers, including hidden Layer 2, without resizing."""
import argparse
import json
from pathlib import Path

from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
args = parser.parse_args()
out = Path(__file__).resolve().parents[1] / "public/art/presentation/icons"
out.mkdir(parents=True, exist_ok=True)
psd = PSDImage.open(args.source)
manifest = []
for number in [2, 3, 4, 5, 7, 8, 9]:
    layer = next(layer for layer in psd if layer.name == f"Layer {number}")
    layer.visible = True
    image = layer.composite()
    name = f"layer-{number}"
    image.save(out / f"{name}.webp", lossless=True)
    manifest.append({"name": name, "width": image.width, "height": image.height})
(out / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Exported {len(manifest)} original layers with transparency.")
