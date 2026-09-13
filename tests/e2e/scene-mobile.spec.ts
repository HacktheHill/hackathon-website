import { expect, test } from "@playwright/test";

test("mobile scrolling skips desktop parallax transforms", async ({ page }) => {
	await page.setViewportSize({ width: 768, height: 1024 });
	await page.goto("/");
	await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
	await expect
		.poll(() =>
			page.locator("[data-section-parallax]").evaluateAll(elements =>
				elements.every(element => {
					const htmlElement = element as HTMLElement;
					return !htmlElement.style.translate && htmlElement.dataset.parallaxOffset === "0";
				}),
			),
		)
		.toBe(true);
});

test("mobile artwork transitions reserve space without covering content", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 768, height: 1024 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const transition = await page.locator("#faq").evaluate(section => {
			const about = document.querySelector<HTMLElement>("#about")!;
			const aboutParagraphs = Array.from(about.querySelectorAll("p"));
			const sectionBox = section.getBoundingClientRect();
			const slot = section.parentElement!;
			const slotBox = slot.getBoundingClientRect();
			const sponsors = slot.previousElementSibling!;
			const sponsorsBox = sponsors.getBoundingClientRect();
			const headingBox = section.querySelector("h2")!.getBoundingClientRect();
			const columnsBox = section.querySelector('[class*="faq-columns"]')!.getBoundingClientRect();
			const testimonials = document.querySelector<HTMLElement>("#testimonials")!.parentElement!;
			const aboutSlot = about.parentElement!;
			return {
				aboutBackground: getComputedStyle(aboutSlot).backgroundImage,
				aboutParagraphGaps: aboutParagraphs
					.slice(1)
					.map(
						(paragraph, index) =>
							paragraph.getBoundingClientRect().top -
							aboutParagraphs[index].getBoundingClientRect().bottom,
					),
				sectionGap: slotBox.top - sponsorsBox.bottom,
				titleGap: sectionBox.top - slotBox.top,
				headingToQuestionsGap: columnsBox.top - headingBox.bottom,
				iceTransition: getComputedStyle(sponsors, "::after").backgroundImage,
				waterBackground: getComputedStyle(slot).backgroundImage,
				waterBackgroundSize: getComputedStyle(slot).backgroundSize,
				waterImageTop: Number.parseFloat(
					getComputedStyle(slot).backgroundPosition.split(",")[1].trim().split(/\s+/)[1],
				),
				testimonialsBackground: getComputedStyle(testimonials).backgroundImage,
			};
		});
		expect(transition.aboutBackground).toContain("bush-2.webp");
		expect(transition.aboutBackground).toContain("linear-gradient");
		for (const gap of transition.aboutParagraphGaps) {
			expect(Math.abs(gap - 16)).toBeLessThanOrEqual(0.1);
		}
		expect(transition.sectionGap).toBeGreaterThanOrEqual(-1.01);
		expect(transition.sectionGap).toBeLessThanOrEqual(0);
		expect(transition.titleGap).toBeGreaterThanOrEqual(31);
		expect(transition.titleGap).toBeLessThanOrEqual(65);
		expect(transition.headingToQuestionsGap).toBeGreaterThanOrEqual(0);
		expect(transition.iceTransition).toContain("ice-1.webp");
		expect(transition.iceTransition).toContain("ice-2.webp");
		expect(transition.waterBackground).toContain("water.webp");
		expect(transition.waterBackgroundSize).toContain("130%");
		expect(transition.waterImageTop).toBeLessThanOrEqual(-104);
		expect(transition.testimonialsBackground).toContain("rgb(230, 107, 46)");
	}
});

test("mobile restores the road, ice shelf, and ocean floor artwork", async ({ page }) => {
	for (const viewport of [
		{ width: 320, height: 568 },
		{ width: 768, height: 1024 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const artwork = await page.evaluate(() => {
			const about = document.querySelector<HTMLElement>("#about")!.parentElement!;
			const video = document.querySelector<HTMLElement>('[class*="video-layer"]')!;
			const blueSign = video.querySelector<HTMLElement>('[data-stat-sign="blue"]')!;
			const stats = document.querySelector<HTMLElement>('[class*="stats-layer"]')!;
			const sponsors = document.querySelector<HTMLElement>("#sponsors")!.parentElement!;
			const footer = document.querySelector<HTMLElement>("footer")!.parentElement!;
			const videoBox = video.getBoundingClientRect();
			const blueSignBox = blueSign.getBoundingClientRect();
			const statsBox = stats.getBoundingClientRect();
			const statsBushTop = statsBox.top + Number.parseFloat(getComputedStyle(stats, "::before").top);
			const sponsorStyle = getComputedStyle(sponsors);
			const icePosition = Number.parseFloat(
				getComputedStyle(sponsors, "::before").backgroundPosition.split(",")[0].trim().split(/\s+/)[1],
			);
			return {
				aboutScene: getComputedStyle(about).backgroundImage,
				statsOverlap: videoBox.bottom - statsBox.top,
				statsOverlapTarget: Math.abs(Number.parseFloat(getComputedStyle(stats).marginTop)),
				coveredSignFraction:
					blueSignBox.height > 0 ? (blueSignBox.bottom - statsBushTop) / blueSignBox.height : null,
				road: getComputedStyle(sponsors, "::before").backgroundImage,
				roadToIceOverlap: Number.parseFloat(sponsorStyle.paddingTop) - 80 - icePosition,
				iceTop: getComputedStyle(sponsors, "::before").backgroundImage,
				iceBottom: getComputedStyle(sponsors, "::after").backgroundImage,
				floor: getComputedStyle(footer).backgroundImage,
				floorSize: getComputedStyle(footer).backgroundSize,
				floorPosition: getComputedStyle(footer).backgroundPosition,
				footerPaddingTop: Number.parseFloat(getComputedStyle(footer).paddingTop),
				footerPaddingBottom: Number.parseFloat(getComputedStyle(footer).paddingBottom),
			};
		});
		expect(artwork.aboutScene).toContain("bush-2.webp");
		expect(artwork.aboutScene).toContain("linear-gradient");
		expect(artwork.statsOverlap).toBeCloseTo(artwork.statsOverlapTarget, 1);
		if (viewport.width <= 600) {
			expect(artwork.coveredSignFraction).toBeGreaterThanOrEqual(0.15);
			expect(artwork.coveredSignFraction).toBeLessThanOrEqual(0.3);
		} else {
			expect(artwork.coveredSignFraction).toBeNull();
		}
		expect(artwork.road).toContain("road.webp");
		expect(artwork.roadToIceOverlap).toBeGreaterThanOrEqual(53);
		expect(artwork.iceTop).toContain("ice-1.webp");
		expect(artwork.iceTop.indexOf("ice-1.webp")).toBeLessThan(artwork.iceTop.indexOf("road.webp"));
		expect(artwork.iceBottom).toContain("ice-1.webp");
		expect(artwork.iceBottom).toContain("ice-2.webp");
		expect(artwork.floor).toContain("footer-water.webp");
		expect(artwork.floor).toContain("footer-water-2.webp");
		expect(artwork.floorSize).toContain("100%");
		expect(artwork.floorSize).toContain("87.73%");
		expect(artwork.floorPosition).toContain("100% 100%");
		expect(artwork.footerPaddingTop).toBe(viewport.width <= 600 ? 16 : 64);
		expect(artwork.footerPaddingBottom).toBe(viewport.width <= 600 ? 104 : 80);
	}
});
