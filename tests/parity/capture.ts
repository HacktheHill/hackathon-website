import { writeFile } from "node:fs/promises";
import type { Page } from "@playwright/test";
import { settlePage } from "./pages";

export async function capturePage(page: Page, path: string) {
	await page.bringToFront();
	await settlePage(page);
	const options = {
		fullPage: true,
		animations: "disabled" as const,
		caret: "hide" as const,
	};
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
			await writeFile(path, current);
			return current;
		}
		previous = current;
	}
	await writeFile(path, previous);
	throw new Error(`Screenshot did not settle to identical consecutive frames: ${path}`);
}
