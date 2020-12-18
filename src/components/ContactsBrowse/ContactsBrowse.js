import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar/MainToolbar';
import ContactCard from './ContactCard';
import Paginate from './Paginate/Paginate';

const ContentWrapper = styled.div`

`;

const ScrollContainer = styled.div`
    overflow-y: auto;
    height: 80vh;
    margin: 2em 2em 0 2em;
`;

const NoResultsMessage = styled.div`
    font-size: 1.2rem;
    font-style: italic;
    padding-left: 6em;
`;

export default function ContactsBrowse(props) {
    const { 
        contacts,
        isContactListPending, 
        contactListError, 
        getContactList, 
        contactsMetadata, 
        isContactListMetadataPending, 
        isContactListMetadataError, 
        getContactListMetadata 
    } = props;
    const history = useHistory();
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);

    const {total} = contactsMetadata;

    useEffect(() => {
        getContactList();
        getContactListMetadata(); // call again when filters/search changes
    }, []);

    useEffect(() => {
        getContactList(page);
    }, [page])

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    return (
        <ContentWrapper>
            <CollectionTitleHeader title="View Contacts" />
            <MainToolbar type="Contact" />
            <ScrollContainer>
                {contacts.length ? (
                    contacts.map(contact => {
                        return (
                            <ContactCard key={contact.id} name={contact.firstName+' '+contact.lastName} />
                        )
                    })
                ) : (
                <NoResultsMessage classNames="warningMessage">
                    Sorry, no results to display{activeFilters.length ? ' for your applied search filters' : ''}
                </NoResultsMessage>
                )}
            </ScrollContainer>
            {total > 3 && (
                <Paginate 
                    total={total}
                    page={page}
                    cardsPerPage={3}
                    updatePage={setPage}
                />
            )}
        </ContentWrapper>
    );
}