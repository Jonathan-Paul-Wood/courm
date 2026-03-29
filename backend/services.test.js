const test = require("node:test");
const assert = require("node:assert/strict");

const {
    buildContactValues
} = require("./src/services/contacts.service");
const {
    buildEventValues
} = require("./src/services/events.service");
const {
    dedupeNoteMediaFiles,
    parseNoteMediaFiles,
    serializeNoteMediaFiles
} = require("./src/services/notes.service");
const {
    buildRelatedRecordMap,
    getFilteredRelationIds
} = require("./src/lib/relations");

test("note media helpers parse, serialize, and dedupe media files", () => {
    const serialized = serializeNoteMediaFiles([
        {
            id: "9ccf4856-f9a9-49ac-8e18-4d5f09bb2298",
            path: "note/images/one.jpg",
            type: "image",
            name: "One"
        },
        {
            id: "9ccf4856-f9a9-49ac-8e18-4d5f09bb2298",
            path: "note/images/one.jpg",
            type: "image",
            name: "Updated One"
        }
    ]);

    const parsed = parseNoteMediaFiles(serialized);
    const deduped = dedupeNoteMediaFiles(parsed);

    assert.equal(deduped.length, 1);
    assert.equal(deduped[0].name, "Updated One");
    assert.equal(deduped[0].type, "image");
});

test("buildContactValues preserves and removes images intentionally", () => {
    const existingContact = {
        profilePicture: "contact-images/original.png"
    };

    const preserved = buildContactValues({}, existingContact);
    assert.equal(preserved.contactValues.profilePicture, "contact-images/original.png");
    assert.equal(preserved.createdImagePath, "");

    const removed = buildContactValues({ removeImage: true }, existingContact);
    assert.equal(removed.contactValues.profilePicture, "");
    assert.equal(removed.replacedImagePath, "contact-images/original.png");
});

test("buildEventValues merges partial event updates with existing values", () => {
    const existingEvent = {
        date: "2026-03-29",
        title: "Planning Session",
        description: "Initial description",
        address: "123 Main St",
        createdOn: "2026-03-28T00:00:00.000Z",
        lastModifiedOn: "2026-03-28T00:00:00.000Z"
    };

    const nextValues = buildEventValues({
        title: "Updated Planning Session",
        lastModifiedOn: "2026-03-29T00:00:00.000Z"
    }, existingEvent);

    assert.equal(nextValues.date, existingEvent.date);
    assert.equal(nextValues.title, "Updated Planning Session");
    assert.equal(nextValues.description, existingEvent.description);
    assert.equal(nextValues.lastModifiedOn, "2026-03-29T00:00:00.000Z");
});

test("relation helpers return record ids that match all requested relationships", () => {
    const relatedRecordMap = buildRelatedRecordMap([
        { id: 1, contactId: 10, noteId: 100, eventId: null },
        { id: 1, contactId: 11, noteId: 100, eventId: null },
        { id: 2, contactId: 10, noteId: 101, eventId: null }
    ]);

    const filteredIds = getFilteredRelationIds(relatedRecordMap, {
        contacts: ["10", "11"],
        notes: ["100"]
    });

    assert.deepEqual(filteredIds, [1]);
});
