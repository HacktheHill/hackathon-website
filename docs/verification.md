# Refactor verification

The reference is untouched `main` at `86c6552697c019a4262c0c8b1388c2ea4971aa55`. The local `2026-rebuild` branch merges that main into the existing rebuild branch, then records the refactor in separate conventional commits. At verification time, no commits had been pushed. The sibling `hackathon-website` checkout was not used as the reference or edited.

The checked application source tree is `90f0eb920b6e6016f8f9b92e98ad91cf874fc2e3`. Checks finished on September 13, 2026, on macOS with Node 24.15.0 and npm 11.12.1. Remote main and rebuild tips were unchanged at the final check.

The final review before PR preparation checked the extracted hooks, content modules, image helpers, dependency changes, and deployment boundaries. It removed one extra blank line in the Python helper. The application source tree remains the one tested below, and `git diff --check` passes.

## Completed checks

| Check                                                           | Result                                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Clean checkout, `npm ci`                                        | Passed using a separate checkout and npm cache                                |
| ESLint                                                          | Passed                                                                        |
| Astro and TypeScript checks                                     | Passed with no errors, warnings, or hints                                     |
| Production build                                                | Passed on both untouched main and the refactor                                |
| Chromium and Firefox behavior tests                             | 122 passed                                                                    |
| Development server interaction checks                           | 10 passed across Chromium and Firefox                                         |
| Public files and generated public copies                        | All 293 byte-identical to main                                                |
| Home and 404 metadata, including structured data                | Identical to main                                                             |
| Generated sitemaps                                              | Byte-identical to main                                                        |
| Remaining translations                                          | All 110 English and 110 French keys used; values identical to main            |
| Retained dependency versions, resolutions, and integrity hashes | Unchanged; 54 unused lockfile entries removed                                 |
| Python shared PSD traversal                                     | Compiled and checked against the original helper with synthetic nested groups |

The behavior suite covers responsive artwork selection and positioning, FAQ expansion, language switching, countdown phases and focus, carousel controls and swipes, particles, the video frame, and the newsletter form. Newsletter tests mock the endpoint and verify the request body and response handling. They send no real subscriptions.

The original suite had one failure on unchanged main: the FAQ water test assumed a responsive image had exactly the source aspect ratio. The updated test waits for decoding, accounts for whole-pixel image rounding, and still requires the intended 2px overlap with no gap. Production geometry did not change.

## Visual comparison

The direct comparison suite builds and serves main and the refactor independently. It covers both languages at 48 viewport sizes, FAQ and carousel interactions, countdown states, and the 404 page in Chromium and Firefox. It compares page content, dimensions, browser errors, and pixels. See [the reproduction instructions](../tests/README.md).

The full run finished with **216 passes and 2 failures** in 16.5 minutes. Each failed case passed one explicit recheck with unchanged code. All **218 distinct browser/scenario cases** have a byte-identical original/candidate image pair. The first run's failures remain recorded:

-   Chromium, French, 320 by 568: 1,131 changed pixels confined to a filtered sponsor snowbank. Page dimensions and content matched. The recheck matched the original image on its first capture.
-   Firefox, English, 481 by 1024: the untouched original could not decode the external `nyah-wagner.webp` portrait. No candidate capture occurred in that attempt. The recheck loaded the images and matched exactly.

Chromium also produced different filtered snowbank pixels when comparing main with itself. The comparison navigates one foreground page through the two builds. On a mismatch it may take up to four additional captures of untouched main, repeating the same interactions. The complete candidate image must exactly match one actual original capture. Every sample and initial mismatch is retained. No artwork is hidden and no changed pixels are allowed. In the full run, 214 passes matched the first original capture; English 320px matched the third, and French 600px matched the second. Both explicit rechecks matched their first original capture.

Local evidence is in `test-results/parity/`, `test-results/parity-recheck/`, and `test-results/verification/parity-summary.json`. Each case records the URLs, original samples, matched filename, SHA256 hashes, content, browser errors, and pixel counts. `build-contract.json` records the public-file and metadata comparison. These generated results are ignored by Git; the test code and this report are committed.

The FAQ interaction case waits for the existing 48px footer clearance after opening each answer. Opening another answer while the previous resize update was still pending produced different extension heights on unchanged main. The comparison waits for that visible layout update before sending the next keypress. Production calculations are unchanged.

Chrome was also inspected through Computer Use at desktop and mobile sizes. The local Chrome profile blocks JavaScript on the preview origin. Live interaction review in that profile is pending permission to allow JavaScript; automated browser interaction tests passed independently.

## Scope and deployment limits

Application markup, copy, public artwork, routes, metadata, countdown dates, and the subscription contract are preserved. Larger components now keep their data and browser effects in adjacent files. App composition is 92 lines, the hero renderer is 182, and the largest source stylesheet is 408. Unused legacy sections, translations, imported assets, and dependencies were removed. Public URLs were retained.

`astro.config.mjs`, the route files, layout, package script commands, and `.github/workflows/dependency-review.yml` are unchanged. The repository's only GitHub Actions workflow reviews dependency changes. Its actual PR run, any hosting configuration outside this repository, and production deployment were not exercised. A passing local build cannot guarantee those external systems.

Online `npm audit` returns the same nine findings and advisory records for main and this branch: one moderate, seven high, and one critical. This refactor adds no dependency and does not upgrade retained packages. Those inherited findings need a separate dependency update.

Static screenshots use reduced motion and a fixed date. Normal-motion behavior is covered by the regular browser suite. Live third-party video playback, delivery by the subscription service, and PSD export using an original Photoshop file were not tested.

The supplied `matias-io/uo-multi-agent` reference was unavailable through GitHub, so its source could not be reviewed. The folder structure and documentation follow the stated requirements for short modules, clear ownership, and direct setup instructions.
