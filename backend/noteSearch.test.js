const test = require('node:test');
const assert = require('node:assert/strict');

const {
    buildNotesListQuery,
    getValidatedNoteOrder,
    getValidatedPositiveInteger,
    getValidatedSortDirection,
    normalizeCsvList
} = require('./noteSearch');

test('buildNotesListQuery keeps OR search filters grouped before relation filtering', () => {
    const query = buildNotesListQuery({
        searchTerm: 'cool',
        filters: ['title', 'date'],
        filteredIds: [7, 9]
    });

    assert.equal(
        query.sql,
        'SELECT * FROM notes WHERE (title LIKE ? OR date LIKE ?) AND id IN (?, ?)'
    );
    assert.deepEqual(query.params, ['%cool%', '%cool%', 7, 9]);
});

test('buildNotesListQuery does not apply relation filtering when no relation filters were selected', () => {
    const query = buildNotesListQuery({
        searchTerm: 'cool',
        filters: ['title'],
        filteredIds: null
    });

    assert.equal(query.sql, 'SELECT * FROM notes WHERE (title LIKE ?)');
    assert.deepEqual(query.params, ['%cool%']);
});

test('buildNotesListQuery returns all notes when no search term or relation filter is supplied', () => {
    const query = buildNotesListQuery({
        searchTerm: '',
        filters: [],
        filteredIds: null
    });

    assert.equal(query.sql, 'SELECT * FROM notes');
    assert.deepEqual(query.params, []);
});

test('normalizeCsvList trims and drops empty values', () => {
    assert.deepEqual(normalizeCsvList(' title, ,date ,, record '), ['title', 'date', 'record']);
});

test('validation helpers fall back to safe defaults', () => {
    assert.equal(getValidatedPositiveInteger('0', 5), 5);
    assert.equal(getValidatedPositiveInteger('12', 5), 12);
    assert.equal(getValidatedNoteOrder('createdOn'), 'createdOn');
    assert.equal(getValidatedNoteOrder('drop table notes'), 'title');
    assert.equal(getValidatedSortDirection('desc'), 'DESC');
    assert.equal(getValidatedSortDirection('sideways'), 'ASC');
});
