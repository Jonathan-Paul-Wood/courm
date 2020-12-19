import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import TextArea from '../../common/TextArea/TextArea';

const ContentWrapper = styled.div`

`;

const ScrollContainer = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
    height: 80vh;
    margin: 2em 2em 0 2em;
`;

const GridWrapper = styled.div`
    .imageRow {
        height: 15vh;
        display: flex;
        justify-content: space-between;
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
`;

const ToggleSwitch = styled.div`
width: 30%;
display: flex;
justify-content: space-between;

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
`;

export default function ContactsBrowse(props) {
    const location = useLocation();
    const isNewContact = !!location.pathname.match('/new');
    const { 
        contact,
        isContactPending,
        contactError, 
        getContact, 
        id,
        postContact,
        isContactPostPending,
        contactPostError,
        putContact,
        isContactPutPending,
        contactPutError
    } = props;
    const [editMode, setEditMode] = useState(isNewContact);
    const [entityType, setEntityType] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({
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
    });
    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        firm: '',
        industry: '',
        address: '',
        dateOfBirth: '',
        bio: '',
    });
    const history = useHistory();

    useEffect(() => {
        if(id) {
            setPendingChanges(getContact(id));
        }
    }, []);

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    function updateData(field, value) {
        //clear any errors
        let updateError = {};
        updateError[field] = false;
        setError({...error, ...updateError});

        //update the value
        let updatedValue = {};
        updatedValue[field] = value;
        setPendingChanges({...pendingChanges, ...updatedValue});
    }

    function handleSaveContact() {
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
        if (pendingChanges.dateOfBirth && !pendingChanges.dateOfBirth.match(/^[0-9]{1,5}-[0-9]{2}-[0-9]{2}$/g)) {
            valid = false;
            setError({...error, ...{dateOfBirth: 'Expect format: YYYY-MM-DD'}});
        }

        if (valid) {
            let dob = pendingChanges.dateOfBirth;
            if (dob) {
                dob = new Date(pendingChanges.dateOfBirth).toISOString()
            }

            const entity = pendingChanges.entityType ? 'organization' : 'person';
            //submit changes
            let submitChanges = {
                ...pendingChanges,
                lastModifiedOn: new Date().toISOString(),
                dateOfBirth: dob,
                entityType: entity,
            }
            if (isNewContact) {
                submitChanges.entityType = entityType;
                console.log(submitChanges);
                postContact(submitChanges);
            } else {
                putContact(id, submitChanges);
            }
        }
    }

    return (
        <ContentWrapper>
            <EntityTitleHeader
                title={isNewContact ? 'New Contact' : `${contact.firstName} ${contact.lastName}`}
                editMode={editMode}
                toggleEdit={setEditMode}
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
                        <img src="" alt="profile image" />
                        {editMode ? 
                            <ToggleSwitch>
                                <span>
                                    {entityType
                                        ? 'Organization'
                                        : 'Person'}
                                </span>
                                <label class="switch">
                                    <input type="checkbox" onClick={() => setEntityType(!entityType)} />
                                    <span class="slider round"></span>
                                </label>
                            </ToggleSwitch>
                            : <Button label="Export" />
                        }
                    </div>
                    <div className="metadataRow">

                        <div id="nameData" className="inputRow rowMargin">
                            <Input
                                placeholder="Enter Name"
                                value={pendingChanges.firstName}
                                label={entityType ? 'Firm Name *' : 'First Name *'}
                                locked={!editMode}
                                error={error.firstName}
                                onChange={(event) => updateData('firstName', event.target.value)}
                            />
                            <Input
                                placeholder={entityType ? 'eg: LLC, Corp, 401(c)3' : 'Enter Name'}
                                value={pendingChanges.lastName}
                                label={entityType ? 'Firm Type' : 'Last Name'}
                                locked={!editMode}
                                error={error.lastName}
                                onChange={(event) => updateData('lastName', event.target.value)}
                            />
                        </div>

                        <div id="contactData" className="inputRow rowMargin">
                            <Input
                                placeholder="mail@example.com"
                                value={pendingChanges.email}
                                label="Email"
                                locked={!editMode}
                                error={error.email}
                                onChange={(event) => updateData('email', event.target.value)}
                                maxLength={254}
                            />
                            <Input
                                placeholder="###-###-####"
                                value={pendingChanges.phoneNumber}
                                label="Phone Number"
                                locked={!editMode}
                                error={error.phoneNumber}
                                onChange={(event) => updateData('phoneNumber', event.target.value)}
                                maxLength={12}
                            />
                        </div>

                        {!entityType && (
                            <div id="personOnlyData" className="inputRow rowMargin">
                                <Input
                                    placeholder="Company X, LLC"
                                    value={pendingChanges.firm}
                                    label="Firm"
                                    locked={!editMode}
                                    error={error.firm}
                                    onChange={(event) => updateData('firm', event.target.value)}
                                />
                                <Input
                                    placeholder="1950-11-24"
                                    value={pendingChanges.dateOfBirth}
                                    label="Date of Birth"
                                    locked={!editMode}
                                    error={error.dateOfBirth}
                                    onChange={(event) => updateData('dateOfBirth', event.target.value)}
                                    maxLength={11}
                                />
                            </div>
                        )}

                        <div id="placementData" className="inputRow rowMargin">                                
                            <Input
                                placeholder="212 Oak PL, Neverland OH 12345"
                                value={pendingChanges.address}
                                label="Address"
                                locked={!editMode}
                                error={error.address}
                                onChange={(event) => updateData('address', event.target.value)}
                            />
                            <Input
                                placeholder="eg: Retail, Academia, In School"
                                value={pendingChanges.industry}
                                label="Industry"
                                locked={!editMode}
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
                            locked={!editMode}
                            error={error.bio}
                            onChange={(event) => updateData('bio', event.target.value)}
                            height="18vh"
                            maxLength={750}
                        />
                    </div>
                    <div classNames="tagsRow">

                    </div>
                    <div className="InteractionsRow">
                        <h3>Recent Interactions (<Button label="view all" type="link" />)</h3>
                        <div>
                            cards go here, or none available message...
                        </div>
                    </div>
                </GridWrapper>
            </ScrollContainer>
        </ContentWrapper>
);
}