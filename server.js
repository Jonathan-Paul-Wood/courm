const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('main.db', (err) => {
    if(err) {
        console.error(err.message);
    }
}); //TODO: run such that it won't stop program on ERRORs (set .bail to OFF), otherwise bugs force users to restart program...
//TODO: someway to save DB backup on either user input or on application close
const app = express();
const { ERROR_CODE, SUCCESS_CODE, NOT_FOUND_CODE } = require('./responseStatusCodes.js');

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

function initializeDB() {
    db.serialize(function() {
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT,
            profilePicture TEXT,
            phoneNumber TEXT,
            email TEXT,
            address TEXT,
            firm TEXT,
            industry TEXT,
            dateOfBirth TEXT,
            tags TEXT,
            interactions TEXT,
            createdBy TEXT,
            createdOn TEXT,
            lastModifiedBy TEXT,
            lastModifiedOn TEXT,
            lastInteractionId TEXT,
            lastInteractionOn TEXT,
            entityType TEXT        
            )`);
      });      
}

function closeDB() { 
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to your CRM / Address Book!"});
});

app.post("/api/initialize", (req, res) => {
    initializeDB();
    res.json({message: 'done'});
});

app.delete("/api/disconnect", (req, res) => {
    const response = closeDB();
    res.json({message: 'database closed'})
});

app.post('/api/contacts/new', (req, res) => {
    console.log(req.body);
    const response = db.run(
        `INSERT INTO contacts(
            firstName,
            lastName,
            profilePicture,
            phoneNumber,
            email,
            address,
            firm,
            industry,
            dateOfBirth,
            tags,
            interactions,
            createdBy,
            createdOn,
            lastModifiedBy,
            lastModifiedOn,
            lastInteractionId,
            lastInteractionOn,
            entityType) 
        VALUES(
            '${req.body.firstName}',
            '${req.body.lastName}',
            '${req.body.profilePicture}',
            '${req.body.phoneNumber}',
            '${req.body.email}',
            '${req.body.address}',
            '${req.body.firm}',
            '${req.body.industry}',
            '${req.body.dateOfBirth}',
            '${req.body.tags}',
            '${req.body.interactions}',
            '${req.body.createdBy}',
            '${req.body.createdOn}',
            '${req.body.lastModifiedBy}',
            '${req.body.lastModifiedOn}',
            '${req.body.lastInteraction}',
            '${req.body.lastInteraction}',
            '${req.body.entityType}'
            )`
        );
    res.json(response);
});

app.get("/api/contacts", (req, res) => {
    const sql = `SELECT * FROM contacts`;
    db.all(sql, (err, rows) => {
        if (err) {
            res.status = ERROR_CODE;
            return console.error(err.message);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            return;
        } else {
            res.status = SUCCESS_CODE;
            res.json({'response': rows});
        }
    });
});

app.get("/api/contacts/:id", (req, res) => {
    const sql = `SELECT * FROM contacts WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status = ERROR_CODE;
            return console.error(err.message);
        } else if (!row) {
            res.status = NOT_FOUND_CODE;
            return;
        } else {
            res.status = SUCCESS_CODE;
            res.json(row);
        }
    })
});

app.put("/api/contacts/:id", (req, res) => {
    console.log('PUT contact: ', req.body);
    let data = Object.keys(req.body).map(key => {
        return req.body[key];
    });
    data.push(req.params.id);
    console.log('shaped data: ', data);
    const sql = `UPDATE contacts SET firstName=?, lastName=?, profilePicture=?, phoneNumber=?, email=?, address=?, firm=?, industry=?, dateOfBirth=?, tags=?, interactions=?, lastModifiedBy=?, lastModifiedOn=?, lastInteractionId=?, lastInteractionOn=? WHERE id=?`;
    db.run(sql, data, (err, row) => {
        console.log(err);
        console.log(row);
        if (err) {
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!row) {
            res.status = NOT_FOUND_CODE;
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status = SUCCESS_CODE;
            res.json({'response': row});
        }
    });
});

app.delete("/api/contacts/:id", (req, res) => {
    console.log('DELETING... ', req.params.id);
    const sql = `DELETE FROM contacts WHERE id = ${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!row) {
            res.status = NOT_FOUND_CODE;
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status = SUCCESS_CODE;
            res.json({'response': row});
        }
    });
});
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
