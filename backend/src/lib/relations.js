/*
 * Responsibility: share relation lookup, filtering, and cleanup helpers across route modules.
 * Exports: relation map builders, filtered id resolution, and cleanup helpers.
 * Does not contain: record-specific route handlers.
 */
const { getAllRows, runStatement } = require("../db/connection");

function createEmptyRelationEntry() {
    return {
        contacts: [],
        events: [],
        notes: []
    };
}

/* Relation filtering expects a record to match every requested id for each requested relation type. */
function buildRelatedRecordMap(rows) {
    const relatedRecordMap = new Map();

    rows.forEach((row) => {
        if (!row.id) {
            return;
        }

        if (!relatedRecordMap.get(row.id)) {
            relatedRecordMap.set(row.id, createEmptyRelationEntry());
        }

        const thisRecordEntry = relatedRecordMap.get(row.id);
        if (row.contactId && !thisRecordEntry.contacts.includes(row.contactId)) {
            thisRecordEntry.contacts = [...thisRecordEntry.contacts, row.contactId];
        }
        if (row.eventId && !thisRecordEntry.events.includes(row.eventId)) {
            thisRecordEntry.events = [...thisRecordEntry.events, row.eventId];
        }
        if (row.noteId && !thisRecordEntry.notes.includes(row.noteId)) {
            thisRecordEntry.notes = [...thisRecordEntry.notes, row.noteId];
        }

        relatedRecordMap.set(row.id, thisRecordEntry);
    });

    return relatedRecordMap;
}

function getFilteredRelationIds(relatedRecordMap, relationships, transformExpectedId = (value) => parseInt(value, 10)) {
    const filteredIds = [];

    for (const [key, recordRelations] of relatedRecordMap.entries()) {
        const hasAllExpectedRelations = Object.keys(relationships).every((recordIdType) => {
            return relationships[recordIdType].every((id) => {
                return recordRelations[recordIdType].find((storedId) => storedId === transformExpectedId(id));
            });
        });

        if (hasAllExpectedRelations) {
            filteredIds.push(key);
        }
    }

    return filteredIds;
}

async function getRelatedRecordIds(recordType, relationships, transformExpectedId) {
    const sql = `
    SELECT *
    FROM relations
    LEFT JOIN ${recordType}s
    ON relations.${recordType}Id = ${recordType}s.id`;
    const rows = await getAllRows(sql);
    const relatedRecordMap = buildRelatedRecordMap(rows);

    return getFilteredRelationIds(relatedRecordMap, relationships, transformExpectedId);
}

async function cleanUpRelations(recordType, recordId) {
    await runStatement(`DELETE FROM relations WHERE ${recordType}Id = ?`, [recordId]);
}

module.exports = {
    buildRelatedRecordMap,
    cleanUpRelations,
    getFilteredRelationIds,
    getRelatedRecordIds
};
