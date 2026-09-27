import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

test("winner cannons vary, clear on navigation, replay on reveal, and respect reduced motion", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.goto("/closing#foss");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	const confetti = page.locator(".winner-confetti");
	const ink = () =>
		confetti.evaluate((el: HTMLCanvasElement) =>
			el
				.getContext("2d")!
				.getImageData(0, 0, 1600, 900)
				.data.some((value, i) => i % 4 === 3 && value > 0),
		);
	for (const [id, pattern, motif] of [
		["foss", "crossfire", "code"],
		["ui-ux", "streamers", "cursor"],
		["hardware", "stars", "bolt"],
		["education", "fountain", "math"],
		["elevenlabs", "rain", "elevenlabs"],
	]) {
		await expect(page).toHaveURL(new RegExp(`#${id}$`));
		await expect(confetti).toHaveCount(0);
		await page.keyboard.press("ArrowRight");
		await expect(confetti).toHaveAttribute("data-pattern", pattern);
		await expect(confetti).toHaveAttribute("data-motif", motif);
		await expect.poll(ink).toBe(true);
		await page.keyboard.press("ArrowRight");
		await expect(confetti).toHaveCount(0);
	}
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#elevenlabs\/winner$/);
	await expect(confetti).toHaveCount(0);
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("ArrowRight");
	await expect.poll(ink).toBe(true);
	await expect(confetti).toHaveAttribute("data-running", "false", { timeout: 7000 });
	expect(await ink()).toBe(false);
	await page.evaluate(() => {
		location.hash = "general-1";
	});
	await page.keyboard.press("ArrowRight");
	await expect(confetti).toHaveAttribute("data-pattern", "stars");
	await expect.poll(ink).toBe(true);
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect.poll(ink).toBe(false);
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("ArrowRight");
	expect(await ink()).toBe(false);
});

test("winner bar wipes over the drumroll with larger text and themed Gemini and Solana confetti", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.goto("/closing#gemini");
	await expect(page.locator(".slide-gemini")).toHaveAttribute("aria-hidden", "false");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	const bar = page.locator(".slide-gemini .closing-winner-bar");
	const before = await bar.boundingBox();
	await expect(bar).toHaveCSS("clip-path", "inset(0px 100% 0px 0px)");
	await page.keyboard.press("ArrowRight");
	await expect(page.locator(".winner-confetti")).toHaveAttribute("data-motif", "gemini");
	await expect(bar).toHaveAttribute("aria-hidden", "false");
	await expect(page.locator(".slide-gemini .closing-drumroll")).toHaveAttribute("aria-hidden", "true");
	await expect(bar).toHaveCSS("clip-path", "inset(0px)");
	await expect(bar.locator("h2")).toHaveCSS("font-size", "112px");
	expect(await bar.boundingBox()).toEqual(before);
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("ArrowRight");
	await expect(page.locator(".winner-confetti")).toHaveAttribute("data-motif", "solana");
});

