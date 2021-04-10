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
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('firstName');
    const [direction, setDirection] = useState("ASC"); //ASC if ascending, DESC if descending

    useEffect(() => {
        initiateSearch();
    }, []);

    useEffect(() => {
        initiateSearch();
    }, [page, searchOrderBy, direction]);

    useEffect(() => {
        if(searchTerm !== '') {
            initiateSearch();
        }
    }, [activeFilters]);

    useEffect(() => {
        if (searchTerm !== '') {
            const timer = setTimeout(() => {
                initiateSearch();
            }, 500);
            return () => clearTimeout(timer);
        }
        
        initiateSearch();
    }, [searchTerm]);

    function initiateSearch() {
        getContactList(RESULTS_PER_PAGE, page, searchTerm, searchOrderBy, direction, activeFilters);
    }

    return (
        <>
            <CollectionTitleHeader title="View Contacts" />
            <ContentWrapper>
                <MainToolbar
                    type="Contact"
                    className="main-toolbar"
                    updateActiveFilters={setActiveFilters}
                    searchTerm={searchTerm}
                    updateSearchTerm={setSearchTerm}
                    currentOrder={searchOrderBy}
                    handleOrderUpdate={setSearchOrderBy}
                    currentDirection={direction}
                    handleDirectionUpdate={setDirection}
                />
                <ScrollContainer className="scroll-container">
                {isContactListPending ? (
                    <LoadingSpinner type="spinner" />
                ) : (
                    contacts.results.length ? (
                        contacts.results.map(contact => {
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
                {contacts.totalCount > RESULTS_PER_PAGE && (
                    <Paginate
                        className="paginate"
                        total={contacts.totalCount}
                        page={page}
                        cardsPerPage={RESULTS_PER_PAGE}
                        count={contacts.resultCount}
                        updatePage={setPage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}