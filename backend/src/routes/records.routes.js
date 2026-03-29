/*
 * Responsibility: expose shared cross-record lookup routes.
 * Exports: an Express router mounted under /api.
 * Does not contain: resource CRUD handlers.
 */
const express = require("express");

const { sendServerError, sendSuccess } = require("../lib/responses");
const { getAllRows } = require("../db/connection");
const { getRelatedRecordIds } = require("../lib/relations");

const router = express.Router();
const VALID_RECORD_TYPES = new Set(["contact", "event", "note"]);

router.get("/records-by-relation/recordType/:recordType", async (req, res) => {
    try {
        const { recordType } = req.params;
        if (!VALID_RECORD_TYPES.has(recordType)) {
            res.status(404).json({ message: "NOT FOUND" });
            return;
        }

        const relationships = req.body || {};
        const filteredIds = await getRelatedRecordIds(recordType, relationships, (value) => value);

        if (!filteredIds.length) {
            sendSuccess(res, []);
            return;
        }

        const rows = await getAllRows(
            `SELECT * FROM ${recordType}s WHERE id IN (${filteredIds.join(",")})`
        );
        sendSuccess(res, rows);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/title-list/recordType/:recordType", async (req, res) => {
    try {
        const { recordType } = req.params;
        if (!VALID_RECORD_TYPES.has(recordType)) {
            res.status(404).json({ message: "NOT FOUND" });
            return;
        }

        const fields = recordType === "contact" ? "firstName, lastName" : "title";
        const rows = await getAllRows(`SELECT id, ${fields} FROM ${recordType}s`);
        sendSuccess(res, { results: rows });
    } catch (err) {
        sendServerError(res, err);
    }
});

module.exports = router;
