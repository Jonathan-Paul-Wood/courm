# DB Agents Guide

## Ownership
- Connection lifecycle, sqlite helpers, and schema migrations belong here.

## Constraints
- No Express request or response handling.
- Keep migration code idempotent.

## Growth Rules
- Put new tables and schema migrations in `schema.js` unless the migration surface becomes large enough for a dedicated module.
- Reuse the shared promise helpers from `connection.js`.

## Avoid
- Resource-specific shaping logic.
- Filesystem side effects unrelated to schema migration.
