/*
 * Responsibility: normalize event payloads for create and update flows.
 * Exports: buildEventValues.
 * Does not contain: SQL execution or Express request/response handling.
 */

/* buildEventValues merges partial updates with the existing row so route handlers can issue predictable writes. */
function buildEventValues(body = {}, existingEvent = null) {
    return {
        date: Object.prototype.hasOwnProperty.call(body, "date") ? body.date : (existingEvent?.date || ""),
        title: Object.prototype.hasOwnProperty.call(body, "title") ? body.title : (existingEvent?.title || ""),
        description: Object.prototype.hasOwnProperty.call(body, "description")
            ? body.description
            : (existingEvent?.description || ""),
        address: Object.prototype.hasOwnProperty.call(body, "address") ? body.address : (existingEvent?.address || ""),
        createdOn: Object.prototype.hasOwnProperty.call(body, "createdOn") ? body.createdOn : (existingEvent?.createdOn || ""),
        lastModifiedOn: Object.prototype.hasOwnProperty.call(body, "lastModifiedOn")
            ? body.lastModifiedOn
            : (existingEvent?.lastModifiedOn || "")
    };
}

module.exports = {
    buildEventValues
};
