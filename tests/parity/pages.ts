import { writeFile } from "node:fs/promises";
import { expect, type Browser, type Page, type TestInfo } from "@playwright/test";
import { fixCountdownTime } from "../helpers/time";

export type Locale = "en" | "fr";
export type Viewport = { width: number; height: number };
export const referenceUrl = "http://127.0.0.1:4337";
export const candidateUrl = "http://127.0.0.1:4338";

/** Wait for local artwork, fonts, and the video's initial poster in its srcdoc frame. */
export async function settlePage(page: Page) {
	await page.evaluate(() => {
		document.querySelectorAll<HTMLImageElement | HTMLIFrameElement>("img, iframe").forEach(element => {
			element.loading = "eager";
		});
	});
	// Let picture source selection and eager iframe navigation take effect first.
	await page.evaluate(
		() =>
			new Promise<void>(resolve => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
			}),
	);
	for (const frame of page.frames()) {
		const failedImages = await frame.evaluate(async () => {
			await document.fonts.ready;
			const failures: string[] = [];
			await Promise.all(
				Array.from(document.images, async image => {
					const sources = Array.from(image.closest("picture")?.querySelectorAll("source") ?? []);
					const hasSource =
						image.getAttribute("src") ||
						image.getAttribute("srcset") ||
						sources.some(source => source.srcset && (!source.media || matchMedia(source.media).matches));
					if (!hasSource) return;
					try {
						await image.decode();
					} catch {
						failures.push(image.currentSrc || image.src);
					}
				}),
			);
			await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
			return failures;
		});
		expect(failedImages, `Images failed to decode in ${frame.url()}`).toEqual([]);
	}
	// Chromium can decode offscreen images without painting them into a full-page
	// capture. Visit each viewport so both pages rasterize the complete scene.
	await page.evaluate(async () => {
		const initialTop = scrollY;
		const paint = () =>
			new Promise<void>(resolve => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
			});
		for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight) {
			scrollTo({ top, behavior: "instant" });
			await paint();
		}
		scrollTo({ top: initialTop, behavior: "instant" });
		await paint();
	});
}

export async function openPair(browser: Browser, viewport: Viewport, locale: Locale, path = "/") {
	const contexts = await Promise.all(
		[referenceUrl, candidateUrl].map(() =>
			browser.newContext({
				viewport,
				deviceScaleFactor: 1,
				colorScheme: "light",
				reducedMotion: "reduce",
				locale: "en-CA",
				timezoneId: "America/Toronto",
			}),
		),
	);
	const pages = await Promise.all(contexts.map(context => context.newPage()));
	const statuses: number[] = [];
	const errors: string[][] = [[], []];
	try {
		for (const [index, page] of pages.entries()) {
			page.on("pageerror", error => errors[index].push(error.message));
			await page.bringToFront();
			await fixCountdownTime(page);
			const response = await page.goto(`${index === 0 ? referenceUrl : candidateUrl}${path}`);
			statuses.push(response!.status());
			await expect(page.locator("main")).toBeVisible();
			await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
			if (locale === "fr") {
				await page.getByRole("button", { name: /FR:/ }).click();
				await expect(page.locator("html")).toHaveAttribute("lang", "fr");
			}
			await settlePage(page);
		}
		expect(statuses[1], "HTTP response status changed").toBe(statuses[0]);
		return {
			reference: pages[0],
			candidate: pages[1],
			pages,
			async close(info: TestInfo) {
				await writeFile(info.outputPath("page-errors.json"), JSON.stringify(errors, null, 2));
				await Promise.all(contexts.map(context => context.close()));
				expect(errors[1], "Candidate browser errors differ from the reference").toEqual(errors[0]);
			},
		};
	} catch (error) {
		await Promise.all(contexts.map(context => context.close()));
		throw error;
	}
}

/** Record user-facing content and controls independently of generated CSS class names. */
export async function compareContent(reference: Page, candidate: Page, info: TestInfo, name: string) {
	const readContent = (page: Page) =>
		page.evaluate(() => ({
			lang: document.documentElement.lang,
			title: document.title,
			text: document.body.innerText,
			controls: Array.from(document.querySelectorAll("a, button, input, summary, iframe"), element => ({
				tag: element.tagName,
				text: element.textContent,
				href: element.getAttribute("href"),
				label: element.getAttribute("aria-label"),
				title: element.getAttribute("title"),
				pressed: element.getAttribute("aria-pressed"),
				expanded: element.getAttribute("aria-expanded"),
				disabled: element.hasAttribute("disabled"),
			})),
			openQuestions: Array.from(document.querySelectorAll("#faq details"), element =>
				element.hasAttribute("open"),
			),
		}));
	const [before, after] = await Promise.all([readContent(reference), readContent(candidate)]);
	await writeFile(
		info.outputPath(`${name}-content.json`),
		JSON.stringify({ reference: before, candidate: after }, null, 2),
	);
	expect.soft(after, `${name}: rendered content or controls changed`).toEqual(before);
}
