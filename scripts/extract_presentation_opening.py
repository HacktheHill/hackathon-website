"""Export separate opening artwork layers from the supplied socials PSD."""
import argparse
import json
import re
from pathlib import Path

from psd_tools import PSDImage

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / "public/art/presentation/opening"
out.mkdir(parents=True, exist_ok=True)
psd = PSDImage.open(args.source)
board = next(layer for layer in psd if layer.name == "Hero copy 4")
origin_x, origin_y, right, _ = board.bbox
manifest = []
for layer in board:
    if layer.kind != "pixel" or not layer.visible:
        continue
    name = re.sub(r"[^a-z0-9]+", "-", layer.name.lower()).strip("-")
    image = layer.composite()
    image.save(out / f"{name}.webp", quality=93)
    manifest.append({"name": name, "x": layer.left - origin_x,
                     "y": layer.top - origin_y, "width": image.width,
                     "height": image.height})

# The supplied wordmark is its own asset. Date and ceremony text remain HTML.
wordmark = next(layer for layer in board if layer.name == "Group 1")
for layer in wordmark:
    if layer.kind == "type" and ("Sept." in layer.name or "Apply now!" in layer.name):
        layer.visible = False
visible = [layer for layer in wordmark if layer.visible]
box = (min(layer.left for layer in visible), min(layer.top for layer in visible),
       max(layer.right for layer in visible), max(layer.bottom for layer in visible))
wordmark.composite(viewport=box).save(out / "wordmark.webp", quality=96)
data = {"canvasWidth": right - origin_x, "layers": manifest,
        "wordmark": {"x": box[0] - origin_x, "y": box[1] - origin_y,
                     "width": box[2] - box[0], "height": box[3] - box[1]}}
(out / "manifest.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
print(f"Exported {len(manifest)} separate layers and the wordmark.")
