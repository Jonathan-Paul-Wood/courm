import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar/MainToolbar';
import ContactCard from './ContactCard';
import Paginate from './Paginate/Paginate';
import {RESULTS_PER_PAGE} from '../../common/constants/constants';
import Tooltip from '../../common/Tooltip/Tooltip';

const ContentWrapper = styled.div`
    margin-top: 4em;
    padding: 0 1em;

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto auto auto;
    grid-template-areas: "toolbar" "container" "paginate";

    .main-toolbar {
        grid-area: "toolbar";
    }
    .scroll-container {
        grid-area: "container";
    }
    .paginate {
        grid-area: "paginate";
    }
`;

const ScrollContainer = styled.div`
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
        getContactList(RESULTS_PER_PAGE);
        getContactListMetadata(); // call again when filters/search changes
    }, []);

    useEffect(() => {
        getContactList(RESULTS_PER_PAGE, page);
    }, [page]);

    return (
        <>
            <CollectionTitleHeader title="View Contacts" />
            <ContentWrapper>
                <MainToolbar type="Contact" className="main-toolbar" />
                <ScrollContainer className="scroll-container">
                    {contacts.length ? (
                        contacts.map(contact => {
                            return (
                                <ContactCard key={contact.id} contact={contact} />
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
                        className="paginate"
                        total={total}
                        page={page}
                        cardsPerPage={RESULTS_PER_PAGE}
                        count={contacts.length}
                        updatePage={setPage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}