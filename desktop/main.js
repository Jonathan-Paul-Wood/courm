const fs = require("fs");
const path = require("path");

const { app, BrowserWindow, dialog } = require("electron");

let backendHandle = null;
let mainWindow = null;

function resolveFrontendBuildDirectory() {
    return path.resolve(__dirname, "..", "ui", "build");
}

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function resolveBackendDataDirectory() {
    const configuredDataDirectory = process.env.COURM_DATA_DIR;
    if (configuredDataDirectory) {
        return path.resolve(configuredDataDirectory);
    }

    if (app.isPackaged) {
        return path.join(app.getPath("userData"), "data");
    }

    return path.resolve(__dirname, "..", "backend");
}

function configureRuntimeEnvironment() {
    const backendDataDirectory = resolveBackendDataDirectory();
    const backendStorageDirectory = path.join(backendDataDirectory, "storage");

    ensureDirectoryExists(backendDataDirectory);
    ensureDirectoryExists(backendStorageDirectory);

    process.env.DB_PATH = path.join(backendDataDirectory, "main.db");
    process.env.APP_STORAGE_DIRECTORY = backendStorageDirectory;
    process.env.FRONTEND_BUILD_DIRECTORY = resolveFrontendBuildDirectory();
}

async function closeBackendServer() {
    if (!backendHandle) {
        return;
    }

    const { close } = backendHandle;
    backendHandle = null;

    if (close) {
        await close();
    }
}

async function ensureBackendServer() {
    if (backendHandle) {
        return backendHandle;
    }

    const frontendBuildDirectory = resolveFrontendBuildDirectory();

    if (!fs.existsSync(path.join(frontendBuildDirectory, "index.html"))) {
        throw new Error("The desktop UI build was not found. Run `npm run build:ui` before starting the desktop app.");
    }

    configureRuntimeEnvironment();

    const { startServer } = require(path.resolve(__dirname, "..", "backend", "src", "startServer"));
    backendHandle = await startServer({
        host: "127.0.0.1",
        port: 0
    });

    return backendHandle;
}

async function createMainWindow() {
    const activeBackendHandle = await ensureBackendServer();

    mainWindow = new BrowserWindow({
        height: 900,
        minHeight: 720,
        minWidth: 1080,
        show: false,
        title: "CouRM",
        width: 1440,
        webPreferences: {
            contextIsolation: true,
            sandbox: true
        }
    });

    mainWindow.removeMenu();
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    await mainWindow.loadURL(activeBackendHandle.url);
}

async function launchApplication() {
    try {
        await createMainWindow();
    } catch (err) {
        await dialog.showMessageBox({
            buttons: ["Close"],
            detail: err.stack || "",
            message: err.message,
            title: "CouRM could not start",
            type: "error"
        });

        await closeBackendServer();
        app.quit();
    }
}

app.whenReady().then(launchApplication);

app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await launchApplication();
    }
});

app.on("before-quit", async () => {
    await closeBackendServer();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
