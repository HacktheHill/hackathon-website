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
	await page.locator("[data-sponsor-card] img").evaluateAll(images =>
		images.forEach(image => {
			(image as HTMLImageElement).loading = "eager";
		}),
	);
	await expect
		.poll(() =>
			page
				.locator('[data-sponsor-card] img[alt$=" logo"]')
				.evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0)),
		)
		.toBe(true);
	const rowTiers = await page
		.locator("[data-sponsor-tier-row]")
		.evaluateAll(rows =>
			rows.map(row => [...new Set(Array.from(row.children, card => card.getAttribute("data-sponsor-tier")))]),
		);
	expect(rowTiers).toEqual([["largest"], ["large"], ["small"]]);

	const measurements = await page.locator("[data-sponsor-card]").evaluateAll(cards => {
		const sectionWidth = cards[0].parentElement!.getBoundingClientRect().width;
		const paintedBounds = (image: HTMLImageElement) => {
			const canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			const context = canvas.getContext("2d", { willReadFrequently: true })!;
			context.drawImage(image, 0, 0);
			const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
			let left = canvas.width;
			let right = -1;
			let top = canvas.height;
			let bottom = -1;
			for (let y = 0; y < canvas.height; y += 1) {
				for (let x = 0; x < canvas.width; x += 1) {
					if (pixels[(y * canvas.width + x) * 4 + 3] === 0) continue;
					left = Math.min(left, x);
					right = Math.max(right, x);
					top = Math.min(top, y);
					bottom = Math.max(bottom, y);
				}
			}
			return { width: right - left + 1, height: bottom - top + 1 };
		};
		return Object.fromEntries(
			cards.map(card => {
				const tier = card.getAttribute("data-sponsor-tier")!;
				const logo = card.querySelector<HTMLImageElement>('img[alt$=" logo"]')!;
				const snowbank = card.querySelector<HTMLImageElement>('img[aria-hidden="true"]')!;
				const cardWidth = card.getBoundingClientRect().width;
				const logoBox = logo.getBoundingClientRect();
				const objectFitScale = Math.min(logoBox.width / logo.naturalWidth, logoBox.height / logo.naturalHeight);
				const sourcePaint = paintedBounds(logo);
				return [
					logo.alt,
					{
						tier,
						card: cardWidth / sectionWidth,
						logo: logoBox.width / cardWidth,
						paintedArea: sourcePaint.width * objectFitScale * sourcePaint.height * objectFitScale,
						snowbank: snowbank.getBoundingClientRect().width / cardWidth,
					},
				];
			}),
		);
	});

	expect(Object.keys(measurements)).toEqual(["CGI logo", "Ciena logo", "ElevenLabs logo", "Backboard logo"]);
	expect(measurements["CGI logo"].card).toBeCloseTo(0.48, 2);
	expect(measurements["Ciena logo"].card).toBeCloseTo(measurements["CGI logo"].card, 3);
	expect(measurements["ElevenLabs logo"].card).toBeCloseTo(0.24, 2);
	expect(measurements["Backboard logo"].card).toBeCloseTo(measurements["ElevenLabs logo"].card, 3);
	expect(measurements["CGI logo"].paintedArea).toBeGreaterThan(measurements["Ciena logo"].paintedArea);
	expect(measurements["Ciena logo"].paintedArea).toBeGreaterThan(measurements["ElevenLabs logo"].paintedArea);
	expect(measurements["Ciena logo"].paintedArea).toBeGreaterThan(measurements["Backboard logo"].paintedArea);
	for (const measurement of Object.values(measurements)) {
		expect(measurement.logo).toBeCloseTo(measurement.tier === "small" ? 0.68 : 0.7, 2);
		expect(measurement.snowbank).toBeCloseTo(1.08, 2);
	}
});
