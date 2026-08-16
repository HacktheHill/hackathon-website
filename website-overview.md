# Website Overview

This document describes the page architecture and visual behavior implemented on the `2026-mobile` branch. It focuses on durable design constraints rather than viewport-specific measurements from a deployed build.

## Visual Model

The desktop site is composed as one continuous illustrated journey on a 3049 x 12301 reference canvas. Scene artwork and content slots use percentages derived from that coordinate system, allowing the entire composition to scale with the available width while preserving its layer relationships.

The journey progresses through these environments:

1. Sunrise sky, hills, and Parliament around the Hero.
2. Red vegetation and logs around About and the recap video.
3. Autumn signs and bushes around Stats and Testimonials.
4. Road, snow, and ice around Sponsors and Collaborators.
5. Deep water around FAQ and the Footer.

Desktop scenery is intentionally continuous. Empty space between content sections is often part of an environmental transition rather than ordinary section padding.

## Desktop Canvas

`src/components/App/App.tsx` defines the reference dimensions and the source coordinates for every scene layer. Each layer is rendered from `public/art/scene/` and positioned within `src/components/App/App.module.css`.

Important stacking relationships include:

- Clouds paint behind hills and Parliament.
- The recap video paints beneath the log artwork, which forms its frame.
- Stats signs paint between vegetation layers so their posts appear planted in the scene.
- Content slots paint above scenery while preserving pointer interaction only where needed.
- Footer content sits over the final underwater foreground.

The principal desktop content positions are approximately:

| Content | Canvas position |
| --- | ---: |
| Hero | 0-16% |
| About and recap video | 16-25% |
| Stats | 30% |
| Testimonials | 36% |
| Sponsors and Collaborators | 49-68% |
| FAQ | 78% |
| Footer | 92-100% |

These percentages are more reliable than document pixel offsets because the canvas height scales with its rendered width.

## Responsive Layout

At widths of 900px and below, the page intentionally stops scaling the desktop canvas. `App.module.css` hides the canvas artwork and changes the page to a single-column grid of normal-flow sections.

The mobile order is:

1. Hero
2. About
3. Recap video
4. Stats
5. Testimonials
6. Sponsors and Collaborators
7. FAQ
8. Footer

Each section receives a background gradient derived from its desktop environment so the seasonal progression remains recognizable without forcing desktop coordinates onto a narrow viewport.

Notable mobile adaptations include:

- The Hero restores its self-contained sky, clouds, hills, and Parliament foreground.
- Hero copy is centered and clears the navigation and MLH badge.
- The recap video uses the log artwork as a responsive frame.
- Stats signs share one compact row, with the foreground bush covering the lower posts.
- Testimonials use one clipped carousel track and square portraits.
- Interactive controls maintain a minimum 44px touch target.
- Sponsors, FAQ, and Footer reflow to the available width without horizontal scrolling.

## Navigation

The navigation appears at the top of the Hero and scrolls away with the document. It remains visually transparent so the illustrated sky paints beneath it.

Primary controls retain this order across breakpoints:

1. Home logo
2. Language switch
3. MLH badge

Section links and the mobile menu are intentionally omitted.

## Motion

Desktop motion is deliberately shallow:

- Cloud movement is time-based.
- Hero and section parallax respond to scrolling.
- Stats signs animate into place once when they enter the viewport.
- Decorative particles progress from leaves to snow to bubbles as the visitor reaches later sections.
- The testimonial carousel moves only through user interaction.

When `prefers-reduced-motion: reduce` is active, parallax and decorative particle motion are disabled, and Stats signs appear without their entrance transition.

## Accessibility

The page includes:

- A skip link to the main content.
- Semantic section headings and landmarks.
- Keyboard-operable navigation and carousel controls.
- Swipe support for the testimonial carousel.
- A keyboard-accessible clock-tower countdown that opens on hover or activation.
- Focus restoration when the countdown closes.
- Intrinsic media dimensions to reduce layout shift.
- Descriptive labels for controls and meaningful external links.

The countdown is available only before the final event milestone. Tests freeze the clock so countdown coverage remains valid after the event date.

## Performance

Scene images are loaded from `public/art/scene/`. Noncritical images use lazy loading and asynchronous decoding where appropriate. Intrinsic dimensions are supplied so browsers can reserve layout space before media loads.

## Verification

Playwright coverage exercises Chromium and Firefox against a production build. The suite checks:

- Horizontal overflow at phone, tablet, desktop, and short-landscape sizes.
- French content reflow.
- Mobile section separation.
- Hero and navigation placement.
- Touch-target dimensions.
- Carousel controls, clipping, keyboard input, swipe input, and portrait proportions.
- Keyboard navigation order.
- Countdown hover behavior, keyboard dismissal, and focus restoration.
- Reduced-motion behavior.

Run the standard checks with:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```
