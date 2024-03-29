# CouRM

This is an open source project to create a powerful CRM for personal use. At the moment the features are more limited to an address book, see below for details on how to install and use the project, contribute, and an overview of future development goals.

## WHY
This tool was born of a frustration with the default assumption of nearly every data processing tool on the market: That you have no privacy and your data is the toll levied against your use of the platform - even if you already paid to subscribe.

CouRM is open source and built to be run 100% locally, so that you have full control over your use of the tool and the data you put in it. None of your information or metadata is shared outside of your machine by CouRM.

## Downloading (Currently only supporting windows OS)
For regular use, you can download the latest release at https://jonathanpaulwood.com/courm/. You will find a ".zip" file to extract, and from there can double click "LAUNCH APPLICATION" for the program to open in your default browser.

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

## Future Development Overview
- Port code to an integrated desktop application, so command line is not needed to run the project
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