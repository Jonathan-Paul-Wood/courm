# Backend Documentation

## Purpose
This directory contains the CouRM backend entrypoint, architecture docs, and the source tree under `src/`.

## Files
- `server.js`: process bootstrap that creates the app and starts listening.
- `AGENTS.md`: maintenance guardrails for contributors and agents.
- `documentation.md`: backend architecture overview.
- `src/`: implementation code organized by responsibility.

## Request Flow
1. `server.js` creates the app from `src/app.js`.
2. `src/app.js` applies middleware, ensures storage folders exist, and mounts routers.
3. Route modules call shared libs, services, and db helpers.
4. Db helpers execute sqlite queries and schema helpers manage migrations.

## Adding Files
- Add shared runtime code under `src/`.
- Place new helper modules in the most specific directory that owns the concern.
- Update the nearest `documentation.md` and `AGENTS.md` when a new category of code is introduced.

## Do Not Add
- Business logic to `server.js`.
- Duplicate helper logic across routes when a shared module already exists.
