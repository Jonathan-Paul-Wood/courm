const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('main.db', (err) => {
    if(err) {
        console.error(err.message);
    }
}); //TODO: run such that it won't stop program on ERRORs (set .bail to OFF), otherwise bugs force users to restart program...
//TODO: someway to save DB backup on either user input or on application close
const app = express();
const ERROR_CODE = 500;
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;
const APP_STORAGE_DIRECTORY = path.resolve(process.cwd(), 'storage');
const NOTE_STORAGE_DIRECTORY = path.join(APP_STORAGE_DIRECTORY, 'note');
const NOTE_MEDIA_DIRECTORIES = {
    image: path.join(NOTE_STORAGE_DIRECTORY, 'images'),
    audio: path.join(NOTE_STORAGE_DIRECTORY, 'audio'),
    video: path.join(NOTE_STORAGE_DIRECTORY, 'video')
};
const NOTE_MEDIA_DIRECTORY_NAMES = {
    image: 'images',
    audio: 'audio',
    video: 'video'
};
const MAX_NOTE_MEDIA_BYTES = {
    image: 10 * 1024 * 1024,
    audio: 25 * 1024 * 1024,
    video: 50 * 1024 * 1024
};
const SUPPORTED_NOTE_MEDIA_TYPES = ['audio', 'image', 'video'];

var corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '100mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

ensureDirectoryExists(APP_STORAGE_DIRECTORY);
ensureDirectoryExists(NOTE_STORAGE_DIRECTORY);
Object.values(NOTE_MEDIA_DIRECTORIES).forEach(ensureDirectoryExists);
app.use('/api/files', express.static(APP_STORAGE_DIRECTORY));

// parse requests of content-type - text/
//app.use(bodyParser.text());


// If running in production mode enter here
// const breadcrumbtrail = path.join(__dirname, 'build/');
// app.use('/', express.static(breadcrumbtrail));
// app.get('/', function(req, res) {
//     res.sendFile(path.join(breadcrumbtrail, 'index.html'));
// });

