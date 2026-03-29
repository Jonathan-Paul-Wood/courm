# DB Documentation

## Purpose
This directory owns sqlite connectivity and schema initialization.

## Files
- `connection.js`: sqlite connection plus `runStatement`, `getRow`, `getAllRows`, and `closeDb`.
- `schema.js`: table creation and note-media migration logic.

## Import Expectations
- Routes and libs may import db helpers.
- Schema code may depend on service-level migration helpers when it needs record-specific transformations.

## Adding Files
- Add a new db file only when connection concerns and schema concerns need further separation.

## Do Not Add
- Express routers or HTTP response helpers.
