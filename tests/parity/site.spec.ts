import { expect, test } from "@playwright/test";
import { compareSite } from "./compare";
import { settlePage } from "./pages";
import { interactionViewports, parityViewports } from "./viewports";

for (const viewport of parityViewports) {
	for (const locale of ["en", "fr"] as const) {
		test(`home ${locale} ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
			await compareSite(browser, info, { name: "home", viewport, locale });
		});
	}
}

for (const viewport of interactionViewports) {
	for (const locale of ["en", "fr"] as const) {
		test(`interactions ${locale} ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
			await compareSite(browser, info, {
				name: "faq-expanded-carousel-next",
				viewport,
				locale,
				async prepare(page) {
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
						if (viewport.width >= 1025) {
							// Let this accordion's footer adjustment finish before the next keypress.
							await expect
								.poll(() =>
									page.locator("#faq").evaluate(section => {
										const faq = section.parentElement!;
										const footer = document.querySelector("footer")!.parentElement!;
										return footer.offsetTop - faq.offsetTop - faq.getBoundingClientRect().height;
									}),
								)
								.toBeGreaterThanOrEqual(48);
						}
					}
					await expect(page.locator("#faq details[open]")).toHaveCount(await questions.count());
					await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
					await settlePage(page);
				},
			});
		});
	}
}

for (const locale of ["en", "fr"] as const) {
	test(`countdown ${locale} 1440x900`, async ({ browser }, info) => {
		await compareSite(browser, info, {
			name: "countdown",
			viewport: { width: 1440, height: 900 },
			locale,
			async prepare(page) {
				const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
				await hotspot.focus();
				await hotspot.press("Enter");
				await expect(page.locator("#countdown-dialog")).toHaveJSProperty("open", true);
				await settlePage(page);
			},
			async afterCapture(page) {
				await page.keyboard.press("Escape");
				await expect(page.locator('#hero button[aria-haspopup="dialog"]')).toBeFocused();
			},
		});
	});
}

for (const viewport of [...interactionViewports, { width: 699, height: 900 }, { width: 701, height: 900 }]) {
	test(`404 ${viewport.width}x${viewport.height}`, async ({ browser }, info) => {
		await compareSite(browser, info, {
			name: "404",
			viewport,
			locale: "en",
			path: "/404.html",
		});
	});
}
