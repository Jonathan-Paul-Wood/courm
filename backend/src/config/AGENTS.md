# Config Agents Guide

## Ownership
- Constants, limits, and derived path values belong here.

## Constraints
- Keep modules side-effect free.
- Do not put filesystem creation or db access here.

## Growth Rules
- Add new constants when they are shared across multiple modules.
- Add new derived paths when they are environment-backed and reused.

## Avoid
- Business logic and validation routines.
