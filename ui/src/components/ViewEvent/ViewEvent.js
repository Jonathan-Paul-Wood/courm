import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { exportDataList } from '../../common/Utilities/utilities';
import RelationCardManager from '../../common/RelationCardManager';
import ScrollContainer from '../../common/ScrollContainer';
import PropTypes from 'prop-types';

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

        .inputRow {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    .descriptionRow {
        height: 20vh;
        width: 100%;
        margin: 0 1.25em;
    }

    tagsRow {
        height: 20rem;
    }

    .relationsRow {
        display: flex;
        justify-content: space-between;

        .relationsList {
            min-width: 50%;
            margin: 1em;
        }
    }

    .dateInfo {
        font-style: italic;
        font-size: 0.8rem;
    }
`;

export default function ViewEvent (props) {
    const { eventId } = useParams();
    const {
        event,
        isEventPending,
        eventError,
        getEvent
    } = props;
    const [firstRelationCardEdit, setFirstRelationCardEdit] = useState(false);
    const [secondRelationCardEdit, setSecondRelationCardEdit] = useState(false);

    useEffect(() => {
        // initial GET of event
        if (eventId) {
            getEvent(eventId);
        }
    }, [eventId]);

    function exportEvent () {
        exportDataList(['events'], [[event]], `event-${eventId}`);
    }

    // TODO: handle loading state, 404s and errors
    return (
        <>
            {eventError
                ? (<ContentWrapper>
                    <p>No such event exists. (TODO, options to go back or create new, and address header...</p>
                </ContentWrapper>)
                : (
                    <>
                        <EntityTitleHeader
                            title={`${event.title} ${event.date.split('T')[0]}`}
                            editMode={false}
                            type='Event'
                        />
                        <ContentWrapper>
                            {isEventPending
                                ? (<LoadingSpinner />)
                                : (
                                    <ScrollContainer
                                        style={{ margin: '2em 2em 0 2em' }}
                                    >
                                        <GridWrapper>
                                            <div className="metadataRow">
                                                <div id="titleData" className="inputRow rowMargin">
                                                    <Input
                                                        value={event.title}
                                                        label='Title'
                                                        locked={true}
                                                    />
                                                    <DateInput
                                                        value={event.date}
                                                        label="Date"
                                                        locked={true}
                                                    />
                                                </div>
                                                <div id="placementData" className="inputRow rowMargin">
                                                    <Input
                                                        value={event.address}
                                                        label="Address"
                                                        locked={true}
                                                    />
                                                    {/* <Input
                                placeholder="upload files"
                                value={event.files}
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
                                                <div className="relationsRow">
                                                    <RelationCardManager
                                                        parentType={'event'}
                                                        parentId={parseInt(eventId)}
                                                        relationType='contact'
                                                        editMode={firstRelationCardEdit}
                                                        disableEdit={secondRelationCardEdit}
                                                        onChange={setFirstRelationCardEdit}
                                                    />
                                                    <RelationCardManager
                                                        parentType={'event'}
                                                        parentId={parseInt(eventId)}
                                                        relationType='note'
                                                        editMode={secondRelationCardEdit}
                                                        disableEdit={firstRelationCardEdit}
                                                        onChange={setSecondRelationCardEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="descriptionRow">
                                                <TextArea
                                                    value={event.description}
                                                    label="Event"
                                                    height="18vh"
                                                    locked={true}
                                                />
                                            </div>
                                            <div className="dateInfo inputRow rowMargin">
                                                <div>
                                                    Created On: {event.createdOn}
                                                </div>
                                                <div>
                                                    Last Modified: {event.lastModifiedOn}
                                                </div>
                                            </div>

                                            <div className="configureRow">
                                                <Button icon="download" label="Export" onClick={exportEvent} />
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

ViewEvent.propTypes = {
    event: PropTypes.object.isRequired,
    isEventPending: PropTypes.bool.isRequired,
    eventError: PropTypes.string.isRequired,
    getEvent: PropTypes.func.isRequired
};
