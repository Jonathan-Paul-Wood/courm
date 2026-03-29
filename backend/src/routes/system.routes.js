/*
 * Responsibility: expose system-level backend routes such as db initialization and shutdown.
 * Exports: an Express router mounted under /api.
 * Does not contain: resource CRUD logic.
 */
const express = require("express");

const { closeDb } = require("../db/connection");
const { initializeDb } = require("../db/schema");
const { sendServerError, sendSuccess } = require("../lib/responses");

const router = express.Router();

router.post("/initialize", async (_req, res) => {
    try {
        await initializeDb();
        sendSuccess(res, { message: "done" });
    } catch (err) {
        sendServerError(res, err);
    }
});

router.delete("/disconnect", async (_req, res) => {
    try {
        await closeDb();
        sendSuccess(res, { message: "database closed" });
    } catch (err) {
        sendServerError(res, err);
    }
});

module.exports = router;