async function initializeDB() {
    await runStatement(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT,
        profilePicture TEXT,
        phoneNumber TEXT,
        email TEXT,
        address TEXT,
        firm TEXT,
        industry TEXT,
        dateOfBirth TEXT,
        tags TEXT,
        interactions TEXT,
        bio TEXT,
        createdBy TEXT,
        createdOn TEXT NOT NULL,
        lastModifiedBy TEXT,
        lastModifiedOn TEXT,
        lastInteractionId TEXT,
        lastInteractionOn TEXT NOT NULL,
        entityType TEXT NOT NULL
        );`);

    await runStatement(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date datetime NOT NULL,
        title TEXT,
        record TEXT,
        address TEXT,
        contacts TEXT,
        tags TEXT,
        mediaFiles JSONB,
        createdOn datetime default current_timestamp,
        lastModifiedOn datetime default current_timestamp
        );
    `);

    await migrateNotesTableSchema();

    await runStatement(`
    CREATE TABLE IF NOT EXISTS relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contactId INTEGER DEFAULT NULL,
        noteId INTEGER DEFAULT NULL,
        eventId INTEGER DEFAULT NULL,
        createdOn datetime default current_timestamp,
        lastModifiedOn datetime default current_timestamp
        );
    `);

    await runStatement(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date datetime NOT NULL,
        title TEXT,
        description TEXT,
        address TEXT,
        createdOn datetime default current_timestamp,
        lastModifiedOn datetime default current_timestamp
        );
    `);
} //TODO: delete interactions from contacts, delete contacts from notes, delete tags from all (maybe tags in new table like relations)

function closeDB() { 
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

function cleanseString(str) {
    return str.replace(/'/g, "''");
}

function confirmInt(value) {
    return Number.isSafeInteger(value) ? value : null;
}

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function addColumnIfMissing(tableName, columnDefinition) {
    db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error(err.message);
        }
    });
}

function runStatement(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

function getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function getAllRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function normalizeStoredRelativePath(relativeFilePath) {
    return String(relativeFilePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function isSupportedNoteMediaType(mediaType) {
    return SUPPORTED_NOTE_MEDIA_TYPES.includes(mediaType);
}

function normalizeNoteMediaType(mediaType, mimeType = '', relativeFilePath = '') {
    if (isSupportedNoteMediaType(mediaType)) {
        return mediaType;
    }

    if (mimeType.startsWith('image/')) {
        return 'image';
    }

    if (mimeType.startsWith('audio/')) {
        return 'audio';
    }

    if (mimeType.startsWith('video/')) {
        return 'video';
    }

    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath).toLowerCase();
    if (normalizedRelativePath.startsWith('note/images/') || normalizedRelativePath.startsWith('note-images/')) {
        return 'image';
    }
    if (normalizedRelativePath.startsWith('note/audio/')) {
        return 'audio';
    }
    if (normalizedRelativePath.startsWith('note/video/')) {
        return 'video';
    }

    return '';
}

function getStoredFileExtension(fileName, mimeType) {
    const possibleExtension = path.extname(fileName || '').toLowerCase();

    if (possibleExtension) {
        return possibleExtension;
    }

    switch (mimeType) {
    case 'image/jpeg':
        return '.jpg';
    case 'image/png':
        return '.png';
    case 'image/gif':
        return '.gif';
    case 'image/webp':
        return '.webp';
    case 'image/bmp':
        return '.bmp';
    case 'audio/mpeg':
        return '.mp3';
    case 'audio/mp4':
    case 'audio/x-m4a':
        return '.m4a';
    case 'audio/wav':
    case 'audio/x-wav':
        return '.wav';
    case 'audio/ogg':
        return '.ogg';
    case 'audio/webm':
        return '.webm';
    case 'video/mp4':
        return '.mp4';
    case 'video/quicktime':
        return '.mov';
    case 'video/webm':
        return '.webm';
    case 'video/ogg':
        return '.ogv';
    default:
        return '';
    }
}

function sanitizeMediaName(name, fallbackValue = '') {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (trimmedName) {
        return trimmedName;
    }

    const fallbackName = path.posix.basename(normalizeStoredRelativePath(fallbackValue));
    return fallbackName || 'Untitled file';
}

function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function createMediaFile(mediaFile) {
    if (!mediaFile) {
        return null;
    }

    const normalizedPath = normalizeStoredRelativePath(mediaFile.path);
    const mediaType = normalizeNoteMediaType(mediaFile.type, '', normalizedPath);

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
    if (typeof parsedValue === 'string') {
        if (!parsedValue.trim()) {
            return [];
        }

        try {
            parsedValue = JSON.parse(parsedValue);
        } catch (err) {
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

function migrateLegacyNoteMediaPath(relativeFilePath) {
    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath);

    if (!normalizedRelativePath.toLowerCase().startsWith('note-images/')) {
        return normalizedRelativePath;
    }

    const migratedRelativePath = path.posix.join('note', 'images', path.posix.basename(normalizedRelativePath));

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
        type: 'image',
        name: path.posix.basename(migratedRelativePath)
    });

    return mediaFile ? [mediaFile] : [];
}

function resolveStoredFilePath(relativeFilePath) {
    if (!relativeFilePath) {
        return null;
    }

    const normalizedRelativePath = normalizeStoredRelativePath(relativeFilePath).replace(/[\\/]+/g, path.sep);
    const resolvedPath = path.resolve(APP_STORAGE_DIRECTORY, normalizedRelativePath);
    const expectedPrefix = `${APP_STORAGE_DIRECTORY}${path.sep}`;

    if (resolvedPath !== APP_STORAGE_DIRECTORY && !resolvedPath.startsWith(expectedPrefix)) {
        throw new Error('Invalid stored file path');
    }

    return resolvedPath;
}

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

function saveNoteMediaFile(mediaUpload) {
    if (!mediaUpload || !mediaUpload.dataUrl) {
        return null;
    }

    const dataUrlMatch = mediaUpload.dataUrl.match(/^data:(.+);base64,(.+)$/);

    if (!dataUrlMatch) {
        throw new Error('Invalid media upload payload');
    }

    const mimeType = dataUrlMatch[1];
    const mediaType = normalizeNoteMediaType(mediaUpload.type, mimeType);

    if (!mediaType) {
        throw new Error('Only image, audio, and video uploads are supported');
    }

    const mediaBuffer = Buffer.from(dataUrlMatch[2], 'base64');
    const maxMediaBytes = MAX_NOTE_MEDIA_BYTES[mediaType];
    if (mediaBuffer.length > maxMediaBytes) {
        throw new Error(`${mediaType} files must be ${Math.floor(maxMediaBytes / (1024 * 1024))}MB or smaller`);
    }

    const originalFileName = mediaUpload.fileName || mediaUpload.name || '';
    const fileExtension = getStoredFileExtension(originalFileName, mimeType);
    const generatedFileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${fileExtension}`;
    const relativeFilePath = path.posix.join('note', NOTE_MEDIA_DIRECTORY_NAMES[mediaType], generatedFileName);
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

