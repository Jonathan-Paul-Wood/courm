/*
 * Responsibility: keep common JSON response patterns consistent across route modules.
 * Exports: success, error, not-found, and paginated list response helpers.
 * Does not contain: resource-specific payload shaping.
 */
const { ERROR_CODE, NOT_FOUND_CODE, SUCCESS_CODE } = require("../config/constants");

function sendSuccess(res, payload, statusCode = SUCCESS_CODE) {
    return res.status(statusCode).json(payload);
}

function sendServerError(res, error) {
    return res.status(ERROR_CODE).json({ message: error.message });
}

function sendNotFound(res, message) {
    return res.status(NOT_FOUND_CODE).json({ message });
}

function sendPaginatedResults(res, payload) {
    return sendSuccess(res, payload);
}

module.exports = {
    sendNotFound,
    sendPaginatedResults,
    sendServerError,
    sendSuccess
};
