import { expect, test, type Page } from "@playwright/test";

const photo = {
	id: "opening-001",
	category: "Opening Ceremony",
	filename: "IMG_0001.jpg",
	version: "1",
	width: 2400,
	height: 1600,
	thumbnail: { url: "/photos/media/opening-001/thumbnail", width: 640, height: 427, bytes: 42_000 },
	preview: { url: "/photos/media/opening-001/preview", width: 1600, height: 1067, bytes: 180_000 },
	downloads: {
		full: { width: 6000, height: 4000, bytes: 2_400_000 },
		quick: { width: 2048, height: 1365, bytes: 420_000 },
	},
};
const tinyPng = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
	"base64",
);

async function routePhotoMedia(page: Page) {
	await page.route("**/photos/media/**", route =>
		route.fulfill({
			status: 200,
			contentType: "image/png",
			body: tinyPng,
			headers: { "Cache-Control": "private, no-store" },
		}),
	);
	await page.route("**/photos/api/manage/photos/**/preview", route =>
		route.fulfill({
			status: 200,
			contentType: "image/png",
			body: tinyPng,
			headers: { "Cache-Control": "private, no-store" },
		}),
	);
}

async function routeAttendee(page: Page, authenticated = true) {
	await page.route("**/photos/api/auth/session", route =>
		route.fulfill({
			json: authenticated
				? { authenticated: true, csrfToken: "csrf-attendee", accountId: "acct-1", licenceVersion: "2026-10-06" }
				: { authenticated: false },
		}),
	);
	if (authenticated) {
		await routePhotoMedia(page);
		await page.route("**/photos/api/album", route =>
			route.fulfill({
				json: {
					version: "1",
					photos: [
						photo,
						{ ...photo, id: "closing-001", category: "Closing Ceremony", filename: "IMG_0002.jpg" },
					],
				},
			}),
		);
	}
}

async function expectTopDialogContainsFocus(page: Page) {
	await expect
		.poll(() =>
			page.evaluate(() => {
				const dialogs = Array.from(
					document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
				);
				return dialogs.length > 0 && dialogs[dialogs.length - 1].contains(document.activeElement);
			}),
		)
		.toBe(true);
}

test("unauthenticated arrival contains no protected photo media", async ({ page }) => {
	const mediaRequests: string[] = [];
	page.on("request", request => {
		if (request.url().includes("/photos/media/")) mediaRequests.push(request.url());
	});
	await routeAttendee(page, false);
	await page.goto("/photos/");
	await expect(page.getByRole("heading", { name: /album/i })).toBeVisible();
	await expect(page.locator("img")).toHaveCount(1); // branding only
	await expect(page.locator("#photo-email")).toBeVisible();
	expect(mediaRequests).toEqual([]);
	await expect(page.locator("body")).not.toContainText("IMG_0001.jpg");
});

