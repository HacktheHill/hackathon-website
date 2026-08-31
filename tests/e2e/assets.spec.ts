import { expect, test } from "@playwright/test";

test("social cards use a supported raster image", async ({ page, request }) => {
	await page.goto("/");

	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /hackthehill-social\.png$/);
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /hackthehill-social\.png$/);
	await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
	await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");

	const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
	const response = await request.get(new URL(imageUrl!).pathname);
	expect(response.ok()).toBe(true);
	expect(response.headers()["content-type"]).toBe("image/png");
});

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
