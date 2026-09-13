# Browser checks

`npm run test:e2e` builds the site, serves it on port 4338, and runs the behavioral checks in Chromium and Firefox. The suites are grouped by the page area they exercise. `helpers/time.ts` supplies the fixed date used by countdown checks.

The footer tests intercept the subscription endpoint. They check the POST body, disabled pending state, duplicate submission guard, accepted response, error responses, network failure, and editing after an error in both languages. They do not contact the subscription service.

## Compare against main

The parity suite compares the candidate directly with a separately built, untouched checkout of main. Keep that checkout and its build unchanged during the comparison. It captures the original, then navigates the same foreground browser page to the candidate. Each navigation reloads the app and reapplies the requested language and interactions. Keeping the page in the foreground lets animation frames and resize observers run before each capture.

1. Build and serve the original on `http://127.0.0.1:4337`.
2. Build and serve the candidate on `http://127.0.0.1:4338`.
3. Run `PARITY=1 npm run test:e2e -- --project=chromium`.

Use `--project=firefox` to repeat the comparison in Firefox. Neither command rebuilds or starts a server in parity mode. A single case can be selected with `--grep 'home en 1440x900'`.

Each capture must settle to two consecutive identical frames. Each case writes reference and candidate PNGs, SHA256 hashes, decoded pixel difference counts, page content, and browser errors under `test-results/`. Different captures also produce a magenta difference image. The comparison allows zero changed pixels and no page-size difference. It has no command to accept the candidate as a baseline.

Chromium sometimes produced different pixels around unchanged sponsor image filters when comparing main against itself, including on a single page. If the first images differ, the suite captures main up to four more times. The complete candidate image must match one actual original capture exactly. Every original sample, difference image, and comparison count is retained. Each sample must also match the first original's content, response status, and browser errors. The comparison JSON identifies the matching sample, and `*-reference.png` contains that original capture. If no sample matches, the test fails.

`REFERENCE_URL` and `CANDIDATE_URL` override the default server addresses. To check whether a failure also occurs when comparing original main against itself:

```sh
CANDIDATE_URL=http://127.0.0.1:4337 PARITY=1 npm run test:e2e -- --project=chromium --grep 'home en 511x1024'
```

This keeps the same zero-pixel tolerance. An original-against-original failure means the reference does not reproduce that capture consistently; investigate timing and rendering before changing application code.

`parity/viewports.ts` lists the sizes. The matrix covers English and French, phone through ultrawide, and the active scene's width and height boundaries. Separate cases cover all FAQ answers open, the next testimonial, the countdown dialog and focus restoration, and the 404 page. The current 404 is English-only and has no language switch. The header has persistent controls and no menu.

On desktop, the FAQ check waits for the existing 48px footer clearance after each keyboard activation before opening the next answer. The page updates that spacing through a resize observer and animation frame. Waiting for the rendered result avoids sending the next input while the previous layout adjustment is still pending.

Captures use a fixed pre-event date, device scale 1, loaded fonts and images, and reduced motion. Browser screenshot capture finishes finite CSS animations and cancels infinite ones. These are static visual comparisons; the regular suites test normal-motion behavior, including particles, carousel transitions, and scrolling. External artwork and the video poster must load successfully. A third-party playback service is not exercised by the screenshot suite.

## Water continuation assertion

The FAQ expansion test waits for the selected water image to decode. Responsive WebP dimensions round to whole pixels, so their aspect ratio can differ slightly from the source image's declared dimensions. The test subtracts that measured height difference before checking the intended 2px overlap to 0.05px precision, and separately rejects a gap. This fixes an assertion that failed on unchanged main when the 1920px image finished loading.
