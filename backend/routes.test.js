const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

let server;
let baseUrl;
let closeDb;
let tempRoot;

function clearBackendModuleCache() {
    Object.keys(require.cache).forEach((cacheKey) => {
        if (cacheKey.includes(`${path.sep}backend${path.sep}src${path.sep}`)) {
            delete require.cache[cacheKey];
        }
    });
}

async function requestJson(routePath, options = {}) {
    const headers = { ...(options.headers || {}) };
    let body = options.body;

    if (body && typeof body === "object" && !Buffer.isBuffer(body)) {
        headers["content-type"] = headers["content-type"] || "application/json";
        body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${routePath}`, {
        ...options,
        headers,
        body
    });
    const text = await response.text();

    return {
        response,
        data: text ? JSON.parse(text) : null
    };
}

test.before(async () => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "courm-backend-"));
    process.env.DB_PATH = path.join(tempRoot, "test.db");
    process.env.APP_STORAGE_DIRECTORY = path.join(tempRoot, "storage");

    clearBackendModuleCache();

    const { createApp } = require("./src/app");
    ({ closeDb } = require("./src/db/connection"));

    const app = createApp();
    server = await new Promise((resolve) => {
        const nextServer = app.listen(0, () => resolve(nextServer));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/api`;

    const initializeResponse = await requestJson("/initialize", {
        method: "POST"
    });
    assert.equal(initializeResponse.response.status, 200);
});

test.after(async () => {
    if (closeDb) {
        await closeDb();
    }

    if (server) {
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    delete process.env.DB_PATH;
    delete process.env.APP_STORAGE_DIRECTORY;

    if (tempRoot) {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    }
});

test("notes routes support create, update, and delete", async () => {
    const created = await requestJson("/notes/new", {
        method: "POST",
        body: {
            date: "2026-03-29",
            title: "Initial Note",
            record: "Body"
        }
    });

    assert.equal(created.response.status, 200);
    assert.ok(created.data.id);
    assert.deepEqual(created.data.mediaFiles, []);

    const updated = await requestJson(`/notes/${created.data.id}`, {
        method: "PUT",
        body: {
            date: "2026-03-29",
            title: "Updated Note",
            record: "Updated body",
            lastModifiedOn: "2026-03-29T01:00:00.000Z"
        }
    });

    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.title, "Updated Note");

    const deleted = await requestJson(`/notes/${created.data.id}`, {
        method: "DELETE"
    });

    assert.equal(deleted.response.status, 200);
    assert.equal(deleted.data.response.changes, 1);
});

test("contacts routes support create, update, and delete", async () => {
    const created = await requestJson("/contacts/new", {
        method: "POST",
        body: {
            firstName: "Ada",
            lastName: "Lovelace",
            createdOn: "2026-03-29T00:00:00.000Z",
            lastInteractionOn: "2026-03-29T00:00:00.000Z"
        }
    });

    assert.equal(created.response.status, 200);
    assert.ok(created.data.id);

    const updated = await requestJson(`/contacts/${created.data.id}`, {
        method: "PUT",
        body: {
            firstName: "Ada",
            lastName: "Byron",
            createdOn: created.data.createdOn,
            lastInteractionOn: "2026-03-29T00:00:00.000Z"
        }
    });

    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.lastName, "Byron");

    const deleted = await requestJson(`/contacts/${created.data.id}`, {
        method: "DELETE"
    });

    assert.equal(deleted.response.status, 200);
    assert.equal(deleted.data.response.changes, 1);
});

test("events routes support create, update, and delete", async () => {
    const created = await requestJson("/events/new", {
        method: "POST",
        body: {
            date: "2026-03-29",
            title: "Launch Event",
            description: "Original description",
            address: "123 Main St"
        }
    });

    assert.equal(created.response.status, 200);
    assert.ok(created.data.newId);

    const updated = await requestJson(`/events/${created.data.newId}`, {
        method: "PUT",
        body: {
            title: "Updated Launch Event",
            lastModifiedOn: "2026-03-29T02:00:00.000Z"
        }
    });

    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.response.changes, 1);

    const deleted = await requestJson(`/events/${created.data.newId}`, {
        method: "DELETE"
    });

    assert.equal(deleted.response.status, 200);
    assert.equal(deleted.data.response.changes, 1);
});