test("starts at the bottom, advances upward, and reverses award reveals", async ({ page }) => {
	await page.goto("/closing");
	await expect(page.locator(".slide-closing")).toHaveAttribute("aria-hidden", "false");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	const y = () => page.locator(".landscape").evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42);
	const start = await y();
	await page.keyboard.press("ArrowUp");
	await expect(page).toHaveURL(/#programme$/);
	await expect.poll(y).toBeGreaterThan(start);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 900)");
	await page.goto("/closing#foss");
	await expect(page.locator(".slide-foss")).toHaveAttribute("aria-hidden", "false");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#foss\/winner$/);
	await expect(page.locator(".slide-foss .closing-winner-name")).toHaveText("Winner to be announced");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#ui-ux$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#foss\/winner$/);
	await page.keyboard.press("ArrowDown");
	await expect(page).toHaveURL(/#foss$/);
	await page.evaluate(() => {
		location.hash = "join-ctn";
	});
	await expect(page).toHaveURL(/#join-ctn$/);
	await expect.poll(y).toBe(0);
	await page.evaluate(() => {
		location.hash = "closing";
	});
	await expect(page).toHaveURL(/#closing$/);
	await page.mouse.wheel(0, -100);
	await expect(page).toHaveURL(/#closing$/);
	await page.keyboard.press("Space");
	await expect(page).toHaveURL(/#closing$/);
	await expect(page.locator(".presentation-controls")).toHaveCount(0);
});

test("every bilingual slide and logo fits within the stage", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", error => errors.push(error.message));
	await page.goto("/closing");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	await page.evaluate(() => document.fonts.ready);
	await expect
		.poll(() =>
			page
				.locator(".closing-presentation img")
				.evaluateAll(images =>
					images.every(
						image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
					),
				),
		)
		.toBe(true);
	const slides = page.locator(".closing-slide");
	expect(await slides.count()).toBe(33);
	for (let i = 0; i < (await slides.count()); i++) {
		const id = await slides.nth(i).evaluate(el => el.className.match(/slide-([^ ]+)$/)![1]);
		await page.evaluate(id => {
			location.hash = id;
		}, id);
		await expect(slides.nth(i)).toHaveAttribute("aria-hidden", "false");
		await expect(page.locator(".slide-ribbon")).toHaveCSS("transform", `matrix(1, 0, 0, 1, 0, ${i * 900})`);
		const overflow = await slides.nth(i).evaluate(el =>
			[...el.querySelectorAll("h1,h2,p,img,a,ol")]
				.filter(item => {
					const r = item.getBoundingClientRect();
					return r.top < -1 || r.bottom > 901 || r.left < -1 || r.right > 1601;
				})
				.map(item => item.textContent),
		);
		expect(overflow, id).toEqual([]);
	}
	await page.setViewportSize({ width: 1280, height: 800 });
	const stage = await page.locator(".presentation-stage").boundingBox();
	expect(stage!.width / stage!.height).toBeCloseTo(16 / 9);
	await page.goto("/closing#join-ctn");
	await expect(page.locator(".slide-join-ctn a")).toHaveAttribute("href", "https://linktr.ee/hackthehill");
	await page.goto("/closing#return-hardware");
	await expect(page).toHaveURL(/#clean-up$/);
	await expect(page.locator('.slide-clean-up .venue-sign-face[lang="en"]').last()).toContainText("Pick up your ID");
	expect(errors).toEqual([]);
});

test("reminder signs lead to the intro, simple CTN QR, and logo-only finale", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.goto("/closing#clean-up");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	await expect(page.locator(".slide-thank-you")).toHaveCount(0);
	await expect(page.locator(".slide-clean-up .venue-sign-card")).toHaveCount(3);
	for (const name of ["roomclean", "takehome", "return"])
		await expect(page.locator(`.closing-supplied-sign[src$="/${name}.png"]`)).toHaveCount(1);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#clean-up\/fr$/);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#stupid-ideas$/);
	await expect(page.locator(".slide-stupid-ideas")).toHaveCSS("background-color", "rgb(255, 255, 255)");
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
	const audio = page.locator(".stupid-ideas-scene audio");
	await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.readyState)).toBeGreaterThanOrEqual(2);
	if (await page.locator(".stupid-play").isVisible()) await page.locator(".stupid-play").click();
	await page.keyboard.press("ArrowRight");
	await expect(page.locator(".stupid-ideas-scene")).toHaveAttribute("data-phase", "event");
	await expect(page).toHaveURL(/#stupid-ideas$/);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#join-ctn$/);
	await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true);
	await expect(page.locator(".slide-join-ctn .venue-sign-card")).toHaveCount(0);
	await expect(page.locator(".slide-join-ctn img")).toHaveCount(1);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#closing-logo$/);
	await expect(page.locator(".slide-closing-logo img")).toHaveCount(1);
	await expect(page.locator(".slide-closing-logo")).toHaveText("");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#closing-logo$/);
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#stupid-ideas$/);
	await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBeLessThan(3);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#clean-up\/fr$/);
});

test("Zarathustra cues show each black silhouette then the pair and Instagram event", async ({ page }) => {
	await page.goto("/closing#stupid-ideas");
	await page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
	const audio = page.locator(".stupid-ideas-scene audio");
	await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.readyState)).toBeGreaterThanOrEqual(2);
	await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.duration)).toBeCloseTo(20, 0);
	const seek = async (time: number) => {
		await audio.evaluate((el: HTMLAudioElement, time) => {
			el.pause();
			el.currentTime = time;
		}, time);
	};
	await seek(3);
	await expect(page.locator(".stupid-spob")).toBeVisible();
	await expect(page.locator(".stupid-prick")).toBeHidden();
	await expect(page.locator(".stupid-spob")).toHaveCSS("filter", 'url("#stupid-silhouette")');
	await seek(6.5);
	await expect(page.locator(".stupid-ideas-scene")).toHaveAttribute("data-phase", "prick");
	await expect(page.locator(".stupid-prick")).toBeVisible();
	await expect(page.locator(".stupid-spob")).toBeHidden();
	await seek(11);
	await expect(page.locator(".stupid-ideas-scene")).toHaveAttribute("data-phase", "together");
	await expect(page.locator(".stupid-spob")).toBeVisible();
	await expect(page.locator(".stupid-prick")).toBeVisible();
	await seek(15);
	await expect(page.locator(".stupid-event-details")).toHaveCSS("opacity", "1");
	await expect(page.locator(".stupid-event-details a")).toHaveAttribute(
		"href",
		"https://www.instagram.com/stupideas_com/",
	);
	await expect(page.locator(".stupid-event-details > p")).toHaveText("Ottawa / November");
	await expect(page.locator(".stupid-spob")).toHaveCSS("filter", "brightness(1)");
});

test("closing timer plays recap and hands keyboard control to the upward deck", async ({ page }) => {
	await page.goto("/closing-timer");
	const sequence = page.locator(".timer-sequence");
	await expect(sequence).toHaveAttribute("data-video-ready", "true", { timeout: 30_000 });
	await expect(page.locator(".timer-slides")).toHaveAttribute("src", "/closing#closing");
	await page.keyboard.press("+");
	await expect
		.poll(async () => Number(await page.locator('[role="timer"]').getAttribute("data-seconds")))
		.toBeGreaterThan(600);
	for (let i = 0; i < 11; i++) await page.keyboard.press("-");
	await expect(sequence).toHaveAttribute("data-phase", "video");
	await page.locator(".timer-recap").evaluate((video: HTMLVideoElement) => {
		video.currentTime = video.duration - 0.2;
	});
	await expect(sequence).toHaveAttribute("data-phase", "slides");
	const deck = page.frameLocator(".timer-slides");
	await expect(deck.locator(".slide-closing")).toHaveAttribute("aria-hidden", "false");
	await page.keyboard.press("ArrowUp");
	await expect(deck.locator(".slide-programme")).toHaveAttribute("aria-hidden", "false");
});
