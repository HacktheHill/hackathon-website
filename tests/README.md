# Browser checks

`npm run test:e2e` builds the site, serves it on port 4338, and runs the behavioral checks in Chromium and Firefox. The suites are grouped by the page area they exercise. `helpers/time.ts` supplies the fixed date used by countdown checks.

The footer tests intercept the subscription endpoint. They check the POST body, disabled pending state, duplicate submission guard, accepted response, error responses, network failure, and editing after an error in both languages. They do not contact the subscription service.

## Water continuation assertion

The FAQ expansion test waits for the selected water image to decode. Responsive WebP dimensions round to whole pixels, so their aspect ratio can differ slightly from the source image's declared dimensions. The test subtracts that measured height difference before checking the intended 2px overlap to 0.05px precision, and separately rejects a gap. This fixes an assertion that failed on unchanged main when the 1920px image finished loading.
