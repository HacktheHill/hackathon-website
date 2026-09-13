import { expect, test } from "@playwright/test";

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
	const rowTiers = await page
		.locator("[data-sponsor-tier-row]")
		.evaluateAll(rows =>
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
