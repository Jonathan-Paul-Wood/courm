/*
 * Responsibility: define note CRUD and note list routes.
 * Exports: an Express router mounted under /api.
 * Does not contain: reusable note media helpers or schema logic.
 */
const express = require("express");

const { NOT_FOUND_CODE, SUCCESS_CODE } = require("../config/constants");
const { getAllRows, getRow, runStatement } = require("../db/connection");
const {
    deleteStoredFiles
} = require("../lib/files");
const { getSubsetOfRecords } = require("../lib/queries");
const { cleanUpRelations, getRelatedRecordIds } = require("../lib/relations");
const {
    sendPaginatedResults,
    sendServerError,
    sendSuccess
} = require("../lib/responses");
const {
    buildNoteValues,
    normalizeNoteRecord
} = require("../services/notes.service");

const router = express.Router();

router.post("/notes/new", async (req, res) => {
    let createdMediaPaths = [];

    try {
        const { noteValues, createdMediaPaths: nextCreatedMediaPaths } = buildNoteValues(req.body);
        createdMediaPaths = nextCreatedMediaPaths;

        const insertResult = await runStatement(
            `INSERT INTO notes(
                date,
                title,
                record,
                address,
                contacts,
                tags,
                mediaFiles
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                noteValues.date,
                noteValues.title,
                noteValues.record,
                noteValues.address,
                noteValues.contacts,
                noteValues.tags,
                noteValues.mediaFiles
            ]
        );

        const newNote = await getRow("SELECT * FROM notes WHERE id = ?", [insertResult.lastID]);
        sendSuccess(res, normalizeNoteRecord(newNote), SUCCESS_CODE);
    } catch (err) {
        if (createdMediaPaths.length) {
            deleteStoredFiles(createdMediaPaths);
        }
        sendServerError(res, err);
    }
});

router.get("/notes/all", async (_req, res) => {
    try {
        const rows = await getAllRows("SELECT * FROM notes");
        const resultCount = rows.length;

        sendSuccess(res, {
            results: rows.map(normalizeNoteRecord),
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

router.get("/notes", async (req, res) => {
    try {
        const {
            results,
            page,
            order,
            direction,
            searchTerm,
            filters,
            relatedContacts,
            relatedEvents
        } = req.query;
        const relationships = {};

        if (relatedContacts) {
            relationships.contacts = relatedContacts.split(",");
        }
        if (relatedEvents) {
            relationships.events = relatedEvents.split(",");
        }

        const filteredIds = Object.keys(relationships).length
            ? await getRelatedRecordIds("note", relationships)
            : undefined;

        const payload = await getSubsetOfRecords("SELECT * FROM notes", {
            direction,
            filters,
            filteredIds,
            order,
            page,
            results,
            searchTerm,
            transformRow: normalizeNoteRecord
        });

        sendPaginatedResults(res, payload);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.get("/notes/:id", async (req, res) => {
    try {
        const row = await getRow("SELECT * FROM notes WHERE id = ?", [req.params.id]);
        if (!row) {
            res.status(NOT_FOUND_CODE).json({ message: "No such note" });
            return;
        }

        sendSuccess(res, normalizeNoteRecord(row));
    } catch (err) {
        sendServerError(res, err);
    }
});

router.put("/notes/:id", async (req, res) => {
    let createdMediaPaths = [];

    try {
        const existingNote = await getRow("SELECT * FROM notes WHERE id = ?", [req.params.id]);
        if (!existingNote) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        const {
            noteValues,
            createdMediaPaths: nextCreatedMediaPaths,
            deletedMediaPaths
        } = buildNoteValues(req.body, existingNote);
        createdMediaPaths = nextCreatedMediaPaths;

        const updateResult = await runStatement(
            `UPDATE notes
            SET date = ?,
                title = ?,
                record = ?,
                address = ?,
                contacts = ?,
                tags = ?,
                mediaFiles = ?,
                lastModifiedOn = COALESCE(?, lastModifiedOn)
            WHERE id = ?`,
            [
                noteValues.date,
                noteValues.title,
                noteValues.record,
                noteValues.address,
                noteValues.contacts,
                noteValues.tags,
                noteValues.mediaFiles,
                noteValues.lastModifiedOn,
                req.params.id
            ]
        );

        if (!updateResult.changes) {
            if (createdMediaPaths.length) {
                deleteStoredFiles(createdMediaPaths);
            }
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        if (deletedMediaPaths.length) {
            deleteStoredFiles(deletedMediaPaths);
        }

        const updatedNote = await getRow("SELECT * FROM notes WHERE id = ?", [req.params.id]);
        sendSuccess(res, normalizeNoteRecord(updatedNote));
    } catch (err) {
        if (createdMediaPaths.length) {
            deleteStoredFiles(createdMediaPaths);
        }
        sendServerError(res, err);
    }
});

router.delete("/notes/:id", async (req, res) => {
    try {
        const existingNote = await getRow("SELECT * FROM notes WHERE id = ?", [req.params.id]);
        if (!existingNote) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        await cleanUpRelations("note", req.params.id);

        const deleteResult = await runStatement("DELETE FROM notes WHERE id = ?", [req.params.id]);
        if (!deleteResult.changes) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        deleteStoredFiles(normalizeNoteRecord(existingNote).mediaFiles.map((mediaFile) => mediaFile.path));
        sendSuccess(res, { response: deleteResult });
    } catch (err) {
        sendServerError(res, err);
    }
});

module.exports = router;
