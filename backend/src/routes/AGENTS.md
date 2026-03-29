# Routes Agents Guide

## Ownership
- Route modules define endpoints and orchestrate request handling.

## Constraints
- Keep reusable logic out of route files.
- Route modules may call services, libs, and db helpers, but should not become mini service layers.

## Growth Rules
- Add a new router when a new API area appears.
- Register routers centrally in `index.js`.

## Avoid
- Large inline data transformations.
- Direct duplication across route files when a helper can be shared.
