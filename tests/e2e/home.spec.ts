import { expect, test } from "@playwright/test";

const viewports = [
	{ name: "phone", width: 320, height: 568 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "desktop", width: 1440, height: 900 },
	{ name: "short-landscape", width: 844, height: 390 },
	{ name: "below-carousel-breakpoint", width: 510, height: 844 },
	{ name: "above-carousel-breakpoint", width: 511, height: 844 },
	{ name: "below-phone-breakpoint", width: 600, height: 900 },
	{ name: "above-phone-breakpoint", width: 601, height: 900 },
	{ name: "responsive-canvas-limit", width: 1024, height: 900 },
	{ name: "desktop-canvas-start", width: 1025, height: 900 },
];

test("scene artwork has a themed fallback and uses viewport-aware loading", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	let releaseSceneImages!: () => void;
	const sceneImagesReleased = new Promise<void>(resolve => {
		releaseSceneImages = resolve;
	});
	let noteSceneImageRequest!: () => void;
	const sceneImageRequested = new Promise<void>(resolve => {
		noteSceneImageRequest = resolve;
	});
	await page.route("**/art/scene/**", async route => {
		noteSceneImageRequest();
		await sceneImagesReleased;
		await route.continue();
	});
	await page.goto("/", { waitUntil: "domcontentloaded" });
	await sceneImageRequested;
	await expect(page.locator("[data-page-canvas]")).toHaveCSS("background-image", /linear-gradient/);
	const artwork = page.locator("[data-scene-artwork]");
	await expect(artwork).not.toHaveAttribute("data-scene-ready", /.+/);
	await expect(artwork).toHaveCSS("visibility", "visible");
	releaseSceneImages();
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("loading", "eager");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("decoding", "sync");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("fetchpriority", "high");
	await expect(page.locator('[data-scene-layer="sky"]')).toHaveAttribute("width", "3049");
	const skySource = page.locator('picture:has([data-scene-layer="sky"]) source');
	await expect(skySource).toHaveAttribute(
		"srcset",
		/\/art\/scene\/responsive\/1280\/sky\.webp 1280w.*\/responsive\/1920\/sky\.webp 1920w.*\/art\/scene\/sky\.webp 3049w/,
	);
	await expect(skySource).toHaveAttribute("sizes", "(min-width: 3049px) 3049px, 100.0000vw");
	await expect
		.poll(() =>
			page.locator('[data-scene-layer="sky"]').evaluate(element => (element as HTMLImageElement).currentSrc),
		)
		.toContain("/art/scene/responsive/1920/sky.webp");
	expect(
		await page
			.locator("[data-hero-layer]")
			.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).currentSrc)),
	).toEqual(Array(10).fill(""));
	const loadingByLayer = await page.locator("[data-scene-layer]").evaluateAll(elements =>
		elements.map(element => ({
			name: element.getAttribute("data-scene-layer"),
			loading: element.getAttribute("loading"),
		})),
	);
	expect(loadingByLayer.filter(layer => layer.loading === "eager").map(layer => layer.name)).toEqual([
		"sky",
		"cloud-1",
		"cloud-2",
		"cloud-3",
		"cloud-4",
		"cloud-5",
		"cloud-6",
		"hill-near",
		"hill-far",
		"parliament-tower",
		"parliament-roof",
		"parliament-towers",
		"bush-1",
		"bush-2",
	]);
	expect(loadingByLayer.filter(layer => layer.loading === "lazy")).toHaveLength(9);
	await expect(page.locator('[data-scene-layer="bush-3"]')).toHaveAttribute("decoding", "async");

	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	const mobileSources = await page
		.locator("[data-scene-layer]")
		.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).currentSrc));
	expect(new Set(mobileSources)).toEqual(new Set([""]));
});

