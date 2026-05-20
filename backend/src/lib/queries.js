/*
 * Responsibility: provide shared query-building helpers for list and update flows.
 * Exports: sanitizers, paginated list helper, and dynamic update clause builder.
 * Does not contain: resource-specific value shaping or Express handlers.
 */
const { getAllRows } = require("../db/connection");

function cleanseString(str) {
    return String(str || "").replace(/'/g, "''");
}

function confirmInt(value) {
    return Number.isSafeInteger(value) ? value : null;
}

function appendSearchClause(sql, searchTerm, filters) {
    if (!searchTerm || !filters) {
        return sql;
    }

    const searchFilters = filters
        .split(",")
        .map((filter) => filter.trim())
        .filter(Boolean);

    if (!searchFilters.length) {
        return sql;
    }

    const searchConditions = searchFilters.map((filter, index) => {
        const operator = index === 0 ? "WHERE" : "OR";
        return `${operator} ${filter} LIKE '%${searchTerm}%'`;
    });

    return `${sql} ${searchConditions.join(" ")}`;
}

function appendFilteredIdsClause(sql, filteredIds) {
    if (!filteredIds) {
        return sql;
    }

    if (!filteredIds.length) {
        return sql.includes(" WHERE ") ? `${sql} AND 1 = 0` : `${sql} WHERE 1 = 0`;
    }

    return sql.includes(" WHERE ")
        ? `${sql} AND id IN (${filteredIds.join(",")})`
        : `${sql} WHERE id IN (${filteredIds.join(",")})`;
}

async function getSubsetOfRecords(baseSql, options = {}) {
    const {
        direction,
        filters,
        filteredIds,
        order,
        page,
        results,
        searchTerm,
        transformRow
    } = options;
    let sql = appendSearchClause(baseSql, searchTerm, filters);
    sql = appendFilteredIdsClause(sql, filteredIds);

    const metadataSql = sql;
    const pageSize = parseInt(results, 10);
    const currentPage = parseInt(page, 10);
    const paginatedSql = `${sql} ORDER BY ${order} ${direction} LIMIT ${results} OFFSET ((${page} - 1) * ${results})`;

    const [rows, result] = await Promise.all([
        getAllRows(paginatedSql),
        getAllRows(metadataSql)
    ]);

    return {
        results: transformRow ? rows.map(transformRow) : rows,
        resultCount: rows.length,
        pageSize,
        totalCount: result.length,
        pageCount: Math.ceil(result.length / pageSize),
        currentPage
    };
}

function buildUpdateClause(values, allowedFields) {
    const updateFields = allowedFields.filter((field) => Object.prototype.hasOwnProperty.call(values, field));

    return {
        clause: updateFields.map((field) => `${field} = ?`).join(", "),
        params: updateFields.map((field) => values[field])
    };
}

module.exports = {
    buildUpdateClause,
    cleanseString,
    confirmInt,
    getSubsetOfRecords
};
