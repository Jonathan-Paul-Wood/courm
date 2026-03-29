/*
 * Responsibility: own note media normalization, legacy migration, and note value building.
 * Exports: note media helpers plus buildNoteValues and normalizeNoteRecord.
 * Does not contain: SQL execution or Express request/response handling.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
    MAX_NOTE_MEDIA_BYTES,
    SUPPORTED_NOTE_MEDIA_TYPES
} = require("../config/constants");
const {
    NOTE_MEDIA_DIRECTORIES,
    NOTE_MEDIA_DIRECTORY_NAMES
} = require("../config/storage");
const {
    deleteStoredFiles,
    ensureDirectoryExists,
    getStoredFileExtension,
    normalizeStoredRelativePath,
    resolveStoredFilePath
} = require("../lib/files");

function isSupportedNoteMediaType(mediaType) {
    return SUPPORTED_NOTE_MEDIA_TYPES.includes(mediaType);
}

function normalizeNoteMediaType(mediaType, mimeType = "", relativeFilePath = "") {
    if (isSupportedNoteMediaType(mediaType)) {
        return mediaType;
    }

    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("audio/")) {
        return "audio";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath).toLowerCase();
    if (normalizedRelativePath.startsWith("note/images/") || normalizedRelativePath.startsWith("note-images/")) {
        return "image";
    }
    if (normalizedRelativePath.startsWith("note/audio/")) {
        return "audio";
    }
    if (normalizedRelativePath.startsWith("note/video/")) {
        return "video";
    }

    return "";
}

function sanitizeMediaName(name, fallbackValue = "") {
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (trimmedName) {
        return trimmedName;
    }

    const fallbackName = path.posix.basename(normalizeStoredRelativePath(fallbackValue));
    return fallbackName || "Untitled file";
}

function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function createMediaFile(mediaFile) {
    if (!mediaFile) {
        return null;
    }

    const normalizedPath = normalizeStoredRelativePath(mediaFile.path);
    const mediaType = normalizeNoteMediaType(mediaFile.type, "", normalizedPath);

    if (!normalizedPath || !mediaType) {
        return null;
    }

    return {
        path: normalizedPath,
        type: mediaType,
        name: sanitizeMediaName(mediaFile.name, normalizedPath),
        id: isUuid(mediaFile.id) ? mediaFile.id : crypto.randomUUID()
    };
}

function parseNoteMediaFiles(value) {
    if (!value) {
        return [];
    }

    let parsedValue = value;
    if (typeof parsedValue === "string") {
        if (!parsedValue.trim()) {
            return [];
        }

        try {
            parsedValue = JSON.parse(parsedValue);
        } catch (_err) {
            return [];
        }
    }

    if (parsedValue && !Array.isArray(parsedValue) && Array.isArray(parsedValue.files)) {
        parsedValue = parsedValue.files;
    }

    if (!Array.isArray(parsedValue)) {
        return [];
    }

    return parsedValue
        .map(createMediaFile)
        .filter(Boolean);
}

function dedupeNoteMediaFiles(mediaFiles) {
    const mediaFileMap = new Map();

    mediaFiles.forEach((mediaFile) => {
        const normalizedMediaFile = createMediaFile(mediaFile);
        if (!normalizedMediaFile) {
            return;
        }

        const mapKey = normalizedMediaFile.id || normalizedMediaFile.path;
        mediaFileMap.set(mapKey, normalizedMediaFile);
    });

    return Array.from(mediaFileMap.values());
}

function serializeNoteMediaFiles(mediaFiles) {
    return JSON.stringify(dedupeNoteMediaFiles(mediaFiles));
}

/* Legacy image-only notes are migrated lazily so existing installs keep working without a one-time manual step. */
function migrateLegacyNoteMediaPath(relativeFilePath) {
    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath);

    if (!normalizedRelativePath.toLowerCase().startsWith("note-images/")) {
        return normalizedRelativePath;
    }

    const migratedRelativePath = path.posix.join("note", "images", path.posix.basename(normalizedRelativePath));

    try {
        const legacyStoredFilePath = resolveStoredFilePath(normalizedRelativePath);
        const migratedStoredFilePath = resolveStoredFilePath(migratedRelativePath);

        ensureDirectoryExists(path.dirname(migratedStoredFilePath));
        if (
            legacyStoredFilePath &&
            migratedStoredFilePath &&
            fs.existsSync(legacyStoredFilePath) &&
            !fs.existsSync(migratedStoredFilePath)
        ) {
            fs.renameSync(legacyStoredFilePath, migratedStoredFilePath);
        }
    } catch (err) {
        console.error(`Failed to migrate legacy note media ${relativeFilePath}: ${err.message}`);
    }

    return migratedRelativePath;
}

function buildLegacyNoteMediaFiles(imagePath) {
    if (!imagePath) {
        return [];
    }

    const migratedRelativePath = migrateLegacyNoteMediaPath(imagePath);
    const mediaFile = createMediaFile({
        path: migratedRelativePath,
        type: "image",
        name: path.posix.basename(migratedRelativePath)
    });

    return mediaFile ? [mediaFile] : [];
}