test("mobile hero keeps its warm fallback while artwork is pending", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	const requestedWebps: string[] = [];
	let releaseHeroImages!: () => void;
	const heroImagesReleased = new Promise<void>(resolve => {
		releaseHeroImages = resolve;
	});
	let noteHeroImageRequest!: () => void;
	const heroImageRequested = new Promise<void>(resolve => {
		noteHeroImageRequest = resolve;
	});
	await page.route("**/*.webp", async route => {
		requestedWebps.push(new URL(route.request().url()).pathname);
		noteHeroImageRequest();
		await heroImagesReleased;
		await route.continue();
	});

	await page.goto("/", { waitUntil: "domcontentloaded" });
	await heroImageRequested;
	await expect(page.locator("section#hero")).toHaveCSS("background-image", /linear-gradient/);
	await expect(page.locator("section#hero")).not.toHaveCSS("background-color", "rgb(6, 18, 56)");

	releaseHeroImages();
	await page.waitForLoadState("load");
	await expect(page.locator('[data-hero-layer="sky"]')).toHaveAttribute("loading", "eager");
	await expect(page.locator('[data-hero-layer="sky"]')).toHaveAttribute("decoding", "auto");
	const skySource = page.locator('picture:has([data-hero-layer="sky"]) source');
	await expect(skySource).toHaveAttribute(
		"srcset",
		/\/art\/hero\/responsive\/480\/sky\.webp 480w.*\/responsive\/768\/sky\.webp 768w.*\/responsive\/1024\/sky\.webp 1024w.*\/responsive\/1280\/sky\.webp 1280w/,
	);
	await expect(skySource).toHaveAttribute("sizes", "max(100vw, 166.11svh)");
	await expect(page.locator('picture:has([data-hero-layer="hill1"]) source')).toHaveAttribute("sizes", "max(242.10vh, 104.24vw)");
	await expect(page.locator('picture:has([data-hero-layer="hill2"]) source')).toHaveAttribute("sizes", "max(235.10vh, 101.22vw)");
	await expect
		.poll(() =>
			page.locator('[data-hero-layer="sky"]').evaluate(element => (element as HTMLImageElement).currentSrc),
		)
		.toMatch(/^.*\/_astro\/sky\.[^/]+\.webp$/);
	const loadedMobileLayers = await page
		.locator("[data-hero-layer]")
		.evaluateAll(elements =>
			elements
				.filter(element => (element as HTMLImageElement).currentSrc !== "")
				.map(element => element.getAttribute("data-hero-layer")),
		);
	expect(loadedMobileLayers).toEqual(["sky", "cloud6", "hill2", "hill1", "foreground"]);
	const selectedForeground = new URL(
		await page
			.locator('[data-hero-layer="foreground"]')
			.evaluate(element => (element as HTMLImageElement).currentSrc),
	).pathname;
	expect(selectedForeground).toMatch(/^\/art\/hero\/responsive\/(480|768|1024|1280)\/foreground\.webp$/);
	expect(requestedWebps.filter(path => path.includes("foreground"))).toEqual([selectedForeground]);
	expect(requestedWebps.some(path => path.startsWith("/art/particles/"))).toBe(false);
});

test("FAQ uses keyboard-accessible native accordions", async ({ page }) => {
	await page.goto("/");
	const questions = page.locator("#faq details");
	await questions.first().locator("summary").click();
	await expect(questions.first()).toHaveAttribute("open", "");
	await questions.nth(1).locator("summary").click();
	await expect(questions.first()).toHaveAttribute("open", "");
	await expect(questions.nth(1)).toHaveAttribute("open", "");
});

for (const viewport of viewports) {
	test(`${viewport.name} layout has no horizontal overflow`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.goto("/");
		await expect(page.locator("main")).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
}

test("French content reflows without overflow", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 768, height: 1024 },
		{ width: 1025, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		await page.getByRole("button", { name: /FR:/ }).click();
		await expect(page.locator("html")).toHaveAttribute("lang", "fr");
		await expect(page.getByRole("heading", { name: "Foire aux questions" })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);
	}
});

