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
    width: 80vw;

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

        .contactData {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .placeData {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .dateData {
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

export default function ContactsBrowse(props) {
    const location = useLocation();
    const isNewContact = !!location.pathname.match('/new');
    const { contact, isContactPending, contactError, getContact, id } = props;
    const [editMode, setEditMode] = useState(isNewContact);
    const [pendingChanges, setPendingChanges] = useState({});
    const [error, setError] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        firm: false,
        industry: false,
        address: false,
        dob: false,
        bio: false,
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
        const copyPendingChanges = JSON.parse(JSON.stringify(pendingChanges));
        let updatedValue = {};
        updatedValue[field] = value;
        setPendingChanges({...pendingChanges, ...updatedValue});
    }

    return (
        <ContentWrapper>
            <EntityTitleHeader
                title={isNewContact ? 'New Contact' : `${contact.firstName} ${contact.lastName}`}
                editMode={editMode}
                toggleEdit={setEditMode}
            />
            <ScrollContainer>
                <GridWrapper>
                    <div className="imageRow">
                        <img src="" alt="profile image" />
                        {editMode ? 
                            <div /*TODO: disable if not isNewContact*/>Toggle entity/organization</div>
                            : <Button label="Export" />
                        }
                    </div>
                    <div className="metadataRow">
                        <div className="contactData rowMargin">
                                <Input
                                    placeholder="mail@example.com"
                                    value={pendingChanges.email}
                                    label="Email"
                                    locked={!editMode}
                                    error={error.email}
                                    onChange={(event) => updateData('email', event.target.value)}
                                />
                                <Input
                                    placeholder="###-###-####"
                                    value={pendingChanges.phone}
                                    label="Phone Number"
                                    locked={!editMode}
                                    error={error.phone}
                                    onChange={(event) => updateData('phone', event.target.value)}
                                />
                        </div>

                        <div className="placeData rowMargin">
                                <Input
                                    placeholder="Company X, LLC"
                                    value={pendingChanges.firm}
                                    label="Firm"
                                    locked={!editMode}
                                    error={error.firm}
                                    onChange={(event) => updateData('firm', event.target.value)}
                                />
                                <Input
                                    placeholder="212 Oak PL, Neverland OH 12345"
                                    value={pendingChanges.address}
                                    label="Address"
                                    locked={!editMode}
                                    error={error.address}
                                    onChange={(event) => updateData('address', event.target.value)}
                                />
                        </div>

                        <div className="dateData rowMargin">
                                <Input
                                    placeholder="1950-11-24"
                                    value={pendingChanges.dob}
                                    label="Date of Birth"
                                    locked={!editMode}
                                    error={error.dob}
                                    onChange={(event) => updateData('dob', event.target.value)}
                                />
                                <Input
                                    value="2020-03-14"
                                    label="Last Contact"
                                    locked={true}
                                    error={''}
                                    onChange={() => {}}
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