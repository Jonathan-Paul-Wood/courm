import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import CommonModal from '../../common/CommonModal/CommonModal';

const ScrollContainer = styled.div`
    margin: 4em 2em 0 2em;
    padding: 0 1em;
`;

const GridWrapper = styled.div`
    .imageRow {
        height: 15vh;
        display: flex;
        justify-content: space-between;
        
        #profile-picture {
            margin: auto 0;
            max-height: 13vh;
            width: auto;
        }

        #picture-upload {
        }

        img {
            cursor: pointer;
        }
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

    .bioRow {
        height: 20vh;
        width: 100%;
        margin: 0 1.25em;
    }

    tagsRow {
        height: 20rem;
    }

    #dangerRow {
        margin: 2rem;
        display: flex;
        justify-content: space-between;

        #delete-contact-button {
            display: flex;
            justify-content: right;
        }
    }
`;

const ToggleSwitch = styled.div`
width: 30%;
display: flex;
justify-content: space-between;
margin: auto 0;

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.hidden {
    display: none; //TODO: make class global
}
`;

export default function ViewContact(props) {
    const location = useLocation();
    const isNewContact = !!location.pathname.match('/new');
    const { contactId } = useParams();
    const { 
        contact,
        isContactPending,
        contactError, 
        getContact,
        postContact,
        isContactPostPending,
        contactPostError,
        putContact,
        isContactPutPending,
        contactPutError,
        deleteContact,
        isContactDeletePending,
        contactDeleteError
    } = props;
    const defaultChanges = {
        firstName: '',
        lastName: '',
        profilePicture: '',
        email: '',
        phoneNumber: '',
        firm: '',
        industry: '',
        address: '',
        dateOfBirth: '',
        bio: '',
    }
    const [entityIsOrganization, setEntityIsOrganization] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(defaultChanges);
    const [error, setError] = useState(defaultChanges);
    const history = useHistory();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        //initial GET of contact
        if(contactId) {
            setPendingChanges(getContact(contactId));
        } else {
            setPendingChanges(defaultChanges);
        }
    }, []);

    useEffect(() => {
        //update page when GET returns
        const dob = contact.dateOfBirth ? contact.dateOfBirth.split('T')[0] : "";
        const newValues = {...contact, dateOfBirth: dob}
        //TODO: handle 404, and Errors
        setPendingChanges(newValues);
        setEntityIsOrganization(contact.entityType === 'organization');
    }, [contact]);

    //only after the page is first loaded, a post/put/delete changing from pending to success requires a redirect
    useEffect(() => {
        if(!isContactPending && contact) {
            setPageLoaded(true);
        }
    }, [isContactPending]);
    useEffect(() => {
        setPendingChanges(defaultChanges);
    }, [isContactPostPending]);
    useEffect(() => {
        if(pageLoaded && !isContactPutPending) {
            history.push(`/contacts/${contactId}`);
        }
    }, [isContactPutPending]);
    useEffect(() => {
        if(pageLoaded && !isContactDeletePending) {
            history.push(`/contacts`);
        }
    }, [isContactDeletePending]);

    function updateData(field, value) {
        //clear any errors
        let updateError = {};
        updateError[field] = '';
        setError({...error, ...updateError});

        //update the value
        let updatedValue = {};
        updatedValue[field] = value;
        setPendingChanges({...pendingChanges, ...updatedValue});
    }

    function handleSaveContact() {
        console.log('attempted save');
        //validate inputs, error messages if needed TODO
        let valid = true;
        if (!pendingChanges.firstName) {
            valid = false;
            setError({...error, ...{firstName: 'Please enter name'}});
        }
        if (pendingChanges.email && !pendingChanges.email.match(/^.{1,}\@[a-zA-Z0-9-_]{1,}\.[a-z]{1,}$/g)) { //^ and $ to match pattern on entire string, not subset
            valid = false;
            setError({...error, ...{email: 'Expected format: name@example.com'}});
        }
        if (pendingChanges.phoneNumber && !pendingChanges.phoneNumber.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/g)) {
            valid = false;
            setError({...error, ...{phoneNumber: 'Expected format: ###-###-####'}});
        }
        if (!entityIsOrganization && 
                pendingChanges.dateOfBirth && 
                (pendingChanges.dateOfBirth &&
                    !pendingChanges.dateOfBirth.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/g)
                )
            ) {
            valid = false;
            setError({...error, ...{dateOfBirth: 'Expect format: YYYY-MM-DD'}});
        }

        if (valid) {
            let dob = pendingChanges.dateOfBirth;
            if (!entityIsOrganization && dob) {
                dob = new Date(pendingChanges.dateOfBirth).toISOString()
            }
            const entity = pendingChanges.entityIsOrganization ? 'organization' : 'person';

            let submitChanges = {
                ...pendingChanges,
                lastModifiedOn: new Date().toISOString(),
                dateOfBirth: dob,
                entityType: entity,
            }
            
            //submit changes
            if (isNewContact) {
                postContact(submitChanges);
            } else {
                console.log('putting')
                putContact(contactId, submitChanges);
            }
        }
    }

    function handleDeleteConfirm() {
        setShowDeleteModal(false);
        deleteContact(contactId);
    }

    function handlePictureUpload(e) {
        console.log(e.target.files[0]);
        console.log(e);
    }

    //TODO: handle loading state, 404s and errors
    return (
        <>
            <EntityTitleHeader
                title={isNewContact ? 'New Contact' : `Edit Contact`}
                editMode={true}
                handleSave={handleSaveContact}
                disableSave={
                    isContactPending
                    || isContactPostPending
                    || isContactPutPending
                }
            />
            <ScrollContainer>
                <GridWrapper>
                    <div className="imageRow">
                        <div id="profile-picture">
                            <img src={contact.profilePicture ? `../../assets/images/contact-${contactId}-picture/` : '../../assets/images/default-profile.png'} alt="profile picture"/>
                            <br/>
                            <input id="picture-upload" type="file" accept="image/*" onChange={(event) => handlePictureUpload(event)} capture />
                        </div>
                        <ToggleSwitch>
                            <span>
                                {entityIsOrganization 
                                    ? 'Organization'
                                    : 'Person'}
                            </span>
                            <label className={`switch ${isNewContact ? '' : 'hidden'}`}>
                                <input
                                    active={`${entityIsOrganization}`}
                                    type="checkbox"
                                    onClick={() => setEntityIsOrganization(!entityIsOrganization)}
                                    disabled={!isNewContact}
                                />
                                <span className="slider round"></span>
                            </label>
                        </ToggleSwitch>
                    </div>
                    <div className="metadataRow">

                        <div id="nameData" className="inputRow rowMargin">
                            <Input
                                placeholder="Enter Name"
                                value={pendingChanges.firstName}
                                label={entityIsOrganization ? 'Firm Name *' : 'First Name *'}
                                locked={false}
                                error={error.firstName}
                                onChange={(event) => updateData('firstName', event.target.value)}
                            />
                            <Input
                                placeholder={entityIsOrganization ? 'eg: LLC, Corp, 401(c)3' : 'Enter Name'}
                                value={pendingChanges.lastName}
                                label={entityIsOrganization ? 'Firm Type' : 'Last Name'}
                                locked={false}
                                error={error.lastName}
                                onChange={(event) => updateData('lastName', event.target.value)}
                            />
                        </div>

                        <div id="contactData" className="inputRow rowMargin">
                            <Input
                                placeholder="mail@example.com"
                                value={pendingChanges.email}
                                label="Email"
                                locked={false}
                                error={error.email}
                                onChange={(event) => updateData('email', event.target.value)}
                                maxLength={254}
                            />
                            <Input
                                placeholder="###-###-####"
                                value={pendingChanges.phoneNumber}
                                label="Phone Number"
                                locked={false}
                                error={error.phoneNumber}
                                onChange={(event) => updateData('phoneNumber', event.target.value)}
                                maxLength={12}
                            />
                        </div>

                        {!entityIsOrganization && (
                            <div id="personOnlyData" className="inputRow rowMargin">
                                <Input
                                    placeholder="Company X, LLC"
                                    value={pendingChanges.firm}
                                    label="Firm"
                                    locked={false}
                                    error={error.firm}
                                    onChange={(event) => updateData('firm', event.target.value)}
                                />
                                <DateInput
                                    placeholder="Enter or select YYYY/MM/DD"
                                    value={pendingChanges.dateOfBirth}
                                    label="Date of Birth"
                                    locked={false}
                                    error={error.dateOfBirth}
                                    onChange={(event) => updateData('dateOfBirth', event)}
                                    maxLength={11}
                                />
                            </div>
                        )}

                        <div id="placementData" className="inputRow rowMargin">                                
                            <Input
                                placeholder="212 Oak PL, Neverland OH 12345"
                                value={pendingChanges.address}
                                label="Address"
                                locked={false}
                                error={error.address}
                                onChange={(event) => updateData('address', event.target.value)}
                            />
                            <Input
                                placeholder="eg: Retail, Academia, In School"
                                value={pendingChanges.industry}
                                label="Industry"
                                locked={false}
                                error={error.industry}
                                onChange={(event) => updateData('industry', event.target.value)}
                            />
                        </div>
                        {/*TODO: have all the fields as inputs, dis-/en-abled based on editState*/}
                    </div>
                    <div className="bioRow">
                        <Input
                            placeholder="Add biographical notes here"
                            value={pendingChanges.bio}
                            label="Bio"
                            locked={false}
                            error={error.bio}
                            onChange={(event) => updateData('bio', event.target.value)}
                            height="18vh"
                            maxLength={750}
                        />
                    </div>
                    <div className="tagsRow">

                    </div>
                    {/* <div className="InteractionsRow">
                        <h3>Recent Interactions</h3>
                        <div>
                            cards go here, or none available message...
                        </div>
                    </div> */}
                    {!isNewContact && <div id="dangerRow">
                        <div></div>
                        <Button 
                            id="delete-contact-button"
                            label="DELETE"
                            type="danger"
                            icon="trashCan"
                            onClick={() => setShowDeleteModal(true)}
                        />
                    </div>}
                </GridWrapper>
            </ScrollContainer>
        
            <CommonModal 
                show={isContactDeletePending || showDeleteModal}
                icon={'trashCan'}
                title={'Please Confirm Contact Deletion'}
                onClose={() => setShowDeleteModal(false)}
                onSubmit={() => handleDeleteConfirm()}
                submitText={'Confirm'}
            >
                <div>
                    Are you certain you would like to delete {contact.firstName}? This cannot be undone.
                </div>
            </CommonModal>
        </>
);
}