test("mobile sections do not overlap", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const boxes = await page
		.locator("#hero, #about, #stats, #testimonials, #sponsors, #collaborators, #faq, footer")
		.evaluateAll(elements =>
			elements
				.map(element => {
					const box = element.getBoundingClientRect();
					return { top: box.top, bottom: box.bottom };
				})
				.sort((left, right) => left.top - right.top),
		);
	for (let index = 1; index < boxes.length; index += 1) {
		expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1);
	}
});

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
			const aboutPanel = getComputedStyle(about, "::before");
			return {
				aboutPanelBackground: aboutPanel.backgroundImage,
				aboutPanelTop: Number.parseFloat(aboutPanel.top),
				aboutParagraphGaps: aboutParagraphs.slice(1).map(
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
		expect(transition.aboutPanelTop).toBeLessThan(0);
		expect(transition.aboutPanelBackground).toContain("rgba(0, 0, 0, 0)");
		for (const gap of transition.aboutParagraphGaps) {
			expect(Math.abs(gap)).toBeLessThanOrEqual(0.1);
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
		expect(transition.waterImageTop).toBeLessThanOrEqual(-72);
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
			const statsBushTop =
				statsBox.top + Number.parseFloat(getComputedStyle(stats, "::before").top);
			const sponsorStyle = getComputedStyle(sponsors);
			const icePosition = Number.parseFloat(
				getComputedStyle(sponsors, "::before").backgroundPosition.split(",")[0].trim().split(/\s+/)[1],
			);
			return {
				aboutTop: getComputedStyle(about, "::before").backgroundImage,
				aboutTopMask: getComputedStyle(about, "::before").maskImage,
				aboutBottom: getComputedStyle(about, "::after").backgroundImage,
				aboutBottomMask: getComputedStyle(about, "::after").maskImage,
				aboutMiddle: getComputedStyle(about).backgroundImage,
				aboutPanel: getComputedStyle(document.querySelector<HTMLElement>("#about")!, "::before")
					.backgroundImage,
				statsOverlap: videoBox.bottom - statsBox.top,
				statsOverlapTarget: Math.abs(Number.parseFloat(getComputedStyle(stats).marginTop)),
				coveredSignFraction:
					blueSignBox.height > 0 ? (blueSignBox.bottom - statsBushTop) / blueSignBox.height : null,
				road: getComputedStyle(sponsors, "::before").backgroundImage,
				roadToIceOverlap: Number.parseFloat(sponsorStyle.paddingTop) - 80 - icePosition,
				iceTop: getComputedStyle(sponsors, "::before").backgroundImage,
				iceBottom: getComputedStyle(sponsors, "::after").backgroundImage,
				floor: getComputedStyle(footer).backgroundImage,
			};
		});
		expect(artwork.aboutTop).toContain("bush-2.webp");
		expect(artwork.aboutTopMask).toContain("gradient");
		expect(artwork.aboutBottom).toContain("bush-2.webp");
		expect(artwork.aboutBottom.indexOf("linear-gradient")).toBeLessThan(
			artwork.aboutBottom.indexOf("bush-2.webp"),
		);
		expect(artwork.aboutBottomMask).toContain("gradient");
		expect(artwork.aboutMiddle).toContain("linear-gradient");
		expect(artwork.aboutPanel).toContain("linear-gradient");
		expect(artwork.statsOverlap).toBeCloseTo(artwork.statsOverlapTarget, 1);
		if (viewport.width <= 600) {
			expect(artwork.coveredSignFraction).toBeGreaterThanOrEqual(0.5);
			expect(artwork.coveredSignFraction).toBeLessThanOrEqual(0.7);
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
	}
});

test("narrow mobile stats labels stay inside the green sign in both locales", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await page.goto("/");

	for (const locale of ["en", "fr"] as const) {
		if (locale === "fr") {
			await page.getByRole("button", { name: /FR:/ }).click();
			await expect(page.locator("html")).toHaveAttribute("lang", "fr");
		}

		const bounds = await page.locator("#stats").evaluate(section => {
			const sign = section.querySelector<HTMLElement>('[class*="signs"]')!.lastElementChild!
				.firstElementChild as HTMLElement;
			const signBox = sign.getBoundingClientRect();
			return Array.from(sign.querySelectorAll("span")).flatMap(label => {
				const labelBox = label.getBoundingClientRect();
				return labelBox.width > 0 && labelBox.height > 0
					? [
							{
								left: labelBox.left - signBox.left,
								right: signBox.right - labelBox.right,
							},
						]
					: [];
			});
		});

		for (const label of bounds) {
			expect(label.left).toBeGreaterThanOrEqual(-1);
			expect(label.right).toBeGreaterThanOrEqual(-1);
		}
	}
});

