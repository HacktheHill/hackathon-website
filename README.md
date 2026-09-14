# Hack the Hill website

Source for [hackthehill.com](https://hackthehill.com), the 2026 event site. Astro builds two static pages, the home page and a 404. React runs on the home page for the language switch, countdown, testimonial carousel, particles, and newsletter form. Nothing else is dynamic.

## Run locally

You need Node 22.12 or newer and npm 9.6.5 or newer.

```sh
npm ci
npm run dev
```

The site is served at `http://localhost:4321`. No environment variables or backend services are needed to render it. The newsletter form posts to the live subscription service, so avoid submitting real addresses while testing by hand. The browser tests mock that endpoint.

## Find the code

```text
src/
  pages/             Home and 404 routes
  layouts/           HTML shell, metadata, fonts, analytics
  components/
    App/             Home page composition
    Scene/           Full-page artwork, positioning, scroll effects
    Hero/            Mobile artwork, heading, clock countdown
    About/           Introduction and video embed
    Stats/           Illustrated statistics signs
    Testimonials/    Carousel markup, behavior, and content
    Sponsors/        Organization list and logo rendering
    FAQ/             Native details/summary accordions
    Footer/          Social links and newsletter subscription
    Navigation/      Header and language switch
    Button/          Shared link/button styling
    FourOFour/       Error page
  i18n/              Typed translation lookup and locale store
  locales/           English and French copy
  assets/            Imported images, processed by Astro
public/              Files served at stable URLs, including scene artwork
scripts/             Optional artwork export tools
tests/               Browser behavior checks
```

Each component owns its styles. Browser behavior with state lives in a hook next to the component that uses it, and content lists sit next to whatever renders them.

## Common edits

| Change                                   | Start here                                       |
| ---------------------------------------- | ------------------------------------------------ |
| English or French copy                   | `src/locales/en.ts` and `fr.ts`                  |
| Sponsors or collaborators                | `src/components/Sponsors/sponsorData.ts`         |
| Testimonial order or portraits           | `src/components/Testimonials/testimonialData.ts` |
| Countdown phase dates                    | `src/components/Hero/countdown.ts`               |
| Scene measurements or parallax speeds    | `src/components/Scene/sceneLayers.ts`            |
| Desktop or mobile section positioning    | `src/components/Scene/styles/`                   |
| Newsletter endpoint or response handling | `src/components/Footer/useSubscription.ts`       |
| Social metadata and canonical URLs       | `src/layouts/Layout.astro`                       |
| Event structured data                    | `public/structured-data.json`                    |

An event date change touches four places: the countdown dates, both locale files, the layout description, and the structured data. They are separate output formats, so updating one does not update the others.

## Check a change

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Run `npx playwright install chromium firefox` once to get the test browsers. `npm run build` writes to `build/`, and `npm run preview` serves that folder.

For more detail, [architecture](docs/architecture.md) explains how the scene and components fit together, [browser checks](tests/README.md) describes the test suites, and [artwork](docs/assets.md) covers the optional Python export tools.

The only GitHub Actions workflow reviews dependency changes. Lint, type checks, the build, and the browser tests run locally.

## Contributing

External contributions are not accepted at the moment. Team members should read the [contribution guidelines](https://github.com/HacktheHill/.github/blob/main/CONTRIBUTING.md). Questions go to [development@hackthehill.com](mailto:development@hackthehill.com).

Copyright © 2023 Hack the Hill. All Rights Reserved.
