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

const MAX_NOTE_IMAGE_BYTES = 10 * 1024 * 1024;

const GridWrapper = styled.div`
    .imageRow {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .imagePreview {
        width: 18rem;
        max-width: 100%;
        min-height: 12rem;
        border: 1px dashed #bfbfbf;
        border-radius: 4px;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem;
        color: #666666;
    }

    .imagePreview img {
        width: 100%;
        max-height: 16rem;
        object-fit: contain;
    }

    .imageControls {
        min-width: 16rem;
        flex: 1 1 16rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .imageControls label {
        font-weight: 600;
    }

    .imageControls .supportText {
        color: #666666;
        font-size: 0.9rem;
    }

    .imageControls .errorText {
        color: #c62828;
        font-size: 0.9rem;
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
        imagePath: ''
    };
    const [pendingChanges, setPendingChanges] = useState(defaultChanges);
    const [error, setError] = useState(defaultChanges);
    const [pendingImageUpload, setPendingImageUpload] = useState(null);
    const [pendingImagePreview, setPendingImagePreview] = useState('');
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // initial GET of note
        if (noteId) {
            getNote(noteId);
        } else {
            setPendingChanges(defaultChanges);
        }
    }, [noteId]);

    useEffect(() => {
        if (!noteId) {
            setPendingChanges(defaultChanges);
            setPendingImageUpload(null);
            setPendingImagePreview('');
            setRemoveCurrentImage(false);
            return;
        }

        const d = note.date ? note.date : '';
        const newValues = { ...defaultChanges, ...note, date: d };
        setPendingChanges(newValues);
        setPendingImageUpload(null);
        setPendingImagePreview(note.imagePath ? buildStoredFileUrl(note.imagePath) : '');
        setRemoveCurrentImage(false);
    }, [noteId, note]);

    // only after the page is first loaded, a post/put/delete changing from pending to success requires a redirect
    useEffect(() => {
        if (!isNotePending && note) {
            setPageLoaded(true);
        }
    }, [isNotePending]);
    useEffect(() => {
        setPendingChanges(defaultChanges);
        setPendingImageUpload(null);
        setPendingImagePreview('');
        setRemoveCurrentImage(false);
    }, [isNotePostPending]);
    useEffect(() => {
        if (pageLoaded && !isNotePutPending) {
            navigate(`/notes/${noteId}`);
        }
    }, [isNotePutPending]);
    useEffect(() => {
        if (pageLoaded && !isNoteDeletePending) {
            navigate('/notes');
        }
    }, [isNoteDeletePending]);

    function updateData (field, value) {
        // clear any errors
        const updateError = {};
        updateError[field] = '';
        setError({ ...error, ...updateError });

        // update the value
        const updatedValue = {};
        updatedValue[field] = value;
        setPendingChanges({ ...pendingChanges, ...updatedValue });
    }

    function handleImageSelection (event) {
        const selectedFile = event.target.files && event.target.files[0];
        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type || !selectedFile.type.startsWith('image/')) {
            setError({ ...error, imagePath: 'Please select an image file' });
            event.target.value = '';
            return;
        }

        if (selectedFile.size > MAX_NOTE_IMAGE_BYTES) {
            setError({ ...error, imagePath: 'Images must be 10MB or smaller' });
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = typeof reader.result === 'string' ? reader.result : '';
            setError({ ...error, imagePath: '' });
            setPendingImageUpload({
                fileName: selectedFile.name,
                mimeType: selectedFile.type,
                dataUrl
            });
            setPendingImagePreview(dataUrl);
            setRemoveCurrentImage(false);
        };
        reader.readAsDataURL(selectedFile);
        event.target.value = '';
    }

    function handleRemoveImage () {
        setError({ ...error, imagePath: '' });
        if (pendingImageUpload) {
            setPendingImageUpload(null);
            setPendingImagePreview(pendingChanges.imagePath ? buildStoredFileUrl(pendingChanges.imagePath) : '');
            setRemoveCurrentImage(false);
            return;
        }

        setPendingImageUpload(null);
        setPendingImagePreview('');
        setRemoveCurrentImage(true);
        updateData('imagePath', '');
    }

    function getDisplayedImagePreview () {
        if (pendingImagePreview) {
            return pendingImagePreview;
        }

        if (!removeCurrentImage && pendingChanges.imagePath) {
            return buildStoredFileUrl(pendingChanges.imagePath);
        }

        return '';
    }

    function handleSaveNote () {
        // validate inputs, prompt user with actionable errors
        let valid = true;
        const nextErrorState = { ...error };

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
                imageUpload: pendingImageUpload,
                removeImage: removeCurrentImage
            };

            // submit changes
            if (isNewNote) {
                postNote(submitChanges);
            } else {
                putNote(noteId, submitChanges);
            }
        }
    }

    function handleDeleteConfirm () {
        setShowDeleteModal(false);
        deleteNote(noteId);
    }

    // TODO: handle loading state, 404s and errors
    const displayedImagePreview = getDisplayedImagePreview();
    const hasImagePreview = !!displayedImagePreview;

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
                    <div className="imageRow rowMargin">
                        <div className="imagePreview">
                            {hasImagePreview
                                ? <img src={displayedImagePreview} alt="Selected note attachment" />
                                : <span>No image uploaded</span>}
                        </div>
                        <div className="imageControls">
                            <label htmlFor="note-image-upload">Image</label>
                            <input
                                id="note-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelection}
                            />
                            <Button
                                label="Remove Image"
                                type="secondary"
                                icon="trashCan"
                                onClick={handleRemoveImage}
                                disabled={!hasImagePreview && !pendingChanges.imagePath}
                            />
                            {pendingImageUpload && <div className="supportText">This image will be saved when you save the note.</div>}
                            {!pendingImageUpload && pendingChanges.imagePath && !removeCurrentImage && (
                                <div className="supportText">Saved path: {pendingChanges.imagePath}</div>
                            )}
                            <div className="supportText">Uploaded note images are stored locally in the application folder.</div>
                            {error.imagePath && <div className="errorText">{error.imagePath}</div>}
                        </div>
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
