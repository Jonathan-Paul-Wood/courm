/*
 * Responsibility: create backend tables and run note schema migrations.
 * Exports: initializeDb and migrateNotesTableSchema.
 * Does not contain: connection setup or route handlers.
 */
const { getAllRows, runStatement } = require("./connection");
const {
    buildLegacyNoteMediaFiles,
    parseNoteMediaFiles,
    serializeNoteMediaFiles
} = require("../services/notes.service");

async function initializeDb() {
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
}

async function migrateNotesTableSchema() {
    const noteTableColumns = await getAllRows("PRAGMA table_info(notes)");
    const hasImagePath = noteTableColumns.some((column) => column.name === "imagePath");
    const hasMediaFiles = noteTableColumns.some((column) => column.name === "mediaFiles");

    if (!hasMediaFiles && !hasImagePath) {
        await runStatement("ALTER TABLE notes ADD COLUMN mediaFiles JSONB");
        await runStatement("UPDATE notes SET mediaFiles = ? WHERE mediaFiles IS NULL", [serializeNoteMediaFiles([])]);
        return;
    }

    if (hasMediaFiles && !hasImagePath) {
        const notes = await getAllRows("SELECT id, mediaFiles FROM notes");
        for (const note of notes) {
            await runStatement("UPDATE notes SET mediaFiles = ? WHERE id = ?", [
                serializeNoteMediaFiles(parseNoteMediaFiles(note.mediaFiles)),
                note.id
            ]);
        }
        return;
    }

    await runStatement("ALTER TABLE notes RENAME TO notes_legacy_migration");
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

    const legacyNotes = await getAllRows("SELECT * FROM notes_legacy_migration");
    for (const legacyNote of legacyNotes) {
        const parsedMediaFiles = parseNoteMediaFiles(legacyNote.mediaFiles);
        const migratedMediaFiles = parsedMediaFiles.length
            ? parsedMediaFiles
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

    await runStatement("DROP TABLE notes_legacy_migration");
}

module.exports = {
    initializeDb,
    migrateNotesTableSchema
};
