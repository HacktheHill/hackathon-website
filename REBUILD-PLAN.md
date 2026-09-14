# Rebuild the responsive illustrated scene

## Problem

The desktop layout positions most scenery and content against one page-sized coordinate system. Narrower layouts rebuild the same scene with their own section-specific rules. Any change in content height, and any width between the tested ones, therefore needs compensating offsets, duplicated transition logic, breakpoint extensions, or runtime height adjustments to hold the picture together.

That makes changes hard to isolate. Adjusting one section or one viewport can open seams, expose asset edges, misalign artwork, or leave extra space somewhere else on the page. English and French copy, text wrapping, and expanded FAQ answers are the worst cases, because content height and scenery placement are not independent.

The rebuild removes that coupling while keeping the current visual composition and behavior. It is not a redesign.

## Outcome

Replace the coupled scene and content layout with a responsive implementation that looks the same as today but lets content and scenery adapt independently. The reference is the deployed site:

https://2026.website-1cg.pages.dev/

The full visual sequence is what must be preserved: Parliament and sky, the autumn About, Stats, and Testimonials sections, the road into Sponsors and Collaborators, winter and ice, then the underwater FAQ and footer.

Limit the rebuild to the illustrated scene, its responsive layout, and the tests needed to prove the change. Leave site content, information architecture, branding, and unrelated component behavior alone.

Content must stay in normal responsive flow and determine its own height at every supported width. Longer translated copy, different text wrapping, and expanded FAQ answers must not open gaps in the scene, move unrelated artwork, or need new viewport-specific offsets.

Small visual differences are acceptable when they remove brittle behavior without changing the intended composition.

## Preserve

Keep English and French content, navigation and focus behavior, the hero and countdown interactions, the video, testimonial controls, sponsors and collaborators, FAQ behavior, the footer, animations, reduced motion, accessibility, and responsive image loading.

Decorative artwork may overlap content regions visually, but it must not determine content order, hide or intercept interactive elements, or require duplicated content.

## Guidance

Inspect the deployed reference, the local rendering, the artwork assets, the implementation, and the tests before choosing a replacement. The reference defines the intended look. The existing code is evidence of how that look is produced today, but its coordinates, breakpoints, and ownership model are not requirements.

Assets that form one composition must keep their relative alignment as they scale. Raster images must keep their intrinsic aspect ratios. Cropping and overlap may hide regions that are intentionally unused, but asset rectangles, duplicate boundaries, and unintended transparent edges must never become visible.

Make the stacking order readable from the code. Use the fewest independently positioned layers that still produce the composition. Decorative layers must stay non-interactive and hidden from assistive technology.

Implement the replacement end to end and remove the scene code it supersedes. Preserve unrelated working-tree changes. Do not create commits or branches or rewrite history unless separately asked.

## Avoid

Do not solve the rebuild by adding more of the following:

- full-page fixed heights or positions tied to one page-sized canvas;
- page-wide percentage coordinates that couple unrelated regions;
- runtime measurement to position static scenery when CSS layout can express the relationship;
- breakpoint offsets that repair only one width;
- duplicated layers or separate placement data that can drift apart;
- absolute positioning for content that can stay in normal flow;
- extra wrappers, layers, scripts, or breakpoint rules without a cross-viewport purpose;
- stretched raster images, exposed asset edges, visible seams, or decoration over interactive content.

Responsive variants are fine when the composition really differs between widths. They must share content, and where practical they must not duplicate placement logic.

Every added layer, wrapper, breakpoint rule, measurement, or script needs a named purpose tied to a required visual relationship or behavior. Do not trade away the current composition to simplify the code, and do not keep machinery whose only job is to repair one screenshot.

## Done when

Capture fixed reference screenshots before editing. Compare the local rendering with those baselines at:

- 320x568 and 390x844 phones;
- 768x1024 tablet;
- 1024x900 and 1025x900, on both sides of the current primary scene boundary;
- 1280x720 and 1440x900 desktops;
- 1920x1080;
- 3440x1440 ultrawide.

Test every other scene-layout breakpoint one pixel below and one pixel above, plus at least one width in between.

Inspect each transition: Hero to About, About to Stats, Stats to Testimonials, Testimonials to road, road to Sponsors, Sponsors to ice, ice to FAQ, and FAQ to footer.

At phone, tablet, and desktop widths, exercise:

- English and French;
- all FAQ items collapsed and all expanded;
- keyboard-only navigation, focus order, and every interactive control;
- normal and reduced motion;
- narrow and long text wrapping;
- responsive image selection, confirming that an appropriately sized source loads rather than always the largest one.

Confirm:

- no horizontal overflow, seams, gaps, duplicate layers, distortion, or hidden content;
- artwork relationships and layer order stay stable;
- content changes do not move unrelated scenery;
- decorative artwork stays non-interactive;
- existing behavior and accessibility still work.

Add or update tests for the behavior the rebuild changes. Test outcomes, not implementation details.

After the final edit, run these commands in order:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Report each result. Do not call the work complete while a relevant check fails.

Finish with a short summary of the architecture, the visual checks, the command results, and any combinations left unverified.
