const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require('path');
const open = require('open');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('main.db', (err) => {
    if(err) {
        console.error(err.message);
    }
}); //TODO: run such that it won't stop program on ERRORs (set .bail to OFF), otherwise bugs force users to restart program...
//TODO: someway to save DB backup on either user input or on application close
const app = express();
const ERROR_CODE = 500;
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;

var corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - text/
//app.use(bodyParser.text());


// If running in production mode enter here
// const breadcrumbtrail = path.join(__dirname, 'build/');
// app.use('/', express.static(breadcrumbtrail));
// app.get('/', function(req, res) {
//     res.sendFile(path.join(breadcrumbtrail, 'index.html'));
// });

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
            bio TEXT,
            createdBy TEXT,
            createdOn TEXT NOT NULL,
            lastModifiedBy TEXT,
            lastModifiedOn TEXT,
            lastInteractionId TEXT,
            lastInteractionOn TEXT NOT NULL,
            entityType TEXT NOT NULL
            );`);
        db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date datetime NOT NULL,
            title TEXT,
            record TEXT,
            address TEXT,
            contacts TEXT,
            tags TEXT,
            createdOn datetime default current_timestamp,
            lastModifiedOn datetime default current_timestamp
            );
        `);
        db.run(`
        CREATE TABLE IF NOT EXISTS relations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contactId INTEGER DEFAULT NULL,
            noteId INTEGER DEFAULT NULL,
            eventId INTEGER DEFAULT NULL,
            createdOn datetime default current_timestamp,
            lastModifiedOn datetime default current_timestamp
            );
        `);
        db.run(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date datetime NOT NULL,
            title TEXT,
            description TEXT,
            address TEXT,
            createdOn datetime default current_timestamp,
            lastModifiedOn datetime default current_timestamp
            );
        `);
      });      
} //TODO: delete interactions from contacts, delete contacts from notes, delete tags from all (maybe tags in new table like relations)

function closeDB() { 
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

function cleanseString(str) {
    return str.replace(/'/g, "''");
}

function confirmInt(value) {
    return Number.isSafeInteger(value) ? value : null;
}

app.post("/api/initialize", (req, res) => {
    initializeDB();
    res.json({message: 'done'});
});

app.delete("/api/disconnect", (req, res) => {
    const response = closeDB();
    res.json({message: 'database closed'})
});

// NOTES APIS

app.post('/api/notes/new', (req, res) => {
    db.run(
        `INSERT INTO notes(
            date,
            title,
            record,
            address,
            contacts,
            tags) 
        VALUES(
            '${req.body.date}',
            '${cleanseString(req.body.title)}',
            '${cleanseString(req.body.record)}',
            '${cleanseString(req.body.address)}',
            '${req.body.contacts}',
            '${req.body.tags}'
            )`, (err, rows) => {
                console.log('error: ', err);
                if (err) {
                    res.status = ERROR_CODE;
                    res.json(err);
                } else {
                    res.status = SUCCESS_CODE;
                    db.run(`SELECT id FROM notes WHERE createdOn=${req.body.createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
});

//accepts requests of the form: /api/notes?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
app.get("/api/notes", (req, res) => {
    const { results, page, order, direction, searchTerm, filters } = req.query;
    let sql = `SELECT * FROM notes`;

    //apply search
    if(searchTerm && filters) {
        const searchFilters = filters.split(',');
        sql = sql + ` WHERE ${searchFilters[0]} LIKE '%${searchTerm}%'`;
        searchFilters.forEach((filter, index) => {
            if(index) {
                sql = sql + ` OR ${filter} LIKE '%${searchTerm}%'`
            }
        });
    }

    const sql_metadata = sql;
    //apply sort order and pagination
    sql = sql+` ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page - 1})* ${results})`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            db.all(sql_metadata, (err, result) => {
                if (err) {
                    res.status = ERROR_CODE;
                    return console.error(err.message);
                } else if (!result) {
                    res.status = NOT_FOUND_CODE;
                    return;
                } else {
                    totalResults = result.length;
                    res.json({
                        results: rows,
                        resultCount: rows.length,
                        pageSize: parseInt(results),
                        totalCount: totalResults,
                        pageCount: Math.ceil(totalResults / parseInt(results)),
                        currentPage: parseInt(page)
                    });
                }
            });
        }
    });
});