async function migrateNotesTableSchema() {
    const noteTableColumns = await getAllRows(`PRAGMA table_info(notes)`);
    const hasImagePath = noteTableColumns.some((column) => column.name === 'imagePath');
    const hasMediaFiles = noteTableColumns.some((column) => column.name === 'mediaFiles');

    if (!hasMediaFiles && !hasImagePath) {
        await runStatement(`ALTER TABLE notes ADD COLUMN mediaFiles JSONB`);
        await runStatement(`UPDATE notes SET mediaFiles = ? WHERE mediaFiles IS NULL`, [serializeNoteMediaFiles([])]);
        return;
    }

    if (hasMediaFiles && !hasImagePath) {
        const notes = await getAllRows(`SELECT id, mediaFiles FROM notes`);
        for (const note of notes) {
            await runStatement(`UPDATE notes SET mediaFiles = ? WHERE id = ?`, [
                serializeNoteMediaFiles(parseNoteMediaFiles(note.mediaFiles)),
                note.id
            ]);
        }
        return;
    }

    await runStatement(`ALTER TABLE notes RENAME TO notes_legacy_migration`);
    await runStatement(`
    CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date datetime NOT NULL,
        title TEXT,
        record TEXT,
        address TEXT,
        contacts TEXT,
        tags TEXT,
        mediaFiles JSONB,
        createdOn datetime default current_timestamp,
        lastModifiedOn datetime default current_timestamp
        );
    `);

    const legacyNotes = await getAllRows(`SELECT * FROM notes_legacy_migration`);
    for (const legacyNote of legacyNotes) {
        const migratedMediaFiles = parseNoteMediaFiles(legacyNote.mediaFiles).length
            ? parseNoteMediaFiles(legacyNote.mediaFiles)
            : buildLegacyNoteMediaFiles(legacyNote.imagePath);

        await runStatement(
            `INSERT INTO notes(
                id,
                date,
                title,
                record,
                address,
                contacts,
                tags,
                mediaFiles,
                createdOn,
                lastModifiedOn
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                legacyNote.id,
                legacyNote.date,
                legacyNote.title,
                legacyNote.record,
                legacyNote.address,
                legacyNote.contacts,
                legacyNote.tags,
                serializeNoteMediaFiles(migratedMediaFiles),
                legacyNote.createdOn,
                legacyNote.lastModifiedOn
            ]
        );
    }

    await runStatement(`DROP TABLE notes_legacy_migration`);
}

function buildNoteValues(body, existingNote) {
    const normalizedExistingNote = normalizeNoteRecord(existingNote);
    const existingMediaFiles = normalizedExistingNote ? normalizedExistingNote.mediaFiles : [];
    const hasExplicitMediaFiles = Object.prototype.hasOwnProperty.call(body, 'mediaFiles');
    const removeLegacyImage = body.removeImage === true || body.removeImage === 'true';
    let requestedMediaFiles = existingMediaFiles;

    if (hasExplicitMediaFiles) {
        requestedMediaFiles = parseNoteMediaFiles(body.mediaFiles);
    } else if (typeof body.imagePath === 'string') {
        requestedMediaFiles = buildLegacyNoteMediaFiles(body.imagePath);
    } else if (removeLegacyImage) {
        requestedMediaFiles = [];
    }

    const uploadPayloads = Array.isArray(body.mediaUploads)
        ? body.mediaUploads
        : (body.imageUpload ? [{ ...body.imageUpload, type: 'image' }] : []);
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
            date: body.date || '',
            title: body.title || '',
            record: body.record || '',
            address: body.address || '',
            contacts: body.contacts || '',
            tags: body.tags || '',
            mediaFiles: serializeNoteMediaFiles(finalMediaFiles),
            lastModifiedOn: body.lastModifiedOn || null
        },
        createdMediaPaths: createdMediaFiles.map((mediaFile) => mediaFile.path),
        deletedMediaPaths
    };
}

app.post("/api/initialize", async (req, res) => {
    try {
        await initializeDB();
        res.json({message: 'done'});
    } catch (err) {
        res.status(ERROR_CODE).json({ message: err.message });
    }
});

app.delete("/api/disconnect", (req, res) => {
    const response = closeDB();
    res.json({message: 'database closed'})
});

// NOTES APIS

app.post('/api/notes/new', async (req, res) => {
    let createdMediaPaths = [];

    try {
        const { noteValues, createdMediaPaths: nextCreatedMediaPaths } = buildNoteValues(req.body);
        createdMediaPaths = nextCreatedMediaPaths;

        const insertResult = await runStatement(
            `INSERT INTO notes(
                date,
                title,
                record,
                address,
                contacts,
                tags,
                mediaFiles
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                noteValues.date,
                noteValues.title,
                noteValues.record,
                noteValues.address,
                noteValues.contacts,
                noteValues.tags,
                noteValues.mediaFiles
            ]
        );

        const newNote = await getRow(`SELECT * FROM notes WHERE id = ?`, [insertResult.lastID]);
        res.status(SUCCESS_CODE).json(normalizeNoteRecord(newNote));
    } catch (err) {
        if (createdMediaPaths.length) {
            deleteStoredFiles(createdMediaPaths);
        }
        res.status(ERROR_CODE).json({ message: err.message });
    }
});

app.get('/api/notes/all', (req, res) => {
    const sql = `SELECT * FROM notes`;
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!rows) {
            res.status(NOT_FOUND_CODE).send({message: 'Failed to get all notes'});
        } else {
            res.status(SUCCESS_CODE);
            const resultCount = rows.length;
            res.json({
                results: rows.map(normalizeNoteRecord),
                resultCount: resultCount,
                pageSize: resultCount,
                totalCount: resultCount,
                pageCount: 1,
                currentPage: 1,
            });
        }
    });
});

