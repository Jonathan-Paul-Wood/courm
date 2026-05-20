/*
 * Responsibility: own the sqlite connection and promise-based query helpers.
 * Exports: the sqlite instance plus run/get/all/close helpers.
 * Does not contain: schema creation, migrations, or Express concerns.
 */
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_FILE_PATH = path.resolve(process.env.DB_PATH || "main.db");
const db = new sqlite3.Database(DB_FILE_PATH, (err) => {
    if (err) {
        console.error(err.message);
    }
});

function runStatement(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes
            });
        });
    });
}

function getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row);
        });
    });
}

function getAllRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

function closeDb() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports = {
    closeDb,
    db,
    getAllRows,
    getRow,
    runStatement
};
