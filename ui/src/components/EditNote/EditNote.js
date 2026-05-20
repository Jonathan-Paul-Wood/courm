import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import CommonModal from '../../common/CommonModal/CommonModal';
import PropTypes from 'prop-types';
import ScrollContainer from '../../common/ScrollContainer';
import { buildStoredFileUrl } from '../../common/Utilities/utilities';

const NOTE_MEDIA_SIZE_LIMITS = {
    image: 10 * 1024 * 1024,
    audio: 25 * 1024 * 1024,
    video: 50 * 1024 * 1024
};

const NOTE_MEDIA_TYPE_LABELS = {
    image: 'Image',
    audio: 'Audio',
    video: 'Video'
};

const GridWrapper = styled.div`
    .mediaRow {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .mediaControls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .mediaControls label {
        font-weight: 600;
    }

    .supportText {
        color: #666666;
        font-size: 0.9rem;
    }

    .errorText {
        color: #c62828;
        font-size: 0.9rem;
    }

    .mediaGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        gap: 1rem;
    }

    .mediaCard {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: #fafafa;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .mediaPreview {
        min-height: 12rem;
        border: 1px dashed #bfbfbf;
        border-radius: 4px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem;
        color: #666666;
        overflow: hidden;
    }

    .mediaPreview img,
    .mediaPreview video {
        width: 100%;
        max-height: 16rem;
        object-fit: contain;
    }

    .mediaPreview audio {
        width: 100%;
    }

    .mediaMeta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        color: #666666;
        font-size: 0.9rem;
    }

    .mediaNameInput {
        width: 100%;
        padding: 0.625rem 0.75rem;
        border: 1px solid #bfbfbf;
        border-radius: 4px;
        font-size: 1rem;
    }

    .mediaPath {
        word-break: break-word;
        color: #666666;
        font-size: 0.9rem;
    }

    .emptyMediaState {
        min-height: 12rem;
        border: 1px dashed #bfbfbf;
        border-radius: 4px;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        padding: 1rem;
    }

    .rowMargin {
        margin: 1rem 0;

        .input-field {
            padding: 0 3em;
        }
    }

    .metadataRow {
        height: 45vh;

        .inputRow {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    .bioRow {
        height: 20vh;
        width: 100%;
        margin: 0 1.25em;
    }

    tagsRow {
        height: 20rem;
    }

    .dateInfo {
        font-style: italic;
        font-size: 0.8rem;
    }

    #dangerRow {
        margin-top: 3rem;
        display: flex;
        justify-content: space-between;

        #delete-note-button {
            display: flex;
            justify-content: right;
        }
    }
`;

function createClientUuid () {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
        const randomValue = Math.random() * 16 | 0;
        const nextValue = character === 'x' ? randomValue : ((randomValue & 0x3) | 0x8);
        return nextValue.toString(16);
    });
}

function getNoteMediaType (file) {
    if (!file || !file.type) {
        return '';
    }

    if (file.type.startsWith('image/')) {
        return 'image';
    }

    if (file.type.startsWith('audio/')) {
        return 'audio';
    }

    if (file.type.startsWith('video/')) {
        return 'video';
    }

    return '';
}

function readFileAsDataUrl (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
    });
}

function getMediaSource (mediaFile) {
    if (mediaFile.previewUrl) {
        return mediaFile.previewUrl;
    }

    if (mediaFile.path) {
        return buildStoredFileUrl(mediaFile.path);
    }

    return '';
}

function mapNoteMediaFiles (mediaFiles = []) {
    return mediaFiles.map((mediaFile) => ({
        id: mediaFile.id,
        path: mediaFile.path,
        type: mediaFile.type,
        name: mediaFile.name,
        previewUrl: '',
        upload: null
    }));
}

function getSizeLimitLabel (mediaType) {
    return `${Math.floor(NOTE_MEDIA_SIZE_LIMITS[mediaType] / (1024 * 1024))}MB`;
}