test("phone moves the participant sign below the video and simplifies the stats signs", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 568 });
	await page.goto("/");

	const layout = await page.evaluate(() => {
		const video = document.querySelector<HTMLElement>('[class*="video-layer"]')!;
		const stats = document.querySelector<HTMLElement>("#stats")!;
		const mobileBlue = video.querySelector<HTMLElement>('[data-stat-sign="blue"]')!;
		const statsBlue = stats.querySelector<HTMLElement>('[data-stat-sign="blue"]')!;
		const organizers = stats.querySelector<HTMLElement>('[data-stat-sign="organizers"]')!;
		const green = stats.querySelector<HTMLElement>('[data-stat-sign="green"]')!;
		const title = stats.querySelector<HTMLElement>("h2")!;
		const greenDetails = green.querySelector<HTMLElement>('[class*="mobile-green-details"]')!;
		const greenRows = Array.from(
			greenDetails.querySelectorAll<HTMLElement>('[class*="mobile-green-row"]'),
		);
		const videoBox = video.getBoundingClientRect();
		const statsBox = stats.getBoundingClientRect();
		const blueBox = mobileBlue.getBoundingClientRect();
		const greenBox = green.getBoundingClientRect();
		const titleBox = title.getBoundingClientRect();
		return {
			blueInsideVideo: blueBox.top >= videoBox.top && blueBox.bottom <= videoBox.bottom,
			blueFontFamily: getComputedStyle(mobileBlue.querySelector("strong")!).fontFamily,
			blueFontWeight: getComputedStyle(mobileBlue.querySelector("strong")!).fontWeight,
			videoBackground: getComputedStyle(video).backgroundColor,
			statsBlueStage: getComputedStyle(statsBlue.parentElement!).display,
			organizerStage: getComputedStyle(organizers.parentElement!).display,
			titleTopSpacing: titleBox.top - statsBox.top,
			greenAfterTitle: greenBox.top >= titleBox.bottom,
			greenBush: getComputedStyle(green.parentElement!, "::after").backgroundImage,
			greenRowGap: getComputedStyle(greenDetails).rowGap,
			greenRowAlignment: greenRows.map(row => getComputedStyle(row).alignItems),
			mobileGreenCopy: Array.from(
				green.querySelectorAll<HTMLElement>('[data-mobile-green-copy] strong, [data-mobile-green-copy] span'),
				element => element.textContent?.trim(),
			),
		};
	});

	expect(layout.blueInsideVideo).toBe(true);
	expect(layout.blueFontFamily).toContain("Highway Gothic");
	expect(layout.blueFontWeight).toBe("400");
	expect(layout.videoBackground).toBe("rgb(75, 13, 16)");
	expect(layout.statsBlueStage).toBe("none");
	expect(layout.organizerStage).toBe("none");
	expect(layout.titleTopSpacing).toBeGreaterThanOrEqual(15.5);
	expect(layout.greenAfterTitle).toBe(true);
	expect(layout.greenBush).toContain("bush-4.webp");
	expect(layout.greenRowGap).toBe("0px");
	expect(layout.greenRowAlignment).toEqual(["baseline", "baseline"]);
	expect(layout.mobileGreenCopy).toEqual(["8", "Sponsors", "15", "Collaborators", "70", "Organizers"]);
});

test("phone sign typography stays proportional when sign artwork reaches its size cap", async ({ page }) => {
	const ratios: Array<{ blue: number; green: number }> = [];
	for (const width of [320, 510]) {
		await page.setViewportSize({ width, height: 844 });
		await page.goto("/");
		ratios.push(
			await page.evaluate(() => {
				const blue = document.querySelector<HTMLElement>(
					'[class*="video-layer"] [data-stat-sign="blue"]',
				)!;
				const green = document.querySelector<HTMLElement>('#stats [data-stat-sign="green"]')!;
				return {
					blue: Number.parseFloat(getComputedStyle(blue.querySelector("strong")!).fontSize) / blue.clientWidth,
					green:
						Number.parseFloat(
							getComputedStyle(green.querySelector('[data-mobile-green-copy] strong')!).fontSize,
						) / green.clientWidth,
				};
			}),
		);
	}
	expect(ratios[1].blue).toBeCloseTo(ratios[0].blue, 3);
	expect(ratios[1].green).toBeCloseTo(ratios[0].green, 3);
});

