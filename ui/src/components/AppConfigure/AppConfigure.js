import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/Button';
import Select from '../../common/Select';
import { exportDataList } from '../../common/Utilities/utilities';
import { templateContact } from '../../constants/contactConstants';
import LoadingSpinner from '../../common/LoadingSpinner';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../common/App/ToastWrapper/toastNotifications';

const ConfigureWrapper = styled.div`
    padding: 0 1em;

    .error {
        color: red;
    }
`;

export default function AppConfigure (props) {
    const {
        getAllContacts,
        postContact,
        deleteContact,
        contacts,
        isAllContactsPending,
        getAllEvents,
        postEvent,
        deleteEvent,
        events,
        isAllEventsPending,
        getAllNotes,
        postNote,
        deleteNote,
        notes,
        isAllNotesPending,
        getAllRelations,
        postRelation,
        deleteRelation,
        relations,
        isRelationListPending
    } = props;

    const fileTypeOptions = [
        {
            label: 'All Data',
            value: 'all'
        },
        {
            label: 'Contacts',
            value: 'contacts'
        },
        {
            label: 'Events',
            value: 'events'
        },
        {
            label: 'Notes',
            value: 'notes'
        },
        {
            label: 'Relations',
            value: 'relations'
        }
    ];

    const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
    const [pendingUpload, setPendingUpload] = useState(null);
    const [pendingLinkedInUpload, setPendingLinkedInUpload] = useState(null);
    const [linkedInUploadError, setLinkedInUploadError] = useState('');
    const [isLinkedInFileUploading, setIsLinkedInFileUploading] = useState(false);
    const [linkedInUploadInfo, setLinkedInUploadInfo] = useState('');
    const bulkNotificationOptions = {
        suppressSuccess: true,
        suppressError: true
    };

    useEffect(() => {
        // TODO: replace with getAll endpoints once made
        refreshConfigureData();
    }, []);

    async function refreshConfigureData () {
        await Promise.allSettled([
            getAllContacts(),
            getAllEvents(),
            getAllNotes(),
            getAllRelations()
        ]);
    }

    function parseUploadedJson () {
        if (!pendingUpload?.result) {
            throw new Error('Please browse and select a JSON backup file.');
        }

        try {
            return JSON.parse(pendingUpload.result);
        } catch (error) {
            throw new Error('The uploaded JSON backup could not be parsed.');
        }
    }

    function getUploadedEntities (entityType) {
        const uploadedJSON = parseUploadedJson();
        return uploadedJSON?.data?.[entityType]?.data || [];
    }

    async function runBulkRequests (taskFactories, successLabel, emptyLabel) {
        if (!taskFactories.length) {
            showWarningToast(emptyLabel);
            return { successCount: 0, failureCount: 0 };
        }

        const results = await Promise.allSettled(taskFactories.map(taskFactory => taskFactory()));
        const failureCount = results.filter(result => result.status === 'rejected').length;
        const successCount = taskFactories.length - failureCount;

        if (failureCount) {
            showErrorToast(`${successLabel} finished with ${failureCount} failure${failureCount === 1 ? '' : 's'} and ${successCount} success${successCount === 1 ? '' : 'es'}.`);
        } else {
            showSuccessToast(`${successLabel} completed for ${successCount} record${successCount === 1 ? '' : 's'}.`);
        }

        return {
            successCount,
            failureCount
        };
    }

    function handleListExport () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'contacts') {
            exportDataList(['contacts'], [contacts.results], 'contactList');
        } else if (type === 'events') {
            exportDataList(['events'], [events.results], 'eventList');
        } else if (type === 'notes') {
            exportDataList(['notes'], [notes.results], 'noteList');
        } else if (type === 'events') {
            exportDataList(['events'], [events.results], 'eventList');
        } else if (type === 'relations') {
            exportDataList(['relations'], [relations], 'relationList');
        } else if (type === 'all') {
            exportDataList(['contacts', 'events', 'notes', 'relations'], [contacts.results, events.results, notes.results, relations], 'fullExport');
        }
    }

    function captureUpload (event) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        setPendingUpload(reader);
    }

    function captureLIUpload (event) {
        setLinkedInUploadError(null);
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        setPendingLinkedInUpload(reader);
    }

    async function settleTaskFactories (taskFactories) {
        if (!taskFactories.length) {
            return { successCount: 0, failureCount: 0 };
        }

        const results = await Promise.allSettled(taskFactories.map(taskFactory => taskFactory()));
        const failureCount = results.filter(result => result.status === 'rejected').length;

        return {
            successCount: taskFactories.length - failureCount,
            failureCount
        };
    }

    function buildAddEntityTasks (entityType) {
        return getUploadedEntities(entityType).map(entity => {
            const newEntity = {
                ...entity
            };

            delete newEntity.id;

            switch (entityType) {
            case 'contacts':
                return () => postContact(newEntity, bulkNotificationOptions);
            case 'notes':
                return () => postNote(newEntity, bulkNotificationOptions);
            case 'events':
                return () => postEvent(newEntity, bulkNotificationOptions);
            case 'relations':
                return () => postRelation(newEntity, bulkNotificationOptions);
            default:
                return () => Promise.resolve();
            }
        });
    }

    function buildDeleteTasks (entityType) {
        switch (entityType) {
        case 'contacts':
            return (contacts.results || []).map(contact => () => deleteContact(contact.id, bulkNotificationOptions));
        case 'events':
            return (events.results || []).map(event => () => deleteEvent(event.id, bulkNotificationOptions));
        case 'notes':
            return (notes.results || []).map(note => () => deleteNote(note.id, bulkNotificationOptions));
        case 'relations':
            return relations.map(relation => () => deleteRelation(relation.id, bulkNotificationOptions));
        default:
            return [];
        }
    }

    async function handleRestore () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        const entityTypes = type === 'all' ? ['contacts', 'events', 'notes', 'relations'] : [type];

        try {
            parseUploadedJson();
        } catch (error) {
            showErrorToast(error);
            return;
        }

        const deleteTasks = entityTypes.flatMap(entityType => buildDeleteTasks(entityType));
        const addTasks = entityTypes.flatMap(entityType => buildAddEntityTasks(entityType));
        const totalTaskCount = deleteTasks.length + addTasks.length;

        if (!totalTaskCount) {
            showWarningToast(`No ${fileTypeOptions[selectedTypeIndex].label.toLowerCase()} records were available to restore.`);
            return;
        }

        const deleteSummary = await settleTaskFactories(deleteTasks);
        const addSummary = await settleTaskFactories(addTasks);
        const successCount = deleteSummary.successCount + addSummary.successCount;
        const failureCount = deleteSummary.failureCount + addSummary.failureCount;

        if (failureCount) {
            showErrorToast(`Restore ${fileTypeOptions[selectedTypeIndex].label} finished with ${failureCount} failure${failureCount === 1 ? '' : 's'} and ${successCount} success${successCount === 1 ? '' : 'es'}.`);
        } else {
            showSuccessToast(`Restore ${fileTypeOptions[selectedTypeIndex].label} completed for ${successCount} record${successCount === 1 ? '' : 's'}.`);
        }
        await refreshConfigureData();
    }

    async function handleParseLinkedInContacts () {
        setLinkedInUploadError(null);
        setIsLinkedInFileUploading(true);
        if (!pendingLinkedInUpload) {
            setLinkedInUploadError('Please Browse and select a file');
            setIsLinkedInFileUploading(false);
            showErrorToast('Please browse and select a LinkedIn contacts file.');
            return;
        }
        const linkedInFileRows = pendingLinkedInUpload.result.split(/r\n|\n/);

        const requests = linkedInFileRows.map((row, i) => {
            const rowArr = row.split(',');

            if (rowArr.length < 4) return null; // skip some metadata rows
            if (row === 'First Name,Last Name,Email Address,Company,Position,Connected On') return null; // skip header

            let connectedOn = row.match(/[0-9]{2} [A-Z][a-z]{2} [0-9]{4}/);
            if (connectedOn && connectedOn.length) {
                connectedOn = connectedOn[0];
            } else {
                console.log('no date found: ', row);
                connectedOn = '01 Jan 1990';
            }
            setLinkedInUploadInfo(`Uploading ${i} of approximately ${row.length} contacts...`);
            return () => postContact({
                ...templateContact,
                firstName: rowArr[0],
                lastName: rowArr[1],
                email: rowArr[2],
                firm: rowArr[3],
                createdOn: new Date(connectedOn),
                lastModifiedOn: new Date()
            }, bulkNotificationOptions);
        }).filter(Boolean);

        await runBulkRequests(requests, 'LinkedIn import', 'No LinkedIn contacts were found in the selected file.');
        await refreshConfigureData();
        setIsLinkedInFileUploading(false);
        setLinkedInUploadInfo('');
    }

    async function handleAddData () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        const entityTypes = type === 'all' ? ['contacts', 'events', 'notes', 'relations'] : [type];

        try {
            parseUploadedJson();
        } catch (error) {
            showErrorToast(error);
            return;
        }

        const addRequests = entityTypes.flatMap(entityType => buildAddEntityTasks(entityType));
        await runBulkRequests(
            addRequests,
            `Import ${fileTypeOptions[selectedTypeIndex].label}`,
            `No ${fileTypeOptions[selectedTypeIndex].label.toLowerCase()} records were found in the uploaded backup.`
        );
        await refreshConfigureData();
    }

    return (
        <ConfigureWrapper>
            <h2>Configure Application</h2>
            <hr />
            {(isAllContactsPending || isAllEventsPending || isAllNotesPending || isRelationListPending)
                ? (<LoadingSpinner />)
                : (<>
                    <h3>Manage Records</h3>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <p>Select what type of records you are processing:</p>
                            <Select options={fileTypeOptions} selectedIndex={selectedTypeIndex} onSelect={setSelectedTypeIndex} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <p>Upload your saved records:</p>
                            <input type="file" name="uploadedFile" id="uploadedFile" accept="application/json" onChange={e => captureUpload(e)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Export</h4>
                            <p>You can make backups by saving JSON files.</p>
                            <Button icon="download" label={`Export ${fileTypeOptions[selectedTypeIndex].label}`} type="secondary" onClick={() => handleListExport()} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Import</h4>
                            <p>Adding data will create new records. This does not check for duplicates of existing data.</p>
                            <Button icon="upload" label={`Add ${fileTypeOptions[selectedTypeIndex].label}`} type="secondary" onClick={() => handleAddData()} />
                            <p>Restoring data will remove all existing data and replace them with those in the uploaded file.</p>
                            <Button icon="upload" label={`Restore ${fileTypeOptions[selectedTypeIndex].label}`} type="secondary" onClick={() => handleRestore()} />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" />
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Import LinkedIn Contacts</h4>
                            <p>Upload the 'Contacts.csv' file:</p>
                            <input type="file" name="linkedinContacts" id="linkedinContacts" onChange={e => captureLIUpload(e)} />
                            <p>We will attempt to find contacts in the selected file and add them to your records</p>
                            <Button isPending={isLinkedInFileUploading} icon="upload" label={'Extract & Upload'} type="secondary" onClick={() => handleParseLinkedInContacts()} />
                            <p className='error'>{linkedInUploadError}</p>
                            <p className='info'>{linkedInUploadInfo}</p>
                        </div>
                    </div>
                    {/*
                    TODO: add confirm modal
                        validate shape of upload
                        determine upload type (contact, notes, etc)
                        state if invalid format
                        CONFIRM that you want to (DELETE (XXX contacts) (and) (XXX notes) and) (ADD (XXX contacts) (and) (XXX notes)

                        NEW Export Shape:
                            timestamp: new Date()
                            version: string
                            data: {
                                contacts: [],
                                notes: [],
                            }
                    */}
                </>)
            }
        </ConfigureWrapper>
    );
}

