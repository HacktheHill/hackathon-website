import { expect, test } from "@playwright/test";
import { fixCountdownTime } from "../helpers/time";

test("countdown restores focus after pointer and keyboard dismissal", async ({ page }) => {
	await fixCountdownTime(page);
	await page.goto("/");
	const hotspot = page.locator('#hero button[aria-haspopup="dialog"]');
	await expect(hotspot).toBeAttached();
	const dialog = page.locator("#countdown-dialog");
	await hotspot.dispatchEvent("pointerover", { pointerType: "mouse" });
	await expect(dialog).toHaveJSProperty("open", true);
	await hotspot.dispatchEvent("pointerout", { pointerType: "mouse" });
	await expect(dialog).toHaveJSProperty("open", false);
	await hotspot.focus();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await expect(page.getByRole("button", { name: "Close the countdown" })).toBeFocused();
	await hotspot.dispatchEvent("pointerover", { pointerType: "mouse" });
	await hotspot.dispatchEvent("pointerout", { pointerType: "mouse" });
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
	await hotspot.press("Enter");
	await expect(dialog).toHaveJSProperty("open", true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveJSProperty("open", false);
	await expect(hotspot).toBeFocused();
});