app.get("/api/notes/:id", (req, res) => {
    const sql = `SELECT * FROM notes WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such note'});
        } else {
            res.status = SUCCESS_CODE;
            res.json(row);
        }
    })
});

app.put("/api/notes/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE notes SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'date') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'date') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
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

app.delete("/api/notes/:id", (req, res) => {
    const sql = `DELETE FROM notes WHERE id = ${req.params.id}`;
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

// END NOTES APIS

// CONTACTS APIS
app.post('/api/contacts/new', (req, res) => {
    const createdOn = req.body.createdOn;
    db.run(
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
            bio,
            createdBy,
            createdOn,
            lastModifiedBy,
            lastModifiedOn,
            lastInteractionId,
            lastInteractionOn,
            entityType) 
        VALUES(
            '${cleanseString(req.body.firstName)}',
            '${cleanseString(req.body.lastName)}',
            '${req.body.profilePicture}',
            '${req.body.phoneNumber}',
            '${req.body.email}',
            '${cleanseString(req.body.address)}',
            '${cleanseString(req.body.firm)}',
            '${cleanseString(req.body.industry)}',
            '${req.body.dateOfBirth}',
            '${req.body.tags}',
            '${req.body.interactions}',
            '${cleanseString(req.body.bio)}',
            '${req.body.createdBy}',
            '${req.body.createdOn}',
            '${req.body.lastModifiedBy}',
            '${req.body.lastModifiedOn}',
            '${req.body.lastInteraction}',
            '${req.body.lastInteraction}',
            '${req.body.entityType}'
            )`, (err, rows) => {
                if (err) {
                    res.status = ERROR_CODE;
                    res.json(err);
                } else {
                    res.status = SUCCESS_CODE;
                    db.run(`SELECT id FROM contacts WHERE createdOn=${createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
});

//accepts requests of the form: /api/contacts?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
// {
//    "contacts": Array<number>,
//    "events": Array<number>,
//    "notes": Array<number>
// }
app.get("/api/contacts", (req, res) => {
    const { results, page, order, direction, searchTerm, filters, relatedEvents, relatedNotes } = req.query;
    const relationships = {};
    if (relatedEvents) {
        relationships.events = relatedEvents.split(',');
    }
    if (relatedNotes) {
        relationships.notes = relatedNotes.split(',');
    }

    const sqlPre =
    `SELECT *
    FROM relations
    LEFT JOIN contacts
    ON relations.contactId = contacts.id`;

    db.all(sqlPre, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            const relatedRecordMap = new Map();

            // create map where each record id has an object of their existing relationships
            rows.forEach((row) => {
                if (row.id) {
                    if (!relatedRecordMap.get(row.id)) {
                        relatedRecordMap.set(row.id, {
                            contacts: [],
                            events: [],
                            notes: []
                        });
                    }
                    const thisRecordEntry = relatedRecordMap.get(row.id);
                    if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            contacts: [...thisRecordEntry.contacts, row.contactId]
                        });
                    }
                    if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            events: [...thisRecordEntry.events, row.eventId]
                        });
                    }
                    if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            notes: [...thisRecordEntry.notes, row.noteId]
                        });
                    }
                }
            });

            // filter for just the record ids with the expected relations
            const filteredIds = [];
            const mapKeys = relatedRecordMap.keys();
            let nextMapKey = mapKeys.next();
            while (nextMapKey.done === false) {
                const key = nextMapKey.value;
                const recordRelations = relatedRecordMap.get(key);
                const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                    return relationships[recordIdType].every((id) => {
                        return recordRelations[recordIdType].find(i => i === parseInt(id));
                    });
                });
                if (hasAllExpectedRelations) {
                    filteredIds.push(key);
                }

                nextMapKey = mapKeys.next();
            }

            let sql = `SELECT * FROM contacts`;

            //apply search
            if(searchTerm && filters) {
                const searchFilters = filters.split(',');
                sql = sql + ` WHERE ${searchFilters[0]} LIKE '%${searchTerm}%'`;
                searchFilters.forEach((filter, index) => {
                    if(index) {
                        sql = sql + ` OR ${filter} LIKE '%${searchTerm}%'`;
                    }
                });
                sql = sql+` AND id IN (${filteredIds})`;
                // sql = sql+` WHERE firstName LIKE '%${searchTerm}%' OR lastName LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
                // sql = sql+` OR phoneNumber LIKE '%${searchTerm}%' OR address LIKE '%${searchTerm}%' OR firm LIKE '%${searchTerm}%' or industry LIKE '%${searchTerm}%'`;
                
                // use % to match >=0 chars before and after search term
            } else {
                sql = sql+` WHERE id IN (${filteredIds})`;
            }

            const sql_metadata = sql;
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
                    db.all(sql_metadata, (err, result) => {
                        if (err) {
                            res.status = ERROR_CODE;
                            return console.error(err.message);
                        } else if (!result) {
                            res.status = NOT_FOUND_CODE;
                            return;
                        } else {
                            totalResults = result.length;
                            res.json({
                                results: rows,
                                resultCount: rows.length,
                                pageSize: parseInt(results),
                                totalCount: totalResults,
                                pageCount: Math.ceil(totalResults / parseInt(results)),
                                currentPage: parseInt(page),
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get("/api/contacts/:id", (req, res) => {
    const sql = `SELECT * FROM contacts WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such contact'});
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
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'firstName') {
            sql = sql+` ${key}='${cleanseString(b[key])}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
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

// END CONTACTS APIS

// EVENTS APIS

app.post('/api/events/new', (req, res) => {
    db.run(
        `INSERT INTO events(
            date,
            title,
            description,
            address)
            VALUES(
                '${req.body.date}',
                '${cleanseString(req.body.title)}',
                '${cleanseString(req.body.description)}',
                '${cleanseString(req.body.address)}'
            )`, (err, rows) => {
                console.log('error: ', err);
                if (err) {
                    res.status = ERROR_CODE;
                    res.json(err);
                } else {
                    res.status = SUCCESS_CODE;
                    db.run(`SELECT id FROM events WHERE createdOn=${req.body.createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
    });

//accepts requests of the form: /api/events?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
app.get("/api/events", (req, res) => {
    const { results, page, order, direction, searchTerm, filters } = req.query;
    let sql = `SELECT * FROM events`;
    //apply search
    if(searchTerm && filters) {
        const searchFilters = filters.split(',');
        sql = sql + ` WHERE ${searchFilters[0]} LIKE '%${searchTerm}%'`;
        searchFilters.forEach((filter, index) => {
            if(index) {
                sql = sql + ` OR ${filter} LIKE '%${searchTerm}%'`
            }
        });
    }

    const sql_metadata = sql;
    //apply sort order and pagination
    sql = sql+` ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page - 1})* ${results})`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            db.all(sql_metadata, (err, result) => {
                if (err) {
                    res.status = ERROR_CODE;
                    return console.error(err.message);
                } else if (!result) {
                    res.status = NOT_FOUND_CODE;
                    return;
                } else {
                    totalResults = result.length;
                    res.json({
                        results: rows,
                        resultCount: rows.length,
                        pageSize: parseInt(results),
                        totalCount: totalResults,
                        pageCount: Math.ceil(totalResults / parseInt(results)),
                        currentPage: parseInt(page)
                    });
                }
            });
        }
    });
});

app.get("/api/events/:id", (req, res) => {
    const sql = `SELECT * FROM events WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such event'});
        } else {
            res.status = SUCCESS_CODE;
            res.json(row);
        }
    })
});

app.put("/api/events/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE events SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'date') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'date') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
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

app.delete("/api/events/:id", (req, res) => {
    const sql = `DELETE FROM events WHERE id = ${req.params.id}`;
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

// END EVENTS APIS

// RELATIONS APIS

app.post('/api/relations/new', (req, res) => {
    db.run(
        `INSERT INTO relations(
            contactId,
            noteId,
            eventId) 
        VALUES(
            ${confirmInt(req.body.contactId)},
            ${confirmInt(req.body.noteId)},
            ${confirmInt(req.body.eventId)}
            )`, (err, rows) => {
                console.log('error: ', err);
                if (err) {
                    res.status = ERROR_CODE;
                    res.json(err);
                } else {
                    res.status = SUCCESS_CODE;
                    db.run(`SELECT id FROM relations WHERE createdOn=${req.body.createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
});

app.get('/api/relations/all', (req, res) => {
    let sql = `SELECT * FROM relations`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/relations/:id', (req, res) => {
    let sql = `SELECT * FROM relations WHERE id = ${req.params.id}`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

//accepts requests of the form: /api/relations?entity=[contactId | noteId | eventId]&id=string
app.get("/api/relations", (req, res) => {
    const { entity, id } = req.query;
    let sql = `SELECT * FROM relations WHERE ${entity} = ${id}`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

app.put("/api/relations/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE relations SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'eventId') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'eventId') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
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

app.delete("/api/relations/:id", (req, res) => {
    const sql = `DELETE FROM relations WHERE id = ${req.params.id}`;
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

// END RELATIONS APIS

// START COMBINATORIAL SEARCH APIS

/* getRecordsByRelations
    CONSUMES:
    - params.recordType: 'contact' || 'event' || 'note' // The type of records to be returned
    - params.body: {
        contacts?: Array<number>
        events?: Array<number>
        notes?: Array<number>
    } // arrays of the ids of each relation type
    PRODUCES:
    - Array<contact || event || note> (only one type). An array of the records (of specified type) that have all the relations specified in the body
*/
app.get("/api/records-by-relation/recordType/:recordType", async (req, res) => {
    const recordType = req.params.recordType; // 'contact' || 'event' || 'note'
    const relationships = req.body;

    const sql =
    `SELECT *
    FROM relations
    LEFT JOIN ${recordType}s
    ON relations.${recordType}Id = ${recordType}s.id`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            const relatedRecordMap = new Map();

            // create map where each record id has an object of their existing relationsships
            rows.forEach((row) => {
                if (row.id) {
                    if (!relatedRecordMap.get(row.id)) {
                        relatedRecordMap.set(row.id, {
                            contacts: [],
                            events: [],
                            notes: []
                        });
                    }
                    const thisRecordEntry = relatedRecordMap.get(row.id);
                    if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            contacts: [...thisRecordEntry.contacts, row.contactId]
                        });
                    }
                    if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            events: [...thisRecordEntry.events, row.eventId]
                        });
                    }
                    if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            notes: [...thisRecordEntry.notes, row.noteId]
                        });
                    }
                }
            });

            // filter for just the record ids with the expected relations
            const filteredIds = [];
            const mapKeys = relatedRecordMap.keys();
            let nextMapKey = mapKeys.next();
            while (nextMapKey.done === false) {
                const key = nextMapKey.value;
                const recordRelations = relatedRecordMap.get(key);
                const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                    return relationships[recordIdType].every((id) => {
                        return recordRelations[recordIdType].find(i => i === id);
                    });
                });
                if (hasAllExpectedRelations) {
                    filteredIds.push(key);
                }

                nextMapKey = mapKeys.next();
            }

            const sql2 = `SELECT * FROM ${recordType}s WHERE id IN (${filteredIds})`;
            db.all(sql2, (err2, rows2) => {
                if (err2) {
                    res.status = ERROR_CODE;
                    res.json(err2);
                } else if (!rows2) {
                    res.status = NOT_FOUND_CODE;
                    res.json({'response': 'NOT FOUND'});
                } else {
                    res.status = SUCCESS_CODE;
                    res.json(rows2);
                }
            });
        }
    });
});

// END COMBINATORIAL SEARCH APIS

// GET NAMES OF RECORDS
app.get("/api/title-list/recordType/:recordType", async (req, res) => {
    const recordType = req.params.recordType; // 'contact' || 'event' || 'note'
    const fields = recordType === 'contact' ? `firstName, lastName` : `title`

    const sql =
    `SELECT id, ${fields} FROM ${recordType}s`;

    db.all(sql, (err, rows) => {
        if (err) {
            res.status = ERROR_CODE;
            res.json(err);
        } else if (!rows) {
            res.status = NOT_FOUND_CODE;
            res.json({message: 'NOT FOUND'});
        } else {
            res.status = SUCCESS_CODE;
            res.json({ results: rows });
        }
    });
});
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);

    // if in production mode: opens the url in the default browser 
    // open(`http://localhost:${PORT}/`);
});
