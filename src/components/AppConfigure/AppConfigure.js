import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/Button';
import { exportJSON } from '../../common/Utilities/utilities';
import LoadingSpinner from '../../common/LoadingSpinner';

const ConfigureWrapper = styled.div`
    padding: 0 1em;
`;

export default function AppConfigure(props) {
    const {
        getContactListMetadata,
        getContactList,
        postContact,
        deleteContact,
        contacts,
        isContactListPending,
        contactListError,
        contactsMetadata,
        isContactListMetadataPending,
        isContactListMetadataError,
        isContactPostPending,
        contactPostError,
        isContactDeletePending,
        contactDeleteError,
    } = props;

    const [pendingUpload, setPendingUpload] = useState(null);

    useEffect(() => {
        getContactListMetadata('');
    }, []);

    useEffect(() => {
        getContactList(contactsMetadata.total, 1, '', 'firstName', 'ASC');
    }, [contactsMetadata]);

    function handleContactListExport() {
        exportJSON(contacts, `contactList`);
    }

    function captureUpload(event) {
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        setPendingUpload(reader);
    }

    function handleAddContacts() {
        const uploadedJSON = JSON.parse(pendingUpload.result);
        console.log(uploadedJSON);
        uploadedJSON.data.forEach(contact => {
            console.log(contact);
            let newContact = {
                ...contact,
                lastModifiedOn: new Date().toISOString(),
            }
            delete newContact['id'];
            postContact(newContact);
        });
    }

    function handleRestoreContacts() {
        contacts.forEach(contact => deleteContact(contact.id));
        handleAddContacts();
    }

    return (
        <ConfigureWrapper>
            <h2>Configure Application</h2>
            <hr/>
            {isContactListPending || isContactListMetadataPending ? (
                <LoadingSpinner />
            ) : (
                <>
                    <h3>Manage Contacts</h3>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Export</h4>
                            <p>You can make backups by saving JSON files.</p>
                            <Button label="Export All Contacts" type="secondary" onClick={handleContactListExport} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <h4>Import</h4>
                            <p>Upload your saved JSON files, then restore or add the contacts.</p>
                            <input type="file" name="contactFile" id="contactFile" accept="application/json" onChange={e => captureUpload(e)} />
                            <p>Adding contacts will create new records. This does not check for duplicates of existing contacts.</p>
                            <Button label="Add Contacts" type="secondary" onClick={handleAddContacts} />
                            <p>Restoring contacts will remove all existing contacts and replace them with those in the uploaded file.</p>
                            <Button label="Restore Contacts" type="secondary" onClick={handleRestoreContacts} />
                        </div>
                    </div>
                </>
            )}
        </ConfigureWrapper>
    );
}

AppConfigure.propTypes = {
    getContactListMetadata: PropTypes.func.isRequired,
    getContactList: PropTypes.func.isRequired,
    postContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    contacts: PropTypes.object.isRequired,
    isContactListPending: PropTypes.bool.isRequired,
    contactListError: PropTypes.string.isRequired,
    contactsMetadata: PropTypes.object.isRequired,
    isContactListMetadataPending: PropTypes.bool.isRequired,
    isContactListMetadataError: PropTypes.string.isRequired,
    isContactPostPending: PropTypes.bool.isRequired,
    contactPostError: PropTypes.object.isRequired,
    isContactDeletePending: PropTypes.bool.isRequired,
    contactDeleteError: PropTypes.string.isRequired,
}