test("desktop FAQ keeps a modest stable offset across canvas breakpoints", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1025, 1199, 1200, 1201, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		const topRatio = await page.locator("#faq").evaluate(section => {
			const slot = section.parentElement!;
			const canvas = section.closest<HTMLElement>("[data-page-canvas]")!;
			return Number.parseFloat(getComputedStyle(slot).top) / canvas.clientHeight;
		});
		expect(topRatio).toBeCloseTo(0.8125, 3);
	}
});

test("tablet canvas expands only the partner middle and the split ice middle", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1024, 1025, 1201, 1440, 1600]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		const layout = await page.evaluate(() => {
			const partner = document.querySelector<HTMLElement>("#testimonials")!;
			const partnerSlot = partner.parentElement!;
			const collaborator = document.querySelector<HTMLElement>("#collaborators")!;
			const partnerInsert = getComputedStyle(partnerSlot, "::before");
			const collaboratorInsert = getComputedStyle(collaborator, "::before");
			const iceTop = document.querySelector<HTMLElement>('[data-scene-layer="ice-1"]')!;
			const iceBottom = document.querySelector<HTMLElement>(
				'[data-scene-slice="ice-bottom"]',
			)!;
			const iceCracks = document.querySelector<HTMLElement>('[data-scene-layer="ice-2"]')!;
			const iceMiddle = document.querySelector<HTMLElement>('[class*="tablet-ice-middle"]')!;
			const iceTopStyle = getComputedStyle(iceTop);
			const iceBottomStyle = getComputedStyle(iceBottom);
			const iceCracksStyle = getComputedStyle(iceCracks);
			const iceMiddleStyle = getComputedStyle(iceMiddle);
			const partnerSlotBox = partnerSlot.getBoundingClientRect();
			const partnerBox = partner.getBoundingClientRect();
			const partnerScale = partnerSlotBox.width / partnerSlot.offsetWidth;
			const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			const aboutParagraphs = Array.from(document.querySelectorAll<HTMLElement>("#about p"));
			const partnerInsertActive = partnerInsert.content !== "none";
			return {
				partnerInsertActive,
				partnerInsertBackground: partnerInsert.backgroundImage,
				partnerRoadClearance: partnerInsertActive
					? partnerSlotBox.top +
						(Number.parseFloat(partnerInsert.height) - rootFontSize * 8) * partnerScale -
						partnerBox.bottom
					: null,
				collaboratorOverlayActive: collaboratorInsert.content !== "none",
				iceMiddleActive: iceMiddleStyle.display !== "none",
				iceMiddleBackground: iceMiddleStyle.backgroundImage,
				iceMiddleWidth: iceMiddle.getBoundingClientRect().width,
				artworkWidth: iceMiddle.parentElement!.getBoundingClientRect().width,
				iceMiddleHeight: iceMiddle.getBoundingClientRect().height,
				iceMiddleZIndex: Number.parseFloat(iceMiddleStyle.zIndex),
				iceTopClip: iceTopStyle.clipPath,
				iceTopZIndex: Number.parseFloat(iceTopStyle.zIndex),
				iceBottomDisplay: iceBottomStyle.display,
				iceBottomClip: iceBottomStyle.clipPath,
				iceBottomTranslate: iceBottomStyle.translate,
				iceCracksTranslate: iceCracksStyle.translate,
				aboutParagraphGaps: aboutParagraphs.slice(1).map(
					(paragraph, index) =>
						paragraph.getBoundingClientRect().top -
						aboutParagraphs[index].getBoundingClientRect().bottom,
				),
				horizontalOverflow:
					document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});

		const partnerInsertExpected = width >= 1025 && width <= 1440;
		const splitIceExpected = width >= 1025 && width <= 1599;
		expect(layout.partnerInsertActive).toBe(partnerInsertExpected);
		expect(layout.collaboratorOverlayActive).toBe(false);
		expect(layout.iceMiddleActive).toBe(splitIceExpected);
		if (partnerInsertExpected) {
			expect(layout.partnerInsertBackground).toContain("road.webp");
			expect(layout.partnerRoadClearance).toBeGreaterThanOrEqual(-2);
		}
		if (splitIceExpected) {
			expect(layout.iceMiddleBackground).toContain("rgb(117, 200, 186)");
			expect(layout.iceMiddleWidth).toBeGreaterThanOrEqual(layout.artworkWidth - 2);
			expect(layout.iceMiddleHeight).toBeGreaterThan(0);
			expect(layout.iceTopClip).toContain("20%");
			expect(layout.iceBottomDisplay).toBe("block");
			expect(layout.iceBottomClip).toContain("80%");
			expect(layout.iceBottomTranslate).not.toBe("none");
			expect(layout.iceCracksTranslate).toBe(layout.iceBottomTranslate);
			expect(layout.iceMiddleZIndex).toBeLessThan(layout.iceTopZIndex);
		} else {
			expect(layout.iceTopClip).toBe("none");
			expect(layout.iceBottomDisplay).toBe("none");
			expect(layout.iceCracksTranslate).toBe("none");
		}
		for (const gap of layout.aboutParagraphGaps) {
			expect(Math.abs(gap)).toBeLessThanOrEqual(0.1);
		}
		expect(layout.horizontalOverflow).toBeLessThanOrEqual(0);
	}
});

