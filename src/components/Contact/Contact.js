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
        email: false,
        firstName: false,
        lastName: false,
        phone: false
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
        let copyPendingChanges = JSON.parse(JSON.stringify(pendingChanges));
        copyPendingChanges.field = value;
        setPendingChanges(copyPendingChanges);
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
                        <div>Toggle entity/organization</div>
                        <Button label="Export" />
                    </div>
                    <div className="metadataRow">
                        <div className="contactData rowMargin">
                                <Input
                                    placeholder="mail@example.com"
                                    value={pendingChanges.email}
                                    label="Email"
                                    locked={!isNewContact}
                                    error={error.email}
                                    onChange={(val) => updateData('email', val)}
                                />
                                <Input
                                    placeholder="###-###-####"
                                    value={pendingChanges.phone}
                                    label="Phone Number"
                                    locked={!isNewContact}
                                    error={error.phone}
                                    onChange={(val) => updateData('phone', val)}
                                />
                        </div>

                        <div className="placeData rowMargin">
                                <Input
                                    placeholder="Company X, LLC"
                                    value={pendingChanges.firm}
                                    label="Firm"
                                    locked={!isNewContact}
                                    error={error.firm}
                                    onChange={(val) => updateData('firm', val)}
                                />
                                <Input
                                    placeholder="212 Oak PL, Neverland OH 12345"
                                    value={pendingChanges.address}
                                    label="Address"
                                    locked={!isNewContact}
                                    error={error.address}
                                    onChange={(val) => updateData('address', val)}
                                />
                        </div>

                        <div className="dateData rowMargin">
                                <Input
                                    placeholder="1950-11-24"
                                    value={pendingChanges.dob}
                                    label="Date of Birth"
                                    locked={!isNewContact}
                                    error={error.dob}
                                    onChange={(val) => updateData('dob', val)}
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
                        <TextArea 
                        
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