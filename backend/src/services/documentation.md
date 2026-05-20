# Services Documentation

## Purpose
This directory contains resource-specific helper modules for notes, contacts, and events.

## Files
- `notes.service.js`: note media parsing, legacy migration, and note value building.
- `contacts.service.js`: contact image handling and contact value building.
- `events.service.js`: event value normalization for create and update flows.

## Import Expectations
- Services may depend on `config/` and `lib/`.
- Routes should call services instead of duplicating shaping logic.

## Adding Files
- Add a service when a resource gains enough internal logic that its routes would otherwise become repetitive.

## Do Not Add
- Express handlers or db connection code.
