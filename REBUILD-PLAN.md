# Rebuild the responsive illustrated scene

## Problem

The current desktop layout positions most scenery and content against one page-sized coordinate system, while narrower layouts reconstruct the same scene with separate section-specific rules. Content height changes and intermediate widths therefore require compensating offsets, duplicated transition logic, breakpoint extensions, and runtime height adjustments.

This makes changes difficult to isolate: adjusting one section or viewport can create seams, exposed asset edges, misaligned artwork, or extra space elsewhere. English and French copy, text wrapping, and expanded FAQ content are especially difficult because content height and scenery placement are not independent.

The rebuild is intended to remove that coupling while preserving the current visual composition and behavior. It is not a redesign.

## Outcome

Replace the current coupled scene and content-layout system with a responsive implementation that preserves the current appearance while allowing content and scenery to adapt independently:

https://2026.website-1cg.pages.dev/

The full visual sequence is the reference: Parliament and sky, autumn About, Stats, and Testimonials, the road into Sponsors and Collaborators, winter and ice, then the underwater FAQ and footer.

Limit the rebuild to the illustrated scene, its responsive layout, and tests needed to prove the change. Do not change site content, information architecture, branding, or unrelated component behavior.

Content must remain in normal responsive flow and determine its own height at every supported width. Longer translated copy, different text wrapping, and expanded FAQ answers must not open scene gaps, move unrelated artwork, or require new viewport-specific offsets.

Minor visual differences are acceptable when they remove brittle behavior without changing the intended composition.

## Preserve

Preserve English and French content, navigation and focus behavior, hero and countdown interactions, video, testimonial controls, sponsors and collaborators, FAQ behavior, footer, animations, reduced motion, accessibility, and responsive image loading.

Decorative artwork may overlap content regions visually, but it must not determine content order, hide or intercept interactive elements, or require duplicated content.

## Guidance

Inspect the deployed reference, local rendering, artwork assets, implementation, and tests before choosing the replacement. The reference defines the intended look. Existing code can provide evidence, but its coordinates, breakpoints, and ownership model are not requirements.

Assets that form one composition must preserve their relative alignment as they scale. Raster images must keep their intrinsic aspect ratios. Cropping and overlap may conceal intentionally unused regions, but asset rectangles, duplicate boundaries, and unintended transparent edges must not become visible.

Make the stacking order understandable from the code. Use the fewest independently positioned layers that preserve the composition. Decorative layers must remain non-interactive and hidden from assistive technology.

Implement the replacement end to end and remove superseded scene code. Preserve unrelated working-tree changes. Do not create commits, branches, or rewrite history unless separately requested.

## Avoid

Do not solve the rebuild by adding more:

-   full-page fixed heights or positions tied to one page-sized canvas;
-   page-wide percentage coordinates that couple unrelated regions;
-   runtime measurement to position static scenery when CSS layout can express the relationship;
-   breakpoint offsets that repair only one width;
-   duplicated layers or separate placement data that can drift;
-   absolute positioning for content that can remain in normal flow;
-   extra wrappers, layers, scripts, or breakpoint rules without a required cross-viewport purpose;
-   stretched raster images, exposed asset edges, visible seams, or decoration over interactive content.

Responsive variants are allowed when the composition truly differs. They must share content and avoid duplicated placement logic where practical.

Every added layer, wrapper, breakpoint rule, measurement, or script must have a named purpose tied to a required visual relationship or behavior. Do not trade away the current composition to simplify the code, and do not keep machinery that only repairs one screenshot.

## Done when

Capture fixed reference screenshots before editing. Compare local rendering with those baselines at:

-   320x568 and 390x844 phones;
-   768x1024 tablet;
-   1024x900 and 1025x900, on both sides of the current primary scene boundary;
-   1280x720 and 1440x900 desktops;
-   1920x1080;
-   3440x1440 ultrawide.

Test each other scene-layout breakpoint one pixel below and above, plus at least one intermediate width.

Inspect Hero to About, About to Stats, Stats to Testimonials, Testimonials to road, road to Sponsors, Sponsors to ice, ice to FAQ, and FAQ to footer.

At phone, tablet, and desktop widths, exercise:

-   English and French;
-   all FAQ items collapsed and expanded;
-   keyboard-only navigation, focus order, and interactive controls;
-   normal and reduced motion;
-   narrow and long text wrapping;
-   responsive image selection, confirming an appropriate source loads instead of always using the largest asset.

Confirm:

-   no horizontal overflow, seams, gaps, duplicate layers, distortion, or hidden content;
-   artwork relationships and layer order remain stable;
-   content changes do not move unrelated scenery;
-   decorative artwork remains non-interactive;
-   existing behavior and accessibility still work.

Add or update tests for behavior changed by the rebuild. Test outcomes, not implementation details.

After the final edit, run these commands sequentially:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Report each result. Do not describe the work as complete while a relevant check fails.

Finish with a concise summary of the architecture, visual checks, command results, and any unverified combinations.