test("mobile hero copy clears navigation and stays in view", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const [badge, heading, apply] = await Promise.all([
		page.locator("#mlh-trust-badge").boundingBox(),
		page.locator("#hero h1").boundingBox(),
		page.getByRole("link", { name: "Apply Now" }).boundingBox(),
	]);
	expect(badge).not.toBeNull();
	expect(heading).not.toBeNull();
	expect(apply).not.toBeNull();
	expect(heading!.y).toBeGreaterThanOrEqual(badge!.y + badge!.height + 16);
	expect(heading!.x).toBeGreaterThanOrEqual(0);
	expect(heading!.x + heading!.width).toBeLessThanOrEqual(390);
	expect(apply!.x + apply!.width).toBeLessThanOrEqual(390);
});

test("header remains in document flow and scrolls with the page", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	const navbar = page.locator("nav").first();
	const badge = page.locator("#mlh-trust-badge");
	await expect(navbar).toBeInViewport();
	await expect(badge).toBeVisible();
	await expect(navbar).toHaveCSS("position", "static");
	await expect(navbar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await navbar.locator('[href="#hero"]').click();
	await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
	await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
	await expect(navbar).not.toBeInViewport();
	await expect(badge).not.toBeInViewport();
	await expect(navbar).not.toHaveAttribute("data-hidden");
	await expect(navbar).not.toHaveAttribute("data-floating");
});

test("header only exposes persistent controls", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/");
	const navbar = page.locator("nav").first();
	const badge = page.locator("#mlh-trust-badge");
	await expect(navbar.locator("ul")).toHaveCount(0);
	await expect(navbar.locator('[href="#hero"]')).toBeVisible();
	await expect(navbar.locator("button")).toHaveText("FR");
	await expect(navbar.locator('[href="https://2024.hackthehill.com"]')).toBeVisible();
	await expect(badge).toBeVisible();
	await expect(badge).toHaveAttribute("href", /utm_campaign=2027-season/);
	await expect(badge.locator("img")).toHaveAttribute("alt", /2027 Hackathon Season/);

	await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
	await expect(navbar).not.toBeInViewport();
	await expect(badge).not.toBeInViewport();
});

test("navbar controls keep the same order and alignment across breakpoints", async ({ page }) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const controls = await page
			.locator("[data-navigation-home], nav button[aria-label], #mlh-trust-badge")
			.evaluateAll(elements =>
				elements
					.filter(element => element.getClientRects().length > 0)
					.map(element => {
						const box = element.getBoundingClientRect();
						return { x: box.x, top: box.y };
					}),
			);
		expect(controls.map(control => control.x)).toEqual(
			[...controls.map(control => control.x)].sort((a, b) => a - b),
		);
		expect(controls).toHaveLength(3);
		expect(Math.abs(controls[0].top - controls[2].top)).toBeLessThanOrEqual(1);
		expect(controls[1].top).toBeGreaterThanOrEqual(controls[0].top);
		expect(controls[1].top).toBeLessThanOrEqual(controls[0].top + 24);
	}
});

