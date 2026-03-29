# Lib Agents Guide

## Ownership
- Cross-domain helpers that are reused by multiple resources belong here.

## Constraints
- Keep functions generic and dependency-light.
- Do not make `lib/` a dumping ground for resource-specific code.

## Growth Rules
- Move a helper here only after confirming it is shared across resources.
- If a helper starts depending on one record type, move it into the matching service.

## Avoid
- Express `req`/`res` usage.
- Resource naming baked into generic helpers unless the module is explicitly about shared relation handling.
