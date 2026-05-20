# Routes Documentation

## Purpose
This directory owns Express route definitions and route registration.

## Files
- `index.js`: mounts all routers on the app.
- `system.routes.js`: initialization and shutdown routes.
- `notes.routes.js`: note CRUD and note list routes.
- `contacts.routes.js`: contact CRUD and contact list routes.
- `events.routes.js`: event CRUD and event list routes.
- `relations.routes.js`: relation CRUD and relation lookup routes.
- `records.routes.js`: cross-record relation and title-list routes.

## Import Expectations
- Routes may import from `db/`, `lib/`, `services/`, and `config/`.

## Adding Files
- Create a new route file when an API area has distinct responsibilities or enough endpoints to stay readable on its own.

## Do Not Add
- Shared helper implementations that belong in `lib/` or `services/`.
