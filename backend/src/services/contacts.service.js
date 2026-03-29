/*
 * Responsibility: own contact image handling and contact payload shaping.
 * Exports: saveContactImage and buildContactValues.
 * Does not contain: SQL execution or Express request/response handling.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { MAX_CONTACT_IMAGE_BYTES } = require("../config/constants");
const { CONTACT_IMAGE_DIRECTORY } = require("../config/storage");
const {
    ensureDirectoryExists,
    getStoredFileExtension,
    resolveStoredFilePath
} = require("../lib/files");

function saveContactImage(imageUpload) {
    if (!imageUpload || !imageUpload.dataUrl) {
        return "";
    }

    const dataUrlMatch = imageUpload.dataUrl.match(/^data:(.+);base64,(.+)$/);

    if (!dataUrlMatch) {
        throw new Error("Invalid image upload payload");
    }

    const mimeType = dataUrlMatch[1];
    if (!mimeType.startsWith("image/")) {
        throw new Error("Only image uploads are supported");
    }

    const imageBuffer = Buffer.from(dataUrlMatch[2], "base64");
    if (imageBuffer.length > MAX_CONTACT_IMAGE_BYTES) {
        throw new Error("Image exceeds the 10MB limit");
    }

    const fileExtension = getStoredFileExtension(imageUpload.fileName, mimeType);
    const generatedFileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${fileExtension}`;
    const relativeFilePath = path.posix.join("contact-images", generatedFileName);
    const storedFilePath = resolveStoredFilePath(relativeFilePath);

    ensureDirectoryExists(CONTACT_IMAGE_DIRECTORY);
    fs.writeFileSync(storedFilePath, imageBuffer);

    return relativeFilePath;
}

/* buildContactValues preserves existing image references unless the caller explicitly uploads or removes one. */
function buildContactValues(body, existingContact) {
    const existingProfilePicture = existingContact && existingContact.profilePicture ? existingContact.profilePicture : "";
    const removeImage = body.removeImage === true || body.removeImage === "true";
    let createdImagePath = "";
    let nextProfilePicture = typeof body.profilePicture === "string" ? body.profilePicture : existingProfilePicture;

    if (body.imageUpload && body.imageUpload.dataUrl) {
        createdImagePath = saveContactImage(body.imageUpload);
        nextProfilePicture = createdImagePath;
    } else if (removeImage) {
        nextProfilePicture = "";
    } else if (!nextProfilePicture && existingProfilePicture) {
        nextProfilePicture = existingProfilePicture;
    }

    return {
        contactValues: {
            firstName: body.firstName || "",
            lastName: body.lastName || "",
            profilePicture: nextProfilePicture,
            phoneNumber: body.phoneNumber || "",
            email: body.email || "",
            address: body.address || "",
            firm: body.firm || "",
            industry: body.industry || "",
            dateOfBirth: body.dateOfBirth || "",
            tags: body.tags || "",
            interactions: body.interactions || "",
            bio: body.bio || "",
            createdBy: body.createdBy || "",
            createdOn: body.createdOn || "",
            lastModifiedBy: body.lastModifiedBy || "",
            lastModifiedOn: body.lastModifiedOn || "",
            lastInteractionId: body.lastInteractionId || body.lastInteraction || "",
            lastInteractionOn: body.lastInteractionOn || body.lastInteraction || "",
            entityType: body.entityType || "person"
        },
        createdImagePath,
        replacedImagePath: existingProfilePicture && existingProfilePicture !== nextProfilePicture ? existingProfilePicture : ""
    };
}

module.exports = {
    buildContactValues,
    saveContactImage
};
