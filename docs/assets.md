# Artwork

Day-to-day development uses the checked-in images. Do not regenerate them for a code-only change.

`src/assets/` holds the imported hero layers, organization logos, and the 404 mascot. Astro fingerprints these, so their URLs change between builds. `public/art/` holds the scene, particle, and snowbank images at stable URLs, including the responsive variants, and `public/Logos/` holds logos at stable URLs. Anything under `public/` may be linked from outside this repository, so an unused import is not enough reason to delete a public file.

## Export tools

The scripts need Python 3.10 or newer. Pillow resizes images and `psd-tools` reads Photoshop files.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install Pillow psd-tools
.venv/bin/python scripts/extract_psd_layers.py /path/to/source.psd /tmp/hth-scene-export
.venv/bin/python scripts/extract_psd_particles.py /path/to/source.psd /tmp/hth-particle-export
.venv/bin/python scripts/extract_psd_snowbanks.py /path/to/source.psd /tmp/hth-snowbank-export
```

The PSD is not in this repository and is not needed to build the site. Export to a temporary directory first, then compare the manifest, dimensions, and images against the checked-in artwork before replacing anything. The layer exporter maps PSD layer names to the stable scene names and records each layer's source coordinates in its manifest. The particle and snowbank exporters find their named PSD groups through `psd_helpers.py`.

After replacing source artwork on purpose, generate the responsive variants from the repository root:

```sh
.venv/bin/python scripts/generate_responsive_assets.py
```

This writes to `public/art/scene/responsive/` and `public/art/hero/responsive/`. The full scene is produced at canvas widths 1280 and 1920, and the mobile hero at 480, 768, 1024, and 1280. Those width lists must match `Scene/sceneImages.ts` and `Hero/assets.ts`.

Runtime placement lives in `Scene/sceneLayers.ts`. The export manifest only records source geometry, so regenerating it does not move anything on the page. The logs are deliberately placed away from their source position so the frame fits the video.

Responsive variants have whole-pixel dimensions, which can shift their aspect ratio slightly from the source. The FAQ water test accounts for that. After changing images, look at both languages with the FAQ expanded at mobile, tablet, desktop, and ultrawide widths, then run the [browser checks](../tests/README.md).
