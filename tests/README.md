# Browser checks

`npm run test:e2e` builds the site, serves it on port 4338, and runs the Playwright suites in Chromium and Firefox. Each file under `e2e/` covers one area of the page. The countdown suite pins the clock to the date in `helpers/time.ts` so its results do not depend on when it runs.

The footer suite intercepts the subscription endpoint and never contacts the real service. It checks the POST body, the disabled input while a request is pending, the guard against double submission, the accepted response, each error response, a network failure, and editing the address after an error, in both languages.

## Water overlap in the FAQ test

The FAQ expansion test waits for the selected water image to decode before measuring. Responsive WebP variants have whole-pixel dimensions, so their aspect ratio can differ slightly from the source image. The test subtracts that measured height difference, then checks for the intended 2px overlap to 0.05px and separately fails on any gap. Without that adjustment the assertion failed whenever the 1920px variant was the one that loaded.
