import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import CommonModal from '../../common/CommonModal/CommonModal';
import PropTypes from 'prop-types';

const ScrollContainer = styled.div`
    margin: 2em 2em 0 2em;
    padding: 0 1em;
`;

const GridWrapper = styled.div`
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
        record: ''
    };
    const [pendingChanges, setPendingChanges] = useState(defaultChanges);
    const [error, setError] = useState(defaultChanges);
    const history = useHistory();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // initial GET of note
        if (noteId) {
            setPendingChanges(getNote(noteId));
        } else {
            setPendingChanges(defaultChanges);
        }
    }, []);

    useEffect(() => {
        // update page when GET returns
        const d = note.date ? note.date.split('T')[0] : '';
        const newValues = { ...note, date: d };
        // TODO: handle 404, and Errors
        setPendingChanges(newValues);
    }, [note]);

    // only after the page is first loaded, a post/put/delete changing from pending to success requires a redirect
    useEffect(() => {
        if (!isNotePending && note) {
            setPageLoaded(true);
        }
    }, [isNotePending]);
    useEffect(() => {
        setPendingChanges(defaultChanges);
    }, [isNotePostPending]);
    useEffect(() => {
        if (pageLoaded && !isNotePutPending) {
            history.push(`/notes/${noteId}`);
        }
    }, [isNotePutPending]);
    useEffect(() => {
        if (pageLoaded && !isNoteDeletePending) {
            history.push('/notes');
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

    function handleSaveNote () {
        // validate inputs, prompt user with actionable errors
        let valid = true;
        if (!pendingChanges.title) {
            valid = false;
            setError({ ...error, ...{ title: 'Please enter title' } });
        }
        if (pendingChanges.date &&
                (pendingChanges.date &&
                    !pendingChanges.date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g)
                )
        ) {
            valid = false;
            setError({ ...error, ...{ date: 'Expected format: YYYY-MM-DD' } });
        }

        if (valid) {
            let d = pendingChanges.date;
            if (d) {
                d = new Date(pendingChanges.date).toISOString();
            }

            const submitChanges = {
                ...pendingChanges,
                lastModifiedOn: new Date().toISOString(),
                date: d
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
            <ScrollContainer>
                <GridWrapper>
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
                                onChange={(event) => updateData('date', event.target.value)}
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
                            {/* <Input
                                placeholder="upload files"
                                value={pendingChanges.files}
                                label="Files"
                                error={error.files}
                                onChange={(event) => updateData('files', event.target.value)}
                            /> */}
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
