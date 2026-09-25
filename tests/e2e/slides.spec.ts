import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1600, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

test("black reminders show uppercase copy and play a fresh ding on each entry", async ({ page }) => {
	await page.goto("/slides#blackout");
	await expect(page.locator('.slide-blackout[aria-hidden="false"]')).toBeVisible();
	const audio = page.locator(".interlude-ding");
	await audio.evaluate((element: HTMLAudioElement) => {
		element.dataset.plays = "0";
		element.addEventListener("play", () => {
			element.dataset.plays = String(Number(element.dataset.plays) + 1);
		});
	});
	const titles = ["1. SHORT, FOCUSED, AND IN SCOPE", "2. MANAGE YOUR TIME", "3. WHAT GOES IN?\nWHAT GOES OUT?"];
	for (const [index, title] of titles.entries()) {
		await page.keyboard.press("ArrowRight");
		await expect(page.locator(".presentation-interlude h2")).toHaveText(title);
		await expect(audio).toHaveAttribute("data-plays", String(index + 1));
		await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.currentTime)).toBeGreaterThan(0);
		await expect(page.locator(".blackout-film")).toBeHidden();
	}
	await expect(page.locator(".presentation-interlude h2")).toHaveCSS("white-space", "pre-line");
	await page.keyboard.press("ArrowLeft");
	await expect(audio).toHaveAttribute("data-plays", "4");
	await page.keyboard.press("End");
	await expect(page.locator(".presentation-interlude")).toHaveCount(0);
	expect(await audio.evaluate((element: HTMLAudioElement) => element.paused)).toBe(true);
});

test("venue rules switch crown signs to French shields without moving the camera", async ({ page }) => {
	await page.goto("/slides#guidelines");
	await expect(page.locator('.slide-guidelines[aria-hidden="false"]')).toBeVisible();
	const signs = page.locator('.venue-sign-face[aria-hidden="false"]');
	const camera = page.locator(".presentation-stage > .landscape");
	const before = await camera.getAttribute("style");
	await expect(signs.first()).toHaveAttribute("lang", "en");
	await expect(signs.first()).toContainText("Meals in Common Areas");
	for (const sign of await signs.locator(".guideline-sign").all()) {
		await expect(sign).toHaveAttribute("src", "/art/presentation/socials-road-sign.webp");
	}
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#guidelines$/);
	await expect(signs.first()).toHaveAttribute("lang", "fr");
	await expect(page.locator(".venue-sign-flipper").first()).toHaveCSS("transition-duration", "0.95s");
	await expect(signs.first()).toHaveCSS("backface-visibility", "hidden");
	await expect
		.poll(() =>
			page
				.locator(".venue-sign-flipper")
				.first()
				.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m11),
		)
		.toBeCloseTo(-1, 3);
	await expect(page.locator(".venue-icon-sign")).toHaveCount(3);
	await expect(page.locator(".venue-sign-flipper .venue-icon-sign")).toHaveCount(0);
	const tilts = await page
		.locator(".venue-sign-tilt")
		.evaluateAll(cards => cards.map(card => getComputedStyle(card).transform));
	expect(tilts[0]).toBe(tilts[2]);
	expect(tilts[1]).not.toBe(tilts[0]);
	await expect(signs.first()).toContainText("aires communes");
	for (const sign of await signs.locator(".guideline-sign").all()) {
		await expect(sign).toHaveAttribute("src", "/art/presentation/socials-road-sign-fr.webp");
	}
	await expect(camera).toHaveAttribute("style", before!);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#sponsors$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#guidelines$/);
	await expect(signs.first()).toHaveAttribute("lang", "fr");
	await page.keyboard.press("ArrowLeft");
	await expect(signs.first()).toHaveAttribute("lang", "en");
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#president$/);
});

