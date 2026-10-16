# Rangatantra tickets

Event reservation and physical ticket issuance desk. Responsive React interface, server-side role checks, username/password sign-in and Cloudflare D1 persistence.

## Accounts and roles
- Super user: sole account creator; all application operations and role changes.
- Admin: create/close/delete events, all booking/counter operations, and promote existing RT_Users to Admin. Cannot create accounts or change the super user.
- RT_User: reservations, payments, issuance and reports. No event or user administration.

Usernames are case-insensitive identifiers (3–40 letters, digits or underscores); no email required. Passwords are salted PBKDF2-SHA256 hashes. Random server-side sessions expire after 8 hours and use Secure, HttpOnly, SameSite cookies. Sign-out invalidates the current session. Login attempts are limited per username/IP over 15 minutes.

The initial super account is `admin_RT`. Its bootstrap hash and salt are configured only through the runtime secrets `RT_BOOTSTRAP_HASH` and `RT_BOOTSTRAP_SALT`; never commit passwords or these values. Bootstrap inserts only a missing super account and never resets an existing account. Old ChatGPT users remain in the legacy state for rollback, but cannot authenticate in this version. Authentication uses separate D1 tables.

Restore point: GitHub branch `backup/chatgpt-login-2026-10-16`, hosted version 9. Restoring that source also requires restoring owner-private hosting access before deploying the old ChatGPT-auth version. This is a code restore point, not a frozen copy of booking data.

## Workflows
Create an event (name, code, date, venue, ticket price), register a reservation with an optional phone, then search by reference/name/phone at the counter. Booking numbers use EVENTCODE-DDMMYY-001 with an event-local sequence. Partial issuance cannot exceed the outstanding quantity. Payments apply to an entire booking. Unpaid bookings require full payment confirmation before issuance.

Records are stored centrally in D1. Version-checked updates reject concurrent stale changes and require retry, preventing duplicate issuance and reference collisions. This initial small-scale implementation stores versioned application state in one row; normalization and scale testing belong to the NFR phase.

## Development
Use Node 22.13+; install dependencies and run `npm run dev`. Sites provisions the D1 binding DB. Generate schema migrations with `npm run db:generate`; production migration application is part of deployment.

Validation: `node node_modules/typescript/bin/tsc --noEmit`, `node tests/desk.test.mjs`, and the Sites build helper. Authentication and desk tests use an in-memory SQLite database behind the D1 interface. Browser QA remains a separate check.

## Pending
Optional event image gallery; editable event pricing; booking cancellation and quantity edits; invitation onboarding; per-ticket pricing/refunds/partial payments; NFR review. Existing booking prices are captured at registration.
