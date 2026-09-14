# Artwork

Normal development uses checked-in images. Do not regenerate them to make a code-only change.

`src/assets/` contains imported hero layers, organization logos, and the 404 mascot. Astro fingerprints these assets. `public/art/` contains stable scene, particle, and snowbank URLs, including responsive variants. `public/Logos/` also contains stable public URLs. A public file may be linked outside this repository, so a missing source import alone is not evidence that it can be removed.

## Optional export tools

Use Python 3.10 or newer in a virtual environment. Pillow resizes images; `psd-tools` reads Photoshop files.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install Pillow psd-tools
.venv/bin/python scripts/extract_psd_layers.py /path/to/source.psd /tmp/hth-scene-export
.venv/bin/python scripts/extract_psd_particles.py /path/to/source.psd /tmp/hth-particle-export
.venv/bin/python scripts/extract_psd_snowbanks.py /path/to/source.psd /tmp/hth-snowbank-export
```

The PSD is not required to run the website and is not included here. Export to a temporary directory first. Compare the manifest, dimensions, and images before replacing checked-in artwork. The layer exporter maps PSD names to the stable scene names and records source layer coordinates in its manifest. The particle and snowbank exporters look up named PSD groups using `psd_helpers.py`.

After intentionally replacing source artwork, generate responsive variants from the repository root:

```sh
.venv/bin/python scripts/generate_responsive_assets.py
```

This command writes under `public/art/scene/responsive/` and `public/art/hero/responsive/`. It uses canvas widths 1280 and 1920 for the full scene, and 480, 768, 1024, and 1280 for the mobile hero. Keep these lists aligned with `Scene/sceneImages.ts` and `Hero/assets.ts`.

Runtime placement lives in `Scene/sceneLayers.ts`; the export manifest records source geometry. The logs have an intentional runtime placement adjustment to fit the video frame. Regenerating a manifest does not change that adjustment.

Responsive dimensions round to whole pixels. Tests account for the small resulting aspect-ratio difference when checking the FAQ water overlap. Review image changes in both languages, with expanded FAQs, at mobile, tablet, desktop, and ultrawide sizes, and run the [browser checks](../tests/README.md).
