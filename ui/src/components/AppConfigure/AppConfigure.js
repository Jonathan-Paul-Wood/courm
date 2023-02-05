import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/Button';
import Select from '../../common/Select';
import { exportDataList } from '../../common/Utilities/utilities';
import { templateContact } from '../../constants/contactConstants';
import LoadingSpinner from '../../common/LoadingSpinner';

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

    useEffect(() => {
        // TODO: replace with getAll endpoints once made
        getAllContacts();
        getAllEvents();
        getAllNotes();
        getAllRelations();
    }, []);

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

    function handleAddEntity (entityType) {
        const uploadedJSON = JSON.parse(pendingUpload.result);
        if (uploadedJSON && uploadedJSON.data && uploadedJSON.data[entityType] && uploadedJSON.data[entityType].data && uploadedJSON.data[entityType].data.length) {
            uploadedJSON.data[entityType].data.forEach(entity => {
                const newEntity = {
                    ...entity
                };
                delete newEntity.id;
                switch (entityType) {
                case 'contacts':
                    postContact(newEntity);
                    break;
                case 'notes':
                    postNote(newEntity);
                    break;
                case 'events':
                    postEvent(newEntity);
                    break;
                case 'relations':
                    postRelation(newEntity);
                    break;
                }
            });
        }
    }

    function handleRestore () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'all') {
            contacts.results.forEach(contact => deleteContact(contact.id));
            handleAddEntity('contacts');
            notes.results.forEach(note => deleteNote(note.id));
            handleAddEntity('notes');
            events.results.forEach(event => deleteEvent(event.id));
            handleAddEntity(type);
            relations.forEach(event => deleteRelation(event.id));
            handleAddEntity(type);
        } else if (type === 'contacts') {
            contacts.results.forEach(contact => deleteContact(contact.id));
            handleAddEntity(type);
        } else if (type === 'events') {
            events.results.forEach(event => deleteEvent(event.id));
            handleAddEntity(type);
        } else if (type === 'notes') {
            notes.results.forEach(note => deleteNote(note.id));
            handleAddEntity(type);
        } else if (type === 'relations') {
            relations.forEach(event => deleteRelation(event.id));
            handleAddEntity(type);
        }
    }

    function handleParseLinkedInContacts () {
        setLinkedInUploadError(null);
        setIsLinkedInFileUploading(true);
        if (!pendingLinkedInUpload) {
            setLinkedInUploadError('Please Browse and select a file');
        }
        const linkedInFileRows = pendingLinkedInUpload.result.split(/r\n|\n/);

        linkedInFileRows.forEach((row, i) => {
            const rowArr = row.split(',');

            if (rowArr.length < 4) return; // skip some metadata rows
            if (row === 'First Name,Last Name,Email Address,Company,Position,Connected On') return; // skip header

            let connectedOn = row.match(/[0-9]{2} [A-Z][a-z]{2} [0-9]{4}/);
            if (connectedOn && connectedOn.length) {
                connectedOn = connectedOn[0];
            } else {
                console.log('no date found: ', row);
                connectedOn = '01 Jan 1990';
            }
            setLinkedInUploadInfo(`Uploading ${i} of approximately ${row.length} contacts...`);
            postContact({
                ...templateContact,
                firstName: rowArr[0],
                lastName: rowArr[1],
                email: rowArr[2],
                firm: rowArr[3],
                createdOn: new Date(connectedOn),
                lastModifiedOn: new Date()
            });
        });

        setIsLinkedInFileUploading(false);
        setLinkedInUploadInfo('');
    }

    function handleAddData () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'all') {
            handleAddEntity('contacts');
            handleAddEntity('events');
            handleAddEntity('notes');
            handleAddEntity('relations');
        } else {
            handleAddEntity(type);
        }
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
                            <input type="file" name="linedinContacts" id="linedinContacts" accept="csv" onChange={e => captureLIUpload(e)} />
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
