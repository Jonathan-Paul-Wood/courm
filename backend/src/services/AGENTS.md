# Services Agents Guide

## Ownership
- Resource-specific value shaping, normalization, and file-handling logic belongs here.

## Constraints
- Service functions should accept plain objects and return plain objects.
- No Express `req`/`res` handling in services.

## Growth Rules
- Keep one service per resource when possible.
- Move repeated resource behavior out of route files into the matching service.

## Avoid
- Direct SQL execution.
- Cross-domain helper collections that should live in `lib/`.
