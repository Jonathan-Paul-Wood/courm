import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';

const ContentWrapper = styled.div`
    margin-top: 4em;
    padding: 0 1em;
`;

const ScrollContainer = styled.div`
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

export default function ViewContact(props) {
    const location = useLocation();
    const isNewContact = !!location.pathname.match('/new');
    const { contactId } = useParams();
    const { 
        contact,
        isContactPending,
        contactError, 
        getContact,
    } = props;
    const [entityType, setEntityType] = useState('');
    const history = useHistory();

    useEffect(() => {
        //initial GET of contact
        if(contactId) {
            getContact(contactId);
        }
    }, []);

    useEffect(() => {
        //update page when GET returns
        //TODO: handle 404, and Errors
        setEntityType(contact.entityType);
    }, [contact]);

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    //TODO: handle loading state, 404s and errors
    return (
        <>
            <EntityTitleHeader
                title={isNewContact ? 'New Contact' : `${contact.firstName} ${contact.lastName}`}
                editMode={false}
            />
            <ContentWrapper>
                <ScrollContainer>
                    <GridWrapper>
                        <div className="imageRow">
                            <img src="" alt="profile image" />
                            <Button label="Export" onClick={() => window.open(`http://localhost:8080/api/contacts/${contactId}`, '_blank')}/>
                        </div>
                        <div className="metadataRow">
                            <div id="nameData" className="inputRow rowMargin">
                                <Input
                                    value={contact.firstName}
                                    label={entityType === 'organization' ? 'Firm Name' : 'First Name'}
                                    locked={true}
                                />
                                <Input
                                    value={contact.lastName}
                                    label={entityType === 'organization' ? 'Firm Type' : 'Last Name'}
                                    locked={true}
                                />
                            </div>

                            <div id="contactData" className="inputRow rowMargin">
                                <Input
                                    value={contact.email}
                                    label="Email"
                                    locked={true}
                                />
                                <Input
                                    value={contact.phoneNumber}
                                    label="Phone Number"
                                    locked={true}
                                />
                            </div>

                            {entityType === 'person' && (
                                <div id="personOnlyData" className="inputRow rowMargin">
                                    <Input
                                        value={contact.firm}
                                        label="Firm"
                                        locked={true}
                                    />
                                    <DateInput
                                        value={contact.dateOfBirth}
                                        label="Date of Birth"
                                        locked={true}
                                    />
                                </div>
                            )}

                            <div id="placementData" className="inputRow rowMargin">                                
                                <Input
                                    value={contact.address}
                                    label="Address"
                                    locked={true}
                                />
                                <Input
                                    value={contact.industry}
                                    label="Industry"
                                    locked={true}
                                />
                            </div>
                            {/*TODO: have all the fields as inputs, dis-/en-abled based on editState*/}
                        </div>
                        <div className="bioRow">
                            <Input
                                value={contact.bio}
                                label="Bio"
                                locked={true}
                                height="18vh"
                            />
                        </div>
                        <div className="tagsRow">

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
        </>
);
}