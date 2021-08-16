# COURM

This is an open source project to create a powerful CRM for personal use. At the moment the features are more limited to an address book, see below for details on how to install and use the project, contribute, and an overview of future development goals.

## Installation
In each both the `ui` and `backend` directories, install dependencies

    npm install

In the `backend` directory, create a database file by running one of the following commands:

...for windows:

    npm run db-init-win

...for linux or mac:

    npm run db-init-lin

## Use
Courm can be run in one terminal or two.

By default, the code runs in two directories. Start the `backend` and `ui` each in their own terminal

    npm start

The UI will start on localhost:3000, and the backend will start on localhost:8080

To run in a single terminal, first build the UI files.

### Build files

In order to create new build files of the UI to host off of the backend and run the project off a single terminal with the latest UI code, after updating your UI, create your build files

    npm build

And then move the resulting file into /backend/build

Next, update the file /backend/server.js.

### uncomment line 31
This will enable bodyParser, to help the backend serve the built ui files

    app.use(bodyParser.text());

### uncomment lines 35 - 40
This will retrieve the ui files from the `build` directory

    const breadcrumbtrail = path.join(__dirname, 'build/');
    app.use('/', express.static(breadcrumbtrail));
    app.get('/', function(req, res) {
        console.log(req);
        res.sendFile(path.join(breadcrumbtrail, 'index.html'));
    });

### uncomment line 274
This will ensure the app automatically opens in your default browser on startup. Otherwise you can navigate directly to it.

    open(`http://localhost:${PORT}/`);

### on line 268, change the port from 8080 to 3000
Not strictly needed, but for consistency to access the application from localhost:3000

    const PORT = process.env.PORT || 3000;

Now when you run `npm start` in the /backend directory, the backend will serve the built UI files from localhost:3000

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

CouRM is licensed under CC BY-NC 2.5. Free for non-commercial use with attribution.

In short, you are free to share, copy, remix, adapt, fork, and distribute the code for any non-commercial purpose, so long as you attribute myself and CouRM as the valid source. You should also note in your derivations if any changes where made, and should not restrict things in your derivations that this license permits. More details at https://creativecommons.org/licenses/by-nc/2.5/