test("timeline advances and reverses within the slide before changing slides", async ({ page }) => {
	await page.goto("/slides#schedule");
	await expect(page.locator('.slide-schedule[aria-hidden="false"]')).toBeVisible();
	const schedule = page.locator(".schedule");
	const camera = await page.locator(".presentation-stage > .landscape").getAttribute("style");
	await expect(schedule).toHaveAttribute("data-event", "1");
	await expect(page.locator(".schedule-event-copy")).toContainText("Début du hackathon");
	await expect(page.locator(".schedule-day")).toHaveText("Friday / Vendredi");
	await expect(page.locator(".schedule strong")).toHaveText("9:30 p.m.");
	const line = await page.locator(".schedule-line").boundingBox();
	expect(line!.width).toBe(1600);
	expect(line!.height).toBe(16);
	await page.keyboard.press("PageDown");
	await expect(schedule).toHaveAttribute("data-event", "2");
	await expect(page).toHaveURL(/#schedule$/);
	await expect(page.locator(".presentation-stage > .landscape")).toHaveAttribute("style", camera!);
	const stop = await page.locator(".schedule-stop.is-current").boundingBox();
	expect(stop!.x + stop!.width / 2).toBe(800);
	await page.keyboard.press("PageUp");
	await expect(schedule).toHaveAttribute("data-event", "1");
	await page.keyboard.press("PageUp");
	await expect(page).toHaveURL(/#challenges$/);
	await page.keyboard.press("ArrowRight");
	for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#blackout$/);
	await expect(page.locator(".presentation-blackout")).toHaveCSS("background-color", "rgb(0, 0, 0)");
	await expect(page.locator(".slide-blackout")).toBeEmpty();
	for (let number = 1; number <= 3; number++) {
		await page.keyboard.press("ArrowRight");
		await expect(page).toHaveURL(new RegExp(`#blackout-${number}$`));
		await expect(page.locator(".presentation-interlude")).toContainText(`${number}.`);
		await expect(page.locator(".presentation-interlude")).toHaveCSS("background-color", "rgb(0, 0, 0)");
		await expect(page.locator(".presentation-blackout")).toBeHidden();
	}
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/#rules$/);
	await expect(page.locator(".presentation-blackout")).toBeHidden();
	await expect(page.locator(".presentation-interlude")).toHaveCount(0);
	for (let number = 3; number >= 1; number--) {
		await page.keyboard.press("ArrowLeft");
		await expect(page).toHaveURL(new RegExp(`#blackout-${number}$`));
		await expect(page.locator(".presentation-interlude")).toContainText(`${number}.`);
	}
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#blackout$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/#schedule$/);
	await expect(schedule).toHaveAttribute("data-event", "8");
	await expect(page.locator(".schedule-day")).toHaveText("Sunday / Dimanche");
	await expect(page.locator(".schedule-event-copy")).toContainText("Devpost closes");
	await page.keyboard.press("Shift+Space");
	await expect(schedule).toHaveAttribute("data-event", "7");
	await page.mouse.wheel(0, -100);
	await expect(schedule).toHaveAttribute("data-event", "6");
	await page.keyboard.press("Home");
	await expect(page).toHaveURL(/#opening$/);
	await page.keyboard.press("End");
	await expect(page).toHaveURL(/#resources$/);
});

test("judging anchor follows the background, clips at the edge, and sways with its chains", async ({ page }) => {
	await page.goto("/slides#judging");
	await expect(page.locator('.slide-judging[aria-hidden="false"]')).toBeVisible();
	const anchor = page.locator('[data-anchor-layer="layer-15"]');
	const water = page.locator('.landscape > img[src$="/water.webp"]');
	await expect(page.locator(".anchor-layer")).toHaveCount(6);
	await expect(page.locator(".anchor-chain")).toHaveCount(5);
	const header = await page.locator(".slide-judging header").boundingBox();
	const before = await anchor.boundingBox();
	const waterBefore = await water.boundingBox();
	expect(before!.x).toBeGreaterThan(header!.x + header!.width);
	expect(before!.x + before!.width).toBeGreaterThan(1600);
	await page.keyboard.press("ArrowDown");
	await expect(page).toHaveURL(/#next$/);
	const after = await anchor.boundingBox();
	const waterAfter = await water.boundingBox();
	expect(after!.y).toBeLessThan(before!.y);
	expect(Math.abs(after!.y - before!.y - (waterAfter!.y - waterBefore!.y))).toBeLessThan(0.1);
	await expect(page.locator(".anchor-chain").first()).toHaveCSS("animation-name", "none");
	await expect(page.locator(".anchor-assembly")).toHaveCSS("animation-name", "none");
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect(anchor).toHaveCSS("animation-name", "none");
	const motion = await page.locator(".anchor-chain, .anchor-assembly").evaluateAll(links =>
		links.map(link => {
			const animation = link.getAnimations()[0];
			animation.pause();
			animation.currentTime = 0;
			const start = getComputedStyle(link).transform;
			animation.currentTime = 3000;
			return { start, end: getComputedStyle(link).transform };
		}),
	);
	for (const link of motion) expect(link.end).not.toBe(link.start);
});

test("keyboard navigation and deep links work with no presentation chrome", async ({ page }) => {
	await page.goto("/slides#guidelines");
	const active = page.locator('.presentation-slide[aria-hidden="false"]');
	await expect(active).toContainText("Venue rules");
	await expect(page.locator(".presentation-slide[inert]")).toHaveCount(await page.locator(".presentation-slide").count() - 1);
	await page.keyboard.press("ArrowDown");
	await expect(page.locator('.venue-sign-face[aria-hidden="false"]').first()).toHaveAttribute("lang", "fr");
	await page.keyboard.press("ArrowDown");
	await expect(active).toContainText("Made possible by");
	await expect(page).toHaveURL(/#sponsors$/);
	await page.reload();
	await expect(active).toContainText("Made possible by");
	await page.mouse.move(800, 880);
	await expect(page.locator("nav, dialog, .slide-footer, .journey-progress, .scene-veil")).toHaveCount(0);
	await page.keyboard.press("Home");
	await expect(active).toContainText("Opening");
	await page.keyboard.press("ArrowUp");
	await expect(active).toContainText("Opening ceremony");
	await page.keyboard.press("End");
	await expect(active).toContainText("Stay connected");
	await page.keyboard.press("ArrowDown");
	await expect(active).toContainText("Stay connected");
});

test("stage stays 16:9, assets load, and content stays inside its slide", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", error => errors.push(error.message));
	await page.goto("/slides");
	await page.evaluate(() => document.fonts.ready);
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
	for (const viewport of [
		{ width: 1920, height: 1080 },
		{ width: 1280, height: 720 },
		{ width: 1440, height: 900 },
	]) {
		await page.setViewportSize(viewport);
		await expect
			.poll(async () => {
				const rect = await page.locator(".presentation-stage").boundingBox();
				return (
					Math.abs(rect!.width / rect!.height - 16 / 9) < 0.001 &&
					rect!.x >= -1 &&
					rect!.y >= -1 &&
					rect!.x + rect!.width <= viewport.width + 1 &&
					rect!.y + rect!.height <= viewport.height + 1
				);
			})
			.toBe(true);
	}
	const overflow = await page.locator(".presentation-slide").evaluateAll(sections =>
		sections.flatMap(section => {
			const frame = section.getBoundingClientRect();
			return [...section.querySelectorAll("h1, h2, h3, p, li, .sponsor-mark")]
				.filter(element => {
					if (element.closest('.venue-sign-face[aria-hidden="true"]')) return false;
					const rect = element.getBoundingClientRect();
					return (
						rect.left < frame.left ||
						rect.right > frame.right + 1 ||
						rect.top < frame.top ||
						rect.bottom > frame.bottom - 25
					);
				})
				.map(element => element.textContent || "image");
		}),
	);
	expect(overflow).toEqual([]);
	expect(errors).toEqual([]);
	await expect(page.locator(".slide-ribbon")).toHaveCSS("transition-duration", "0s");
});

test("trackpad momentum advances only one slide and fullscreen can be toggled", async ({ page }) => {
	await page.goto("/slides");
	await expect(page.locator('.presentation-slide[aria-hidden="false"]')).toContainText("Opening");
	await expect(page.locator(".cover-artwork")).toHaveCount(0);
	const openingLayer = page.locator('.landscape [data-opening-layer="parl-tower"]');
	const before = await openingLayer.boundingBox();
	await page.mouse.wheel(0, 150);
	await expect(page).toHaveURL(/#tonight$/);
	const after = await openingLayer.boundingBox();
	// The same tower stays in the world and moves with the slower landscape,
	// rather than being baked into a cover moving with the 900px slide ribbon.
	expect(before!.y - after!.y).toBeGreaterThan(600);
	expect(before!.y - after!.y).toBeLessThan(800);
	expect(after!.x).toBe(before!.x);
	await page.mouse.wheel(0, 150);
	await page.mouse.wheel(0, 150);
	await expect(page).toHaveURL(/#tonight$/);
	await page.keyboard.press("f");
	await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
	await page.keyboard.press("f");
	await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
});

test("English and French headings have equal prominence and image proportions are preserved", async ({ page }) => {
	await page.goto("/slides");
	await page.evaluate(() => document.fonts.ready);
	const unequal = await page.locator(".presentation-slide").evaluateAll(sections =>
		sections
			.filter(section => {
				if (section.getAttribute("data-kind") === "imported") return false;
				if ([...section.classList].some(name => name.startsWith("slide-blackout"))) return false;
				const english = section.querySelector("h1, h2")!;
				const french = section.querySelector(".french")!;
				const en = getComputedStyle(english),
					fr = getComputedStyle(french);
				return ["fontSize", "fontFamily", "fontWeight", "color", "opacity"].some(
					key => en[key as keyof CSSStyleDeclaration] !== fr[key as keyof CSSStyleDeclaration],
				);
			})
			.map(section => section.className),
	);
	expect(unequal).toEqual([]);
	const distorted = await page.locator(".presentation-stage img").evaluateAll(images =>
		images
			.filter(node => {
				const image = node as HTMLImageElement;
				const style = getComputedStyle(image);
				if (style.objectFit === "contain" || !image.naturalWidth) return false;
				return (
					Math.abs(
						parseFloat(style.width) /
							parseFloat(style.height) /
							(image.naturalWidth / image.naturalHeight) -
							1,
					) > 0.01
				);
			})
			.map(node => (node as HTMLImageElement).src),
	);
	expect(distorted).toEqual([]);
	await expect(page.locator(".presentation-particles")).toHaveCSS("display", "none");
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect(page.locator(".presentation-particles")).toBeVisible();
	await expect(page.locator(".presentation-particles")).toHaveAttribute("data-mode", "none");
	await expect(page.locator(".particles-leaves")).toHaveCount(0);
	await page.goto("/slides#partners");
	await expect(page.locator(".presentation-particles")).toHaveAttribute("data-mode", "snow");
	await page.goto("/slides#resources");
	await expect(page.locator(".presentation-particles")).toHaveAttribute("data-mode", "bubbles");
});

test("ceremony flow separates venue and competition rules and finishes with resources", async ({ page }) => {
	await page.goto("/slides#ciena");
	await expect(page.locator('.slide-ciena[aria-hidden="false"]')).toBeVisible();
	await expect(page.locator(".slide-ciena .sponsor-mark")).toHaveCount(1);
	await expect(page.locator(".slide-ciena .sponsor-mark")).toHaveAttribute("alt", "Ciena");
	await expect(page.locator(".slide-partners .sponsor-mark")).toHaveCount(6);
	await expect(page.locator(".slide-sponsors .sponsor-mark")).toHaveCount(7);
	await expect(page.locator(".slide-speaker")).toHaveCount(0);
	await expect(page.locator(".slide-uosu")).toHaveCount(0);
	await page.goto("/slides#challenges");
	await expect(page.locator('.slide-challenges[aria-hidden="false"]')).toBeVisible();
	await expect(page.locator(".challenge-view")).toHaveAttribute("data-stage", "0");
	await expect(page.locator(".challenge-overview li")).toHaveCount(9);
	await expect(page.locator(".challenge-view img[alt=MathemaTech]")).toBeVisible();
	const overviewBox = await page.locator(".challenge-view").boundingBox();
	expect(overviewBox!.y + overviewBox!.height).toBeLessThanOrEqual(875);
	for (let stage = 1; stage <= 9; stage++) {
		await page.keyboard.press("ArrowDown");
		await expect(page.locator(".challenge-view")).toHaveAttribute("data-stage", String(stage));
		await expect(page).toHaveURL(/#challenges$/);
		await expect(page.locator(".challenge-focus")).toHaveCount(1);
		const box = await page.locator(".challenge-focus").boundingBox();
		expect(box!.y + box!.height / 2).toBeCloseTo(450, 0);
	}
	await expect(page.locator(".challenge-focus")).toContainText("Best Hardware Hack");
	for (const id of ["schedule", "blackout", "blackout-1", "blackout-2", "blackout-3", "rules", "judging", "next", "resources"]) {
		if (id === "blackout") {
			for (let event = 2; event <= 8; event++) {
				await page.keyboard.press("ArrowDown");
				await expect(page.locator(".schedule")).toHaveAttribute("data-event", String(event));
				await expect(page).toHaveURL(/#schedule$/);
			}
		}
		await page.keyboard.press("ArrowDown");
		await expect(page).toHaveURL(new RegExp(`#${id}$`));
	}
	await expect(page.locator(".schedule-stop")).toHaveCount(8);
	await expect(page.locator(".resource-links")).toContainText("Track the Hack");
	await expect(page.locator(".resource-links")).toContainText("Discord");
	await expect(
		page.locator(".resource-links a").filter({ has: page.getByAltText("QR code: Discord") }),
	).toHaveAttribute("href", "https://discord.gg/NNnZ4KYAS");
	await expect(
		page.locator(".resource-links a").filter({ has: page.getByAltText("QR code: Track the Hack") }),
	).toHaveAttribute("href", "https://tracker.hackthehill.com/schedule");
	await expect(page.locator(".resource-qr")).toHaveCount(2);
	await expect(page.locator(".qr-pending")).toHaveCount(0);
	await expect(page.locator(".slide-guidelines")).not.toContainText("Up to 4");
	await expect(page.locator(".slide-rules")).toContainText("Up to 4");
});
