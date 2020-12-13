import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import EntityTitleHeader from '../../common/EntityTitleHeader/EntityTitleHeader';
import Button from '../../common/Button/Button';

const ContentWrapper = styled.div`

`;

const ScrollContainer = styled.div`
    overflow-y: auto;
    height: 80vh;
    margin: 2em 2em 0 2em;
`;

const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 15vh 45vh 20vh 20rem auto;

    .metadataRow {
        grid-template-columns: 50% 50%;
        grid-template-rows: 30em 10em 20em;
    }
`;

export default function ContactsBrowse(props) {
    const location = useLocation();
    const isNewContact = !!location.pathname.match('/new');
    const { contact, isContactPending, contactError, getContact } = props;
    const [editMode, setEditMode] = useState(isNewContact);
    const history = useHistory();

    useEffect(() => {
        getContact();
    }, []);

    function handleNavigation(path) {
        history.push(`/${path}`);
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
                    <div classNames="imageRow">
                        <img src="" alt="profile image" />
                        <div>Toggle entity/organization</div>
                        <Button label="Export" />
                    </div>
                    <div classNames="metadataRow">

                    </div>
                    <div classNames="bioRow">

                    </div>
                    <div classNames="tagsRow">

                    </div>
                    <div classNames="InteractionsRow">
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