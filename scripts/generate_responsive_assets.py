"""Generate responsive scene and mobile hero WebP assets."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
WEBP_OPTIONS = {"quality": 85, "method": 6, "exact": True}

SCENE_DESIGN_WIDTH = 3049
SCENE_WIDTHS = (1280, 1920)
SCENE_LAYERS = (
    "sky",
    "cloud-1",
    "cloud-2",
    "cloud-3",
    "cloud-4",
    "cloud-5",
    "cloud-6",
    "hill-near",
    "hill-far",
    "parliament-tower",
    "parliament-roof",
    "parliament-towers",
    "bush-1",
    "bush-2",
    "bush-3",
    "bush-4",
    "road",
    "water",
    "ice-1",
    "ice-2",
    "logs",
    "footer-water",
    "footer-water-2",
)

HERO_DESIGN_WIDTH = 1920
HERO_WIDTHS = (480, 768, 1024, 1280)
HERO_LAYERS = (
    "sky",
    "cloud1",
    "cloud2",
    "cloud3",
    "cloud4",
    "cloud5",
    "cloud6",
    "hill1",
    "hill2",
    "foreground",
)


def generate(
    source_dir: Path,
    output_dir: Path,
    layers: tuple[str, ...],
    design_width: int,
    widths: tuple[int, ...],
) -> None:
    for layer in layers:
        source_path = source_dir / f"{layer}.webp"
        with Image.open(source_path) as source:
            source = source.convert("RGBA")
            for canvas_width in widths:
                width = round(source.width * canvas_width / design_width)
                height = round(source.height * canvas_width / design_width)
                destination = output_dir / str(canvas_width) / source_path.name
                destination.parent.mkdir(parents=True, exist_ok=True)
                resized = source.resize((width, height), Image.Resampling.LANCZOS)
                resized.save(destination, "WEBP", **WEBP_OPTIONS)
                print(f"{destination.relative_to(ROOT)}: {width}x{height}")


def main() -> None:
    generate(
        ROOT / "public/art/scene",
        ROOT / "public/art/scene/responsive",
        SCENE_LAYERS,
        SCENE_DESIGN_WIDTH,
        SCENE_WIDTHS,
    )
    generate(
        ROOT / "src/assets/Hero",
        ROOT / "public/art/hero/responsive",
        HERO_LAYERS,
        HERO_DESIGN_WIDTH,
        HERO_WIDTHS,
    )


if __name__ == "__main__":
    main()
