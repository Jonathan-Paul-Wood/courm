/*
 * Responsibility: define shared backend constants for HTTP responses and upload limits.
 * Exports: status codes, default CORS origin, and media constraints.
 * Does not contain: derived filesystem paths or database logic.
 */
const ERROR_CODE = 500;
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;
const DEFAULT_CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const SUPPORTED_NOTE_MEDIA_TYPES = ["audio", "image", "video"];
const MAX_NOTE_MEDIA_BYTES = {
    image: 10 * 1024 * 1024,
    audio: 25 * 1024 * 1024,
    video: 50 * 1024 * 1024
};
const MAX_CONTACT_IMAGE_BYTES = 10 * 1024 * 1024;

module.exports = {
    DEFAULT_CORS_ORIGIN,
    ERROR_CODE,
    MAX_CONTACT_IMAGE_BYTES,
    MAX_NOTE_MEDIA_BYTES,
    NOT_FOUND_CODE,
    SUCCESS_CODE,
    SUPPORTED_NOTE_MEDIA_TYPES
};
