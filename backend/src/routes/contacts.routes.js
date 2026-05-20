/*
 * Responsibility: define contact CRUD and contact list routes.
 * Exports: an Express router mounted under /api.
 * Does not contain: reusable contact image helpers or schema logic.
 */
const express = require("express");

const { NOT_FOUND_CODE } = require("../config/constants");
const { getAllRows, getRow, runStatement } = require("../db/connection");
const { deleteStoredFile } = require("../lib/files");
const { getSubsetOfRecords } = require("../lib/queries");
const { cleanUpRelations, getRelatedRecordIds } = require("../lib/relations");
const {
    sendPaginatedResults,
    sendServerError,
    sendSuccess
} = require("../lib/responses");
const { buildContactValues } = require("../services/contacts.service");

const router = express.Router();

router.post("/contacts/new", async (req, res) => {
    let createdImagePath = "";

    try {
        const { contactValues, createdImagePath: nextCreatedImagePath } = buildContactValues(req.body);
        createdImagePath = nextCreatedImagePath;

        const insertResult = await runStatement(
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
                entityType
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                contactValues.firstName,
                contactValues.lastName,
                contactValues.profilePicture,
                contactValues.phoneNumber,
                contactValues.email,
                contactValues.address,
                contactValues.firm,
                contactValues.industry,
                contactValues.dateOfBirth,
                contactValues.tags,
                contactValues.interactions,
                contactValues.bio,
                contactValues.createdBy,
                contactValues.createdOn,
                contactValues.lastModifiedBy,
                contactValues.lastModifiedOn,
                contactValues.lastInteractionId,
                contactValues.lastInteractionOn,
                contactValues.entityType
            ]
        );

        const newContact = await getRow("SELECT * FROM contacts WHERE id = ?", [insertResult.lastID]);
        sendSuccess(res, newContact);
    } catch (err) {
        if (createdImagePath) {
            deleteStoredFile(createdImagePath);
        }
        sendServerError(res, err);
    }
});

router.get("/contacts/all", async (_req, res) => {
    try {
        const rows = await getAllRows("SELECT * FROM contacts");
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

router.get("/contacts", async (req, res) => {
    try {
        const {
            results,
            page,
            order,
            direction,
            searchTerm,
            filters,
            relatedEvents,
            relatedNotes
        } = req.query;
        const relationships = {};

        if (relatedEvents) {
            relationships.events = relatedEvents.split(",");
        }
        if (relatedNotes) {
            relationships.notes = relatedNotes.split(",");
        }

        const filteredIds = Object.keys(relationships).length
            ? await getRelatedRecordIds("contact", relationships)
            : undefined;

        const payload = await getSubsetOfRecords("SELECT * FROM contacts", {
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

router.get("/contacts/:id", async (req, res) => {
    try {
        const row = await getRow("SELECT * FROM contacts WHERE id = ?", [req.params.id]);
        if (!row) {
            res.status(NOT_FOUND_CODE).json({ message: "No such contact" });
            return;
        }

        sendSuccess(res, row);
    } catch (err) {
        sendServerError(res, err);
    }
});

router.put("/contacts/:id", async (req, res) => {
    let createdImagePath = "";

    try {
        const existingContact = await getRow("SELECT * FROM contacts WHERE id = ?", [req.params.id]);
        if (!existingContact) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        const {
            contactValues,
            createdImagePath: nextCreatedImagePath,
            replacedImagePath
        } = buildContactValues(req.body, existingContact);
        createdImagePath = nextCreatedImagePath;

        const updateResult = await runStatement(
            `UPDATE contacts
            SET firstName = ?,
                lastName = ?,
                profilePicture = ?,
                phoneNumber = ?,
                email = ?,
                address = ?,
                firm = ?,
                industry = ?,
                dateOfBirth = ?,
                tags = ?,
                interactions = ?,
                bio = ?,
                createdBy = ?,
                createdOn = ?,
                lastModifiedBy = ?,
                lastModifiedOn = ?,
                lastInteractionId = ?,
                lastInteractionOn = ?,
                entityType = ?
            WHERE id = ?`,
            [
                contactValues.firstName,
                contactValues.lastName,
                contactValues.profilePicture,
                contactValues.phoneNumber,
                contactValues.email,
                contactValues.address,
                contactValues.firm,
                contactValues.industry,
                contactValues.dateOfBirth,
                contactValues.tags,
                contactValues.interactions,
                contactValues.bio,
                contactValues.createdBy,
                contactValues.createdOn,
                contactValues.lastModifiedBy,
                contactValues.lastModifiedOn,
                contactValues.lastInteractionId,
                contactValues.lastInteractionOn,
                contactValues.entityType,
                req.params.id
            ]
        );

        if (!updateResult.changes) {
            if (createdImagePath) {
                deleteStoredFile(createdImagePath);
            }
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        if (replacedImagePath) {
            deleteStoredFile(replacedImagePath);
        }

        const updatedContact = await getRow("SELECT * FROM contacts WHERE id = ?", [req.params.id]);
        sendSuccess(res, updatedContact);
    } catch (err) {
        if (createdImagePath) {
            deleteStoredFile(createdImagePath);
        }
        sendServerError(res, err);
    }
});

router.delete("/contacts/:id", async (req, res) => {
    try {
        const existingContact = await getRow("SELECT * FROM contacts WHERE id = ?", [req.params.id]);
        if (!existingContact) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        await cleanUpRelations("contact", req.params.id);

        const deleteResult = await runStatement("DELETE FROM contacts WHERE id = ?", [req.params.id]);
        if (!deleteResult.changes) {
            res.status(NOT_FOUND_CODE).json({ response: "NOT FOUND" });
            return;
        }

        if (existingContact.profilePicture) {
            deleteStoredFile(existingContact.profilePicture);
        }

        sendSuccess(res, { response: deleteResult });
    } catch (err) {
        sendServerError(res, err);
    }
});

module.exports = router;
