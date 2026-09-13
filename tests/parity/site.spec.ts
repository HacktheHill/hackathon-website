import { expect, test } from "@playwright/test";
import { compareScreenshots } from "./compare";
import { compareContent, openPair, settlePage } from "./pages";
import { interactionViewports, parityViewports } from "./viewports";

for (const viewport of parityViewports) {
	for (const locale of ["en", "fr"] as const) {
		test(`home ${locale} ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
			const pair = await openPair(browser, viewport, locale);
			try {
				await compareContent(pair.reference, pair.candidate, info, "home");
				await compareScreenshots(pair.reference, pair.candidate, info, "home");
			} finally {
				await pair.close(info);
			}
		});
	}
}

for (const viewport of interactionViewports) {
	for (const locale of ["en", "fr"] as const) {
		test(`interactions ${locale} ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
			const pair = await openPair(browser, viewport, locale);
			try {
				for (const page of pair.pages) {
					const carousel = page.locator("#testimonials [aria-live]");
					await carousel.focus();
					await carousel.press("ArrowRight");
					await expect(page.locator('#testimonials button[aria-pressed="true"]')).toHaveAttribute(
						"aria-label",
						/2:/,
					);
					const questions = page.locator("#faq summary");
					for (const question of await questions.all()) {
						await question.focus();
						await question.press("Enter");
					}
					await expect(page.locator("#faq details[open]")).toHaveCount(await questions.count());
					await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
					await settlePage(page);
				}
				await compareContent(pair.reference, pair.candidate, info, "faq-expanded-carousel-next");
				await compareScreenshots(pair.reference, pair.candidate, info, "faq-expanded-carousel-next");
			} finally {
				await pair.close(info);
			}
		});
	}
}

for (const locale of ["en", "fr"] as const) {
	test(`countdown ${locale} 1440x900`, async ({ browser }, info) => {
		const pair = await openPair(browser, { width: 1440, height: 900 }, locale);
		try {
			for (const page of pair.pages) {
				const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
				await hotspot.focus();
				await hotspot.press("Enter");
				await expect(page.locator("#countdown-dialog")).toHaveJSProperty("open", true);
				await settlePage(page);
			}
			await compareContent(pair.reference, pair.candidate, info, "countdown");
			await compareScreenshots(pair.reference, pair.candidate, info, "countdown");
			for (const page of pair.pages) {
				await page.keyboard.press("Escape");
				await expect(page.locator('#hero button[aria-haspopup="dialog"]')).toBeFocused();
			}
		} finally {
			await pair.close(info);
		}
	});
}

for (const viewport of [...interactionViewports, { width: 699, height: 900 }, { width: 701, height: 900 }]) {
	test(`404 ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
		const pair = await openPair(browser, viewport, "en", "/404.html");
		try {
			await compareContent(pair.reference, pair.candidate, info, "404");
			await compareScreenshots(pair.reference, pair.candidate, info, "404");
		} finally {
			await pair.close(info);
		}
	});
}
