# Photo gallery Worker

This is the dedicated backend for the first-party `/photos` gallery. It owns authentication, private R2 media delivery, licence acknowledgements, aggregate activity, removal cases, moderation audit, rights follow-up and the notification outbox. The Worker never exposes R2 object keys or a public bucket URL.

The default Wrangler configuration is the verified staging resource: D1 database `f61bc64c-e938-4711-9b65-482d7682ffe5` and private R2 bucket `hack-the-hill-photo-gallery-staging`. The production environment intentionally has empty resource identifiers until the owner supplies the separately reviewed production resources. Do not copy staging data or credentials into production.

Run these commands from this directory:

```sh
npm install
npm run types
npx wrangler d1 migrations apply DB --local
npm test
npm run typecheck
npm run deploy:dry-run
```

Migrations `0003_moderation_operation_tokens.sql`, `0004_case_retention.sql`, and `0005_aggregate_download_formats.sql` add opaque per-mutation markers, CAS-bound audit support, resolved-report retention timestamps, and durable full/quick download counters. Apply all pending migrations to a reviewed target before deploying code that expects those columns. New removal reports are limited atomically to 30 per attendee per hour and 5 per photo per attendee per hour; idempotent retries return their existing case before quota evaluation. The management queue is cursor-paginated with a `pendingTotal` count, while scheduled cleanup keeps pending cases and removes resolved case history and audit rows after one year. Management aggregates include photo metadata, full/quick totals, and 90-day album visits; download-format totals remain after rights-record expiry.

Management deep links can request `GET /photos/api/manage?case=<caseId>` to receive a bounded `selectedCases` array containing that case even when it is outside the current queue page. `case` and `cursor` cannot be combined; invalid case identifiers fail with `400`.

Required secrets are declared in `wrangler.jsonc` and must be set with Wrangler or protected local secret files: `OTP_HMAC_SECRET`, `SESSION_HMAC_SECRET`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`. The two HMAC secrets must be at least 32 characters. SES configuration is supplied through the non-secret variables `SES_REGION`, `SES_FROM_EMAIL`, `MODERATOR_EMAILS`, and the approved `APP_ORIGIN`; the Worker leaves the outbox pending when SES is not completely configured. It never logs codes, credentials, requester explanations or JWTs.

Access-protected management routes require a cryptographically verified Cloudflare Access JWT with the configured dedicated `ACCESS_AUD`, `ACCESS_TEAM` issuer, an unexpired token, and an `@ctn-rtc.org` email. The Access application and Google Workspace-only policy are configured separately. The Worker does not trust an email header and does not accept attendee OTP sessions for management routes. `GET /photos/api/manage/session` issues the one-hour JWT-bound CSRF value used by management POST requests. Both the assertion header and the `CF_Authorization` cookie are accepted when the platform does not forward the header.

Eligibility imports are owner operations. The input is a JSON object containing `accounts: [{"email":"person@example.org","eligible":true}]`; unrelated registration fields are ignored. Set the HMAC secret in the invoking environment without printing it, then run locally by default:

```sh
OTP_HMAC_SECRET='provided-through-a-protected-secret-store' npm run import:eligibility -- /absolute/path/attendee-eligibility.json
CONFIRM_PHOTO_GALLERY_REMOTE_IMPORT=yes OTP_HMAC_SECRET='provided-through-a-protected-secret-store' npm run import:eligibility -- /absolute/path/attendee-eligibility.json --remote
```

Remote imports require the explicit confirmation variable and Wrangler's authenticated target. Review the generated eligibility source and selected environment before running one. Revocation is a guarded owner SQL operation (`UPDATE accounts SET active=0,revoked_at=... WHERE email_hash=...`) followed by session revocation; no public eligibility or roster endpoint exists.

For the same guarded operation through the included command, use `npm run revoke:eligibility -- person@example.org` locally or add `CONFIRM_PHOTO_GALLERY_REMOTE_REVOKE=yes` and `--remote` only after reviewing the exact Wrangler target. The command derives the keyed email hash from the protected HMAC secret and never places the email in a browser response.

The asset owner must seed `photos`, `photo_variants`, `licence_versions` and private R2 objects from the validated publish manifest. `photos.version` is the moderation publication version integer; the manifest's content/version/hash fields remain internal import metadata. A seeded row is publishable only when all required variant rows exist and its status is `published`. The Worker checks D1 publication state immediately before every media and download response.
