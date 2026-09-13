import type { Page } from "@playwright/test";

// Before the event, so the countdown stays available regardless of the test date.
export const COUNTDOWN_TIME = "2026-08-15T12:00:00-04:00";

export async function fixCountdownTime(page: Page) {
	await page.clock.setFixedTime(new Date(COUNTDOWN_TIME));
}