function saveNoteMediaFile(mediaUpload) {
    if (!mediaUpload || !mediaUpload.dataUrl) {
        return null;
    }

    const dataUrlMatch = mediaUpload.dataUrl.match(/^data:(.+);base64,(.+)$/);

    if (!dataUrlMatch) {
        throw new Error("Invalid media upload payload");
    }

    const mimeType = dataUrlMatch[1];
    const mediaType = normalizeNoteMediaType(mediaUpload.type, mimeType);

    if (!mediaType) {
        throw new Error("Only image, audio, and video uploads are supported");
    }

    const mediaBuffer = Buffer.from(dataUrlMatch[2], "base64");
    const maxMediaBytes = MAX_NOTE_MEDIA_BYTES[mediaType];
    if (mediaBuffer.length > maxMediaBytes) {
        throw new Error(`${mediaType} files must be ${Math.floor(maxMediaBytes / (1024 * 1024))}MB or smaller`);
    }

    const originalFileName = mediaUpload.fileName || mediaUpload.name || "";
    const fileExtension = getStoredFileExtension(originalFileName, mimeType);
    const generatedFileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${fileExtension}`;
    const relativeFilePath = path.posix.join("note", NOTE_MEDIA_DIRECTORY_NAMES[mediaType], generatedFileName);
    const storedFilePath = resolveStoredFilePath(relativeFilePath);

    ensureDirectoryExists(NOTE_MEDIA_DIRECTORIES[mediaType]);
    fs.writeFileSync(storedFilePath, mediaBuffer);

    return createMediaFile({
        id: mediaUpload.id,
        path: relativeFilePath,
        type: mediaType,
        name: sanitizeMediaName(mediaUpload.name, originalFileName || generatedFileName)
    });
}

function normalizeNoteRecord(note) {
    if (!note) {
        return note;
    }

    const normalizedNote = { ...note };
    const parsedMediaFiles = parseNoteMediaFiles(normalizedNote.mediaFiles);

    normalizedNote.mediaFiles = parsedMediaFiles.length
        ? parsedMediaFiles
        : buildLegacyNoteMediaFiles(normalizedNote.imagePath);

    delete normalizedNote.imagePath;

    return normalizedNote;
}

/* buildNoteValues centralizes note payload shaping so routes only orchestrate persistence and cleanup. */
function buildNoteValues(body, existingNote) {
    const normalizedExistingNote = normalizeNoteRecord(existingNote);
    const existingMediaFiles = normalizedExistingNote ? normalizedExistingNote.mediaFiles : [];
    const hasExplicitMediaFiles = Object.prototype.hasOwnProperty.call(body, "mediaFiles");
    const removeLegacyImage = body.removeImage === true || body.removeImage === "true";
    let requestedMediaFiles = existingMediaFiles;

    if (hasExplicitMediaFiles) {
        requestedMediaFiles = parseNoteMediaFiles(body.mediaFiles);
    } else if (typeof body.imagePath === "string") {
        requestedMediaFiles = buildLegacyNoteMediaFiles(body.imagePath);
    } else if (removeLegacyImage) {
        requestedMediaFiles = [];
    }

    const uploadPayloads = Array.isArray(body.mediaUploads)
        ? body.mediaUploads
        : (body.imageUpload ? [{ ...body.imageUpload, type: "image" }] : []);
    const createdMediaFiles = uploadPayloads
        .map(saveNoteMediaFile)
        .filter(Boolean);
    const finalMediaFiles = dedupeNoteMediaFiles([...requestedMediaFiles, ...createdMediaFiles]);
    const deletedMediaPaths = existingMediaFiles
        .filter((existingMediaFile) => {
            return !finalMediaFiles.some((mediaFile) => {
                return mediaFile.id === existingMediaFile.id || mediaFile.path === existingMediaFile.path;
            });
        })
        .map((mediaFile) => mediaFile.path)
        .filter(Boolean);

    return {
        noteValues: {
            date: body.date || "",
            title: body.title || "",
            record: body.record || "",
            address: body.address || "",
            contacts: body.contacts || "",
            tags: body.tags || "",
            mediaFiles: serializeNoteMediaFiles(finalMediaFiles),
            lastModifiedOn: body.lastModifiedOn || null
        },
        createdMediaPaths: createdMediaFiles.map((mediaFile) => mediaFile.path),
        deletedMediaPaths
    };
}

module.exports = {
    buildLegacyNoteMediaFiles,
    buildNoteValues,
    createMediaFile,
    dedupeNoteMediaFiles,
    deleteStoredFiles,
    migrateLegacyNoteMediaPath,
    normalizeNoteMediaType,
    normalizeNoteRecord,
    parseNoteMediaFiles,
    saveNoteMediaFile,
    serializeNoteMediaFiles
};
