# Hack the Hill Website

The 2026 event website at [hackthehill.com](https://hackthehill.com). Astro builds the website and presentation routes. React handles the home page's language switch, countdown, carousel, particles, and subscription form.

## Run locally

Use Node 22.12 or newer and npm 9.6.5 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. There are no environment variables or backend services to configure for local rendering. The newsletter form uses a live external endpoint; browser tests mock it.

## Opening ceremony presentation

Open `http://localhost:4321/slides` after starting the dev server. The 18-slide presentation uses the website's artwork and fonts, with a camera that moves down the landscape as slides advance. The stage always stays 16:9; other screen shapes are letterboxed.

- Arrow keys, Space, Enter, or Page Down advance; Page Up or Shift+Space go back.
- `F` toggles fullscreen; Home/End jump to the first/last slide.
- Mouse-wheel gestures advance one slide at a time. The screen contains only slides: no controls, overview, slide numbers, footer labels, or progress bar.
- A URL fragment such as `/slides#schedule` opens a specific slide. Reduced-motion preferences disable transitions and particles. English and French headings use the same typography.

Edit ceremony order, camera positions, and presenter notes in `src/components/Presentation/slides.ts`; layouts are in `Presentation.tsx`. Sponsor and collaborator logos come from the current website. The sequence ends with challenges, run of show, competition rules, judging, next steps, then Track the Hack and Discord. There is no guest-speaker slide. Run of show has eight scheduled events in `scheduleEvents` in `presentationContent.ts`: each advance moves the full-width timeline to the next event, then cuts to the training video after event eight; after playback, the next advance cuts to hackathon rules. Reverse navigation retraces the events; returning from hackathon rules passes through the black slide before event eight. Home/End still jump to the first/last slide.

There is no dedicated UOSU slide; UOSU remains in the sponsor overview. Venue rules are separate from competition rules. The three venue signs in `presentationContent.ts` contain the organizers’ food, safety, and outlet rules. They first appear in English on crown signs; advancing flips the individually tilted signs around to reveal French shield faces without moving the camera. The larger food, no-smoking, and power pictograms stay stationary on the right while the text signs flip. The middle sign leans opposite to the outer two. French sign text uses sentence case. The next advance continues to sponsors; backward navigation retraces the language stages. Reduced motion switches the signs immediately. The challenges section starts with an overview of three main tracks and six mini-challenges, then presents each individually on subsequent advances; backward navigation retraces them. CGI, ElevenLabs, MLH, and MathemaTech logos accompany their sponsored challenges. Judging criteria and submission instructions remain pending. Land acknowledgement, presidents’ address, and judging remain section titles for spoken content.

The final slide contains QR codes for the organizer-supplied Discord invite and `https://tracker.hackthehill.com/schedule`. Update `url` and `qrSrc` together in `presentationContent.ts` when replacing a destination, and verify the generated QR asset decodes to the exact URL.

Run the focused browser checks with `npm run test:e2e -- tests/e2e/slides.spec.ts tests/e2e/blackout-video.spec.ts`.

The judging anchor uses only layers 15–20 from `wanchor.psd`. Re-export with `python scripts/extract_presentation_anchor.py <path-to-wanchor.psd>`; `public/art/presentation/anchor/manifest.json` records each original layer's position and dimensions. The artwork travels with the landscape, while chain layers 16–20 sway slightly (disabled for reduced motion).

## Countdown timer

Open `http://localhost:4321/timer` for the opening artwork and an automatically running 10-minute countdown. `+` (or `=`) adds one minute; `-` subtracts one minute. Numpad keys also work. At zero, the timer fades to black, plays `public/art/presentation/hthrecap_2.mp4` with sound, then fades into the opening slide of the preloaded `/slides` deck. The whole video is downloaded to a Blob before playback; if it is still loading at zero, the screen stays black until ready. If the browser blocks autoplay with sound, click **Play recap** or press Enter. Slide keyboard navigation works after playback. Timer adjustments stop once the sequence begins; reload to reset to 10 minutes. Digits slide as they change, with motion disabled for reduced-motion preferences. There are no controls during normal playback, and images/video retain their aspect ratios. The deadline tracks elapsed time even when the tab is in the background.

Run its checks with `npm run test:e2e -- tests/e2e/timer.spec.ts`.

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
    ParticleEffects/ Falling leaves, snow, and bubbles
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

The repository's GitHub Actions workflow reviews dependency changes. It does not run these local build and browser checks.

## Contributing

We appreciate your interest, but please note that we currently do not accept external contributions.

If you're part of the Hack the Hill team, refer to our [Contribution guidelines](https://github.com/HacktheHill/.github/blob/main/CONTRIBUTING.md).

## Contact

For questions or inquiries, please reach out to [development@hackthehill.com](mailto:development@hackthehill.com).

Copyright © 2023 Hack the Hill. All Rights Reserved.

The training-video cutaway at `/slides#blackout` fully downloads `blackout-training.mp4` before playback, then holds black for three seconds. The video and captions stay inside a centered 16:9 frame. English captions are in `blackout-training.vtt`. Tape distortion starts at 36.5 seconds and cuts to silence and black at 39.5 seconds; the presenter advances manually afterward. Re-entering the slide replays it. Rebuild the processed copy with `python scripts/prepare_blackout_video.py <source-video>`; the original file is preserved.
