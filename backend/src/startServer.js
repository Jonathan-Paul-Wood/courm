const { createApp } = require("./app");
const { initializeDb } = require("./db/schema");

function buildServerUrl(server, requestedHost) {
    const address = server.address();
    const hostname = !requestedHost || requestedHost === "0.0.0.0" || requestedHost === "::"
        ? "localhost"
        : requestedHost;

    if (!address || typeof address === "string") {
        return `http://${hostname}`;
    }

    return `http://${hostname}:${address.port}`;
}

async function startServer(options = {}) {
    const {
        host,
        initializeDatabase = true,
        port = process.env.PORT || 8080
    } = options;

    if (initializeDatabase) {
        await initializeDb();
    }

    const app = createApp();
    const server = await new Promise((resolve, reject) => {
        const nextServer = app.listen(port, host, () => resolve(nextServer));
        nextServer.on("error", reject);
    });

    return {
        app,
        close: () => new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        }),
        port: typeof server.address() === "object" ? server.address().port : port,
        server,
        url: buildServerUrl(server, host)
    };
}

module.exports = {
    startServer
};
