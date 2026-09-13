import { expect, test } from "@playwright/test";

test("desktop welcome video leaves clear space beside the copy", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1025, 1100, 1200, 1536, 1920]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.evaluate(() => document.fonts.ready);
		const layout = await page.evaluate(() => {
			const canvas = document.querySelector<HTMLElement>("[data-page-canvas]")!;
			const about = document.querySelector<HTMLElement>("#about")!;
			const copy = document.querySelector<HTMLElement>('#about [class*="about-text"]')!;
			const video = document.querySelector<HTMLElement>('[class*="video-layer"]')!;
			const frame = document.querySelector<HTMLElement>('[data-scene-layer="logs"]')!;
			const lowerBush = document.querySelector<HTMLElement>('[data-scene-layer="bush-3"]')!;
			const copyBox = copy.getBoundingClientRect();
			const aboutBox = about.getBoundingClientRect();
			const heading = copy.querySelector("h2")!;
			const copyEdge = heading.getBoundingClientRect();
			const paragraphs = [...copy.querySelectorAll("p")];
			const bodyBottom = paragraphs.at(-1)!.getBoundingClientRect().bottom;
			const videoBox = video.getBoundingClientRect();
			const frameBox = frame.getBoundingClientRect();
			const canvasBox = canvas.getBoundingClientRect();
			const copyStyle = getComputedStyle(copy);
			const frameOpening = {
				left: frameBox.left + frameBox.width * (151 / 1342),
				top: frameBox.top + frameBox.height * (145 / 900),
				width: frameBox.width * (1059 / 1342),
				height: frameBox.height * (571 / 900),
			};
			return {
				gap: videoBox.left - copyBox.right,
				frameGap: frameBox.left - copyBox.right,
				outerMarginDifference: Math.abs(copyEdge.left - canvasBox.left - (canvasBox.right - frameBox.right)),
				centerAlignment: copyBox.top + copyBox.height / 2 - (frameBox.top + frameBox.height / 2),
				copyHeightDifference: copyBox.height - aboutBox.height,
				copyContentOverflow: copy.scrollHeight - copy.clientHeight,
				headingTopClearance: copyEdge.top - frameBox.top,
				bodyBottomClearance: frameBox.bottom - bodyBottom,
				headingBodyGap: paragraphs[0].getBoundingClientRect().top - copyEdge.bottom,
				paddingTop: Number.parseFloat(copyStyle.paddingTop),
				paddingBottom: Number.parseFloat(copyStyle.paddingBottom),
				paragraphGaps: paragraphs
					.slice(1)
					.map(
						(paragraph, index) =>
							paragraph.getBoundingClientRect().top - paragraphs[index].getBoundingClientRect().bottom,
					),
				desktopTitle: heading.getAttribute("aria-label"),
				bottomClearance: lowerBush.getBoundingClientRect().top - copyBox.bottom,
				canvasWidth: canvasBox.width,
				videoWidth: videoBox.width,
				videoAspectRatio: videoBox.width / videoBox.height,
				frameAlignment: {
					left: videoBox.left - frameOpening.left,
					top: videoBox.top - frameOpening.top,
					width: videoBox.width - frameOpening.width,
					height: videoBox.height - frameOpening.height,
				},
				horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});
		expect(layout.gap).toBeGreaterThanOrEqual(layout.canvasWidth * 0.035);
		expect(layout.frameGap).toBeGreaterThanOrEqual(layout.canvasWidth * 0.035);
		expect(layout.outerMarginDifference).toBeLessThanOrEqual(layout.canvasWidth * 0.01);
		expect(Math.abs(layout.centerAlignment)).toBeLessThanOrEqual(1);
		expect(Math.abs(layout.copyHeightDifference)).toBeLessThanOrEqual(1);
		expect(layout.copyContentOverflow).toBeLessThanOrEqual(1);
		expect(layout.headingTopClearance).toBeGreaterThanOrEqual(layout.paddingTop - 1);
		expect(layout.bodyBottomClearance).toBeGreaterThanOrEqual(0);
		expect(Math.abs(layout.headingTopClearance - layout.headingBodyGap)).toBeLessThanOrEqual(1);
		for (const gap of layout.paragraphGaps) expect(gap).toBeGreaterThanOrEqual(0);
		expect(Math.abs(layout.paragraphGaps[0] - layout.paragraphGaps[1])).toBeLessThanOrEqual(1);
		expect(layout.desktopTitle).toBe("Welcome to Hack the Hill III");
		expect(layout.bottomClearance).toBeGreaterThanOrEqual(layout.canvasWidth * 0.004);
		expect(layout.videoWidth / layout.canvasWidth).toBeCloseTo(0.338606, 2);
		expect(layout.videoAspectRatio).toBeCloseTo(1059 / 571, 2);
		for (const offset of Object.values(layout.frameAlignment)) {
			expect(Math.abs(offset)).toBeLessThanOrEqual(1);
		}
		expect(layout.horizontalOverflow).toBeLessThanOrEqual(0);
	}
});

test("mobile recap poster and player fill the log frame opening", async ({ page }) => {
	for (const width of [390, 768, 1024]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		const alignment = await page.evaluate(() => {
			const frame = document.querySelector<HTMLElement>('[class*="video-frame"]')!;
			const video = frame.querySelector<HTMLIFrameElement>("iframe")!;
			const paragraphs = [...document.querySelectorAll<HTMLElement>("#about p")];
			const title = document.querySelector<HTMLElement>("#about h2")!;
			const frameBox = frame.getBoundingClientRect();
			const videoBox = video.getBoundingClientRect();
			const opening = {
				left: frameBox.left + frameBox.width * (151 / 1342),
				top: frameBox.top + frameBox.height * (145 / 900),
				width: frameBox.width * (1059 / 1342),
				height: frameBox.height * (571 / 900),
			};
			return {
				left: videoBox.left - opening.left,
				top: videoBox.top - opening.top,
				width: videoBox.width - opening.width,
				height: videoBox.height - opening.height,
				title: title.getAttribute("aria-label"),
				titleDisplay: getComputedStyle(title).display,
				paragraphGap: paragraphs[1].getBoundingClientRect().top - paragraphs[0].getBoundingClientRect().bottom,
			};
		});

		for (const offset of [alignment.left, alignment.top, alignment.width, alignment.height]) {
			expect(Math.abs(offset)).toBeLessThanOrEqual(1);
		}
		expect(alignment.title).toBe("Welcome to Hack the Hill III");
		expect(alignment.titleDisplay).not.toBe("none");
		expect(Math.abs(alignment.paragraphGap - 16)).toBeLessThanOrEqual(1);
	}
});
