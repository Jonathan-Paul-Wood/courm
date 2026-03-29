/*
 * Responsibility: define relation CRUD and lookup routes.
 * Exports: an Express router mounted under /api.
 * Does not contain: record-specific filtering logic beyond relation persistence.
 */
const express = require("express");

const { NOT_FOUND_CODE } = require("../config/constants");
const { getAllRows, getRow, runStatement } = require("../db/connection");
const { buildUpdateClause, confirmInt } = require("../lib/queries");
const { sendServerError, sendSuccess } = require("../lib/responses");

const router = express.Router();
const RELATION_FIELDS = ["contactId", "noteId", "eventId", "createdOn", "lastModifiedOn"];
const RELATION_QUERY_FIELDS = new Set(["contactId", "noteId", "eventId"]);

router.post("/relations/new", async (req, res) => {
    try {
        const insertResult = await runStatement(
            `INSERT INTO relations(
                contactId,
                noteId,
                eventId
            ) VALUES(?, ?, ?)`,
            [
                confirmInt(req.body.contactId),
                confirmInt(req.body.noteId),
                confirmInt(req.body.eventId)
            ]
        );

        sendSuccess(res, { newId: insertResult.lastID });
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/relations/all", async (_req, res) => {
    try {
        const rows = await getAllRows("SELECT * FROM relations");
        sendSuccess(res, rows);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/relations/:id", async (req, res) => {
    try {
        const row = await getRow("SELECT * FROM relations WHERE id = ?", [req.params.id]);
        if (!row) {
            res.status(NOT_FOUND_CODE).json({ message: "NOT FOUND" });
            return;
        }

        sendSuccess(res, [row]);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/relations", async (req, res) => {
    try {
        const { entity, id } = req.query;
        if (!RELATION_QUERY_FIELDS.has(entity)) {
            res.status(NOT_FOUND_CODE).json({ message: "NOT FOUND" });
            return;
        }

        const rows = await getAllRows(`SELECT * FROM relations WHERE ${entity} = ?`, [id]);
        sendSuccess(res, rows);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.put("/relations/:id", async (req, res) => {
    try {
        const existingRelation = await getRow("SELECT * FROM relations WHERE id = ?", [req.params.id]);
        if (!existingRelation) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        const nextRelationValues = RELATION_FIELDS.reduce((accumulator, field) => {
            accumulator[field] = Object.prototype.hasOwnProperty.call(req.body, field)
                ? req.body[field]
                : existingRelation[field];
            return accumulator;
        }, {});
        const { clause, params } = buildUpdateClause(nextRelationValues, RELATION_FIELDS);
        const updateResult = await runStatement(
            `UPDATE relations SET ${clause} WHERE id = ?`,
            [...params, req.params.id]
        );

        if (!updateResult.changes) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        sendSuccess(res, { response: updateResult });
    } catch (err) {
        sendServerError(res, err);
    }
});

router.delete("/relations/:id", async (req, res) => {
    try {
        const deleteResult = await runStatement("DELETE FROM relations WHERE id = ?", [req.params.id]);
        if (!deleteResult.changes) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        sendSuccess(res, { response: deleteResult });
    } catch (err) {
        sendServerError(res, err);
    }
});

module.exports = router;
