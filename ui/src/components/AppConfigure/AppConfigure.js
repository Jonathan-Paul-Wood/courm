import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/Button';
import Select from '../../common/Select';
import { exportDataList } from '../../common/Utilities/utilities';
import LoadingSpinner from '../../common/LoadingSpinner';

const ConfigureWrapper = styled.div`
    padding: 0 1em;
`;

export default function AppConfigure (props) {
    const {
        getContactList,
        postContact,
        deleteContact,
        contacts,
        isContactListPending,
        getNoteList,
        postNote,
        deleteNote,
        notes,
        isNoteListPending
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
            label: 'Notes',
            value: 'notes'
        }
    ];

    const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
    const [pendingUpload, setPendingUpload] = useState(null);

    useEffect(() => {
        // TODO: replace with getAll endpoints once made
        getContactList(100000, 1, '', 'firstName', 'ASC'); // TODO: how to stop double calls
        getNoteList(100000, 1, '', 'title', 'ASC'); // TODO: how to stop double calls
    }, []);

    function handleListExport () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'contacts') {
            exportDataList(['contacts'], [contacts.results], 'contactList');
        } else if (type === 'notes') {
            exportDataList(['notes'], [notes.results], 'noteList');
        } else if (type === 'all') {
            exportDataList(['contacts', 'notes'], [contacts.results, notes.results], 'fullExport');
        }
    }

    function captureUpload (event) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        setPendingUpload(reader);
    }

    function handleAddContacts () {
        const uploadedJSON = JSON.parse(pendingUpload.result);
        uploadedJSON.data.contacts.data.forEach(contact => {
            const newContact = {
                ...contact,
                lastModifiedOn: new Date().toISOString()
            };
            delete newContact.id;
            postContact(newContact);
        });
    }

    function handleAddNotes () {
        const uploadedJSON = JSON.parse(pendingUpload.result);
        uploadedJSON.data.notes.data.forEach(note => {
            const newNote = {
                ...note
            };
            delete newNote.id;
            postNote(newNote);
        });
    }

    function handleRestore () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'contacts') {
            contacts.forEach(contact => deleteContact(contact.id));
            handleAddContacts();
        } else if (type === 'notes') {
            notes.forEach(note => deleteNote(note.id));
            handleAddNotes();
        } else if (type === 'all') {
            contacts.forEach(contact => deleteContact(contact.id));
            handleAddContacts();
            notes.forEach(note => deleteNote(note.id));
            handleAddNotes();
        }
    }

    function handleAddData () {
        const type = fileTypeOptions[selectedTypeIndex].value;
        if (type === 'contacts') {
            handleAddContacts();
        } else if (type === 'notes') {
            handleAddNotes();
        } else if (type === 'all') {
            handleAddContacts();
            handleAddNotes();
        }
    }

    return (
        <ConfigureWrapper>
            <h2>Configure Application</h2>
            <hr/>
            {(isContactListPending || isNoteListPending)
                ? (<LoadingSpinner />)
                : (<>
                    <h3>Manage Records</h3>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <p>Select what type of records you are processing:</p>
                            <Select options={fileTypeOptions} selectedIndex={selectedTypeIndex} onSelect={setSelectedTypeIndex}/>
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
    getContactList: PropTypes.func.isRequired,
    postContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    contacts: PropTypes.object.isRequired,
    isContactListPending: PropTypes.bool.isRequired,
    contactListError: PropTypes.string.isRequired,
    isContactPostPending: PropTypes.bool.isRequired,
    contactPostError: PropTypes.string.isRequired,
    isContactDeletePending: PropTypes.bool.isRequired,
    contactDeleteError: PropTypes.string.isRequired,
    getNoteList: PropTypes.func.isRequired,
    postNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired,
    isNoteListPending: PropTypes.bool.isRequired,
    noteListError: PropTypes.string.isRequired,
    isNotePostPending: PropTypes.bool.isRequired,
    notePostError: PropTypes.string.isRequired,
    isNoteDeletePending: PropTypes.bool.isRequired,
    noteDeleteError: PropTypes.string.isRequired
};
