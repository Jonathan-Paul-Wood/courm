import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import DateInput from '../../common/DateInput/DateInput';
import TextArea from '../../common/TextArea/TextArea';
import icons from '../../assets/icons/bootstrapIcons';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { exportDataList } from '../../common/Utilities/utilities';
import PropTypes from 'prop-types';
import RelationCardManager from '../../common/RelationCardManager';
import ScrollContainer from '../../common/ScrollContainer';

const ContentWrapper = styled.div`
    padding: 0 1em;

    .link {
        color: blue;
        text-decoration-line: underline;
        cursor: pointer;
    }
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

    .relationsRow {
        display: flex;
        justify-content: space-between;

        .relationsList {
            min-width: 50%;
            margin: 1em;
        }
    }
`;

export default function ViewContact (props) {
    const { contactId } = useParams();
    const {
        contact,
        isContactPending,
        contactError,
        getContact
    } = props;
    const [entityType, setEntityType] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);
    const [firstRelationCardEdit, setFirstRelationCardEdit] = useState(false);
    const [secondRelationCardEdit, setSecondRelationCardEdit] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // initial GET of contact
        if (contactId) {
            getContact(contactId);
        }
    }, [contactId]);

    useEffect(() => {
        setFirstLoad(false);
        setEntityType(contact.entityType);
    }, [contact]);

    function exportContact () {
        exportDataList(['contacts'], [[contact]], `contact-${contactId}`);
    }

    // TODO: handle loading state, 404s and errors
    return (
        <>
            {contactError
                ? (<ContentWrapper>
                    <p>No such contact exists. You can try <span className="link" onClick={() => navigate('/contacts/new')}>creating one</span>, or return to the <span className="link" onClick={() => navigate('/contacts')}>search existing contacts</span> </p>
                </ContentWrapper>)
                : (
                    <>
                        <EntityTitleHeader
                            title={`${contact.firstName} ${contact.lastName}`}
                            editMode={false}
                            type='Contact'
                        />
                        <ContentWrapper>
                            {(isContactPending || firstLoad)
                                ? (<LoadingSpinner />)
                                : (
                                    <ScrollContainer
                                        style={{ margin: '2em 2em 0 2em' }}
                                    >
                                        <GridWrapper>
                                            <div className="imageRow">
                                                <div id="profile-picture">
                                                    {contact.profilePicture ? contact.profilePicture : icons.personCard}
                                                </div>
                                                <Button icon="download" label="Export" onClick={exportContact}/>
                                            </div>
                                            <div className="metadataRow">
                                                <div id="nameData" className="inputRow rowMargin">
                                                    <Input
                                                        value={contact.firstName}
                                                        label={entityType === 'organization'
                                                            ? 'Firm Name'
                                                            : 'First Name'}
                                                        locked={true}
                                                    />
                                                    <Input
                                                        value={contact.lastName}
                                                        label={entityType === 'organization'
                                                            ? 'Firm Type'
                                                            : 'Last Name'}
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
                                                {/* TODO: have all the fields as inputs, dis-/en-abled based on editState */}
                                            </div>
                                            <div className="bioRow">
                                                <TextArea
                                                    value={contact.bio}
                                                    label="Bio"
                                                    locked={true}
                                                    height="18vh"
                                                />
                                            </div>
                                            <div className="tagsRow">

                                            </div>
                                            {/* <div className="InteractionsRow">
                                        <h3>Recent Interactions (<Button label="view all" type="link" />)</h3>
                                        <div>
                                            cards go here, or none available message...
                                        </div>
                                    </div> */}
                                            <div className="relationsRow">
                                                <RelationCardManager
                                                    parentType={'contact'}
                                                    parentId={parseInt(contactId)}
                                                    relationType='note'
                                                    editMode={firstRelationCardEdit}
                                                    disableEdit={secondRelationCardEdit}
                                                    onChange={setFirstRelationCardEdit}
                                                />
                                                <RelationCardManager
                                                    parentType={'contact'}
                                                    parentId={parseInt(contactId)}
                                                    relationType='event'
                                                    editMode={secondRelationCardEdit}
                                                    disableEdit={firstRelationCardEdit}
                                                    onChange={setSecondRelationCardEdit}
                                                />
                                            </div>
                                        </GridWrapper>
                                    </ScrollContainer>
                                )}
                        </ContentWrapper>
                    </>
                )}
        </>
    );
}

ViewContact.propTypes = {
    contact: PropTypes.object.isRequired,
    isContactPending: PropTypes.bool.isRequired,
    contactError: PropTypes.string.isRequired,
    getContact: PropTypes.func.isRequired
};
