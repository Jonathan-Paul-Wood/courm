/*
 * Responsibility: derive storage-related paths from the active backend environment.
 * Exports: app storage root, note media folders, and contact image folder.
 * Does not contain: filesystem side effects or upload logic.
 */
const path = require("path");

const APP_STORAGE_DIRECTORY = path.resolve(
    process.env.APP_STORAGE_DIRECTORY || path.join(process.cwd(), "storage")
);
const NOTE_STORAGE_DIRECTORY = path.join(APP_STORAGE_DIRECTORY, "note");
const NOTE_MEDIA_DIRECTORIES = {
    image: path.join(NOTE_STORAGE_DIRECTORY, "images"),
    audio: path.join(NOTE_STORAGE_DIRECTORY, "audio"),
    video: path.join(NOTE_STORAGE_DIRECTORY, "video")
};
const NOTE_MEDIA_DIRECTORY_NAMES = {
    image: "images",
    audio: "audio",
    video: "video"
};
const CONTACT_IMAGE_DIRECTORY = path.join(APP_STORAGE_DIRECTORY, "contact-images");

module.exports = {
    APP_STORAGE_DIRECTORY,
    CONTACT_IMAGE_DIRECTORY,
    NOTE_MEDIA_DIRECTORIES,
    NOTE_MEDIA_DIRECTORY_NAMES,
    NOTE_STORAGE_DIRECTORY
};
