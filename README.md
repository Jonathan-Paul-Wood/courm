# CouRM

This is an open source project to create a powerful CRM for personal use. At the moment the features are more limited to an address book, see below for details on how to install and use the project, contribute, and an overview of future development goals.

## WHY
This tool was born of a frustration with the default assumption of nearly every data processing tool on the market: That you have no privacy and your data is the toll levied against your use of the platform - even if you already paid to subscribe.

CouRM is open source and built to be run 100% locally, so that you have full control over your use of the tool and the data you put in it. None of your information or metadata is shared outside of your machine by CouRM.

## Downloading
For regular use, you can download the latest release at https://jonathanpaulwood.com/courm/. End users should download the installer for their operating system only:

- Windows: `CouRM-Setup-<version>.exe`
- macOS: `CouRM-<version>.dmg`
- Linux: `CouRM-<version>.AppImage`

Below are instructions for working directly with the code.

## Installation
In both the `ui` and `backend` directories, install dependencies

    npm install

In the `backend` directory, create a database file by running one of the following commands:

...for windows:

    npm run db-init-win

...for linux or mac:

    npm run db-init-lin

## Use
Currently, CouRM runs by using a backend and frontend process. From a terminal of your choice, start each from the `backend` and `ui` directories with

    npm start

The UI will start on localhost:3000 (and open in your default browser), and the backend will start on localhost:8080

## Desktop App
CouRM can also be packaged as a desktop application. The packaged app:

- starts the local backend automatically
- creates the sqlite database on first launch if it does not already exist
- stores the database and uploaded files in a writable per-user data directory
- serves the built UI from the same local process, so no second terminal is needed
- preserves existing user data during normal updates and uninstall/reinstall of the app binaries

### Local desktop run
Install dependencies in all three package roots:

    npm install
    npm install --prefix backend
    npm install --prefix ui

Then build the UI and start the Electron shell:

    npm run desktop

By default, local Electron runs keep data inside `backend/`. You can override the data folder for development or testing with `COURM_DATA_DIR`.

### Build desktop executables
From the repository root:

    npm run dist:win
    npm run dist:mac
    npm run dist:linux

Each command writes packaged output to `dist-desktop/` for the current operating system.

The default `npm run dist` command builds the Windows installer for local Windows packaging compatibility.

### Cross-platform builds
Native desktop targets should be built on their matching operating systems. A GitHub Actions workflow is included at `.github/workflows/desktop-build.yml` to produce Windows, macOS, and Linux artifacts from a matrix build on native runners.

## Backend Structure
The backend uses a modular source tree under `backend/src/`:

- `app.js` builds the Express app
- `routes/` defines API endpoints
- `services/` owns resource-specific shaping logic
- `lib/` owns shared helpers
- `db/` owns sqlite access and schema setup
- `config/` owns constants and derived paths

Additional backend guidance lives in:

- [`backend/documentation.md`](backend/documentation.md)
- [`backend/src/documentation.md`](backend/src/documentation.md)
- [`Documentation/Data_Structures.md`](Documentation/Data_Structures.md)

## Future Development Overview
- Support GPS coordinates and addresses displayed on a map for Contacts
- In addition to Contacts, support record types for Events and Notes
- Ability to link Contacts, Events, and Notes
- Support for a Calendar display, in addition to Lists and Maps
- Additional features per requests and contributions

## Contributions

Contributions are welcome! Simply make a branch, push your changes, and create a Pull Request.

Before committing contributions, always check styling conformity in the UI project by running

    npm run lint

Pull Requests should contain, at a minimum:
- An explanation of what changes were made
- An explanation of why those changes were made
- Any information needed to test the changes. If proper testing requires new types of data, please provide sufficient mock data as well.

## LICENSE

CouRM is licensed under CC BY-NC-SA 4.0. Free for non-commercial use with attribution.

In short, you are free to share, copy, remix, adapt, fork, and distribute the code for any non-commercial purpose, so long as you attribute myself and CouRM as the valid source. You should also note in your derivations if any changes where made, and should not restrict things in your derivations that this license permits. More details at https://creativecommons.org/licenses/by-nc-sa/4.0/
