# Photo gallery integration contract

All browser paths start at `/photos`. Responses use JSON except image/download streams. Errors: `{ error: string }` plus HTTP status. Protected JSON/media use no public caching. Client POST requests send JSON and `X-CSRF-Token` from session; request-code and verify-code instead enforce same Origin without an established session.

- GET `/photos/api/auth/session`: `PhotoSession` (anonymous returns authenticated false).
- POST `/photos/api/auth/request`: `{email,language}`; 202 `{accepted:true}` for eligible/unknown; throttle has generic429. No codes in responses.
- POST `/photos/api/auth/verify`: `{email,code}`; `PhotoSession` and HttpOnly cookie.
- POST `/photos/api/auth/logout`: `{}`; clears cookie/session.
- GET `/photos/api/album`: `AlbumManifest` with only publishedphotos.
- POST `/photos/api/licence/acknowledge`: `{version}`; requires currentversion, returns `{version}`.
- POST `/photos/api/events`: `{photoIds:string[],albumVisit?:boolean}`; session deduped vieweropens.
- GET `/photos/download/<id>?format=full|quick&requestId=<uuid>`: authenticated/currentlicence JPEGattachment; retries/ranges use same requestId; hidden404.
- GET `/photos/media/<id>/thumbnail|preview`: authenticated published image. No fullmedia variant.
- POST `/photos/api/photos/<id>/removal-requests`: `{explanation,requestId}`; atomicquarantine/report/outbox; returns `{caseId}`. Can report a known hidden photo so independent reports aren't lost.
- GET `/photos/api/manage?cursor=<opaque>`: `ManageSummary`; Access organiser authentication, one-hour privileged session. Returns at most 200 cases, `pendingTotal` across the whole queue and `nextCursor` for stable pagination.
- GET `/photos/api/manage?case=<id>`: same authentication, returns the selected case in `selectedCases` even when it is outside the first queue page. Do not combine `case` and `cursor`.
- GET `/photos/api/manage/session`: organiser authentication state and CSRF token, based on verified Cloudflare Access JWT. Google Workspace `@ctn-rtc.org` only; admin does not require attendee OTP. All manage API/review media independently verify Access token signature/issuer/audience/expiry/email domain. Dedicated Access app enforces Google IDP and one-hour duration.
- GET `/photos/api/manage/photos/<id>/preview`: admin-only privatepreview evenquarantined, under the Access-protected API prefix.
- POST `/photos/api/manage/cases/<caseId>`: `{action:'dismiss'|'withdraw'|'duplicate'|'restore',reason,expectedVersion,crossChannelReviewed?:boolean}`. Dismiss resolves report; restore is separate after all pendingreports resolved. Optimisticversion check409. Withdraw optionalcrosschannelchecked records audit.
- GET `/photos/api/manage/rights/<photoId>?cursor=<opaque>`: audited organiser lookup `{requests:[{email,format,createdAt,requestId}],nextCursor:string|null}`. Returns at most 500 retained requests per page, with a stable cursor; each page lookup is audited.

Shared TS contract: `src/shared/photos.ts`. Exact bilingual licence content: `src/shared/photo-licence.json`, `{en:string[],fr:string[]}` copied from the approved source. The frontend never receives the roster, object keys or internal editing notes. The service uses dedicated D1/R2 resources and has no public fallback. Backend code is in `services/photo-gallery/`, frontend components and pages are under `src/components/Photos/` and `src/pages/photos/`, and asset preparation commands are in `scripts/photos/`.

New removal requests are limited to 30 per account per hour and five for the same photo per account per hour. An idempotent retry returns its existing case before evaluating these limits. A rejected request cannot hide another photo, create a report or enqueue a notification.
