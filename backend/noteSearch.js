const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE = 1;
const DEFAULT_NOTE_ORDER = 'title';
const DEFAULT_SORT_DIRECTION = 'ASC';

const ALLOWED_NOTE_SEARCH_FIELDS = new Set([
    'title',
    'date',
    'address',
    'contacts',
    'tags',
    'record'
]);

const ALLOWED_NOTE_ORDER_FIELDS = new Set([
    'title',
    'date',
    'createdOn',
    'lastModifiedOn'
]);

const ALLOWED_SORT_DIRECTIONS = new Set([
    'ASC',
    'DESC'
]);

function normalizeCsvList(value) {
    if (Array.isArray(value)) {
        return value
            .flatMap(normalizeCsvList);
    }

    return String(value || '')
        .split(',')
        .map(entry => entry.trim())
        .filter(Boolean);
}

function getValidatedPositiveInteger(value, defaultValue) {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : defaultValue;
}

function getValidatedNoteSearchFilters(filters) {
    return normalizeCsvList(filters)
        .filter(filter => ALLOWED_NOTE_SEARCH_FIELDS.has(filter));
}

function getValidatedNoteOrder(order) {
    return ALLOWED_NOTE_ORDER_FIELDS.has(order) ? order : DEFAULT_NOTE_ORDER;
}

function getValidatedSortDirection(direction) {
    const normalizedDirection = String(direction || DEFAULT_SORT_DIRECTION).toUpperCase();
    return ALLOWED_SORT_DIRECTIONS.has(normalizedDirection) ? normalizedDirection : DEFAULT_SORT_DIRECTION;
}

function buildNotesListQuery({ searchTerm = '', filters = [], filteredIds = null }) {
    const whereClauses = [];
    const params = [];
    const normalizedSearchTerm = String(searchTerm || '').trim();
    const searchFilters = getValidatedNoteSearchFilters(filters);

    if (normalizedSearchTerm && searchFilters.length) {
        whereClauses.push(`(${searchFilters.map(filter => `${filter} LIKE ?`).join(' OR ')})`);
        searchFilters.forEach(() => {
            params.push(`%${normalizedSearchTerm}%`);
        });
    }

    if (Array.isArray(filteredIds)) {
        if (filteredIds.length) {
            whereClauses.push(`id IN (${filteredIds.map(() => '?').join(', ')})`);
            params.push(...filteredIds);
        } else {
            whereClauses.push('1 = 0');
        }
    }

    return {
        sql: `SELECT * FROM notes${whereClauses.length ? ` WHERE ${whereClauses.join(' AND ')}` : ''}`,
        params
    };
}

module.exports = {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    buildNotesListQuery,
    getValidatedNoteOrder,
    getValidatedPositiveInteger,
    getValidatedSortDirection,
    normalizeCsvList
};
