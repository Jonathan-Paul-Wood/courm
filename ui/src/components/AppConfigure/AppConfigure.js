import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/Button';
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
        isContactListPending
    } = props;

    const [pendingUpload, setPendingUpload] = useState(null);

    useEffect(() => {
        // TODO: replace with getAll endpoint once made
        getContactList(100000, 1, '', 'firstName', 'ASC'); // TODO: how to stop double calls
    }, []);

    function handleContactListExport () {
        exportDataList('contacts', contacts.results, 'contactList');
    }

    function captureUpload (event) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        setPendingUpload(reader);
    }

    function handleAddContacts () {
        const uploadedJSON = JSON.parse(pendingUpload.result);
        uploadedJSON.data.contacts.data.forEach(contact => {
            console.log(contact);
            const newContact = {
                ...contact,
                lastModifiedOn: new Date().toISOString()
            };
            delete newContact.id;
            postContact(newContact);
        });
    }

    function handleRestoreContacts () {
        contacts.forEach(contact => deleteContact(contact.id));
        handleAddContacts();
    }

    return (
        <ConfigureWrapper>
            <h2>Configure Application</h2>
            <hr/>
            {isContactListPending
                ? (<LoadingSpinner />)
                : (<>
                    <h3>Manage Contacts</h3>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Export</h4>
                            <p>You can make backups by saving JSON files.</p>
                            <Button icon="download" label="Export All Contacts" type="secondary" onClick={handleContactListExport} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Import</h4>
                            <p>Upload your saved JSON files, then restore or add the contacts.</p>
                            <input type="file" name="contactFile" id="contactFile" accept="application/json" onChange={e => captureUpload(e)} />
                            <p>Adding contacts will create new records. This does not check for duplicates of existing contacts.</p>
                            <Button icon="upload" label="Add Contacts" type="secondary" onClick={handleAddContacts} />
                            <p>Restoring contacts will remove all existing contacts and replace them with those in the uploaded file.</p>
                            <Button icon="upload" label="Restore Contacts" type="secondary" onClick={handleRestoreContacts} />
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
    contactDeleteError: PropTypes.string.isRequired
};
