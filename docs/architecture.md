# Architecture

## Rendering

`pages/index.astro` renders `App` on the server and hydrates it with `client:load`. `App` lists the page sections and wires the scene references to two hooks. `pages/404.astro` renders a static error page with no React hydration. Both use `Layout.astro` for metadata and the HTML shell.

The application has no router, database, or application server.

## Illustrated scene

The desktop illustration uses a 3049 by 12301 design canvas. Its measurements are artwork coordinates, kept in `Scene/sceneLayers.ts`. `sceneImages.ts` creates responsive image candidates and percentage positions. `SceneArtwork.tsx` emits the pictures in their original stacking order.

`Scene.module.css` imports four files in order:

1. `canvas.css` defines the scene, artwork layers, water continuation, and tablet slices.
2. `clouds.css` defines cloud animation and reduced-motion behavior.
3. `sections.css` places desktop content over the illustration.
4. `mobile.css` changes the content layout below 1025px and paints the mobile section transitions.

These imports share one CSS module scope. Keep their order when editing an override. Section wrappers are positioning and measurement elements; removing one can change the scene even if its own component still looks correct.

`useSceneParallax` handles scroll transforms. `useFaqCanvasExtension` observes the FAQ's height and extends the water and footer when answers need more space.

The mobile hero has its own artwork. `Hero/assets.ts` describes its files, media queries, and responsive widths. `useClockHotspot` places the countdown button over the painted clock. `useHeroParallax` handles heading motion and offscreen clouds. `Hero.module.css` imports scene, heading, countdown, and responsive rules in order.

Neither set of decorative picture elements has an unconditional image source. The matching `source` media query selects which artwork downloads. Adding a fallback `src` can make phones download the full desktop scene.

## State and content

`i18n/index.ts` owns the in-memory locale store, initially English. A component calls `useTranslations()` once, then uses the returned `t` function anywhere in its render. `translate(language, key)` is a pure lookup for code outside React. Type checking validates translation paths and requires the French dictionary to supply every English key. The navbar updates the document language when the locale changes; there is no persisted language preference.

The carousel hook owns pointer tracking, queued movement, and cloned-slide resets. `Testimonials.tsx` renders its state. Keep the queue and `flushSync` reset together so rapid clicks and wraparound retain their existing behavior.

`ParticleEffects/particles.ts` holds asset lists, timing values, and the seeded generator. `useParticles` owns scroll mode, visibility, spawning, and exit timing. The renderer only maps active particles to images. Changing the order of random draws changes the visible trajectories.

`Footer/useSubscription.ts` owns email input and request state. It sends `{ email: trimmedEmail, consent: true }` as JSON to the existing endpoint. Status 202 shows success, 400 marks the email invalid, 429 asks the user to retry, and other responses or network errors show the existing failure text. A ref blocks a second request while one is pending.

## Build boundaries

`astro.config.mjs` sets the `build/` output directory, production site URL, React integration, sitemap generation, and Partytown integration. `Layout.astro` reads event data during the build and only includes it on the home route. `public/` is copied without rewriting its paths.

Python artwork tools are optional authoring tools. The site builds from checked-in images and never runs Python during `npm ci` or `npm run build`.
