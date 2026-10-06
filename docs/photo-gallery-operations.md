# Photo gallery implementation and rollout

The attendee gallery extends the existing Astro website at `/photos/`. A separate Worker serves the authenticated API, preview media and individual downloads. D1 stores eligibility, sessions, publication state, removal reports, the durable notification outbox and restricted rights-follow-up records. R2 stores the prepared photo variants privately.

## Organiser authentication

The organiser screen is `/photos/manage`. Create a dedicated Cloudflare Access self-hosted application with both `hackthehill.com/photos/manage` and `hackthehill.com/photos/api/manage` destinations. Select only **Google Workspace - google-apps**, turn off acceptance of all identity providers, and use an Allow policy restricted to the email domain `ctn-rtc.org`. The existing **Only CTN Emails** reusable policy can be used after its domain condition is checked. Set the application and policy session duration to one hour. Do not change the metrics application or use its audience.

Configure the Worker with the new application's `ACCESS_AUD` and `ACCESS_TEAM=https://hackthehill.cloudflareaccess.com`. The Worker verifies the JWT cryptographically and rejects missing, expired, wrong-audience or non-CTN identities. Google-only login is enforced in the Access application; an undocumented identity-provider claim must not be required from the JWT. Protect both destinations before exposing organiser actions. OTP viewing sessions do not grant these privileges.

`MODERATOR_EMAILS=privacy@ctn-rtc.org` is the approved recipient of removal notifications. It does not grant organiser access or send mail to every CTN account.

## Collection and eligibility

The approved collection contains 358 edited photos across 18 original event categories. Full and quick JPEG downloads are copied byte for byte from the attendee-distribution masters. The pipeline generates 640px WebP thumbnails and 1600px WebP previews, retains ICC profiles, removes derivative location metadata and records hashes. Originals and prior edit candidates stay outside this repository.

Run the pipeline and uploader described in `scripts/photos/`. Keep its output, checkpoints, eligibility exports and credentials outside Git. Use the manifest to seed D1; do not manually reconstruct IDs from basenames, because source categories can contain duplicate filenames. Only published photos are returned to attendees. Media routes check current publication state on every request.

The initial private eligibility export uses the application sheet's recorded **Attended** field: 299 records, 298 usable unique addresses and one missing address. Add confirmed volunteers, organisers, judges, speakers and sponsor representatives from an authoritative reviewed event record. An RSVP alone is not the selected attendance rule. Do not copy application answers into the gallery or expose the roster to browsers.

## Staging resources

Resources prepared in the Hack the Hill Cloudflare account `9cff4e4fc6be8b966eeae47806117336`:

| Resource          | Staging value                              |
| ----------------- | ------------------------------------------ |
| Worker name       | `hack-the-hill-photo-gallery-staging`      |
| Private R2 bucket | `hack-the-hill-photo-gallery-staging`      |
| D1 database       | `hack-the-hill-photo-gallery-staging`      |
| D1 ID             | `f61bc64c-e938-4711-9b65-482d7682ffe5`     |
| SES region        | `ca-central-1`                             |
| Access team       | `https://hackthehill.cloudflareaccess.com` |

The R2 bucket's public access is disabled. Production resources and routes must be separate from staging. The production configuration intentionally has missing resource IDs until they are created and verified. Never deploy with placeholder bindings or an unprotected organiser path.

The staging pilot can serve the built Astro shell with Worker Static Assets at `https://hack-the-hill-photo-gallery-staging.hack-the-hill.workers.dev`. Run the Worker first only for the API, media and download prefixes; ordinary static pages remain assets. This keeps staging requests on one origin without changing the existing Pages website. Its Access application must protect the staging management paths too. An empty Access audience fails closed and is suitable only for staging before organiser configuration.

## Configuration and secrets

Set `APP_ORIGIN` to the approved externally usable deployment origin for email links. Browser assets and API/media/download requests remain relative. Set `CURRENT_LICENCE_VERSION` to `LICENCE_VERSION` in `src/shared/photos.ts` and the current D1 licence row. The bilingual text comes from `src/shared/photo-licence.json`.

The configured sender is the existing `info@hackthehill.com` address and removal notifications go to `privacy@ctn-rtc.org`. Use dedicated SES credentials with only the required sending permission. The existing domain is verified in SES, but that does not establish that a newly deployed Worker has usable credentials. Configure `OTP_HMAC_SECRET`, `SESSION_HMAC_SECRET`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` through Wrangler secret input or a protected deployment secret store. Never commit them, include them in CLI arguments or print them in verification logs. Staging authentication tests use a synthetic account with delivery disabled in the pilot configuration rather than messaging attendees.

## Routing and release sequence

1. Install root and service dependencies and run the frontend checks and service tests.
2. Apply the service D1 migrations to staging.
3. Upload all 1,432 objects to the private staging bucket. Verify every expected key and size and compare hashes; check that no unexpected public access or extra source material exists. Then import the verified photo manifest, exact licence and reviewed eligibility. Manifest re-imports must preserve publication state rather than republishing quarantined photos.
4. Deploy the Worker to staging with working secrets and the correct Access audience. Publish the Astro shell to a private/staging website preview and connect the same-origin service paths.
5. Pilot authentication, licence acknowledgement, full/quick downloads, responsive viewing, removal and restoration with organisers. Test anonymous media denial, wrong-domain Access rejection, stale moderation versions and failed email delivery. A failed notification must never republish a quarantined photo.
6. Create separate production resources and configure Access and secrets, then upload and verify the same manifest. Publish the website and route `/photos/api/*`, `/photos/media/*` and `/photos/download/*` to the Worker. Preserve all other website routes and existing services.
7. Verify production from a signed-out browser and an authorised attendee/organiser session. Record the deployed revision, collection counts, checks and outstanding limitations before announcing availability.

The project uses Cloudflare Pages for the website. Website publication and Worker publication are separate actions. A successful local build or Worker dry run is not a live deployment. Do not redirect the entire site to this Worker.

## Moderation and privacy

Explained attendee reports immediately quarantine the photo and create a durable notification. The organiser reviews the private preview and every unresolved report. Dismissal or duplicate resolution does not itself restore publication. Restoration requires a separate authenticated POST, a reason, the current publication/report version and no pending reports. Confirm cross-channel review where relevant; the existing public Drive collection and previously downloaded files cannot be recalled by the gallery.

The organiser view shows aggregate activity and notification health. Its queue uses stable 200-case pages and can look up an older case directly from an email link. New removal reports have account and per-photo hourly limits; idempotent retries do not consume another report allowance.

Restricted rights-follow-up lookup is audited and has a 90-day retention limit. Resolved cases, resolved reports and moderation audits are retained for 365 days; unresolved cases are preserved. Browsing telemetry must not create an identity-linked history. Run scheduled cleanup and outbox retry, monitor failures and keep photo storage private. The outbox temporarily contains the delivery payload, including an unsent OTP, and redacts it after successful delivery or expiry; removal payloads have a 90-day cap. Do not add facial recognition or marketing analytics.

The exact bilingual licence is shown before downloads. There are no ZIP downloads, licence page, licence TXT file or duplicate licence in the internal Drive folder.
