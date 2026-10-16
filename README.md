# Ranga Tickets

Private event reservation and physical ticket issuance desk. Responsive React interface, server-side role checks, ChatGPT sign-in and Cloudflare D1 persistence.

## Roles
- Admin: events, reservations, payments, issuance, reference settings and user access.
- Booking: register bookings and update remarks.
- Counter: payment status, partial issuance and remarks.

The first authenticated visitor to the initially owner-private deployment becomes the application owner. Do not widen hosting access before owner initialization. Additional users require both site access and an active application role matching their sign-in email. Adding a user does not send invitations.

## Workflows
Create an event (name, code, date, venue, ticket price), register a reservation with an optional phone, then search by reference/name/phone at the counter. Booking numbers use EVENTCODE-DDMMYY-001 with an event-local sequence. Partial issuance cannot exceed the outstanding quantity. Payments apply to an entire booking. Unpaid bookings require full payment confirmation before issuance.

Records are stored centrally in D1. Version-checked updates reject concurrent stale changes and require retry, preventing duplicate issuance and reference collisions. This initial small-scale implementation stores versioned application state in one row; normalization and scale testing belong to the NFR phase.

## Development
Use Node 22.13+; install dependencies and run `npm run dev`. Sites provisions the D1 binding DB. Generate schema migrations with `npm run db:generate`; production migration application is part of deployment.

Validation: `node node_modules/typescript/bin/tsc --noEmit`, `node tests/desk.test.mjs`, and the Sites build helper. Tests mock the D1 API; a real browser and deployed database smoke test are still needed.

## Pending
Optional event image gallery; editable event pricing; booking cancellation and quantity edits; invitation onboarding; per-ticket pricing/refunds/partial payments; NFR review. Existing booking prices are captured at registration.
