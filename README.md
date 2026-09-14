# Hack the Hill website

The 2026 event website at [hackthehill.com](https://hackthehill.com). Astro builds two static pages. React handles the home page's language switch, countdown, carousel, particles, and subscription form.

## Run locally

Use Node 22.12 or newer and npm 9.6.5 or newer. The refactor was checked with Node 24.15 and npm 11.12.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. There are no environment variables or backend services to configure for local rendering. The newsletter form uses a live external endpoint; browser tests mock it.

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
tests/               Browser behavior and original-versus-refactor comparisons
```

Each component keeps its own styles. Stateful browser behavior lives in a named hook next to the component. Content lists live next to their renderer.

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

For an event date change, update the countdown, both locales, layout description, and structured data together. These files serve different output formats; changing one does not update the others.

## Check a change

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Install the test browsers once with `npx playwright install chromium firefox`. The production build goes to `build/`. `npm run preview` serves that build locally.

[Architecture](docs/architecture.md) explains the scene and component boundaries. [Browser checks](tests/README.md) explains the test suites. [Artwork](docs/assets.md) covers optional Python tools.

The repository's GitHub Actions workflow reviews dependency changes. It does not run these local build and browser checks. Deployment configuration and public files remain unchanged by this refactor.

## Contributing

External contributions are not currently accepted. Team members should read the [contribution guidelines](https://github.com/HacktheHill/.github/blob/main/CONTRIBUTING.md). Contact [development@hackthehill.com](mailto:development@hackthehill.com).

Copyright © 2023 Hack the Hill. All Rights Reserved.
