import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar';
import ContactCard from './ContactCard';
import Paginate from './Paginate/Paginate';
import {RESULTS_PER_PAGE} from '../../common/constants/constants';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const ContentWrapper = styled.div`
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
        min-height: 45vh;
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
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [cardTotal, setCardTotal] = useState(0);
    const [searchOrderBy, setSearchOrderBy] = useState('firstName');
    const [direction, setDirection] = useState("ASC"); //ASC if ascending, DESC if descending

    useEffect(() => {
        setCardTotal(contactsMetadata.total);
    }, [contactsMetadata]);

    useEffect(() => {
        getContactList(RESULTS_PER_PAGE, 1, "", 'firstName', 'ASC');
        getContactListMetadata(searchTerm); // call again when filters changes
    }, []);

    function updatePage(value) {
        setPage(value);
        getContactList(RESULTS_PER_PAGE, value, searchTerm);
    }

    function updateSearchOrder(value) {
        setSearchOrderBy(value);
        getContactList(RESULTS_PER_PAGE, 1, searchTerm, value, direction);
    }

    function updateDirection(value) {
        setDirection(value);
        getContactList(RESULTS_PER_PAGE, 1, searchTerm, searchOrderBy, value);
    }

    function handleSearchEntry() {
        getContactList(RESULTS_PER_PAGE, 1, searchTerm, searchOrderBy, direction);
        getContactListMetadata(searchTerm);
    }

    return (
        <>
            <CollectionTitleHeader title="View Contacts" />
            <ContentWrapper>
                <MainToolbar
                    type="Contact"
                    className="main-toolbar"
                    activeFilters={activeFilters}
                    updateActiveFilters={setActiveFilters}
                    searchTerm={searchTerm}
                    updateSearchTerm={setSearchTerm}
                    handleSearchEntry={handleSearchEntry}
                    currentOrder={searchOrderBy}
                    handleOrderUpdate={updateSearchOrder}
                    currentDirection={direction}
                    handleDirectionUpdate={updateDirection}
                />
                <ScrollContainer className="scroll-container">
                {(isContactListPending || isContactListMetadataPending) ? (
                    <LoadingSpinner type="spinner" />
                ) : (
                    contacts.length ? (
                        contacts.map(contact => {
                            return (
                                <ContactCard key={contact.id} contact={contact} />
                            )
                        })
                    ) : (
                    <NoResultsMessage className="warningMessage">
                        Sorry, no results to display{(activeFilters.length || searchTerm) ? ' for your applied search filters' : ''}
                    </NoResultsMessage>
                    )
                )}
                </ScrollContainer>
                {cardTotal > RESULTS_PER_PAGE && (
                    <Paginate
                        className="paginate"
                        total={cardTotal}
                        page={page}
                        cardsPerPage={RESULTS_PER_PAGE}
                        count={contacts.length}
                        updatePage={updatePage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}