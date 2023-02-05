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

        #delete-event-button {
            display: flex;
            justify-content: right;
        }
    }
`;

export default function EditEvent (props) {
    const location = useLocation();
    const isNewEvent = !!location.pathname.match('/new');
    const { eventId } = useParams();
    const {
        event,
        isEventPending,
        getEvent,
        postEvent,
        isEventPostPending,
        putEvent,
        isEventPutPending,
        deleteEvent,
        isEventDeletePending
    } = props;
    const defaultChanges = {
        title: '',
        date: '',
        address: '',
        description: ''
    };
    const [pendingChanges, setPendingChanges] = useState(defaultChanges);
    const [error, setError] = useState(defaultChanges);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // initial GET of event
        if (eventId) {
            setPendingChanges(getEvent(eventId));
        } else {
            setPendingChanges(defaultChanges);
        }
    }, []);

    useEffect(() => {
        // update page when GET returns
        const d = event.date ? event.date : '';
        const newValues = { ...event, date: d };
        // TODO: handle 404, and Errors
        setPendingChanges(newValues);
    }, [event]);

    // only after the page is first loaded, a post/put/delete changing from pending to success requires a redirect
    useEffect(() => {
        if (!isEventPending && event) {
            setPageLoaded(true);
        }
    }, [isEventPending]);
    useEffect(() => {
        setPendingChanges(defaultChanges);
    }, [isEventPostPending]);
    useEffect(() => {
        if (pageLoaded && !isEventPutPending) {
            navigate(`/events/${eventId}`);
        }
    }, [isEventPutPending]);
    useEffect(() => {
        if (pageLoaded && !isEventDeletePending) {
            navigate('/events');
        }
    }, [isEventDeletePending]);

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

    function handleSaveEvent () {
        // validate inputs, prompt user with actionable errors
        let valid = true;
        if (!pendingChanges.title) {
            valid = false;
            setError({ ...error, ...{ title: 'Please enter title' } });
        }
        if (pendingChanges.date &&
            !pendingChanges.date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g)
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
            if (isNewEvent) {
                postEvent(submitChanges);
            } else {
                putEvent(eventId, submitChanges);
            }
        }
    }

    function handleDeleteConfirm () {
        setShowDeleteModal(false);
        deleteEvent(eventId);
    }

    // TODO: handle loading state, 404s and errors
    return (
        <>
            <EntityTitleHeader
                title={isNewEvent ? 'New Event' : 'Edit Event'}
                editMode={true}
                handleSave={handleSaveEvent}
                disableSave={
                    isEventPending ||
                    isEventPostPending ||
                    isEventPutPending
                }
                type='Event'
            />
            <ScrollContainer
                style={{
                    margin: '2em 2em 0 2em',
                    padding: '0 1em'
                }}
            >
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
                                onChange={(newDate) => { updateData('date', newDate); } }
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
                    <div className="descriptionRow">
                        <TextArea
                            placeholder="Description"
                            value={pendingChanges.description}
                            label="Event"
                            error={error.description}
                            onChange={(event) => updateData('description', event.target.value)}
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
                    {!isNewEvent && <div id="dangerRow">
                        <div></div>
                        <Button
                            id="delete-event-button"
                            label="DELETE"
                            type="danger"
                            icon="trashCan"
                            onClick={() => setShowDeleteModal(true)}
                        />
                    </div>}
                </GridWrapper>
            </ScrollContainer>

            <CommonModal
                show={isEventDeletePending || showDeleteModal}
                icon={'trashCan'}
                title={'Please Confirm Event Deletion'}
                onClose={() => setShowDeleteModal(false)}
                onSubmit={() => handleDeleteConfirm()}
                submitText={'Confirm'}
            >
                <div>
                    Are you certain you would like to delete {event.title}? This cannot be undone.
                </div>
            </CommonModal>
        </>
    );
}

EditEvent.propTypes = {
    event: PropTypes.object.isRequired,
    isEventPending: PropTypes.bool.isRequired,
    eventError: PropTypes.string.isRequired,
    isEventPostPending: PropTypes.bool.isRequired,
    eventPostError: PropTypes.any.isRequired,
    isEventPutPending: PropTypes.bool.isRequired,
    eventPutError: PropTypes.string.isRequired,
    isEventDeletePending: PropTypes.bool.isRequired,
    eventDeleteError: PropTypes.string.isRequired,
    getEvent: PropTypes.func.isRequired,
    putEvent: PropTypes.func.isRequired,
    postEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired
};
