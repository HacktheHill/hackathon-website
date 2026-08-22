import { expect, test } from "@playwright/test";

test("carousel wraps forward without reversing the track", async ({ page }) => {
	await page.goto("/");
	const track = page.locator("#testimonials [aria-live] > div");
	const dots = page.locator('#testimonials button[aria-pressed]');
	const translateX = () => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);

	await dots.last().click();
	await expect(track).toHaveAttribute("data-moving", "");
	await expect(track).not.toHaveAttribute("data-moving", "");
	await expect(page.locator('[data-carousel-clone="clone-first"]')).toHaveCSS("visibility", "hidden");
	await page.locator("#testimonials button").last().click();
	await expect(track).toHaveAttribute("style", /-700%/);
	await expect(track).toHaveAttribute("data-moving", "");
	await expect(track).not.toHaveAttribute("data-moving", "");

	const slideWidth = await track.evaluate(element => element.getBoundingClientRect().width);
	expect(await translateX()).toBeCloseTo(-slideWidth, 0);
	await expect(dots.first()).toHaveAttribute("aria-pressed", "true");
});

test("mobile carousel edge-fades adjacent slides", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	await expect(carousel).toHaveCSS("mask-image", /linear-gradient/);
	await expect(page.locator("#testimonials [aria-live] > div")).toHaveCSS("transition-duration", "0.45s");
});

test("carousel queues input and follows horizontal drags", async ({ page }) => {
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	const track = page.locator("#testimonials [aria-live] > div");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await carousel.focus();
	await carousel.press("ArrowRight");
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
	await expect(track).not.toHaveAttribute("data-moving", "");

	const startingPosition = await track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
	await carousel.dispatchEvent("pointerdown", { pointerId: 2, isPrimary: true, clientX: 300, clientY: 200 });
	await carousel.dispatchEvent("pointermove", { pointerId: 2, isPrimary: true, clientX: 220, clientY: 200 });
	await expect
		.poll(() => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41))
		.toBeLessThan(startingPosition - 40);
	await carousel.dispatchEvent("pointerup", { pointerId: 2, isPrimary: true, clientX: 100, clientY: 200 });
	await expect(pressed).toHaveAttribute("aria-label", /4:/);
});

test("carousel snaps without animation when reduced motion is requested", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	const track = page.locator("#testimonials [aria-live] > div");
	await page.locator("#testimonials button").last().click();
	await expect(page.locator('#testimonials button[aria-pressed="true"]')).toHaveAttribute("aria-label", /2:/);
	const transitionDuration = await track.evaluate(element => Number.parseFloat(getComputedStyle(element).transitionDuration));
	expect(transitionDuration).toBeLessThanOrEqual(0.00001);
	await expect(track).not.toHaveAttribute("data-moving", "");
});
