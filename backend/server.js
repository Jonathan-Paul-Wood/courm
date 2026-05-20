const { startServer } = require("./src/startServer");

const serverPromise = startServer()
    .then(({ app: startedApp, url }) => {
        console.log(`Server is running at ${url}/`);
        return startedApp;
    })
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
        throw err;
    });

module.exports = serverPromise;
