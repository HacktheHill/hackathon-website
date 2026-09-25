# Presentation artwork

`mlh-logo-color.png` is the unmodified logo supplied by the user, used on the dedicated MLH slide immediately after Ciena.

The three `socials-*.webp` assets were exported from the user-supplied `C:/Users/afaqv/Downloads/ocials.psd` with psd-tools `layer.composite()`. Source layers: `Layer 20` and `Layer 20 copy` in `Hero copy 5` (road signs), and `Layer 21` in `Hero copy 6` (envelope).

Original layer aspect ratios and transparency are preserved. Text remains live HTML; the PSD's promotional copy is not included. Other scene, sponsor, and particle images are reused from the website.

`icons/` contains layers 2, 3, 4, 5, 7, 8, and 9 from the user-supplied `hackthehill slide icons.psd`. Each is exported at its original dimensions as a lossless transparent WebP, including the initially hidden Layer 2. Regenerate with `scripts/extract_presentation_icons.py <path-to-psd>`. They decorate the land acknowledgement, agenda, welcome, and presidents’ address slides.

`discord-qr.png` encodes the organizer-supplied `https://discord.gg/NNnZ4KYAS` invite. Generated with Python qrcode using medium error correction, a four-module quiet zone, and 16 pixels per module; verified with ZXing against the rendered 720p presentation. `track-the-hack-qr.png` encodes `https://tracker.hackthehill.com/schedule`.

`opening/` contains the separate visible pixel layers from the `Hero copy 4` artboard and its isolated wordmark. `manifest.json` records original positions and dimensions on the 3072-pixel-wide artboard. The scenery lives in the same moving landscape as the rest of the presentation; no flattened cover is used. The date is live HTML, and the application text is omitted. Regenerate these assets with `scripts/extract_presentation_opening.py <path-to-ocials.psd>`.

`hthrecap_2.mp4` is the supplied timer recap, optimized to 1080p H.264 at CRF 20 with its original audio retained. `blackout-training.mp4` is derived from the supplied `hthtraining.mp4` using `scripts/prepare_blackout_video.py`; its English captions are in `blackout-training.vtt`. The training copy includes the final tape-failure effect and cut to black. Original source videos and PSD files are not needed at runtime.
