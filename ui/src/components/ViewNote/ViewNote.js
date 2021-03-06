import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { exportDataList } from '../../common/Utilities/utilities';
import PropTypes from 'prop-types';
import ScrollContainer from '../../common/ScrollContainer';

const ContentWrapper = styled.div`
    padding: 0 1em;
`;

const GridWrapper = styled.div`
    .configureRow {
        height: 15vh;
        display: flex;
        justify-content: right;
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

    .recordsRow {
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
`;

export default function ViewNote (props) {
    const { noteId } = useParams();
    const {
        note,
        isNotePending,
        noteError,
        getNote
    } = props;

    useEffect(() => {
        // initial GET of note
        if (noteId) {
            getNote(noteId);
        }
    }, [noteId]);

    function exportNote () {
        exportDataList(['notes'], [[note]], `note-${noteId}`);
    }

    // TODO: handle loading state, 404s and errors
    return (
        <>
            {noteError
                ? (<ContentWrapper>
                    <p>No such note exists. (TODO, options to go back or create new, and address header...</p>
                </ContentWrapper>)
                : (
                    <>
                        <EntityTitleHeader
                            title={`${note.title} ${note.date}`}
                            editMode={false}
                            type='Note'
                        />
                        <ContentWrapper>
                            {isNotePending
                                ? (<LoadingSpinner />)
                                : (
                                    <ScrollContainer
                                        style={{ margin: '2em 2em 0 2em' }}
                                    >
                                        <GridWrapper>
                                            <div className="metadataRow">
                                                <div id="titleData" className="inputRow rowMargin">
                                                    <Input
                                                        value={note.title}
                                                        label='Title'
                                                        locked={true}
                                                    />
                                                    <DateInput
                                                        value={note.date}
                                                        label="Date"
                                                        locked={true}
                                                    />
                                                </div>
                                                <div id="placementData" className="inputRow rowMargin">
                                                    <Input
                                                        value={note.address}
                                                        label="Address"
                                                        locked={true}
                                                    />
                                                    {/* <Input
                                placeholder="upload files"
                                value={note.files}
                                label="Files"
                                error={error.files}
                                onChange={(event) => updateData('files', event.target.value)}
                            /> */}
                                                </div>
                                                {/* <div className="tagsRow">

                                                </div> */}
                                                {/* <div className="ContactsRow">
                        <h3>Related Contacts</h3>
                        <div>
                            cards go here, or none available message...
                        </div>
                    </div> */}
                                            </div>
                                            <div className="recordRow">
                                                <TextArea
                                                    value={note.record}
                                                    label="Note"
                                                    height="18vh"
                                                    locked={true}
                                                />
                                            </div>
                                            <div className="dateInfo inputRow rowMargin">
                                                <div>
                                                    Created On: {note.createdOn}
                                                </div>
                                                <div>
                                                    Last Modified: {note.lastModifiedOn}
                                                </div>
                                            </div>

                                            <div className="configureRow">
                                                <Button icon="download" label="Export" onClick={exportNote} />
                                            </div>
                                        </GridWrapper>
                                    </ScrollContainer>
                                )}
                        </ContentWrapper>
                    </>
                )}
        </>
    );
}

ViewNote.propTypes = {
    note: PropTypes.object.isRequired,
    isNotePending: PropTypes.bool.isRequired,
    noteError: PropTypes.string.isRequired,
    getNote: PropTypes.func.isRequired
};