test("email code request supports paste and verifies through the API contract", async ({ page }) => {
	await routeAttendee(page, false);
	await page.route("**/photos/api/auth/request", async route => {
		expect(await route.request().postDataJSON()).toEqual({ email: "attendee@example.org", language: "en" });
		await route.fulfill({ status: 202, json: { accepted: true } });
	});
	await page.route("**/photos/api/auth/verify", async route => {
		expect(await route.request().postDataJSON()).toEqual({ email: "attendee@example.org", code: "12345678" });
		await route.fulfill({
			json: {
				authenticated: true,
				csrfToken: "csrf-attendee",
				accountId: "acct-1",
				licenceVersion: "2026-10-06",
			},
		});
	});
	const eventBodies: Array<{ photoIds: string[]; albumVisit: boolean }> = [];
	await page.route("**/photos/api/events", async route => {
		eventBodies.push(await route.request().postDataJSON());
		await route.fulfill({ json: {} });
	});
	await routePhotoMedia(page);
	await page.route("**/photos/api/album", route => route.fulfill({ json: { version: "1", photos: [photo] } }));
	await page.goto("/photos/");
	await page.locator("#photo-email").fill("attendee@example.org");
	await page.getByRole("button", { name: "Send code" }).click();
	await expect(page.locator("#photo-code")).toBeVisible();
	await page.locator("#photo-code").fill("12345678");
	await page.getByRole("button", { name: "Open album" }).click();
	await expect(page.getByRole("heading", { name: "The weekend, in frames" })).toBeVisible();
	await expect.poll(() => eventBodies.filter(event => event.albumVisit).length).toBe(1);
	expect(eventBodies.find(event => event.albumVisit)).toEqual({ photoIds: [], albumVisit: true });
	await expect
		.poll(() =>
			page
				.locator('[class*="photoButton"] img')
				.first()
				.evaluate(image => ({
					complete: (image as HTMLImageElement).complete,
					naturalWidth: (image as HTMLImageElement).naturalWidth,
				})),
		)
		.toEqual({ complete: true, naturalWidth: 1 });
	await expect
		.poll(() =>
			page.locator('[class*="heroPhoto"] img').evaluate(image => ({
				complete: (image as HTMLImageElement).complete,
				naturalWidth: (image as HTMLImageElement).naturalWidth,
			})),
		)
		.toEqual({ complete: true, naturalWidth: 1 });
	await page.locator('input[placeholder="Search photos"]').fill("IMG");
	await page.getByRole("button", { name: "Français" }).click();
	await expect(page.getByRole("heading", { name: "Le week-end en images" })).toBeVisible();
	await expect(page.locator('input[placeholder="Rechercher des photos"]')).toHaveValue("IMG");
	expect(eventBodies.filter(event => event.albumVisit)).toHaveLength(1);
});

