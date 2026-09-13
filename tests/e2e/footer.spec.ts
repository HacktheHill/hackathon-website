import { expect, test } from "@playwright/test";

const subscribeEndpoint = "https://emails.hackthehill.com/subscribe";
const messages = {
	en: {
		thanks: "Check your inbox for a confirmation link.",
		invalid: "Enter a valid email.",
		limited: "Try again shortly.",
		failed: "Couldn’t subscribe. Try again.",
	},
	fr: {
		thanks: "Consultez votre boîte de réception et cliquez sur le lien de confirmation.",
		invalid: "Saisissez une adresse courriel valide.",
		limited: "Réessayez dans un instant.",
		failed: "Inscription impossible. Réessayez.",
	},
};

for (const locale of ["en", "fr"] as const) {
	test.describe(`newsletter ${locale}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.goto("/");
			if (locale === "fr") await page.getByRole("button", { name: /FR:/ }).click();
		});

		test("submits the API contract once and confirms acceptance", async ({ page }) => {
			const requests: { method: string; headers: Record<string, string>; body: unknown }[] = [];
			let releaseResponse!: () => void;
			const responseReady = new Promise<void>(resolve => {
				releaseResponse = resolve;
			});
			await page.route(subscribeEndpoint, async route => {
				const request = route.request();
				requests.push({ method: request.method(), headers: request.headers(), body: request.postDataJSON() });
				await responseReady;
				await route.fulfill({ status: 202, contentType: "application/json", body: "{}" });
			});
			const form = page.locator("footer form");
			const email = page.locator("#footer-email");
			await email.fill(" attendee@example.com ");
			await form.locator('button[type="submit"]').click();
			try {
				await expect(form).toHaveAttribute("aria-busy", "true");
				await expect(email).toBeDisabled();
				await expect(form.locator("button")).toBeDisabled();
				await form.dispatchEvent("submit");
				await expect.poll(() => requests.length).toBe(1);
				expect(requests[0].method).toBe("POST");
				expect(requests[0].headers.accept).toBe("application/json");
				expect(requests[0].headers["content-type"]).toBe("application/json");
				expect(requests[0].body).toEqual({ email: "attendee@example.com", consent: true });
			} finally {
				releaseResponse();
			}
			await expect(page.locator('footer [role="status"]')).toHaveText(messages[locale].thanks);
			await expect(form).toHaveCount(0);
			expect(requests).toHaveLength(1);
		});

		for (const response of [
			{ status: 400, message: "invalid" },
			{ status: 429, message: "limited" },
			{ status: 500, message: "failed" },
			{ status: 200, message: "failed" },
			{ status: 0, message: "failed" },
		] as const) {
			test(`handles ${response.status || "network failure"} and clears the error on edit`, async ({ page }) => {
				await page.route(subscribeEndpoint, route =>
					response.status === 0
						? route.abort("failed")
						: route.fulfill({ status: response.status, contentType: "application/json", body: "{}" }),
				);
				const email = page.locator("#footer-email");
				const form = page.locator("footer form");
				await email.fill("attendee@example.com");
				await form.locator('button[type="submit"]').click();
				await expect(page.locator('footer [role="alert"]')).toHaveText(messages[locale][response.message]);
				await expect(email).toHaveAttribute("aria-invalid", String(response.status === 400));
				await expect(email).toHaveAttribute("aria-describedby", "footer-email-error");
				await expect(email).toBeEnabled();
				await expect(form).toHaveAttribute("aria-busy", "false");
				await email.fill("another@example.com");
				await expect(page.locator('footer [role="alert"]')).toHaveCount(0);
				await expect(email).toHaveAttribute("aria-invalid", "false");
				await expect(email).not.toHaveAttribute("aria-describedby");
			});
		}
	});
}
