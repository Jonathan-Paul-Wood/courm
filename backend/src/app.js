/*
 * Responsibility: assemble the Express app with middleware, storage setup, and routes.
 * Exports: createApp.
 * Does not contain: listen() calls or resource-specific business logic.
 */
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const { DEFAULT_CORS_ORIGIN } = require("./config/constants");
const { APP_STORAGE_DIRECTORY } = require("./config/storage");
const { ensureStorageDirectories } = require("./lib/files");
const registerRoutes = require("./routes");

function createApp() {
    const app = express();
    const frontendBuildDirectory = process.env.FRONTEND_BUILD_DIRECTORY
        ? path.resolve(process.env.FRONTEND_BUILD_DIRECTORY)
        : null;
    const frontendIndexPath = frontendBuildDirectory
        ? path.join(frontendBuildDirectory, "index.html")
        : null;
    const shouldServeFrontend = Boolean(frontendIndexPath && fs.existsSync(frontendIndexPath));

    app.use(cors({
        origin: DEFAULT_CORS_ORIGIN
    }));
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

    ensureStorageDirectories();
    app.use("/api/files", express.static(APP_STORAGE_DIRECTORY));

    registerRoutes(app);

    if (shouldServeFrontend) {
        app.use(express.static(frontendBuildDirectory));
        app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
            res.sendFile(frontendIndexPath);
        });
    }

    return app;
}

module.exports = {
    createApp
};
