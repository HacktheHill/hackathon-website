# Private photo asset pipeline

Install Python 3, Pillow with WebP support and boto3. Run from the repository root. Keep every output directory outside this checkout.

```bash
python3 scripts/photos/pipeline.py build \
  --source-root '/path/attendee-distribution/FullQuality' \
  --quick-root '/path/attendee-distribution/QuickShare' \
  --output-root '/private/path/photo-gallery-assets'
python3 scripts/photos/pipeline.py verify \
  --output-root '/private/path/photo-gallery-assets'
python3 scripts/photos/seed_sql.py --help
python3 scripts/photos/uploader.py --help
# OAuth remote-binding owner utility (staging PHOTO_BUCKET only)
node scripts/photos/r2-binding-upload.mjs upload \
  --inventory '/private/path/photo-gallery-assets/pipeline-inventory.json' \
  --assets-root '/private/path/photo-gallery-assets' --workers 4 --verify
```

The build uses category plus filename to generate a deterministic opaque ID. JPEG variants are copied without re-encoding. Only thumbnails and previews are encoded to WebP, with no enlargement, exact ICC preservation and stripped EXIF/XMP. `pipeline-inventory.json` is private and records paths, keys, hashes, dimensions and byte sizes. `browser-manifest.json` omits private paths and R2 object keys and supplies relative media routes.

The uploader supports inventory creation, no-network dry runs, bounded concurrent uploads and verification. Use `--help` for each subcommand. Credentials come from boto3's provider chain; use a dedicated private R2 bucket-scoped credential and do not place credentials in source files or command arguments. A checkpoint may skip unchanged local objects, but the final verification must still check every expected remote key and size. Use complete remote byte-hash verification for the initial release; do not describe sampled hash verification as full byte verification.

For production verification, make the complete byte pass explicit:

```bash
python3 scripts/photos/uploader.py verify \
  --inventory '/private/path/photo-gallery-assets/pipeline-inventory.json' \
  --assets-root '/private/path/photo-gallery-assets' \
  --bucket 'private-gallery-bucket' \
  --endpoint-url 'https://account-id.r2.cloudflarestorage.com' \
  --all-bytes \
  --output '/private/path/photo-gallery-assets/r2-verification.json'
```

The verifier reports `byteHashMode: "all"` for this command. Without `--all-bytes`, it reports `byteHashMode: "sample"` and the sampled count; both modes still check every expected HEAD, content type, metadata hash, and the complete remote key listing for missing or extra objects.

`r2-binding-upload.mjs` is the owner-side alternative that uses Wrangler OAuth and `getPlatformProxy({ remoteBindings: true })`. It creates a temporary config containing only the staging `PHOTO_BUCKET` binding, omits D1 and production bindings, streams file-backed bodies with known lengths and a 6 MiB hash read bound, and limits work to four concurrent objects. `upload --verify` writes a resumable checkpoint and a verification report after checking every expected HEAD, every downloaded byte SHA-256, the complete remote listing, content type, and custom SHA-256 metadata. It refuses any account or bucket other than the configured staging account and `hack-the-hill-photo-gallery-staging`.

The object key is relative to `objects/`: `<id>/<content-version>/<variant>.<extension>`. Do not include the local `objects/` directory name as an extra R2 prefix. SQL publication version starts at integer `1`; it is separate from the hash-derived object path version. Moderation increments the publication version without changing the encoded photo bytes.

`seed_sql.py` emits an idempotent initial-import script. Photo and variant conflicts use `ON CONFLICT ... DO NOTHING`, so rerunning the import cannot republish a quarantined or withdrawn photo, reset its moderation revision, or replace keys and hashes already controlled by the service. Asset replacements require an explicit publication migration. The generated SQL has no explicit `BEGIN`/`COMMIT` wrapper because Wrangler D1 owns statement transactions. Run the regression tests with `python -m unittest scripts/photos/test_seed_sql.py -v`.

The generated quality report compares selected face, detail and projector examples to resized approved masters. It verifies derivative fidelity and metadata; it does not select a new crop or re-grade the accepted master. Changes to approved edits require a separate visual review and rebuilt inventory.

Never copy original photos, private inventories, eligibility exports or uploader checkpoints into the website's public/build directory. Do not add photo binaries to Git.
