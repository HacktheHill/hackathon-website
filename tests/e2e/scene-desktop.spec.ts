import { expect, test } from "@playwright/test";

test("tablet preserves the road and ice artwork while expanding crowded sections", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1024, 1025, 1201, 1440, 1600]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		const layout = await page.evaluate(() => {
			const partner = document.querySelector<HTMLElement>("#testimonials")!;
			const partnerSlot = partner.parentElement!;
			const sponsors = document.querySelector<HTMLElement>("#sponsors")!;
			const collaborator = document.querySelector<HTMLElement>("#collaborators")!;
			const partnerInsert = getComputedStyle(partnerSlot, "::before");
			const collaboratorInsert = getComputedStyle(collaborator, "::before");
			const road = document.querySelector<HTMLElement>('[data-scene-layer="road"]')!;
			const iceTop = document.querySelector<HTMLElement>('[data-scene-layer="ice-1"]')!;
			const iceBottom = document.querySelector<HTMLElement>('[data-scene-slice="ice-bottom"]')!;
			const iceCracks = document.querySelector<HTMLElement>('[data-scene-layer="ice-2"]')!;
			const iceMiddle = document.querySelector<HTMLElement>('[class*="tablet-ice-middle"]')!;
			const roadStyle = getComputedStyle(road);
			const iceTopStyle = getComputedStyle(iceTop);
			const iceBottomStyle = getComputedStyle(iceBottom);
			const iceCracksStyle = getComputedStyle(iceCracks);
			const iceMiddleStyle = getComputedStyle(iceMiddle);
			const partnerBox = partner.getBoundingClientRect();
			const roadBox = road.getBoundingClientRect();
			const iceTopBox = iceTop.getBoundingClientRect();
			const sponsorsBox = sponsors.getBoundingClientRect();
			const sponsorHeadingBox = sponsors.querySelector("h2")!.getBoundingClientRect();
			const aboutParagraphs = Array.from(document.querySelectorAll<HTMLElement>("#about p"));
			const translateY = (value: string) => {
				if (value === "none") return 0;
				const parts = value.split(/\s+/);
				return Number.parseFloat(parts[1] ?? "0");
			};
			return {
				partnerOverlayActive: partnerInsert.content !== "none",
				partnerInsertBackground: partnerInsert.backgroundImage,
				testimonialRoadClearance: roadBox.top - partnerBox.bottom,
				roadVisible: roadBox.width > 0 && roadBox.height > 0,
				roadTranslateY: translateY(roadStyle.translate),
				roadZIndex: Number.parseFloat(roadStyle.zIndex),
				iceRoadOverlap: roadBox.bottom - iceTopBox.top,
				sponsorHeadingFromIce: sponsorHeadingBox.top - iceTopBox.top,
				sponsorHeadingCenterOffset: Math.abs(
					sponsorHeadingBox.left + sponsorHeadingBox.width / 2 - (sponsorsBox.left + sponsorsBox.width / 2),
				),
				collaboratorOverlayActive: collaboratorInsert.content !== "none",
				iceMiddleActive: iceMiddleStyle.display !== "none",
				iceMiddleBackground: iceMiddleStyle.backgroundImage,
				iceMiddleWidth: iceMiddle.getBoundingClientRect().width,
				artworkWidth: iceMiddle.parentElement!.getBoundingClientRect().width,
				iceMiddleHeight: iceMiddle.getBoundingClientRect().height,
				iceMiddleZIndex: Number.parseFloat(iceMiddleStyle.zIndex),
				iceTopClip: iceTopStyle.clipPath,
				iceTopTranslateY: translateY(iceTopStyle.translate),
				iceTopZIndex: Number.parseFloat(iceTopStyle.zIndex),
				iceBottomDisplay: iceBottomStyle.display,
				iceBottomClip: iceBottomStyle.clipPath,
				iceBottomTranslate: iceBottomStyle.translate,
				iceCracksTranslate: iceCracksStyle.translate,
				aboutParagraphGaps: aboutParagraphs
					.slice(1)
					.map(
						(paragraph, index) =>
							paragraph.getBoundingClientRect().top -
							aboutParagraphs[index].getBoundingClientRect().bottom,
					),
				horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});

		const splitIceExpected = width >= 1025 && width <= 1599;
		expect(layout.partnerOverlayActive).toBe(false);
		expect(layout.partnerInsertBackground).not.toContain("road.webp");
		expect(layout.collaboratorOverlayActive).toBe(false);
		expect(layout.iceMiddleActive).toBe(splitIceExpected);
		if (width >= 1025) {
			expect(layout.roadVisible).toBe(true);
			expect(layout.testimonialRoadClearance).toBeGreaterThanOrEqual(-8);
			expect(layout.iceRoadOverlap).toBeGreaterThan(0);
			expect(layout.iceTopZIndex).toBeGreaterThan(layout.roadZIndex);
			expect(layout.sponsorHeadingFromIce).toBeGreaterThan(0);
			expect(layout.sponsorHeadingCenterOffset).toBeLessThanOrEqual(1);
		}
		if (width === 1025 || width === 1201) {
			expect(layout.roadTranslateY).toBeGreaterThan(0);
			expect(layout.iceTopTranslateY).toBe(layout.roadTranslateY);
		} else {
			expect(layout.roadTranslateY).toBe(0);
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
			expect(gap).toBeGreaterThanOrEqual(-0.1);
			if (width === 1024) expect(Math.abs(gap - 16)).toBeLessThanOrEqual(0.1);
		}
		expect(layout.horizontalOverflow).toBeLessThanOrEqual(0);
	}
});
