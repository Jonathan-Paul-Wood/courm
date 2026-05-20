/*
 * Responsibility: define event CRUD and event list routes.
 * Exports: an Express router mounted under /api.
 * Does not contain: event value normalization helpers or schema logic.
 */
const express = require("express");

const { NOT_FOUND_CODE } = require("../config/constants");
const { getAllRows, getRow, runStatement } = require("../db/connection");
const { getSubsetOfRecords } = require("../lib/queries");
const { cleanUpRelations, getRelatedRecordIds } = require("../lib/relations");
const {
    sendPaginatedResults,
    sendServerError,
    sendSuccess
} = require("../lib/responses");
const { buildEventValues } = require("../services/events.service");

const router = express.Router();

router.post("/events/new", async (req, res) => {
    try {
        const eventValues = buildEventValues(req.body);
        const insertResult = await runStatement(
            `INSERT INTO events(
                date,
                title,
                description,
                address
            ) VALUES(?, ?, ?, ?)`,
            [
                eventValues.date,
                eventValues.title,
                eventValues.description,
                eventValues.address
            ]
        );

        sendSuccess(res, { newId: insertResult.lastID });
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/events/all", async (_req, res) => {
    try {
        const rows = await getAllRows("SELECT * FROM events");
        const resultCount = rows.length;

        sendSuccess(res, {
            results: rows,
            resultCount,
            pageSize: resultCount,
            totalCount: resultCount,
            pageCount: 1,
            currentPage: 1
        });
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/events", async (req, res) => {
    try {
        const {
            results,
            page,
            order,
            direction,
            searchTerm,
            filters,
            relatedContacts,
            relatedNotes
        } = req.query;
        const relationships = {};

        if (relatedContacts) {
            relationships.contacts = relatedContacts.split(",");
        }
        if (relatedNotes) {
            relationships.notes = relatedNotes.split(",");
        }

        const filteredIds = Object.keys(relationships).length
            ? await getRelatedRecordIds("event", relationships)
            : undefined;

        const payload = await getSubsetOfRecords("SELECT * FROM events", {
            direction,
            filters,
            filteredIds,
            order,
            page,
            results,
            searchTerm
        });

        sendPaginatedResults(res, payload);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/events/:id", async (req, res) => {
    try {
        const row = await getRow("SELECT * FROM events WHERE id = ?", [req.params.id]);
        if (!row) {
            res.status(NOT_FOUND_CODE).json({ message: "No such event" });
            return;
        }

        sendSuccess(res, row);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.put("/events/:id", async (req, res) => {
    try {
        const existingEvent = await getRow("SELECT * FROM events WHERE id = ?", [req.params.id]);
        if (!existingEvent) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        const eventValues = buildEventValues(req.body, existingEvent);
        const updateResult = await runStatement(
            `UPDATE events
            SET date = ?,
                title = ?,
                description = ?,
                address = ?,
                createdOn = ?,
                lastModifiedOn = ?
            WHERE id = ?`,
            [
                eventValues.date,
                eventValues.title,
                eventValues.description,
                eventValues.address,
                eventValues.createdOn,
                eventValues.lastModifiedOn,
                req.params.id
            ]
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

router.delete("/events/:id", async (req, res) => {
    try {
        await cleanUpRelations("event", req.params.id);
        const deleteResult = await runStatement("DELETE FROM events WHERE id = ?", [req.params.id]);

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
