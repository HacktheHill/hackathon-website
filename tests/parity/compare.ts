import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { expect, type Page, type TestInfo } from "@playwright/test";
import { settlePage } from "./pages";

const sha256 = (image: Buffer) => createHash("sha256").update(image).digest("hex");

/** Compare pixels directly to the running original, never to an accepted candidate snapshot. */
export async function compareScreenshots(reference: Page, candidate: Page, info: TestInfo, name: string) {
	const options = { fullPage: true, animations: "disabled" as const, caret: "hide" as const };
	const capture = async (page: Page, role: string) => {
		await page.bringToFront();
		await settlePage(page);
		let previous = await page.screenshot(options);
		for (let attempt = 0; attempt < 5; attempt += 1) {
			await page.evaluate(
				() =>
					new Promise<void>(resolve => {
						requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
					}),
			);
			const current = await page.screenshot(options);
			if (current.equals(previous)) {
				await writeFile(info.outputPath(`${name}-${role}.png`), current);
				return current;
			}
			previous = current;
		}
		throw new Error(`${name}: ${role} screenshot did not settle to identical consecutive frames`);
	};
	const before = await capture(reference, "reference");
	const after = await capture(candidate, "candidate");
	const hashes = { reference: sha256(before), candidate: sha256(after) };
	let difference = {
		changedPixels: 0,
		width: before.readUInt32BE(16),
		height: before.readUInt32BE(20),
		sameDimensions: true,
		image: "",
	};

	if (!before.equals(after)) {
		// Decode in the browser to avoid depending on Playwright's private PNG utilities.
		difference = await candidate.evaluate(
			async ([before, after]) => {
				const decode = async (base64: string) => {
					const image = new Image();
					image.src = `data:image/png;base64,${base64}`;
					await image.decode();
					return image;
				};
				const [reference, candidate] = await Promise.all([decode(before), decode(after)]);
				const width = Math.max(reference.width, candidate.width);
				const height = Math.max(reference.height, candidate.height);
				const pixels = (image: HTMLImageElement) => {
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const context = canvas.getContext("2d")!;
					context.drawImage(image, 0, 0);
					return context.getImageData(0, 0, width, height).data;
				};
				const left = pixels(reference);
				const right = pixels(candidate);
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d")!;
				const diff = context.createImageData(width, height);
				let changedPixels = 0;
				for (let offset = 0; offset < left.length; offset += 4) {
					const changed = [0, 1, 2, 3].some(channel => left[offset + channel] !== right[offset + channel]);
					if (changed) changedPixels += 1;
					diff.data[offset] = changed ? 255 : right[offset];
					diff.data[offset + 1] = changed ? 0 : right[offset + 1];
					diff.data[offset + 2] = changed ? 255 : right[offset + 2];
					diff.data[offset + 3] = changed ? 255 : 60;
				}
				context.putImageData(diff, 0, 0);
				return {
					changedPixels,
					width,
					height,
					sameDimensions: reference.width === candidate.width && reference.height === candidate.height,
					image: canvas.toDataURL("image/png").split(",")[1],
				};
			},
			[before.toString("base64"), after.toString("base64")],
		);
	}

	const { image, ...metrics } = difference;
	if (image) {
		await writeFile(info.outputPath(`${name}-diff.png`), Buffer.from(image, "base64"));
	}
	await writeFile(info.outputPath(`${name}-comparison.json`), JSON.stringify({ ...hashes, ...metrics }, null, 2));
	expect.soft(metrics.sameDimensions, `${name}: page dimensions changed`).toBe(true);
	expect.soft(metrics.changedPixels, `${name}: changed pixels, see test-results captures`).toBe(0);
}
