# Source Tree Agents Guide

## Ownership
- `config/` owns constants and derived paths.
- `db/` owns sqlite access and schema setup.
- `lib/` owns cross-domain helpers.
- `routes/` owns Express route wiring.
- `services/` owns resource-specific value shaping.

## Constraints
- Keep separation between HTTP concerns and reusable business logic.
- Service modules should accept plain data and return plain data.
- Db modules should not import Express.

## Growth Rules
- If a route gains reusable logic, move it to `services/` or `lib/`.
- If a helper is only meaningful for one resource, prefer `services/` over `lib/`.

## Avoid
- Circular dependencies between route, service, and db layers.
- Large utility grab-bags with mixed ownership.
