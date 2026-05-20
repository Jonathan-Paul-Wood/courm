# Lib Documentation

## Purpose
This directory contains cross-domain helpers used by multiple parts of the backend.

## Files
- `files.js`: directory setup, stored path resolution, and cleanup helpers.
- `queries.js`: shared query-building helpers.
- `responses.js`: common JSON response patterns.
- `relations.js`: relation-map building, relation filtering, and relation cleanup.

## Import Expectations
- `routes/` and `services/` may import from `lib/`.
- `lib/` should stay free of Express-specific state.

## Adding Files
- Add a helper here only when it serves more than one domain module.

## Do Not Add
- Note-, contact-, or event-specific shaping rules.