test("download opens bilingual terms and cancellation makes no download request", async ({ page }) => {
	await routeAttendee(page);
	await page.route("**/photos/api/events", route => route.fulfill({ json: {} }));
	await page.goto("/photos/");
	await page.getByRole("button", { name: /View photo: IMG_0001/ }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
	let downloadRequests = 0;
	page.on("request", request => {
		if (request.url().includes("/photos/download/")) downloadRequests++;
	});
	await page.getByRole("button", { name: /Download/ }).click();
	await expect(page.getByRole("heading", { name: "Before you download" })).toBeVisible();
	await expect(page.getByText("English", { exact: true })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Français" })).toBeVisible();
	await page.keyboard.press("Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Shift+Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(1); // the viewer remains beneath the licence dialog
	await expect(page.locator("#viewer-title")).toHaveText("IMG_0001.jpg");
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	expect(downloadRequests).toBe(0);
});

test("removal dialog traps focus and Escape restores the viewer", async ({ page }) => {
	await routeAttendee(page);
	await page.route("**/photos/api/events", route => route.fulfill({ json: {} }));
	await page.goto("/photos/");
	await page.getByRole("button", { name: /View photo: IMG_0001/ }).click();
	await page.getByRole("button", { name: "Request removal" }).click();
	await expect(page.getByRole("heading", { name: "Request removal" })).toBeVisible();
	await page.keyboard.press("Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Shift+Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(1);
	await expect(page.locator("#viewer-title")).toHaveText("IMG_0001.jpg");
});

test("viewer keeps the full preview composition and moves with keyboard", async ({ page }) => {
	await routeAttendee(page);
	await page.route("**/photos/api/events", route => route.fulfill({ json: {} }));
	await page.goto("/photos/");
	await page.getByRole("button", { name: /View photo: IMG_0001/ }).click();
	const viewerImage = page.getByRole("dialog").locator("img");
	await expect(viewerImage).toHaveAttribute("src", "/photos/media/opening-001/preview");
	await expect(viewerImage).toHaveAttribute("width", "1600");
	await expect
		.poll(() =>
			viewerImage.evaluate(image => ({
				complete: (image as HTMLImageElement).complete,
				naturalWidth: (image as HTMLImageElement).naturalWidth,
			})),
		)
		.toEqual({ complete: true, naturalWidth: 1 });
	await page.keyboard.press("ArrowRight");
	await expect(page.locator("#viewer-title")).toHaveText("IMG_0002.jpg");
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("unavailable shared photo is neutral and corrupted favourites do not break the album", async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem("hth-photo-favourites:acct-1", "{not-json"));
	await routeAttendee(page);
	await page.goto("/photos/?photo=hidden-or-missing");
	await expect(page.getByRole("status")).toContainText("This photo is no longer available.");
	await expect(page.getByRole("heading", { name: "The weekend, in frames" })).toBeVisible();
	await expect(page.getByText("IMG_0001.jpg")).toBeVisible();
});

test("returning to a visible album closes a withdrawn viewer without remounting the shell", async ({ page }) => {
	await routeAttendee(page);
	let revoked = false;
	await page.route("**/photos/api/auth/session", route =>
		route.fulfill({
			json: revoked
				? { authenticated: true, csrfToken: "csrf-attendee", accountId: "acct-1" }
				: { authenticated: true, csrfToken: "csrf-attendee", accountId: "acct-1" },
		}),
	);
	await page.route("**/photos/api/album", route =>
		route.fulfill({
			json: {
				version: "2",
				photos: revoked
					? [{ ...photo, id: "closing-001", category: "Closing Ceremony", filename: "IMG_0002.jpg" }]
					: [photo],
			},
		}),
	);
	await page.goto("/photos/");
	await page.getByRole("button", { name: /View photo: IMG_0001/ }).click();
	revoked = true;
	await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
	await expect(page.getByRole("status")).toContainText("This photo is no longer available.");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(page.getByRole("heading", { name: "The weekend, in frames" })).toBeVisible();
});

test("logout failure keeps the authenticated album and offers the same retry action", async ({ page }) => {
	await routeAttendee(page);
	await page.route("**/photos/api/auth/logout", route =>
		route.fulfill({ status: 503, json: { error: "temporary outage" } }),
	);
	await page.goto("/photos/");
	await page.getByRole("button", { name: "Sign out" }).click();
	await expect(page.getByRole("alert")).toContainText("temporary outage");
	await expect(page.getByRole("heading", { name: "The weekend, in frames" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("manage page uses Access session and remains usable on a narrow viewport", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await routePhotoMedia(page);
	await page.route("**/photos/api/manage/session", route =>
		route.fulfill({ json: { authenticated: true, administrator: true, csrfToken: "csrf-admin" } }),
	);
	let selectedVersion = 1;
	let selectedCalls = 0;
	await page.route("**/photos/api/manage**", async route => {
		const url = new URL(route.request().url());
		if (url.pathname !== "/photos/api/manage") return route.fallback();
		const selectedCase = {
			id: "case-1234",
			photoId: photo.id,
			filename: photo.filename,
			category: photo.category,
			photoVersion: selectedVersion,
			photoStatus: "quarantined" as const,
			explanation: "Please hide this image.",
			requesterEmail: "person@example.org",
			createdAt: Date.now(),
			status: "pending" as const,
			previewUrl: "/photos/api/manage/photos/opening-001/preview",
			unresolvedReports: 1,
			crossChannelReviewed: false,
		};
		const cursor = url.searchParams.get("cursor");
		if (url.searchParams.has("case")) {
			selectedCalls += 1;
			expect(url.searchParams.get("case")).toBe("case-1234");
			await route.fulfill({
				json: {
					cases: [],
					selectedCases: [selectedCase],
					nextCursor: null,
					pendingTotal: 2,
					albumVisits: 7,
					aggregates: [
						{
							photoId: photo.id,
							filename: photo.filename,
							category: photo.category,
							opens: 4,
							downloads: 2,
							fullDownloads: 2,
							quickDownloads: 1,
						},
					],
					diagnostics: { pendingNotifications: 0, failedNotifications: 0 },
				},
			});
			return;
		}
		await route.fulfill({
			json: {
				cases: [
					selectedCase,
					{
						...selectedCase,
						id: cursor ? "case-queue-2" : "case-queue-1",
						filename: cursor ? "Queue page 2.jpg" : "Queue page 1.jpg",
						explanation: "Another queued case.",
					},
				],
				selectedCases: [],
				nextCursor: cursor ? null : "queue-2",
				albumVisits: 7,
				aggregates: [
					{
						photoId: photo.id,
						filename: photo.filename,
						category: photo.category,
						opens: 4,
						downloads: 2,
						fullDownloads: 2,
						quickDownloads: 1,
					},
				],
				pendingTotal: 2,
				diagnostics: { pendingNotifications: 0, failedNotifications: 0 },
			},
		});
	});
	await page.route("**/photos/api/manage/cases/case-1234", async route => {
		expect(await route.request().postDataJSON()).toMatchObject({ action: "withdraw", expectedVersion: 1 });
		selectedVersion = 2;
		await route.fulfill({ json: { ok: true } });
	});
	await page.route("**/photos/api/manage/rights/opening-001**", async route => {
		expect(route.request().headers()["x-csrf-token"]).toBe("csrf-admin");
		const cursor = new URL(route.request().url()).searchParams.get("cursor");
		await route.fulfill({
			json: {
				requests: [
					{
						email: cursor ? "second-person@example.org" : "person@example.org",
						format: "full",
						createdAt: Date.parse("2026-10-05T18:30:00Z"),
						requestId: cursor ? "request-002" : "request-001",
					},
				],
				nextCursor: cursor ? null : "rights-2",
			},
		});
	});
	await page.goto("/photos/manage?case=case-1234");
	await expect(page.getByRole("heading", { name: "Photo requests" })).toBeVisible();
	await expect(page.getByText("Please hide this image.")).toBeVisible();
	await expect.poll(() => selectedCalls).toBe(1);
	const stats = page.locator('[class*="manageStats"]');
	await expect(stats.getByText("Album visits", { exact: true })).toBeVisible();
	await expect(stats.getByText("Photo opens", { exact: true })).toBeVisible();
	await page.getByText("Open aggregate reporting").click();
	await expect(page.getByRole("heading", { name: "Photo aggregates" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Category totals" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Format totals" })).toBeVisible();
	await expect(page.getByText("Queue page 1.jpg")).toBeVisible();
	await page.getByRole("button", { name: "Load more cases" }).click();
	await expect(page.getByText("Queue page 2.jpg")).toBeVisible();
	await expect(page.locator("body")).toHaveCSS("overflow-x", "visible");
	await expect(page.locator('[class*="caseCard"]')).toHaveCount(3);
	await expect
		.poll(() =>
			page
				.locator('[class*="casePreview"] img')
				.first()
				.evaluate(image => ({
					complete: (image as HTMLImageElement).complete,
					naturalWidth: (image as HTMLImageElement).naturalWidth,
				})),
		)
		.toEqual({ complete: true, naturalWidth: 1 });
	await expect(page.locator('[class*="highlightCase"]')).toHaveCount(1);
	await page.getByRole("button", { name: "Download requests (last 90 days)" }).first().click();
	const rightsDialog = page.getByRole("dialog");
	await expect(rightsDialog.getByRole("heading", { name: "Download requests" })).toBeVisible();
	await expect(rightsDialog.getByText("person@example.org")).toBeVisible();
	await expect(rightsDialog.getByText("Restricted rights follow-up for this photo.")).toBeVisible();
	await expect(rightsDialog.getByText("bulk export", { exact: false })).toBeVisible();
	await expect(page.getByRole("button", { name: "Export" })).toHaveCount(0);
	await rightsDialog.getByRole("button", { name: "Load more requests" }).click();
	await expect(rightsDialog.getByText("second-person@example.org")).toBeVisible();
	await page.keyboard.press("Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await page.getByRole("button", { name: "Confirm withdrawal" }).first().click();
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Tab");
	await expectTopDialogContainsFocus(page);
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await page.getByRole("button", { name: "Confirm withdrawal" }).first().click();
	await page.getByLabel("Explanation").fill("Confirmed after checking the other copies.");
	await page.getByLabel("I checked other CTN-controlled copies").check();
	await page.getByRole("button", { name: "Confirm action" }).click();
	await expect(page.getByText("Queue page 1.jpg")).toBeVisible();
});