//accepts requests of the form: /api/notes?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
app.get("/api/notes", (req, res) => {
    const { results, page, order, direction, searchTerm, filters, relatedContacts, relatedEvents } = req.query;
    const relationships = {};
    if (relatedContacts) {
        relationships.contacts = relatedContacts.split(',');
    }
    if (relatedEvents) {
        relationships.events = relatedEvents.split(',');
    }

    let sqlPre = `SELECT * FROM relations LEFT JOIN notes ON relations.noteId = notes.id`;

    db.all(sqlPre, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            const relatedRecordMap = new Map();

            // create map where each record id has an object of their existing relationships
            rows.forEach((row) => {
                if (row.id) {
                    if (!relatedRecordMap.get(row.id)) {
                        relatedRecordMap.set(row.id, {
                            contacts: [],
                            events: [],
                            notes: []
                        });
                    }
                    const thisRecordEntry = relatedRecordMap.get(row.id);
                    if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            contacts: [...thisRecordEntry.contacts, row.contactId]
                        });
                    }
                    if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                        const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                        relatedRecordMap.set(row.id, {
                            ...possiblyUpdatedRecord,
                            events: [...possiblyUpdatedRecord.events, row.eventId]
                        });
                    }
                    if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                        const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                        relatedRecordMap.set(row.id, {
                            ...possiblyUpdatedRecord,
                            notes: [...possiblyUpdatedRecord.notes, row.noteId]
                        });
                    }
                }
            });

            // filter for just the record ids with the expected relations
            const filteredIds = [];
            const mapKeys = relatedRecordMap.keys();
            let nextMapKey = mapKeys.next();
            while (nextMapKey.done === false) {
                const key = nextMapKey.value;
                const recordRelations = relatedRecordMap.get(key);
                const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                    return relationships[recordIdType].every((id) => {
                        return recordRelations[recordIdType].find(i => i === parseInt(id));
                    });
                });
                if (hasAllExpectedRelations) {
                    filteredIds.push(key);
                }

                nextMapKey = mapKeys.next();
            }

            let sql = `SELECT * FROM notes`;

            //apply search
            if(searchTerm && filters) {
                const searchFilters = filters.split(',');
                sql = sql + ` WHERE ${searchFilters[0]} LIKE '%${searchTerm}%'`;
                searchFilters.forEach((filter, index) => {
                    if(index) {
                        sql = sql + ` OR ${filter} LIKE '%${searchTerm}%'`;
                    }
                });
                sql = sql+` AND id IN (${filteredIds})`;
            } else {
                sql = sql+` WHERE id IN (${filteredIds})`;
            }

            const sql_metadata = sql;
            //apply sort order and pagination
            sql = sql+` ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page - 1})* ${results})`;

            db.all(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(ERROR_CODE);
                    res.json(err);
                } else if (!rows) {
                    res.status(NOT_FOUND_CODE);
                    res.json({message: 'NOT FOUND'});
                } else {
                    db.all(sql_metadata, (err, result) => {
                        if (err) {
                            res.status(ERROR_CODE);
                            return console.error(err.message);
                        } else if (!result) {
                            res.status(NOT_FOUND_CODE);
                            return;
                        } else {
                            totalResults = result.length;
                            res.json({
                                results: rows.map(normalizeNoteRecord),
                                resultCount: rows.length,
                                pageSize: parseInt(results),
                                totalCount: totalResults,
                                pageCount: Math.ceil(totalResults / parseInt(results)),
                                currentPage: parseInt(page)
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get("/api/notes/:id", (req, res) => {
    db.get(`SELECT * FROM notes WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such note'});
        } else {
            res.status(SUCCESS_CODE);
            res.json(normalizeNoteRecord(row));
        }
    });
});

app.put("/api/notes/:id", async (req, res) => {
    let createdMediaPaths = [];

    try {
        const existingNote = await getRow(`SELECT * FROM notes WHERE id = ?`, [req.params.id]);
        if (!existingNote) {
            res.status(NOT_FOUND_CODE).json({ response: 'NOT FOUND' });
            return;
        }

        const {
            noteValues,
            createdMediaPaths: nextCreatedMediaPaths,
            deletedMediaPaths
        } = buildNoteValues(req.body, existingNote);
        createdMediaPaths = nextCreatedMediaPaths;

        const updateResult = await runStatement(
            `UPDATE notes
            SET date = ?,
                title = ?,
                record = ?,
                address = ?,
                contacts = ?,
                tags = ?,
                mediaFiles = ?,
                lastModifiedOn = COALESCE(?, lastModifiedOn)
            WHERE id = ?`,
            [
                noteValues.date,
                noteValues.title,
                noteValues.record,
                noteValues.address,
                noteValues.contacts,
                noteValues.tags,
                noteValues.mediaFiles,
                noteValues.lastModifiedOn,
                req.params.id
            ]
        );

        if (!updateResult.changes) {
            if (createdMediaPaths.length) {
                deleteStoredFiles(createdMediaPaths);
            }
            res.status(NOT_FOUND_CODE).json({ response: 'NOT FOUND' });
            return;
        }

        if (deletedMediaPaths.length) {
            deleteStoredFiles(deletedMediaPaths);
        }

        const updatedNote = await getRow(`SELECT * FROM notes WHERE id = ?`, [req.params.id]);
        res.status(SUCCESS_CODE).json(normalizeNoteRecord(updatedNote));
    } catch (err) {
        if (createdMediaPaths.length) {
            deleteStoredFiles(createdMediaPaths);
        }
        res.status(ERROR_CODE).json({ message: err.message });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    try {
        const existingNote = await getRow(`SELECT * FROM notes WHERE id = ?`, [req.params.id]);
        if (!existingNote) {
            res.status(NOT_FOUND_CODE).json({ response: 'NOT FOUND' });
            return;
        }

        const wasErrorRemovingRelations = cleanUpRelations('note', req.params.id);
        if (wasErrorRemovingRelations) {
            res.status(ERROR_CODE);
            res.json(wasErrorRemovingRelations);
            return;
        }

        const deleteResult = await runStatement(`DELETE FROM notes WHERE id = ?`, [req.params.id]);
        if (!deleteResult.changes) {
            res.status(NOT_FOUND_CODE).json({ response: 'NOT FOUND' });
            return;
        }

        deleteStoredFiles(normalizeNoteRecord(existingNote).mediaFiles.map((mediaFile) => mediaFile.path));

        res.status(SUCCESS_CODE).json({ response: deleteResult });
    } catch (err) {
        res.status(ERROR_CODE).json({ message: err.message });
    }
});
// END NOTES APIS

// CONTACTS APIS
app.post('/api/contacts/new', (req, res) => {
    const createdOn = req.body.createdOn;
    db.run(
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
            entityType) 
        VALUES(
            '${cleanseString(req.body.firstName)}',
            '${cleanseString(req.body.lastName)}',
            '${req.body.profilePicture}',
            '${req.body.phoneNumber}',
            '${req.body.email}',
            '${cleanseString(req.body.address)}',
            '${cleanseString(req.body.firm)}',
            '${cleanseString(req.body.industry)}',
            '${req.body.dateOfBirth}',
            '${req.body.tags}',
            '${req.body.interactions}',
            '${cleanseString(req.body.bio)}',
            '${req.body.createdBy}',
            '${req.body.createdOn}',
            '${req.body.lastModifiedBy}',
            '${req.body.lastModifiedOn}',
            '${req.body.lastInteraction}',
            '${req.body.lastInteraction}',
            '${req.body.entityType}'
            )`, (err, rows) => {
                if (err) {
                    res.status(ERROR_CODE);
                    res.json(err);
                } else {
                    res.status(SUCCESS_CODE);
                    db.run(`SELECT id FROM contacts WHERE createdOn=${createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
});

app.get('/api/contacts/all', (req, res) => {
    const sql = `SELECT * FROM contacts`;
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!rows) {
            res.status(NOT_FOUND_CODE).send({message: 'Failed to get all contacts'});
        } else {
            res.status(SUCCESS_CODE);
            const resultCount = rows.length;
            res.json({
                results: rows,
                resultCount: resultCount,
                pageSize: resultCount,
                totalCount: resultCount,
                pageCount: 1,
                currentPage: 1,
            });
        }
    });
});

//accepts requests of the form: /api/contacts?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
// {
//    "contacts": Array<number>,
//    "events": Array<number>,
//    "notes": Array<number>
// }
app.get("/api/contacts", (req, res) => {
    const { results, page, order, direction, searchTerm, filters, relatedEvents, relatedNotes } = req.query;
    const relationships = {};
    if (relatedEvents) {
        relationships.events = relatedEvents.split(',');
    }
    if (relatedNotes) {
        relationships.notes = relatedNotes.split(',');
    }

    if (Object.keys(relationships).length === 0) {
        // if no relations, don't filter for them first
        let sql = `SELECT * FROM contacts`;
        getSubsetOfRecords(res, sql, order, direction, results, page, searchTerm, filters);
    } else {
        const sqlPre =
        `SELECT *
        FROM relations
        LEFT JOIN contacts
        ON relations.contactId = contacts.id`;

        db.all(sqlPre, (err, rows) => {
            if (err) {
                console.log(err);
                res.status(ERROR_CODE);
                res.json(err);
            } else if (!rows) {
                res.status(NOT_FOUND_CODE);
                res.json({message: 'NOT FOUND'});
            } else {
                const relatedRecordMap = new Map();

                // create map where each record id has an object of their existing relationships
                rows.forEach((row) => {
                    if (row.id) {
                        if (!relatedRecordMap.get(row.id)) {
                            relatedRecordMap.set(row.id, {
                                contacts: [],
                                events: [],
                                notes: []
                            });
                        }
                        const thisRecordEntry = relatedRecordMap.get(row.id);
                        if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                            relatedRecordMap.set(row.id, {
                                ...thisRecordEntry,
                                contacts: [...thisRecordEntry.contacts, row.contactId]
                            });
                        }
                        if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                            const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                            relatedRecordMap.set(row.id, {
                                ...possiblyUpdatedRecord,
                                events: [...possiblyUpdatedRecord.events, row.eventId]
                            });
                        }
                        if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                            const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                            relatedRecordMap.set(row.id, {
                                ...possiblyUpdatedRecord,
                                notes: [...possiblyUpdatedRecord.notes, row.noteId]
                            });
                        }
                    }
                });

                // filter for just the record ids with the expected relations
                const filteredIds = [];
                const mapKeys = relatedRecordMap.keys();
                let nextMapKey = mapKeys.next();
                while (nextMapKey.done === false) {
                    const key = nextMapKey.value;
                    const recordRelations = relatedRecordMap.get(key);
                    const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                        return relationships[recordIdType].every((id) => {
                            return recordRelations[recordIdType].find(i => i === parseInt(id));
                        });
                    });
                    if (hasAllExpectedRelations) {
                        filteredIds.push(key);
                    }

                    nextMapKey = mapKeys.next();
                }

                let sql = `SELECT * FROM contacts`;

                getSubsetOfRecords(res, sql, order, direction, results, page, searchTerm, filters, filteredIds);
            }
        });
    }
});

app.get("/api/contacts/:id", (req, res) => {
    const sql = `SELECT * FROM contacts WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such contact'});
        } else {
            res.status(SUCCESS_CODE);
            res.json(row);
        }
    })
});

app.put("/api/contacts/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE contacts SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'firstName') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'firstName') {
            sql = sql+` ${key}='${cleanseString(b[key])}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});

app.delete("/api/contacts/:id", (req, res) => {
    const wasErrorRemovingRelations = cleanUpRelations('contact', req.params.id);
    if (wasErrorRemovingRelations) {
        res.status(ERROR_CODE);
        res.json(wasErrorRemovingRelations);
        return;
    }

    const sql = `DELETE FROM contacts WHERE id = ${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});
// END CONTACTS APIS

// EVENTS APIS

app.post('/api/events/new', (req, res) => {
    db.run(
        `INSERT INTO events(
            date,
            title,
            description,
            address)
            VALUES(
                '${req.body.date}',
                '${cleanseString(req.body.title)}',
                '${cleanseString(req.body.description)}',
                '${cleanseString(req.body.address)}'
            )`, (err, rows) => {
                console.log('error: ', err);
                if (err) {
                    res.status(ERROR_CODE);
                    res.json(err);
                } else {
                    res.status(SUCCESS_CODE);
                    db.run(`SELECT id FROM events WHERE createdOn=${req.body.createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
    });

app.get('/api/events/all', (req, res) => {
    const sql = `SELECT * FROM events`;
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!rows) {
            res.status(NOT_FOUND_CODE).send({message: 'Failed to get all events'});
        } else {
            res.status(SUCCESS_CODE);
            const resultCount = rows.length;
            res.json({
                results: rows,
                resultCount: resultCount,
                pageSize: resultCount,
                totalCount: resultCount,
                pageCount: 1,
                currentPage: 1,
            });
        }
    });
});

//accepts requests of the form: /api/events?order=id?results=3&page=1?direction=[ASC|DESC]?search=string
app.get("/api/events", (req, res) => {
    const { results, page, order, direction, searchTerm, filters, relatedContacts, relatedNotes } = req.query;
    const relationships = {};
    if (relatedContacts) {
        relationships.contacts = relatedContacts.split(',');
    }
    if (relatedNotes) {
        relationships.notes = relatedNotes.split(',');
    }

    if (Object.keys(relationships).length === 0) {
        // if no relations, don't filter for them first
        let sql = `SELECT * FROM events`;
        getSubsetOfRecords(res, sql, order, direction, results, page, searchTerm, filters);
    } else {
        let sqlPre = `SELECT * FROM relations LEFT JOIN events ON relations.eventId = events.id`;
        //apply search
        db.all(sqlPre, (err, rows) => {
            if (err) {
                console.log(err);
                res.status(ERROR_CODE);
                res.json(err);
            } else if (!rows) {
                res.status(NOT_FOUND_CODE);
                res.json({message: 'NOT FOUND'});
            } else {
                const relatedRecordMap = new Map();
    
                // create map where each record id has an object of their existing relationships
                rows.forEach((row) => {
                    if (row.id) {
                        if (!relatedRecordMap.get(row.id)) {
                            relatedRecordMap.set(row.id, {
                                contacts: [],
                                events: [],
                                notes: []
                            });
                        }
                        const thisRecordEntry = relatedRecordMap.get(row.id);
                        if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                            relatedRecordMap.set(row.id, {
                                ...thisRecordEntry,
                                contacts: [...thisRecordEntry.contacts, row.contactId]
                            });
                        }
                        if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                            const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                            relatedRecordMap.set(row.id, {
                                ...possiblyUpdatedRecord,
                                events: [...possiblyUpdatedRecord.events, row.eventId]
                            });
                        }
                        if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                            const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                            relatedRecordMap.set(row.id, {
                                ...possiblyUpdatedRecord,
                                notes: [...possiblyUpdatedRecord.notes, row.noteId]
                            });
                        }
                    }
                });
    
                // filter for just the record ids with the expected relations
                const filteredIds = [];
                const mapKeys = relatedRecordMap.keys();
                let nextMapKey = mapKeys.next();
                while (nextMapKey.done === false) {
                    const key = nextMapKey.value;
                    const recordRelations = relatedRecordMap.get(key);
                    const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                        return relationships[recordIdType].every((id) => {
                            return recordRelations[recordIdType].find(i => i === parseInt(id));
                        });
                    });
                    if (hasAllExpectedRelations) {
                        filteredIds.push(key);
                    }
    
                    nextMapKey = mapKeys.next();
                }
    
                let sql = `SELECT * FROM events`;
    
                getSubsetOfRecords(res, sql, order, direction, results, page, searchTerm, filters, filteredIds);
            }
        });
    }
});

function getSubsetOfRecords(res, sql, order, direction, results, page, searchTerm, filters, filteredIds) {
    //apply search
    if(searchTerm && filters) {
        const searchFilters = filters.split(',');
        sql = sql + ` WHERE ${searchFilters[0]} LIKE '%${searchTerm}%'`;
        searchFilters.forEach((filter, index) => {
            if(index) {
                sql = sql + ` OR ${filter} LIKE '%${searchTerm}%'`;
            }
        });
    }
    if (!!filteredIds) {
        sql = sql+` WHERE id IN (${filteredIds})`;
    }

    const sql_metadata = sql;
    
    sql = sql+` ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page - 1})* ${results})`;
    console.log(sql);
    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            db.all(sql_metadata, (err, result) => {
                if (err) {
                    res.status(ERROR_CODE);
                    return console.error(err.message);
                } else if (!result) {
                    res.status(NOT_FOUND_CODE);
                    return;
                } else {
                    totalResults = result.length;
                    res.json({
                        results: rows,
                        resultCount: rows.length,
                        pageSize: parseInt(results),
                        totalCount: totalResults,
                        pageCount: Math.ceil(totalResults / parseInt(results)),
                        currentPage: parseInt(page)
                    });
                }
            });
        }
    });
}

app.get("/api/events/:id", (req, res) => {
    const sql = `SELECT * FROM events WHERE id = ${req.params.id}`;
    db.get(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE).send({message: err.message});
        } else if (!row) {
            res.status(NOT_FOUND_CODE).send({message: 'No such event'});
        } else {
            res.status(SUCCESS_CODE);
            res.json(row);
        }
    })
});

app.put("/api/events/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE events SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'date') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'date') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});

app.delete("/api/events/:id", (req, res) => {
    const wasErrorRemovingRelations = cleanUpRelations('event', req.params.id);
    if (wasErrorRemovingRelations) {
        res.status(ERROR_CODE);
        res.json(wasErrorRemovingRelations);
        return;
    }

    const sql = `DELETE FROM events WHERE id = ${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});
// END EVENTS APIS

// RELATIONS APIS

app.post('/api/relations/new', (req, res) => {
    db.run(
        `INSERT INTO relations(
            contactId,
            noteId,
            eventId) 
        VALUES(
            ${confirmInt(req.body.contactId)},
            ${confirmInt(req.body.noteId)},
            ${confirmInt(req.body.eventId)}
            )`, (err, rows) => {
                console.log('error: ', err);
                if (err) {
                    res.status(ERROR_CODE);
                    res.json(err);
                } else {
                    res.status(SUCCESS_CODE);
                    db.run(`SELECT id FROM relations WHERE createdOn=${req.body.createdOn}`, (err, id) => {
                        if (err) {
                            res.json({'message': 'could not get new Id'});
                        } else {
                            res.json({'newId': id});
                        }
                    });
                }
            }
        );
});

app.get('/api/relations/all', (req, res) => {
    let sql = `SELECT * FROM relations`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/relations/:id', (req, res) => {
    let sql = `SELECT * FROM relations WHERE id = ${req.params.id}`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

//accepts requests of the form: /api/relations?entity=[contactId | noteId | eventId]&id=string
app.get("/api/relations", (req, res) => {
    const { entity, id } = req.query;
    let sql = `SELECT * FROM relations WHERE ${entity} = ${id}`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            res.json(rows);
        }
    });
});

app.put("/api/relations/:id", (req, res) => {
    const b = req.body;
    let sql = `UPDATE relations SET`;
    Object.keys(b).map(key => {
        if(key !== 'id' && key !== 'eventId') {
            sql = sql+`, ${key}='${cleanseString(b[key])}'`
        } else if (key === 'eventId') {
            sql = sql+` ${key}='${b[key]}'`
        }
    });
    sql = sql+` WHERE id=${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});

app.delete("/api/relations/:id", (req, res) => {
    const sql = `DELETE FROM relations WHERE id = ${req.params.id}`;
    db.run(sql, (err, row) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!row) {
            res.status(NOT_FOUND_CODE);
            res.json({'response': 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({'response': row});
        }
    });
});

function cleanUpRelations(recordType, recordId) {
    const sql = `DELETE FROM relations WHERE ${recordType}Id = ${recordId}`;
    db.run(sql, (err, _row) => {
        if (err) {
            return err;
        } else {
            return false; // no issues found
        }
    });
}
// END RELATIONS APIS

// START COMBINATORIAL SEARCH APIS

/* getRecordsByRelations
    CONSUMES:
    - params.recordType: 'contact' || 'event' || 'note' // The type of records to be returned
    - params.body: {
        contacts?: Array<number>
        events?: Array<number>
        notes?: Array<number>
    } // arrays of the ids of each relation type
    PRODUCES:
    - Array<contact || event || note> (only one type). An array of the records (of specified type) that have all the relations specified in the body
*/
app.get("/api/records-by-relation/recordType/:recordType", async (req, res) => {
    const recordType = req.params.recordType; // 'contact' || 'event' || 'note'
    const relationships = req.body;

    const sql =
    `SELECT *
    FROM relations
    LEFT JOIN ${recordType}s
    ON relations.${recordType}Id = ${recordType}s.id`;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            const relatedRecordMap = new Map();

            // create map where each record id has an object of their existing relationsships
            rows.forEach((row) => {
                if (row.id) {
                    if (!relatedRecordMap.get(row.id)) {
                        relatedRecordMap.set(row.id, {
                            contacts: [],
                            events: [],
                            notes: []
                        });
                    }
                    const thisRecordEntry = relatedRecordMap.get(row.id);
                    if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
                        relatedRecordMap.set(row.id, {
                            ...thisRecordEntry,
                            contacts: [...thisRecordEntry.contacts, row.contactId]
                        });
                    }
                    if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
                        const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                        relatedRecordMap.set(row.id, {
                            ...possiblyUpdatedRecord,
                            events: [...possiblyUpdatedRecord.events, row.eventId]
                        });
                    }
                    if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
                        const possiblyUpdatedRecord = relatedRecordMap.get(row.id);
                        relatedRecordMap.set(row.id, {
                            ...possiblyUpdatedRecord,
                            notes: [...possiblyUpdatedRecord.notes, row.noteId]
                        });
                    }
                }
            });

            // filter for just the record ids with the expected relations
            const filteredIds = [];
            const mapKeys = relatedRecordMap.keys();
            let nextMapKey = mapKeys.next();
            while (nextMapKey.done === false) {
                const key = nextMapKey.value;
                const recordRelations = relatedRecordMap.get(key);
                const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
                    return relationships[recordIdType].every((id) => {
                        return recordRelations[recordIdType].find(i => i === id);
                    });
                });
                if (hasAllExpectedRelations) {
                    filteredIds.push(key);
                }

                nextMapKey = mapKeys.next();
            }

            const sql2 = `SELECT * FROM ${recordType}s WHERE id IN (${filteredIds})`;
            db.all(sql2, (err2, rows2) => {
                if (err2) {
                    res.status(ERROR_CODE);
                    res.json(err2);
                } else if (!rows2) {
                    res.status(NOT_FOUND_CODE);
                    res.json({'response': 'NOT FOUND'});
                } else {
                    res.status(SUCCESS_CODE);
                    res.json(rows2);
                }
            });
        }
    });
});
// END COMBINATORIAL SEARCH APIS

// GET NAMES OF RECORDS
app.get("/api/title-list/recordType/:recordType", async (req, res) => {
    const recordType = req.params.recordType; // 'contact' || 'event' || 'note'
    const fields = recordType === 'contact' ? `firstName, lastName` : `title`

    const sql =
    `SELECT id, ${fields} FROM ${recordType}s`;

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(ERROR_CODE);
            res.json(err);
        } else if (!rows) {
            res.status(NOT_FOUND_CODE);
            res.json({message: 'NOT FOUND'});
        } else {
            res.status(SUCCESS_CODE);
            res.json({ results: rows });
        }
    });
});
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
