# COURM

This is an open source project to create a powerful CRM for personal use. At the moment the features are more limited to an address book, see below for details on how to install and use the project, contribute, and an overview of future development goals.

## Installation
In each of those directories, install dependencies

    npm install


## Use
Courm can be run in one terminal or two.

By default, the code runs in two directories. Start the backend and ui each in their own terminal

    npm start

The UI will start on localhost:3000, and the backend will start on localhost:8080

To run in a single terminal, 

## Development & Contribution

For ease of development, the UI and Backend are divided into separate directories. In each of those directories, install dependencies

    npm install

And then start the backend and ui each in their own terminal

    npm start

The UI will start on localhost:3000, and the backend will start on localhost:8080

### Build files

In order to create new build files of the UI to host off of the backend and run the project off a single terminal with the latest UI code, after updating your UI, create your build files

    npm build

And then move the resulting file into /backend/build

Next, update the file /backend/server.js.
- uncomment line 31 and lines 35 - 40
- on line 265, change the port from 8080 to 3000

Now when you run `npm start` in the /backend directory, the backend will serve the built UI files from localhost:3000

## Future Development Overview
- Port code to an integrated desktop application, so command line is not needed to run the project
- Support GPS coordinates and addresses displayed on a map for Contacts
- In addition to Contacts, support record types for Events and Notes
- Ability to link Contacts, Events, and Notes
- Support for a Calendar display, in addition to Lists and Maps
- Additional features per requests and contributions

## LICENSE

CouRM is licensed under CC BY-NC 2.5. Free for non-commercial use with attribution.

In short, you are free to share, copy, remix, adapt, fork, and distribute the code for any non-commercial purpose, so long as you attribute myself and CouRM as the valid source. You should also not ein your derivations if any changes where made, and should not restrict things in your derivations that this license permits. More details at https://creativecommons.org/licenses/by-nc/2.5/