import { expect, test } from "@playwright/test";

test("FAQ uses keyboard-accessible native accordions", async ({ page }) => {
	await page.goto("/");
	const questions = page.locator("#faq details");
	await questions.first().locator("summary").press("Enter");
	await expect(questions.first()).toHaveAttribute("open", "");
	await questions.nth(1).locator("summary").press("Enter");
	await expect(questions.first()).toHaveAttribute("open", "");
	await expect(questions.nth(1)).toHaveAttribute("open", "");
});

test("desktop FAQ always clears the bottom ice seam across canvas breakpoints", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1025, 1199, 1200, 1201, 1440, 1599, 1600]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const position = await page.locator("#faq").evaluate(section => {
			const slot = section.parentElement as HTMLElement;
			const heading = section.querySelector("h2")!;
			const footer = document.querySelector<HTMLElement>("footer")!;
			const iceTop = document.querySelector<HTMLElement>('[data-scene-layer="ice-1"]')!;
			const iceBottom = document.querySelector<HTMLElement>('[data-scene-slice="ice-bottom"]')!;
			const activeIce = getComputedStyle(iceBottom).display === "none" ? iceTop : iceBottom;
			return {
				iceClearance: heading.getBoundingClientRect().top - activeIce.getBoundingClientRect().bottom,
				maxUpwardParallax: Number.parseFloat(slot.dataset.parallaxMax ?? "0"),
				footerClearance: footer.getBoundingClientRect().top - slot.getBoundingClientRect().bottom,
			};
		});
		expect(position.iceClearance).toBeGreaterThanOrEqual(position.maxUpwardParallax);
		expect(position.footerClearance).toBeGreaterThanOrEqual(position.maxUpwardParallax);
	}
});

test("desktop FAQ expands its water canvas and moves the ocean floor with the footer", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1025, 1536]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		await page.evaluate(() => document.fonts.ready);
		await page.locator('[data-scene-layer="water"]').evaluate(async element => {
			const image = element as HTMLImageElement;
			image.loading = "eager";
			await image.decode();
		});
		await page.waitForTimeout(100);
		const baseline = await page.evaluate(() => {
			const canvas = document.querySelector<HTMLElement>("[data-page-canvas]")!;
			const baseScene = document.querySelector<HTMLElement>('[class*="base-scene"]')!;
			const footer = document.querySelector<HTMLElement>("footer")!.parentElement!;
			const floor = document.querySelector<HTMLElement>('[data-scene-layer="footer-water"]')!;
			const water = document.querySelector<HTMLElement>('[data-scene-layer="water"]')!;
			const baseBox = baseScene.getBoundingClientRect();
			return {
				canvasHeight: canvas.getBoundingClientRect().height,
				baseHeight: baseBox.height,
				extension: Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")),
				footerTop: footer.offsetTop,
				floorTop: floor.getBoundingClientRect().top,
				waterBottom: water.getBoundingClientRect().bottom - baseBox.top,
				waterRasterRounding:
					water.getBoundingClientRect().height -
					water.getBoundingClientRect().width *
						(Number(water.getAttribute("height")) / Number(water.getAttribute("width"))),
				waterContinuationTop: Number.parseFloat(getComputedStyle(baseScene, "::after").top),
			};
		});

		await page.locator("#faq details").evaluateAll(details => {
			details.forEach(detail => detail.setAttribute("open", ""));
		});
		await expect
			.poll(() =>
				page
					.locator("[data-page-canvas]")
					.evaluate(canvas =>
						Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")),
					),
			)
			.toBeGreaterThan(baseline.extension + 50);
		await expect
			.poll(() =>
				page.locator("[data-page-canvas]").evaluate(canvas => {
					const baseScene = document.querySelector<HTMLElement>('[class*="base-scene"]')!;
					const extension = Number.parseFloat(
						getComputedStyle(canvas).getPropertyValue("--faq-content-extension"),
					);
					return Math.abs(
						canvas.getBoundingClientRect().height - baseScene.getBoundingClientRect().height - extension,
					);
				}),
			)
			.toBeLessThanOrEqual(0.5);

		const expanded = await page.evaluate(() => {
			const canvas = document.querySelector<HTMLElement>("[data-page-canvas]")!;
			const baseScene = document.querySelector<HTMLElement>('[class*="base-scene"]')!;
			const faq = document.querySelector<HTMLElement>("#faq")!.parentElement!;
			const footer = document.querySelector<HTMLElement>("footer")!.parentElement!;
			const floor = document.querySelector<HTMLElement>('[data-scene-layer="footer-water"]')!;
			const water = document.querySelector<HTMLElement>('[data-scene-layer="water"]')!;
			const baseBox = baseScene.getBoundingClientRect();
			return {
				extension: Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")),
				canvasHeight: canvas.getBoundingClientRect().height,
				baseHeight: baseBox.height,
				footerTop: footer.offsetTop,
				floorTop: floor.getBoundingClientRect().top,
				faqClearance: footer.offsetTop - (faq.offsetTop + faq.getBoundingClientRect().height),
				waterContinuation: getComputedStyle(baseScene, "::after").backgroundImage,
				waterBottom: water.getBoundingClientRect().bottom - baseBox.top,
				waterRasterRounding:
					water.getBoundingClientRect().height -
					water.getBoundingClientRect().width *
						(Number(water.getAttribute("height")) / Number(water.getAttribute("width"))),
				waterContinuationTop: Number.parseFloat(getComputedStyle(baseScene, "::after").top),
				horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});

		const extensionGrowth = expanded.extension - baseline.extension;
		expect(expanded.canvasHeight - baseline.canvasHeight).toBeCloseTo(extensionGrowth, 0);
		expect(expanded.baseHeight).toBeCloseTo(baseline.baseHeight, 1);
		expect(expanded.footerTop - baseline.footerTop).toBeCloseTo(extensionGrowth, 0);
		expect(expanded.floorTop - baseline.floorTop).toBeCloseTo(extensionGrowth, 0);
		expect(expanded.waterContinuationTop).toBeCloseTo(baseline.waterContinuationTop, 1);
		// Responsive rasters round their pixel heights. The 1920px water image adds
		// ~0.75px at this viewport, on top of the intentional 2px seam overlap.
		const waterOverlap = expanded.waterBottom - expanded.waterContinuationTop;
		expect(waterOverlap).toBeGreaterThanOrEqual(0);
		expect(waterOverlap - expanded.waterRasterRounding).toBeCloseTo(2, 1);
		expect(expanded.faqClearance).toBeGreaterThanOrEqual(48);
		expect(expanded.waterContinuation).toContain("linear-gradient");
		expect(expanded.waterContinuation).toContain("rgb(10, 31, 106)");
		expect(expanded.horizontalOverflow).toBeLessThanOrEqual(0);

		await page.locator("#faq details").evaluateAll(details => {
			details.forEach(detail => detail.removeAttribute("open"));
		});
		await expect
			.poll(() =>
				page
					.locator("[data-page-canvas]")
					.evaluate(canvas =>
						Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")),
					),
			)
			.toBeLessThanOrEqual(baseline.extension + 1);
	}
});
