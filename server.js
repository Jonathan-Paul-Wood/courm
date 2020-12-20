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

//accepts requests of the form: localhost:8080/api/contacts?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
app.get("/api/contacts", (req, res) => {
    const { results, page, order, direction, search } = req.query;
    // const filters = req.body;
    let sql = `SELECT * FROM contacts`;
    //apply clause for each filter
    // if(filters.entityType) {
    //     sql = sql+` WHERE entityType LIKE ${filters.entityType}`;
    // }

    //apply search
    // if(search) {
    //     sql = sql+` WHERE (firstName,lastName) GLOB '*${search}*'`;

    //     /*
    //      sql = sql+` WHERE firstName GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE lastName GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE firm GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE phoneNumber GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE email GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE address GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE industry GLOB '*${search}*'`;
    //     sql = sql+` OR WHERE tags GLOB '*${search}*'`;
    //     */
    //     // use % to match >=0 chars before and after search term
    // }

    //apply sort order and pagination
    sql = sql+` ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page - 1})* ${results})`;
    console.log(sql);
    db.all(sql, (err, rows) => {
        if (err) {
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            res.status = SUCCESS_CODE;
            res.json(rows);
        }
    });
});

app.get("/api/contacts/all", (req, res) => {
    const sql = `SELECT * FROM contacts`;
    db.all(sql, (err, rows) => {
        if (err) {
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            return;
        } else {
            res.status = SUCCESS_CODE;
            res.json(rows);
        }
    });
});

app.get("/api/contacts/metadata", (req, res) => {
    const sql = `SELECT COUNT(*) FROM contacts`;
    db.get(sql, (err, result) => {
        if (err) {
            res.status = ERROR_CODE;
            return console.error(err.message);
        } else if (!result) {
            res.status = NOT_FOUND_CODE;
            return;
        } else {
            res.status = SUCCESS_CODE;
            res.json({total: result['COUNT(*)']});
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
    const b = req.body;
    let sql = `UPDATE contacts SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'firstName') {
            sql = sql+`, ${key}='${b[key]}'`
        } if (key === 'firstName') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
    console.log(sql);
    db.run(sql, (err, row) => {
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
