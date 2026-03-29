/*
 * Responsibility: manage storage directories and stored file paths.
 * Exports: directory creation, path normalization, and stored file deletion helpers.
 * Does not contain: route handlers, SQL, or domain-specific record shaping.
 */
const fs = require("fs");
const path = require("path");

const {
    APP_STORAGE_DIRECTORY,
    CONTACT_IMAGE_DIRECTORY,
    NOTE_MEDIA_DIRECTORIES,
    NOTE_STORAGE_DIRECTORY
} = require("../config/storage");

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function ensureStorageDirectories() {
    ensureDirectoryExists(APP_STORAGE_DIRECTORY);
    ensureDirectoryExists(NOTE_STORAGE_DIRECTORY);
    ensureDirectoryExists(CONTACT_IMAGE_DIRECTORY);
    Object.values(NOTE_MEDIA_DIRECTORIES).forEach(ensureDirectoryExists);
}

function normalizeStoredRelativePath(relativeFilePath) {
    return String(relativeFilePath || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function resolveStoredFilePath(relativeFilePath) {
    if (!relativeFilePath) {
        return null;
    }

    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath).replace(/[\\/]+/g, path.sep);
    const resolvedPath = path.resolve(APP_STORAGE_DIRECTORY, normalizedRelativePath);
    const expectedPrefix = `${APP_STORAGE_DIRECTORY}${path.sep}`;

    if (resolvedPath !== APP_STORAGE_DIRECTORY && !resolvedPath.startsWith(expectedPrefix)) {
        throw new Error("Invalid stored file path");
    }

    return resolvedPath;
}

/* Deleting stored files is intentionally tolerant so partial cleanup failures do not abort the API flow. */
function deleteStoredFile(relativeFilePath) {
    if (!relativeFilePath) {
        return;
    }

    try {
        const storedFilePath = resolveStoredFilePath(relativeFilePath);
        if (storedFilePath && fs.existsSync(storedFilePath)) {
            fs.unlinkSync(storedFilePath);
        }
    } catch (err) {
        console.error(`Failed to delete stored file ${relativeFilePath}: ${err.message}`);
    }
}

function deleteStoredFiles(relativeFilePaths = []) {
    relativeFilePaths.forEach(deleteStoredFile);
}

function getStoredFileExtension(fileName, mimeType) {
    const possibleExtension = path.extname(fileName || "").toLowerCase();

    if (possibleExtension) {
        return possibleExtension;
    }

    switch (mimeType) {
    case "image/jpeg":
        return ".jpg";
    case "image/png":
        return ".png";
    case "image/gif":
        return ".gif";
    case "image/webp":
        return ".webp";
    case "image/bmp":
        return ".bmp";
    case "audio/mpeg":
        return ".mp3";
    case "audio/mp4":
    case "audio/x-m4a":
        return ".m4a";
    case "audio/wav":
    case "audio/x-wav":
        return ".wav";
    case "audio/ogg":
        return ".ogg";
    case "audio/webm":
        return ".webm";
    case "video/mp4":
        return ".mp4";
    case "video/quicktime":
        return ".mov";
    case "video/webm":
        return ".webm";
    case "video/ogg":
        return ".ogv";
    default:
        return "";
    }
}

module.exports = {
    deleteStoredFile,
    deleteStoredFiles,
    ensureDirectoryExists,
    ensureStorageDirectories,
    getStoredFileExtension,
    normalizeStoredRelativePath,
    resolveStoredFilePath
};