export default function EditNote (props) {
    const location = useLocation();
    const isNewNote = !!location.pathname.match('/new');
    const { noteId } = useParams();
    const {
        note,
        isNotePending,
        getNote,
        postNote,
        isNotePostPending,
        putNote,
        isNotePutPending,
        deleteNote,
        isNoteDeletePending
    } = props;
    const defaultChanges = {
        title: '',
        date: '',
        address: '',
        contacts: '',
        tags: '',
        record: '',
        mediaFiles: []
    };
    const [pendingChanges, setPendingChanges] = useState(defaultChanges);
    const [error, setError] = useState({
        ...defaultChanges,
        mediaFiles: ''
    });
    const [pendingMediaFiles, setPendingMediaFiles] = useState([]);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (noteId) {
            getNote(noteId).catch(() => {});
        } else {
            setPendingChanges(defaultChanges);
            setPendingMediaFiles([]);
        }
    }, [noteId, getNote]);

    useEffect(() => {
        if (!noteId) {
            setPendingChanges(defaultChanges);
            setPendingMediaFiles([]);
            return;
        }

        const d = note.date ? note.date : '';
        const newValues = { ...defaultChanges, ...note, date: d };
        setPendingChanges(newValues);
        setPendingMediaFiles(mapNoteMediaFiles(note.mediaFiles));
    }, [noteId, note]);

    function updateData (field, value) {
        setError((currentError) => ({
            ...currentError,
            [field]: ''
        }));

        setPendingChanges((currentChanges) => ({
            ...currentChanges,
            [field]: value
        }));
    }

    async function handleMediaSelection (event) {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) {
            return;
        }

        const nextMediaFiles = [];
        const selectionErrors = [];

        for (const selectedFile of selectedFiles) {
            const mediaType = getNoteMediaType(selectedFile);
            if (!mediaType) {
                selectionErrors.push('Only image, audio, and video files are supported.');
                continue;
            }

            if (selectedFile.size > NOTE_MEDIA_SIZE_LIMITS[mediaType]) {
                selectionErrors.push(`${NOTE_MEDIA_TYPE_LABELS[mediaType]} files must be ${getSizeLimitLabel(mediaType)} or smaller.`);
                continue;
            }

            try {
                const previewUrl = await readFileAsDataUrl(selectedFile);
                const mediaId = createClientUuid();
                nextMediaFiles.push({
                    id: mediaId,
                    path: '',
                    type: mediaType,
                    name: selectedFile.name,
                    previewUrl,
                    upload: {
                        id: mediaId,
                        type: mediaType,
                        name: selectedFile.name,
                        fileName: selectedFile.name,
                        mimeType: selectedFile.type,
                        dataUrl: previewUrl
                    }
                });
            } catch (selectionError) {
                selectionErrors.push(selectionError.message);
            }
        }

        if (nextMediaFiles.length) {
            setPendingMediaFiles((currentMediaFiles) => [...currentMediaFiles, ...nextMediaFiles]);
        }

        setError((currentError) => ({
            ...currentError,
            mediaFiles: selectionErrors.join(' ')
        }));

        event.target.value = '';
    }

    function handleRemoveMedia (mediaId) {
        setPendingMediaFiles((currentMediaFiles) => currentMediaFiles.filter((mediaFile) => mediaFile.id !== mediaId));
        setError((currentError) => ({
            ...currentError,
            mediaFiles: ''
        }));
    }

    function handleMediaNameChange (mediaId, value) {
        setPendingMediaFiles((currentMediaFiles) => {
            return currentMediaFiles.map((mediaFile) => {
                if (mediaFile.id !== mediaId) {
                    return mediaFile;
                }

                const nextUpload = mediaFile.upload
                    ? {
                        ...mediaFile.upload,
                        name: value
                    }
                    : null;

                return {
                    ...mediaFile,
                    name: value,
                    upload: nextUpload
                };
            });
        });
    }

    function buildSubmitMediaFiles () {
        return pendingMediaFiles
            .filter((mediaFile) => !mediaFile.upload)
            .map((mediaFile) => ({
                id: mediaFile.id,
                path: mediaFile.path,
                type: mediaFile.type,
                name: mediaFile.name
            }));
    }

    function buildSubmitMediaUploads () {
        return pendingMediaFiles
            .filter((mediaFile) => mediaFile.upload)
            .map((mediaFile) => ({
                ...mediaFile.upload,
                id: mediaFile.id,
                type: mediaFile.type,
                name: mediaFile.name
            }));
    }

    async function handleSaveNote () {
        let valid = true;
        const nextErrorState = { ...error, mediaFiles: '' };

        if (!pendingChanges.title) {
            valid = false;
            nextErrorState.title = 'Please enter title';
        }
        if (pendingChanges.date && !pendingChanges.date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)) {
            valid = false;
            nextErrorState.date = 'Expected format: YYYY-MM-DD';
        }
        setError(nextErrorState);

        if (valid) {
            let d = pendingChanges.date;
            if (d) {
                d = new Date(pendingChanges.date).toISOString();
            }

            const submitChanges = {
                ...pendingChanges,
                lastModifiedOn: new Date().toISOString(),
                date: d,
                mediaFiles: buildSubmitMediaFiles(),
                mediaUploads: buildSubmitMediaUploads()
            };

            try {
                if (isNewNote) {
                    await postNote(submitChanges);
                    setPendingChanges(defaultChanges);
                    setPendingMediaFiles([]);
                    setError({
                        ...defaultChanges,
                        mediaFiles: ''
                    });
                } else {
                    await putNote(noteId, submitChanges);
                    navigate(`/notes/${noteId}`);
                }
            } catch (saveError) {
                return saveError;
            }
        }
    }

    async function handleDeleteConfirm () {
        setShowDeleteModal(false);

        try {
            await deleteNote(noteId);
            navigate('/notes');
        } catch (deleteError) {
            return deleteError;
        }
    }

    function renderMediaPreview (mediaFile) {
        const mediaSource = getMediaSource(mediaFile);

        if (!mediaSource) {
            return <span>No preview available</span>;
        }

        if (mediaFile.type === 'image') {
            return <img src={mediaSource} alt={mediaFile.name || 'Note attachment'} />;
        }

        if (mediaFile.type === 'audio') {
            return <audio controls src={mediaSource} />;
        }

        if (mediaFile.type === 'video') {
            return <video controls src={mediaSource} />;
        }

        return <span>No preview available</span>;
    }

    return (
        <>
            <EntityTitleHeader
                title={isNewNote ? 'New Note' : 'Edit Note'}
                editMode={true}
                handleSave={handleSaveNote}
                disableSave={
                    isNotePending ||
                    isNotePostPending ||
                    isNotePutPending
                }
                type='Note'
            />
            <ScrollContainer
                style={{
                    margin: '2em 2em 0 2em',
                    padding: '0 1em'
                }}
            >
                <GridWrapper>
                    <div className="mediaRow rowMargin">
                        <div className="mediaControls">
                            <label htmlFor="note-media-upload">Attachments</label>
                            <input
                                id="note-media-upload"
                                type="file"
                                accept="image/*,audio/*,video/*"
                                multiple
                                onChange={handleMediaSelection}
                            />
                            <div className="supportText">Attach multiple images, audio files, or videos to this note.</div>
                            <div className="supportText">Uploaded note media is stored locally under `storage/note/images`, `storage/note/audio`, and `storage/note/video`.</div>
                            {error.mediaFiles && <div className="errorText">{error.mediaFiles}</div>}
                        </div>
                        {pendingMediaFiles.length
                            ? (
                                <div className="mediaGrid">
                                    {pendingMediaFiles.map((mediaFile) => (
                                        <div key={mediaFile.id} className="mediaCard">
                                            <div className="mediaPreview">
                                                {renderMediaPreview(mediaFile)}
                                            </div>
                                            <div className="mediaMeta">
                                                <span>{NOTE_MEDIA_TYPE_LABELS[mediaFile.type]}</span>
                                                <Button
                                                    label="Remove"
                                                    type="secondary"
                                                    icon="trashCan"
                                                    onClick={() => handleRemoveMedia(mediaFile.id)}
                                                />
                                            </div>
                                            <input
                                                className="mediaNameInput"
                                                value={mediaFile.name}
                                                onChange={(event) => handleMediaNameChange(mediaFile.id, event.target.value)}
                                                placeholder="Attachment name"
                                            />
                                            {mediaFile.path && (
                                                <div className="mediaPath">Saved path: {mediaFile.path}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                            : <div className="emptyMediaState">No media uploaded</div>}
                    </div>
                    <div className="metadataRow">
                        <div id="titleData" className="inputRow rowMargin">
                            <Input
                                placeholder="Enter Title"
                                value={pendingChanges.title}
                                label='Title *'
                                error={error.title}
                                onChange={(event) => updateData('title', event.target.value)}
                            />
                            <DateInput
                                placeholder="Enter or select YYYY/MM/DD"
                                value={pendingChanges.date}
                                label="Date"
                                error={error.date}
                                onChange={(newDate) => updateData('date', newDate)}
                                maxLength={11}
                            />
                        </div>
                        <div id="placementData" className="inputRow rowMargin">
                            <Input
                                placeholder="212 Oak PL, Neverland OH 12345"
                                value={pendingChanges.address}
                                label="Address"
                                error={error.address}
                                onChange={(event) => updateData('address', event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="recordRow">
                        <TextArea
                            placeholder="Record whatever you wish herein"
                            value={pendingChanges.record}
                            label="Note"
                            error={error.record}
                            onChange={(event) => updateData('record', event.target.value)}
                            height="18vh"
                            maxLength={750}
                        />
                    </div>
                    {/* <div className="tagsRow">

                    </div> */}
                    {/* <div className="ContactsRow">
                        <h3>Related Contacts</h3>
                        <div>
                            cards go here, or none available message...
                        </div>
                    </div> */}

                    <div className="dateInfo inputRow rowMargin">
                        <div>
                            Created On: {note.createdOn}
                        </div>
                        <div>
                            Last Modified: {note.lastModifiedOn}
                        </div>
                    </div>
                    {!isNewNote && <div id="dangerRow">
                        <div></div>
                        <Button
                            id="delete-note-button"
                            label="DELETE"
                            type="danger"
                            icon="trashCan"
                            onClick={() => setShowDeleteModal(true)}
                        />
                    </div>}
                </GridWrapper>
            </ScrollContainer>

            <CommonModal
                show={isNoteDeletePending || showDeleteModal}
                icon={'trashCan'}
                title={'Please Confirm Note Deletion'}
                onClose={() => setShowDeleteModal(false)}
                onSubmit={() => handleDeleteConfirm()}
                submitText={'Confirm'}
            >
                <div>
                    Are you certain you would like to delete {note.title}? This cannot be undone.
                </div>
            </CommonModal>
        </>
    );
}

EditNote.propTypes = {
    note: PropTypes.object.isRequired,
    isNotePending: PropTypes.bool.isRequired,
    noteError: PropTypes.string.isRequired,
    isNotePostPending: PropTypes.bool.isRequired,
    notePostError: PropTypes.any.isRequired,
    isNotePutPending: PropTypes.bool.isRequired,
    notePutError: PropTypes.string.isRequired,
    isNoteDeletePending: PropTypes.bool.isRequired,
    noteDeleteError: PropTypes.string.isRequired,
    getNote: PropTypes.func.isRequired,
    putNote: PropTypes.func.isRequired,
    postNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired
};
