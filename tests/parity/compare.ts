import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { expect, type Browser, type Page, type TestInfo } from "@playwright/test";
import { fixCountdownTime } from "../helpers/time";
import { capturePage } from "./capture";
import { candidateUrl, loadPage, readContent, referenceUrl, type Locale, type Viewport } from "./pages";
import { comparePixels } from "./pixels";

const sha256 = (image: Buffer) => createHash("sha256").update(image).digest("hex");
const additionalReferenceCaptures = 4;
// Firefox may revalidate a cached document during same-URL A/A diagnostics.
const documentStatus = (status: number) => (status === 304 ? 200 : status);

type Scenario = {
	name: string;
	viewport: Viewport;
	locale: Locale;
	path?: string;
	prepare?: (page: Page) => Promise<void>;
	afterCapture?: (page: Page) => Promise<void>;
};

/** Run interactions and capture on one foreground page for both builds. */
export async function compareSite(browser: Browser, info: TestInfo, scenario: Scenario) {
	const context = await browser.newContext({
		viewport: scenario.viewport,
		deviceScaleFactor: 1,
		colorScheme: "light",
		reducedMotion: "reduce",
		locale: "en-CA",
		timezoneId: "America/Toronto",
	});
	const page = await context.newPage();
	await fixCountdownTime(page);
	const { name } = scenario;
	const capture = async (url: string, role: string) => {
		const errors: string[] = [];
		const recordError = (error: Error) => errors.push(error.message);
		page.on("pageerror", recordError);
		try {
			const status = await loadPage(page, new URL(scenario.path ?? "/", url).href, scenario.locale);
			await scenario.prepare?.(page);
			const screenshot = await capturePage(page, info.outputPath(`${name}-${role}.png`));
			const content = await readContent(page);
			await scenario.afterCapture?.(page);
			await writeFile(
				info.outputPath(`${name}-${role}.json`),
				JSON.stringify({ status, content, errors }, null, 2),
			);
			return { status, content, screenshot, errors };
		} finally {
			page.off("pageerror", recordError);
		}
	};

	try {
		const before = await capture(referenceUrl, "reference-1");
		const after = await capture(candidateUrl, "candidate");
		await writeFile(
			info.outputPath(`${name}-content.json`),
			JSON.stringify({ reference: before.content, candidate: after.content }, null, 2),
		);
		await writeFile(
			info.outputPath("page-errors.json"),
			JSON.stringify({ reference: before.errors, candidate: after.errors }, null, 2),
		);
		const verifyState = (sample: typeof before, role: string) => {
			expect
				.soft(documentStatus(sample.status), `${role}: HTTP response status changed`)
				.toBe(documentStatus(before.status));
			expect.soft(sample.content, `${role}: rendered content or controls changed`).toEqual(before.content);
			expect
				.soft(sample.errors, `${role}: browser errors differ from the first reference`)
				.toEqual(before.errors);
		};
		verifyState(after, "candidate");

		const referenceSamples = [];
		let selected = before;
		for (let index = 0; index <= additionalReferenceCaptures; index += 1) {
			const role = `reference-${index + 1}`;
			const sample = index === 0 ? before : await capture(referenceUrl, role);
			if (index > 0) verifyState(sample, role);
			const { image, ...difference } = await comparePixels(page, sample.screenshot, after.screenshot);
			const diffFile = image ? `${name}-${role}-diff.png` : null;
			if (diffFile) await writeFile(info.outputPath(diffFile), Buffer.from(image, "base64"));
			referenceSamples.push({
				capture: `${name}-${role}.png`,
				sha256: sha256(sample.screenshot),
				responseStatus: sample.status,
				diff: diffFile,
				...difference,
			});
			if (difference.sameDimensions && difference.changedPixels === 0) {
				selected = sample;
				break;
			}
		}
		const match = referenceSamples.find(sample => sample.sameDimensions && sample.changedPixels === 0);
		const difference = match ?? referenceSamples[0];
		await writeFile(info.outputPath(`${name}-reference.png`), selected.screenshot);
		const metrics = {
			referenceUrl,
			candidateUrl,
			responseStatus: { reference: before.status, candidate: after.status },
			reference: sha256(selected.screenshot),
			candidate: sha256(after.screenshot),
			matchedReference: match?.capture ?? null,
			referenceSamples,
			changedPixels: difference.changedPixels,
			sameDimensions: difference.sameDimensions,
			width: difference.width,
			height: difference.height,
		};
		await writeFile(info.outputPath(`${name}-comparison.json`), JSON.stringify(metrics, null, 2));
		expect.soft(difference.sameDimensions, `${name}: page dimensions changed`).toBe(true);
		expect.soft(difference.changedPixels, `${name}: changed pixels, see test-results captures`).toBe(0);
	} finally {
		await context.close();
	}
}
