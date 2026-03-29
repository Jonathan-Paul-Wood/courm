import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { buildStoredFileUrl, exportDataList } from '../../common/Utilities/utilities';
import PropTypes from 'prop-types';
import RelationCardManager from '../../common/RelationCardManager';
import ScrollContainer from '../../common/ScrollContainer';

const NOTE_MEDIA_TYPE_LABELS = {
    image: 'Image',
    audio: 'Audio',
    video: 'Video'
};

const ContentWrapper = styled.div`
    padding: 0 1em;

    .link {
        color: blue;
        text-decoration-line: underline;
        cursor: pointer;
    }
`;

const GridWrapper = styled.div`
    .mediaRow {
        margin-bottom: 1.5rem;
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
        width: 100%;
        min-height: 14rem;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 0.75rem;
    }

    .mediaPreview img,
    .mediaPreview video {
        width: 100%;
        max-height: 22rem;
        object-fit: contain;
    }

    .mediaPreview audio {
        width: 100%;
    }

    .mediaMeta {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        color: #666666;
        font-size: 0.9rem;
    }

    .mediaPath {
        color: #666666;
        font-size: 0.9rem;
        word-break: break-word;
    }

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

    .relationsRow {
        display: flex;
        justify-content: space-between;

        .relationsList {
            min-width: 50%;
            margin: 1em;
        }
    }

    tagsRow {
        height: 20rem;
    }

    .dateInfo {
        font-style: italic;
        font-size: 0.8rem;
    }
`;

function getMediaSource (mediaFile) {
    if (!mediaFile || !mediaFile.path) {
        return '';
    }

    return buildStoredFileUrl(mediaFile.path);
}

export default function ViewNote (props) {
    const { noteId } = useParams();
    const {
        note,
        isNotePending,
        noteError,
        getNote
    } = props;
    const [firstRelationCardEdit, setFirstRelationCardEdit] = useState(false);
    const [secondRelationCardEdit, setSecondRelationCardEdit] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (noteId) {
            getNote(noteId);
        }
    }, [noteId]);

    function exportNote () {
        exportDataList(['notes'], [[note]], `note-${noteId}`);
    }

    function renderMediaPreview (mediaFile) {
        const mediaSource = getMediaSource(mediaFile);

        if (!mediaSource) {
            return <span>No preview available</span>;
        }

        if (mediaFile.type === 'image') {
            return <img src={mediaSource} alt={mediaFile.name || `${note.title} attachment`} />;
        }

        if (mediaFile.type === 'audio') {
            return <audio controls src={mediaSource} />;
        }

        if (mediaFile.type === 'video') {
            return <video controls src={mediaSource} />;
        }

        return <span>No preview available</span>;
    }

    const noteDate = note.date ? note.date.split('T')[0] : '';
    const mediaFiles = Array.isArray(note.mediaFiles) ? note.mediaFiles : [];

    return (
        <>
            {noteError
                ? (<ContentWrapper>
                    <p>No such note exists. You can try <span className="link" onClick={() => navigate('/notes/new')}>creating one</span>, or return to the <span className="link" onClick={() => navigate('/notes')}>search existing notes</span></p>
                </ContentWrapper>)
                : (
                    <>
                        <EntityTitleHeader
                            title={`${note.title} ${noteDate}`.trim()}
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
                                            {!!mediaFiles.length && (
                                                <div className="mediaRow">
                                                    <div className="mediaGrid">
                                                        {mediaFiles.map((mediaFile) => (
                                                            <div key={mediaFile.id} className="mediaCard">
                                                                <div className="mediaPreview">
                                                                    {renderMediaPreview(mediaFile)}
                                                                </div>
                                                                <div className="mediaMeta">
                                                                    <span>{mediaFile.name}</span>
                                                                    <span>{NOTE_MEDIA_TYPE_LABELS[mediaFile.type]}</span>
                                                                </div>
                                                                <div className="mediaPath">Saved path: {mediaFile.path}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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
                                                </div>
                                                {/* <div className="tagsRow">

                                                </div> */}
                                                {/* <div className="ContactsRow">
                        <h3>Related Contacts</h3>
                        <div>
                            cards go here, or none available message...
                        </div>
                    </div> */}
                                                <div className="relationsRow">
                                                    <RelationCardManager
                                                        parentType={'note'}
                                                        parentId={parseInt(noteId)}
                                                        relationType='contact'
                                                        editMode={firstRelationCardEdit}
                                                        disableEdit={secondRelationCardEdit}
                                                        onChange={setFirstRelationCardEdit}
                                                    />
                                                    <RelationCardManager
                                                        parentType={'note'}
                                                        parentId={parseInt(noteId)}
                                                        relationType='event'
                                                        editMode={secondRelationCardEdit}
                                                        disableEdit={firstRelationCardEdit}
                                                        onChange={setSecondRelationCardEdit}
                                                    />
                                                </div>
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
