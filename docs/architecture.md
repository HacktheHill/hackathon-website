# Architecture

## Rendering

`pages/index.astro` renders `App` on the server and hydrates it with `client:load`. `App` lists the page sections in order and hands two refs to the scene hooks. `pages/404.astro` is a static page with no React. Both routes use `Layout.astro` for the HTML shell and metadata.

There is no router, database, or application server. The site is static output plus one fetch to the subscription service.

## Illustrated scene

On desktop the page is one tall illustration drawn on a 3049 by 12301 design canvas. `Scene/sceneLayers.ts` holds each layer's artwork coordinates. `sceneImages.ts` turns those into percentage positions and responsive image candidates, and `SceneArtwork.tsx` renders the pictures in stacking order.

`Scene.module.css` imports four files. The order matters, because later files override earlier ones inside the same CSS module scope:

1. `canvas.css` defines the scene container, the artwork layers, the water continuation below the FAQ, and the tablet ice slices.
2. `clouds.css` defines cloud animation and its reduced-motion fallback.
3. `sections.css` places desktop content over the illustration.
4. `mobile.css` lays out content below 1025px and paints the transitions between mobile sections.

Section wrappers double as positioning and measurement elements. Removing one can shift the scene even when the component inside still looks right.

Two hooks drive the scene at runtime. `useSceneParallax` applies scroll transforms. `useFaqCanvasExtension` watches the FAQ's height and pushes the water and footer down when open answers need the room.

The mobile hero has its own artwork, described in `Hero/assets.ts` along with its media queries and responsive widths. `useClockHotspot` positions the countdown button over the painted clock face. `useHeroParallax` moves the heading on scroll and pauses the cloud drift while the hero is off screen. `Hero.module.css` imports its scene, heading, countdown, and responsive rules in that order.

Neither set of decorative `<picture>` elements has an unconditional `src`. The `<source>` media queries decide which artwork downloads, so a phone never fetches the desktop scene. Adding a fallback `src` would undo that.

## State and content

`i18n/index.ts` owns the in-memory locale store, which starts in English. Call `useTranslations()` once in a component and use the returned `t` anywhere in its render. `translate(language, key)` is the same lookup as a pure function, for code outside React. Translation paths are type-checked, and the French dictionary must supply every English key or the type check fails. The navbar sets the document language when the locale changes. Nothing persists the choice between visits.

`useTestimonialCarousel` owns pointer tracking, the movement queue, and the jump from a cloned end slide back to its real counterpart. `Testimonials.tsx` only renders its state. Keep the queue and the `flushSync` reset together, since rapid clicks and wraparound depend on both.

`ParticleEffects/particles.ts` holds the asset lists, timing constants, and seeded generator. `useParticles` owns the scroll-driven mode, page visibility, spawning, and exit timing. The renderer maps active particles to images and nothing more. Changing the order of random draws changes the trajectories you see.

`Footer/useSubscription.ts` owns the email input and request state. It POSTs `{ email, consent: true }` as JSON to `https://emails.hackthehill.com/subscribe`. A 202 shows the success message, 400 marks the address invalid, 429 asks the user to try again later, and anything else, including a network error, shows the generic failure text. A ref blocks a second request while one is in flight.

## Build boundaries

`astro.config.mjs` sets the `build/` output directory, the production site URL, and the React, sitemap, and Partytown integrations. `Layout.astro` reads `public/structured-data.json` at build time and only embeds it on the home route. Files in `public/` are copied as they are, with their paths unchanged.

The Python scripts under `scripts/` are optional tools for exporting artwork. The site builds from the checked-in images and never runs Python during `npm ci` or `npm run build`.
