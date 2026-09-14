# Refactor verification

The final reference is untouched `main` at `64e69cdcb9ebf3f01477defd1b0f32b0e8a5962a`. The local `2026-rebuild` branch merges main into the existing rebuild branch and records the refactor in conventional commits. This includes main's npm 10 lockfile fixes and subsequent dependency updates. At verification time, no commits had been pushed. The sibling `hackathon-website` checkout was not used as the reference or edited.

The checked application source tree is `90f0eb920b6e6016f8f9b92e98ad91cf874fc2e3`. Final checks ran on September 13, 2026, on macOS with Node 24.15.0. Separate clean installs passed with npm 10.9.9 and npm 11.12.1. Both installs left the lockfile unchanged.

## Completed checks

| Check                                                           | Result                                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Clean checkout and dependency installation                      | Passed with npm 10 and npm 11                                                 |
| ESLint                                                          | Passed in both clean candidate checkouts                                      |
| Astro and TypeScript checks                                     | No errors, warnings, or hints in either checkout                              |
| Production build                                                | Passed on current main and both candidate checkouts                           |
| Chromium and Firefox behavior tests                             | 122 passed after the final dependency merge                                   |
| Development server interaction checks                           | 10 passed across Chromium and Firefox                                         |
| Public files and generated public copies                        | All 293 byte-identical to current main                                        |
| Home and 404 metadata, including structured data                | Identical to current main                                                     |
| Generated sitemaps                                              | Byte-identical to current main                                                |
| Remaining translations                                          | All 110 English and 110 French keys used; values unchanged                    |
| Retained dependency versions, resolutions, and integrity hashes | Identical to current main; 52 unused lockfile entries removed                 |
| Python shared PSD traversal                                     | Compiled and checked against the original helper with synthetic nested groups |
| Final diff review                                               | `git diff --check` passed                                                     |

The behavior suite covers responsive artwork, FAQ expansion, language switching, countdown phases and focus, carousel controls and swipes, particles, the video frame, and the newsletter form. Newsletter tests mock the endpoint and verify the request body and response handling. They send no real subscriptions.

The original suite had one failure on unchanged main: the FAQ water test assumed a responsive image had exactly the source aspect ratio. The updated test waits for decoding, accounts for whole-pixel image rounding, and still requires the intended 2px overlap with no gap. Production geometry did not change.

The npm 10 and npm 11 candidate builds match except for Astro's internal island UID in `index.html`. All other 333 files are byte-identical. The working checkout also has the updated dependencies and builds successfully. Build comparisons are recorded in `test-results/verification/current-main-builds.json`.

## Visual comparison

The direct comparison suite builds and serves current main and the refactor independently. It covers both languages at 48 viewport sizes, FAQ and carousel interactions, countdown states, and the 404 page in Chromium and Firefox. It compares page content, dimensions, browser errors, and pixels. See [the reproduction instructions](../tests/README.md).

The final full run finished with **215 passes and 3 failures** in 29.8 minutes. Each failed case passed one explicit recheck with unchanged code. All **218 distinct browser/scenario cases** have a byte-identical original/candidate image pair. The first run's failures remain recorded:

- Firefox, English, 1799 by 900: candidate navigation did not reach the load event within 120 seconds.
- Firefox, French, 1799 by 900: external MLH badge and testimonial images failed to decode on untouched main.
- Firefox, English, 1800 by 900: the same external images failed to decode on untouched main.

Chromium produced different filtered snowbank pixels when comparing the original site with itself. The comparison navigates one foreground page through the two builds. On a mismatch it may take up to four additional captures of untouched main, repeating the same interactions. The complete candidate image must exactly match one actual original capture. Every sample and initial mismatch is retained. No artwork is hidden and no changed pixels are allowed.

In the final full run, 212 passes matched the first original capture. Chromium English 320px and English/French 1201px matched the second. All three explicit Firefox rechecks matched their first original capture.

Final evidence is in `test-results/parity-current-main/`, `test-results/parity-current-main-recheck/`, and `test-results/verification/current-main-parity-summary.json`. Each case records the URLs, original samples, matched filename, SHA256 hashes, content, browser errors, and pixel counts. Generated results are ignored by Git; the test code and this report are committed.

The earlier full matrix against main at `86c6552` also produced exact pairs for all 218 cases, with 216 initial passes and two explicit rechecks. Its original snowbank mismatch and external-portrait load failure remain in `test-results/parity/`, `test-results/parity-recheck/`, and `test-results/verification/parity-summary.json`. A subsequent 24-case comparison after the npm 10 fix at `6fb5355` passed in full. The final matrix above supersedes those results for the current dependency set.

The FAQ interaction case waits for the existing 48px footer clearance after opening each answer. Opening another answer while the previous resize update was still pending produced different extension heights on unchanged main. The comparison waits for that visible layout update before sending the next keypress. Production calculations are unchanged.

Chrome was also checked through Computer Use at desktop and 390 by 844 mobile sizes. English/French switching, countdown opening and Escape focus restoration, carousel pointer/keyboard controls, and FAQ expansion worked. JavaScript ran on the final preview reload, resolving the earlier profile restriction. The temporary viewport override was reset.

## Size and scope

Application source, excluding imported assets, decreased from 8,124 to 6,526 lines. App composition is 92 lines, the hero renderer is 182, and the largest source stylesheet is 408. Larger components keep their data and browser effects in adjacent files. Unused legacy sections, translations, imported assets, selectors, and dependencies were removed. Public URLs were retained.

The three generated JavaScript bundles total 301,164 bytes on current main and 292,542 bytes on the refactor. Gzipping each bundle gives totals of 97,200 and 94,680 bytes. This is an 8,622-byte raw reduction and a 2,520-byte gzip reduction; load-time performance was not benchmarked. Measurements are in `test-results/verification/javascript-bytes.json`.

The existing canvas model, page structure, copy, public artwork, routes, metadata, countdown dates, and subscription contract are preserved. The final review checked extracted hooks, content modules, image helpers, dependency changes, and deployment boundaries. Its only additional source cleanup was one extra blank line in the Python helper.

`astro.config.mjs`, route files, the layout, package script commands, and `.github/workflows/dependency-review.yml` are unchanged by the refactor. The repository's only GitHub Actions workflow reviews dependency changes. Its actual PR run, hosting configuration outside this repository, and production deployment were not exercised. A passing local build cannot guarantee those external systems.

Online `npm audit` returns identical advisory records for current main and this branch: one high-severity finding in `nanoid`, [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8). Main's dependency updates reduced the earlier nine findings to one. The refactor adds no dependency or retained-package version change relative to the final main reference.

Static screenshots use reduced motion and a fixed date. Normal-motion behavior is covered by the regular browser suite. Live third-party video playback, delivery by the subscription service, and PSD export using an original Photoshop file were not tested.

The supplied `matias-io/uo-multi-agent` reference was unavailable through GitHub, so its source could not be reviewed. The folder structure and documentation follow the stated requirements for short modules, clear ownership, and direct setup instructions.
