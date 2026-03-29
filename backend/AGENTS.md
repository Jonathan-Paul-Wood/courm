# Backend Agents Guide

## Ownership
- `server.js` is the process entrypoint only.
- Shared logic belongs in `src/lib/` or `src/services/`.
- API contract changes should be deliberate and rare.

## Constraints
- Preserve existing route paths and payload shapes unless the task explicitly changes them.
- Keep `server.js` thin; startup wiring belongs in `src/app.js`.
- Prefer parameterized SQL in new code.

## Growth Rules
- Cross-domain helpers go to `src/lib/`.
- Resource-specific value shaping goes to `src/services/`.
- Route modules should stay focused on request orchestration.

## Avoid
- Reintroducing large reusable helpers inside route files.
- Mixing schema, filesystem, and Express concerns in one file.