AppConfigure.propTypes = {
    getAllContacts: PropTypes.func.isRequired,
    postContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    contacts: PropTypes.object.isRequired,
    isAllContactsPending: PropTypes.bool.isRequired,
    contactListError: PropTypes.string.isRequired,
    isContactPostPending: PropTypes.bool.isRequired,
    contactPostError: PropTypes.string.isRequired,
    isContactDeletePending: PropTypes.bool.isRequired,
    getAllEvents: PropTypes.func.isRequired,
    postEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    events: PropTypes.object.isRequired,
    isAllEventsPending: PropTypes.bool.isRequired,
    eventListError: PropTypes.string.isRequired,
    isEventPostPending: PropTypes.bool.isRequired,
    eventPostError: PropTypes.string.isRequired,
    isEventDeletePending: PropTypes.bool.isRequired,
    getAllNotes: PropTypes.func.isRequired,
    postNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired,
    isAllNotesPending: PropTypes.bool.isRequired,
    noteListError: PropTypes.string.isRequired,
    isNotePostPending: PropTypes.bool.isRequired,
    notePostError: PropTypes.string.isRequired,
    isNoteDeletePending: PropTypes.bool.isRequired,
    getAllRelations: PropTypes.func.isRequired,
    postRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired,
    relations: PropTypes.array.isRequired,
    isRelationListPending: PropTypes.bool.isRequired,
    relationListError: PropTypes.string.isRequired
};
