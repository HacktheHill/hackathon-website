import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

async function openTimer(page: import("@playwright/test").Page) {
	await page.clock.install({ time: new Date("2026-09-25T16:00:00Z") });
	await page.clock.pauseAt(new Date("2026-09-25T16:00:01Z"));
	await page.goto("/timer");
	await page.waitForFunction(() => !document.querySelector("astro-island")?.hasAttribute("ssr"));
}

test("countdown tracks elapsed time, adjusts by minutes, and hands off only once at zero", async ({ page }) => {
	await openTimer(page);
	const timer = page.locator('[role="timer"]');
	await expect(timer).toHaveAttribute("data-seconds", "600");
	await page.clock.runFor(1000);
	await expect(timer).toHaveAttribute("data-seconds", "599");
	await page.keyboard.press("+");
	await expect(timer).toHaveAttribute("data-seconds", "659");
	await page.keyboard.press("-");
	await expect(timer).toHaveAttribute("data-seconds", "599");
	// Simulate a throttled/background tab: one timer delivery must catch up fully.
	await page.clock.fastForward(5 * 60_000);
	await expect(timer).toHaveAttribute("data-seconds", "299");
	for (let i = 0; i < 6; i++) await page.keyboard.press("-");
	await expect(timer).toHaveAttribute("data-seconds", "0");
	await expect(page.locator(".timer-sequence")).toHaveAttribute("data-phase", "black");
	await page.keyboard.press("NumpadAdd");
	await expect(timer).toHaveAttribute("data-seconds", "0");
	await page.keyboard.press("=");
	await expect(timer).toHaveAttribute("data-seconds", "0");
	await page.keyboard.press("Control+-");
	await expect(timer).toHaveAttribute("data-seconds", "0");
});

test("fully downloads the recap, plays with sound, then reveals the working slide deck", async ({ page }) => {
	await page.goto("/timer");
	const sequence = page.locator(".timer-sequence");
	const video = page.locator(".timer-recap");
	await expect(sequence).toHaveAttribute("data-video-ready", "true", { timeout: 30_000 });
	const media = await video.evaluate((element: HTMLVideoElement) => ({
		source: element.currentSrc,
		duration: element.duration,
		width: element.videoWidth,
		height: element.videoHeight,
	}));
	expect(media.source).toMatch(/^blob:/);
	expect(media.duration).toBeGreaterThan(60);
	expect(media.width / media.height).toBeCloseTo(16 / 9);
	for (let i = 0; i < 10; i++) await page.keyboard.press("-");
	await expect(sequence).toHaveAttribute("data-phase", "black");
	await expect(sequence).toHaveAttribute("data-phase", "video");
	await expect
		.poll(() =>
			video.evaluate((element: HTMLVideoElement) => !element.paused && !element.muted && element.currentTime > 0),
		)
		.toBe(true);
	await video.evaluate((element: HTMLVideoElement) => {
		element.currentTime = element.duration - 0.2;
	});
	await expect(sequence).toHaveAttribute("data-phase", "closing");
	await expect(sequence).toHaveAttribute("data-phase", "slides");
	const deck = page.frameLocator(".timer-slides");
	await expect(deck.locator(".slide-opening")).toHaveAttribute("aria-hidden", "false");
	await page.keyboard.press("ArrowRight");
	await expect(deck.locator(".slide-tonight")).toHaveAttribute("aria-hidden", "false");
});

test("holds on black for a pending download and offers playback when autoplay is blocked", async ({ page }) => {
	let download: import("@playwright/test").Route | undefined;
	await page.route("**/hthrecap_2.mp4", route => {
		download = route;
	});
	await page.addInitScript(() => {
		const originalPlay = HTMLMediaElement.prototype.play;
		let calls = 0;
		HTMLMediaElement.prototype.play = function () {
			if (calls++ === 0) return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
			return originalPlay.call(this);
		};
	});
	await page.goto("/timer");
	await expect.poll(() => Boolean(download)).toBe(true);
	for (let i = 0; i < 10; i++) await page.keyboard.press("-");
	await expect(page.locator(".timer-blackout")).toHaveCSS("opacity", "1");
	await expect(page.locator(".timer-sequence")).toHaveAttribute("data-phase", "black");
	await expect(page.locator(".timer-recap")).not.toHaveAttribute("src");
	await download!.continue();
	await expect(page.getByRole("button", { name: "Play recap / Lancer la vidéo" })).toBeVisible({ timeout: 30_000 });
	await page.keyboard.press("Enter");
	await expect(page.locator(".timer-sequence")).toHaveAttribute("data-phase", "video");
});

test("timer retains opening artwork, has no controls, and respects reduced motion", async ({ page }) => {
	await openTimer(page);
	await expect(page.locator("button, nav, input, .slide-ribbon")).toHaveCount(0);
	await expect(page.locator(".landscape [data-opening-layer]")).toHaveCount(14);
	await expect(page.locator(".cover-wordmark, .event-date")).toHaveCount(0);
	await expect(page.locator('[data-opening-layer="parl-tower"]')).toHaveCSS("clip-path", "inset(34px 0px 0px)");
	await expect(page.locator(".flag-rest")).toBeVisible();
	await expect(page.locator(".flag-motion")).toBeHidden();
	await expect
		.poll(() =>
			page
				.locator(".presentation-stage img")
				.evaluateAll(images =>
					images.every(
						image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
					),
				),
		)
		.toBe(true);
	await page.clock.runFor(1000);
	await expect(page.locator(".timer-digit-roll").first()).toHaveCSS("animation-name", "none");
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect(page.locator(".flag-motion")).toBeVisible();
	await expect(page.locator(".flag-rest")).toBeHidden();
	await page.clock.runFor(1000);
	await expect(page.locator(".timer-digit-roll").last()).toHaveCSS("animation-name", "timer-roll");
	await page.setViewportSize({ width: 1280, height: 800 });
	await expect
		.poll(async () => {
			const box = await page.locator(".presentation-stage").boundingBox();
			return box && Math.abs(box.width / box.height - 16 / 9) < 0.001 && box.width <= 1280 && box.height <= 800;
		})
		.toBe(true);
});

test("ExtraBold digits fit their slots and each transition moves as one reel", async ({ page }) => {
	await openTimer(page);
	await page.evaluate(() => document.fonts.ready);
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.clock.runFor(1000);
	const checks = await page.locator(".timer-digit").evaluateAll(slots =>
		slots.map(slot => {
			const style = getComputedStyle(slot);
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d")!;
			context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			const widest = Math.max(...[..."0123456789"].map(digit => context.measureText(digit).width));
			const animation = slot.getAnimations({ subtree: true })[0];
			animation.pause();
			animation.currentTime = 300;
			const rows = [...slot.querySelectorAll(".timer-digit-reel > span")].map(row => row.getBoundingClientRect());
			return {
				fits: widest <= slot.getBoundingClientRect().width,
				duration: animation.effect!.getTiming().duration,
				gap: Math.abs(rows[1].top - rows[0].bottom),
				animationCount: slot.getAnimations({ subtree: true }).length,
			};
		}),
	);
	for (const check of checks) {
		expect(check.fits).toBe(true);
		expect(check.duration).toBe(600);
		expect(check.gap).toBeLessThan(0.1);
		expect(check.animationCount).toBe(1);
	}
});