test("mobile interactive controls meet touch target guidance", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	for (const selector of [
		"#testimonials button",
		"footer a[aria-label]",
		"#sponsors a",
		"#collaborators a",
		"nav button[aria-label]",
	]) {
		const sizes = await page.locator(selector).evaluateAll(elements =>
			elements.map(element => {
				const box = element.getBoundingClientRect();
				return { width: box.width, height: box.height };
			}),
		);
		for (const size of sizes) {
			expect(size.width).toBeGreaterThanOrEqual(44);
			expect(size.height).toBeGreaterThanOrEqual(44);
		}
	}
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

test("sponsor logos keep a visible inset inside their snowbanks", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1332, height: 837 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto("/");
		const sponsorCards = page.locator("[data-sponsor-card]");
		await sponsorCards.locator("img").evaluateAll(images =>
			images.forEach(image => {
				(image as HTMLImageElement).loading = "eager";
			}),
		);
		await expect
			.poll(() =>
				sponsorCards.locator("img").evaluateAll(images =>
					images.every(image => {
						const element = image as HTMLImageElement;
						return element.complete && element.naturalWidth > 0;
					}),
				),
			)
			.toBe(true);
		const invalidCards = await sponsorCards.evaluateAll(cards =>
			cards.flatMap((card, index) => {
				const logo = card.querySelector<HTMLImageElement>('img[alt$=" logo"]');
				const snowbank = card.querySelector<HTMLImageElement>('img[aria-hidden="true"]');
				if (!logo || !snowbank) {
					return [`Sponsor card ${index + 1} is missing its ${!logo ? "logo" : "snowbank"}`];
				}
				const logoBox = logo.getBoundingClientRect();
				const snowbankBox = snowbank.getBoundingClientRect();
				const cardBox = card.getBoundingClientRect();
				const horizontalSafeInset = cardBox.width * 0.14;
				const verticalSafeInset = cardBox.height * 0.18;
				const contained =
					logoBox.left >= cardBox.left + horizontalSafeInset &&
					logoBox.right <= cardBox.right - horizontalSafeInset &&
					logoBox.top >= cardBox.top + verticalSafeInset &&
					logoBox.bottom <= cardBox.bottom - verticalSafeInset &&
					logoBox.left >= snowbankBox.left &&
					logoBox.right <= snowbankBox.right;

				return contained ? [] : [logo.alt];
			}),
		);
		expect(invalidCards).toEqual([]);
	}
});

