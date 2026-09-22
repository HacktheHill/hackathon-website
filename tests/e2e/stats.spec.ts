import { expect, test } from "@playwright/test";

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
		const mobileTitle = video.querySelector<HTMLElement>("h2")!;
		const statsBlue = stats.querySelector<HTMLElement>('[data-stat-sign="blue"]')!;
		const organizers = stats.querySelector<HTMLElement>('[data-stat-sign="organizers"]')!;
		const green = stats.querySelector<HTMLElement>('[data-stat-sign="green"]')!;
		const greenDetails = green.querySelector<HTMLElement>('[class*="mobile-green-details"]')!;
		const greenRows = Array.from(greenDetails.querySelectorAll<HTMLElement>('[class*="mobile-green-row"]'));
		const videoBox = video.getBoundingClientRect();
		const blueBox = mobileBlue.getBoundingClientRect();
		const greenBox = green.getBoundingClientRect();
		const mobileTitleBox = mobileTitle.getBoundingClientRect();
		return {
			blueInsideVideo: blueBox.top >= videoBox.top && blueBox.bottom <= videoBox.bottom,
			titleBeforeBlue: mobileTitleBox.bottom <= blueBox.top,
			blueFontFamily: getComputedStyle(mobileBlue.querySelector("strong")!).fontFamily,
			blueFontWeight: getComputedStyle(mobileBlue.querySelector("strong")!).fontWeight,
			videoBackground: getComputedStyle(video).backgroundColor,
			statsBlueStage: getComputedStyle(statsBlue.parentElement!).display,
			organizerStage: getComputedStyle(organizers.parentElement!).display,
			greenVisible: greenBox.width > 0 && greenBox.height > 0,
			greenBush: getComputedStyle(green.parentElement!, "::after").backgroundImage,
			greenRowGap: getComputedStyle(greenDetails).rowGap,
			greenRowAlignment: greenRows.map(row => getComputedStyle(row).alignItems),
			mobileGreenCopy: Array.from(
				green.querySelectorAll<HTMLElement>("[data-mobile-green-copy] strong, [data-mobile-green-copy] span"),
				element => element.textContent?.trim(),
			),
		};
	});

	expect(layout.blueInsideVideo).toBe(true);
	expect(layout.titleBeforeBlue).toBe(true);
	expect(layout.blueFontFamily).toContain("Highway Gothic");
	expect(layout.blueFontWeight).toBe("400");
	expect(layout.videoBackground).toBe("rgb(51, 10, 10)");
	expect(layout.statsBlueStage).toBe("none");
	expect(layout.organizerStage).toBe("none");
	expect(layout.greenVisible).toBe(true);
	expect(layout.greenBush).toContain("bush-4.webp");
	expect(layout.greenRowGap).toBe("16px");
	expect(layout.greenRowAlignment).toEqual(["baseline", "baseline"]);
	expect(layout.mobileGreenCopy).toEqual(["8", "Sponsors", "15", "Collaborators", "70", "Organisers"]);
});

test("phone sign typography stays proportional when sign artwork reaches its size cap", async ({ page }) => {
	const ratios: Array<{ blue: number; green: number }> = [];
	for (const width of [320, 510]) {
		await page.setViewportSize({ width, height: 844 });
		await page.goto("/");
		ratios.push(
			await page.evaluate(() => {
				const blue = document.querySelector<HTMLElement>('[class*="video-layer"] [data-stat-sign="blue"]')!;
				const green = document.querySelector<HTMLElement>('#stats [data-stat-sign="green"]')!;
				return {
					blue:
						Number.parseFloat(getComputedStyle(blue.querySelector("strong")!).fontSize) / blue.clientWidth,
					green:
						Number.parseFloat(
							getComputedStyle(green.querySelector("[data-mobile-green-copy] strong")!).fontSize,
						) / green.clientWidth,
				};
			}),
		);
	}
	expect(ratios[1].blue).toBeCloseTo(ratios[0].blue, 3);
	expect(ratios[1].green).toBeCloseTo(ratios[0].green, 3);
});
