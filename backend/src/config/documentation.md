# Config Documentation

## Purpose
This directory defines shared constants and derived storage paths.

## Files
- `constants.js`: HTTP codes, CORS defaults, and upload limits.
- `storage.js`: application storage paths and media directory names.

## Import Expectations
- Other modules may read config values but should not mutate them.

## Adding Files
- Add a new config file only when a concern is reused broadly enough to merit a stable home.

## Do Not Add
- Filesystem operations, SQL, or request handling.
