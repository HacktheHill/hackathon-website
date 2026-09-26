import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

test("training video fully loads, waits three seconds, captions both languages, cuts to black, and replays on return", async ({
	page,
}) => {
	await page.goto("/slides#blackout");
	const blackout = page.locator(".presentation-blackout");
	const video = page.locator(".blackout-film");
	await expect(blackout).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
	await expect(video).toBeHidden();
	await page.waitForTimeout(1000);
	expect(await video.evaluate((v: HTMLVideoElement) => v.paused && v.currentTime === 0)).toBe(true);
	await expect
		.poll(
			async () =>
				(await video.evaluate((v: HTMLVideoElement) => !v.paused)) ||
				(await page.locator(".blackout-play").count()) > 0,
		)
		.toBe(true);
	if (await page.locator(".blackout-play").count()) await page.locator(".blackout-play").click();
	const media = await video.evaluate((v: HTMLVideoElement) => ({
		src: v.currentSrc,
		duration: v.duration,
		muted: v.muted,
	}));
	expect(media.src).toMatch(/^blob:/);
	expect(media.duration).toBeCloseTo(39.5, 1);
	expect(media.muted).toBe(false);
	for (const viewport of [
		{ width: 1600, height: 1100 },
		{ width: 1800, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		const box = await video.boundingBox();
		expect(box!.width / box!.height).toBeCloseTo(16 / 9, 3);
		expect(box!.x + box!.width / 2).toBeCloseTo(viewport.width / 2, 0);
		expect(box!.y + box!.height / 2).toBeCloseTo(viewport.height / 2, 0);
	}

	for (const [time, caption] of [
		[24, "Félicitations pour votre admission à Hack the Hill III."],
		[26.5, "Before you begin your hacking journey"],
	] as const) {
		await video.evaluate((v: HTMLVideoElement, time) => {
			v.currentTime = time;
		}, time);
		await expect
			.poll(() =>
				video.evaluate((v: HTMLVideoElement) =>
					[...(v.textTracks[0]?.activeCues ?? [])]
						.map(cue => (cue as VTTCue).getCueAsHTML().textContent)
						.join("\n"),
				),
			)
			.toBe(caption);
	}

	await video.evaluate((v: HTMLVideoElement) => {
		v.currentTime = 30.8;
	});
	await expect
		.poll(() =>
			video.evaluate((v: HTMLVideoElement) =>
				[...(v.textTracks[0]?.activeCues ?? [])].map(cue => (cue as VTTCue).text).join("\n"),
			),
		)
		.toBe("we’ve prepared a 10-minute overview of hacking tips");
	await video.evaluate((v: HTMLVideoElement) => {
		v.currentTime = 39.25;
	});
	await expect(blackout).toHaveAttribute("data-finished", "true");
	await expect(video).toBeHidden();
	await expect(blackout).toHaveCSS("background-color", "rgb(0, 0, 0)");
	await expect(page).toHaveURL(/#blackout$/);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#blackout-1$/);
	await expect(page.locator(".presentation-interlude")).toHaveText("1. SHORT, FOCUSED, AND IN SCOPE");
	await expect(blackout).toBeHidden();
	expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
	await page.keyboard.press("ArrowLeft");
	await expect(blackout).toHaveAttribute("data-finished", "false");
	await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime < 5)).toBe(true);
});
