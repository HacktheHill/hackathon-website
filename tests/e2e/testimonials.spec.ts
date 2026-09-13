import { expect, test } from "@playwright/test";

test("carousel wraps forward without reversing the track", async ({ page }) => {
	await page.goto("/");
	const track = page.locator("#testimonials [aria-live] > div");
	const dots = page.locator("#testimonials button[aria-pressed]");
	const translateX = () => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
	const slideWidth = await track.evaluate(element => element.getBoundingClientRect().width);
	const slideCount = await dots.count();

	await dots.last().click();
	await expect.poll(translateX).toBeCloseTo(-slideWidth * slideCount, 0);
	await expect(page.locator('[data-carousel-clone="clone-first"]')).toHaveCSS("visibility", "hidden");
	await page.locator("#testimonials button").last().click();
	await expect(track).toHaveAttribute("style", /-700%/);

	await expect.poll(translateX).toBeCloseTo(-slideWidth, 0);
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
	const transitionDuration = await track.evaluate(element =>
		Number.parseFloat(getComputedStyle(element).transitionDuration),
	);
	expect(transitionDuration).toBeLessThanOrEqual(0.00001);
	await expect(track).not.toHaveAttribute("data-moving", "");
});

test("carousel controls stay aligned and usable across responsive widths", async ({ page }) => {
	for (const width of [390, 511, 768]) {
		await page.setViewportSize({ width, height: 844 });
		await page.goto("/");
		const controls = page.locator("#testimonials button");
		const boxes = await controls.evaluateAll(elements =>
			elements.map(element => {
				const box = element.getBoundingClientRect();
				return { centerY: box.y + box.height / 2, width: box.width, height: box.height };
			}),
		);
		const center = boxes[0].centerY;
		for (const box of boxes) {
			expect(Math.abs(box.centerY - center)).toBeLessThanOrEqual(1);
			expect(box.width).toBeGreaterThanOrEqual(44);
			expect(box.height).toBeGreaterThanOrEqual(44);
		}
	}
});

test("carousel controls change the selected testimonial", async ({ page }) => {
	await page.goto("/");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await expect(pressed).toHaveAttribute("aria-label", /1:/);
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);
	await page.locator("#testimonials button").last().click();
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});

test("mobile carousel clips adjacent slides", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	await carousel.scrollIntoViewIfNeeded();
	const portrait = page.locator('#testimonials [role="group"]').first().locator("img");
	const portraitBox = await portrait.boundingBox();
	expect(portraitBox).not.toBeNull();
	expect(Math.abs((portraitBox?.width ?? 0) - (portraitBox?.height ?? 0))).toBeLessThan(1);

	const assertSingleVisibleSlide = async () => {
		const visibleSlides = await page.locator('#testimonials [role="group"]').evaluateAll(slides => {
			const viewport = slides[0]?.parentElement?.parentElement?.getBoundingClientRect();
			if (!viewport) return 0;
			return slides.filter(slide => {
				const box = slide.getBoundingClientRect();
				return box.right > viewport.left && box.left < viewport.right;
			}).length;
		});
		expect(visibleSlides).toBe(1);
	};

	await assertSingleVisibleSlide();
	await page.locator("#testimonials button").last().click();
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "visible");
	await page.waitForTimeout(500);
	await expect(page.locator('#testimonials [role="group"]').first()).toHaveCSS("visibility", "hidden");
	await assertSingleVisibleSlide();
});

test("carousel supports keyboard arrows and swipe", async ({ page }) => {
	await page.goto("/");
	const carousel = page.locator("#testimonials [aria-live]");
	const pressed = page.locator('#testimonials button[aria-pressed="true"]');
	await carousel.focus();
	await carousel.press("ArrowRight");
	await expect(pressed).toHaveAttribute("aria-label", /2:/);

	await carousel.dispatchEvent("pointerdown", {
		pointerId: 1,
		isPrimary: true,
		clientX: 300,
		clientY: 200,
	});
	await carousel.dispatchEvent("pointerup", {
		pointerId: 1,
		isPrimary: true,
		clientX: 100,
		clientY: 200,
	});
	await expect(pressed).toHaveAttribute("aria-label", /3:/);
});
