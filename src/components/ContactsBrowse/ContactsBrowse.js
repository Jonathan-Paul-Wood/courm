import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar/MainToolbar';
import ContactCard from './ContactCard';
import Paginate from './Paginate/Paginate';
import {RESULTS_PER_PAGE} from '../../common/constants/constants';
import Tooltip from '../../common/Tooltip/Tooltip';

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
    const [activeFilters, setActiveFilters] = useState({});
    const [page, setPage] = useState(1);

    const {total} = contactsMetadata;

    useEffect(() => {
        getContactList();
        getContactListMetadata(); // call again when filters/search changes
    }, []);

    useEffect(() => {
        getContactList(page);
    }, [page]);

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
                <NoResultsMessage className="warningMessage">
                    Sorry, no results to display{Object.keys(activeFilters).length ? ' for your applied search filters' : ''}
                </NoResultsMessage>
                )}
            </ScrollContainer>
            {total > RESULTS_PER_PAGE && (
                <Paginate 
                    total={total}
                    page={page}
                    cardsPerPage={RESULTS_PER_PAGE}
                    count={contacts.length}
                    updatePage={setPage}
                />
            )}
        </ContentWrapper>
    );
}