test("sponsor tier rows scale their cards, clouds, and logos together", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/");
	await expect(page.locator("[data-sponsor-tier-row]")).toHaveCount(3);
	await expect(page.locator('[data-sponsor-tier-row="backbencher"]')).toHaveCount(0);
	const rowTiers = await page.locator("[data-sponsor-tier-row]").evaluateAll(rows =>
		rows.map(row => [...new Set(Array.from(row.children, card => card.getAttribute("data-sponsor-tier")))]),
	);
	expect(rowTiers).toEqual([["prime-minister"], ["premier"], ["mayor", "councillor"]]);

	const measurements = await page.locator("[data-sponsor-card]").evaluateAll(cards => {
		const sectionWidth = cards[0].parentElement!.getBoundingClientRect().width;
		return Object.fromEntries(
			cards.map(card => {
				const tier = card.getAttribute("data-sponsor-tier")!;
				const logo = card.querySelector<HTMLImageElement>('img[alt$=" logo"]')!;
				const snowbank = card.querySelector<HTMLImageElement>('img[aria-hidden="true"]')!;
				const cardWidth = card.getBoundingClientRect().width;
				return [
					tier,
					{
						card: cardWidth / sectionWidth,
						logo: logo.getBoundingClientRect().width / cardWidth,
						snowbank: snowbank.getBoundingClientRect().width / cardWidth,
					},
				];
			}),
		);
	});

	expect(measurements.councillor.card).toBeCloseTo(0.15, 3);
	expect(measurements.mayor.card).toBeCloseTo(0.17, 3);
	const lowerTierMidpoint = (measurements.councillor.card + measurements.mayor.card) / 2;
	expect(measurements.premier.card).toBeCloseTo(lowerTierMidpoint * 2, 3);
	expect(measurements["prime-minister"].card).toBeCloseTo(lowerTierMidpoint * 3, 3);
	expect(measurements["prime-minister"].card).toBeCloseTo(0.48, 2);
	for (const measurement of Object.values(measurements)) {
		expect(measurement.logo).toBeCloseTo(0.7, 2);
		expect(measurement.snowbank).toBeCloseTo(1.08, 2);
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

test("desktop keyboard order includes persistent header controls", async ({ page }) => {
	await page.goto("/");
	const focused: string[] = [];
	for (let index = 0; index < 5; index += 1) {
		await page.keyboard.press("Tab");
		focused.push(
			await page.evaluate(
				() =>
					document.activeElement?.getAttribute("href") ??
					document.activeElement?.getAttribute("aria-label") ??
					"",
			),
		);
	}
	expect(focused[0]).toBe("#main-content");
	expect(focused[1]).toBe("#hero");
	expect(focused[3]).toBe("https://2024.hackthehill.com");
	expect(focused[4]).toContain("mlh.io");
});

test("countdown restores focus after pointer and keyboard dismissal", async ({ page }) => {
	await page.addInitScript(() => {
		Date.now = () => new Date("2026-08-15T12:00:00-04:00").getTime();
	});
	await page.goto("/");
	const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
	await expect(hotspot).toBeAttached();
	const dialog = page.locator("#countdown-dialog");
	await hotspot.hover({ force: true });
	await expect(dialog).toHaveJSProperty("open", true);
	await page.mouse.move(1, 1);
	await expect(dialog).toHaveJSProperty("open", false);
	await hotspot.focus();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await expect(page.getByRole("button", { name: "Close the countdown" })).toBeFocused();
	await hotspot.hover({ force: true });
	await page.mouse.move(1, 1);
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
});

test("particle modes change only for newly spawned particles", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto("/");

	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="leaves"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count()).toBeGreaterThan(0);
	const existingLeaves = await page.locator('img[src*="/leaf-"]').count();

	await page.locator("#testimonials").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="snow"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/snow-"]').count()).toBeGreaterThan(0);
	await expect(page.locator('img[src*="/leaf-"]')).toHaveCount(existingLeaves);
	await expect(page.locator('[aria-hidden="true"][data-mode] img').first()).toHaveCSS(
		"animation-iteration-count",
		"1",
	);
	await expect
		.poll(() => page.locator('img[src*="/leaf-"]').count(), { timeout: 6_000 })
		.toBe(0);

	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="leaves"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/leaf-"]').count()).toBeGreaterThan(0);
	await page.evaluate(() => {
		document.documentElement.style.scrollBehavior = "auto";
		window.scrollTo(0, 0);
	});
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
	await expect
		.poll(() => page.locator('img[src*="/leaf-"]').count(), { timeout: 1_500 })
		.toBe(0);

	await page.locator("#testimonials").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="snow"]')).toBeAttached();
	await expect.poll(() => page.locator('img[src*="/snow-"]').count()).toBeGreaterThan(0);
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await expect(page.locator('[aria-hidden="true"][data-mode="bubbles"]')).toBeAttached();
	await expect
		.poll(() => page.locator('img[src*="/snow-"]').count(), { timeout: 1_500 })
		.toBe(0);
});

test("reduced motion disables animated particles", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await page.locator("#about").scrollIntoViewIfNeeded();
	await expect(page.locator('[aria-hidden="true"][data-mode="none"]')).toBeAttached();
});

test("bubble highlights remain oriented toward the shared light source", async ({ page }) => {
	await page.goto("/");
	await page.locator("#faq").scrollIntoViewIfNeeded();
	const field = page.locator('[data-mode="bubbles"]');
	await expect(field).toBeAttached();
	const bubbles = field.locator("img");
	await expect(bubbles).toHaveCount(18);

	const orientations = await bubbles.evaluateAll(elements =>
		elements.slice(0, 6).map(element => getComputedStyle(element).rotate),
	);
	expect(orientations).toEqual(["0deg", "-45deg", "-45deg", "15deg", "20deg", "0deg"]);
});
