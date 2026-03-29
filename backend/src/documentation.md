# Source Tree Documentation

## Purpose
`src/` contains the backend runtime code organized by responsibility instead of by monolithic file.

## Files and Directories
- `app.js`: creates and configures the Express app.
- `config/`: constants and derived storage paths.
- `db/`: sqlite connection helpers and schema/migration logic.
- `lib/`: cross-domain helpers used by multiple route or service modules.
- `routes/`: Express routers and route registration.
- `services/`: resource-specific data shaping and file-handling helpers.

## Import Expectations
- `routes/` may import from `services/`, `lib/`, `db/`, and `config/`.
- `services/` may import from `lib/` and `config/`.
- `db/` should stay independent from Express.

## Adding Files
- Add files to the narrowest directory that fully owns the concern.
- Update the local docs when adding a new reusable abstraction.

## Do Not Add
- App bootstrap code outside `app.js`.
- Route handlers in `services/`.
