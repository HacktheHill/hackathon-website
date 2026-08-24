import { expect, test } from "@playwright/test";

test("rendered pages load local assets without errors", async ({ page }) => {
	const failedAssets: string[] = [];
	page.on("response", response => {
		const request = response.request();
		if (
			response.url().startsWith("http://127.0.0.1:4338/") &&
			["font", "image", "media"].includes(request.resourceType()) &&
			response.status() >= 400
		) {
			failedAssets.push(`${response.status()} ${new URL(response.url()).pathname}`);
		}
	});

	for (const path of ["/", "/404.html"]) {
		await page.goto(path);
		await page.evaluate(async () => {
			for (let y = 0; y <= document.documentElement.scrollHeight; y += window.innerHeight) {
				window.scrollTo(0, y);
				await new Promise(resolve => window.setTimeout(resolve, 50));
			}
		});
		await page.waitForTimeout(1_000);
	}

	expect(failedAssets).toEqual([]);
});
