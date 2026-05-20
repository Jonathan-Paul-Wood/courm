/*
 * Responsibility: centralize route registration for the backend app.
 * Exports: a function that mounts all /api routers on an Express app.
 * Does not contain: route implementation details.
 */
const contactsRoutes = require("./contacts.routes");
const eventsRoutes = require("./events.routes");
const notesRoutes = require("./notes.routes");
const recordsRoutes = require("./records.routes");
const relationsRoutes = require("./relations.routes");
const systemRoutes = require("./system.routes");

function registerRoutes(app) {
    app.use("/api", systemRoutes);
    app.use("/api", notesRoutes);
    app.use("/api", contactsRoutes);
    app.use("/api", eventsRoutes);
    app.use("/api", relationsRoutes);
    app.use("/api", recordsRoutes);
}

module.exports = registerRoutes;
