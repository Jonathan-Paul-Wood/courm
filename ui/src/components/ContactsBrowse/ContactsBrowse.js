import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar';
import ContactCard from './ContactCard';
import Paginate from './Paginate/Paginate';
import { RESULTS_PER_PAGE } from '../../common/constants/constants';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ScrollContainer from '../../common/ScrollContainer';

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

const NoResultsMessage = styled.div`
    font-size: 1.2rem;
    font-style: italic;
    padding-left: 6em;
`;

export default function ContactsBrowse (props) {
    const {
        contacts,
        isContactListPending,
        getContactList
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('firstName');
    const [direction, setDirection] = useState('ASC'); // ASC if ascending, DESC if descending

    const searchFields = [
        {
            label: 'First Name',
            value: 'firstName',
            selected: false
        },
        {
            label: 'Last Name',
            value: 'lastName',
            selected: false
        },
        {
            label: 'Email',
            value: 'email',
            selected: false
        },
        {
            label: 'Phone Number',
            value: 'phoneNumber',
            selected: false
        },
        {
            label: 'Address',
            value: 'address',
            selected: false
        },
        {
            label: 'Firm',
            value: 'firm',
            selected: false
        },
        {
            label: 'Industry',
            value: 'industry',
            selected: false
        }
    ];
    const contactSortOptions = [
        {
            label: 'First Name',
            value: 'firstName'
        },
        {
            label: 'Last Name',
            value: 'lastName'
        },
        {
            label: 'Date Of Birth',
            value: 'dateOfBirth'
        },
        {
            label: 'Date Created',
            value: 'createdOn'
        },
        {
            label: 'Date of Last Change',
            value: 'lastModifiedOn'
        }
        // {
        //     label: 'Recently Interacted',
        //     value: 'lastInteractedOn'
        // },
    ];

    useEffect(() => {
        initiateSearch();
    }, []);

    useEffect(() => {
        initiateSearch();
    }, [page, searchOrderBy, direction]);

    useEffect(() => {
        if (searchTerm !== '') {
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

    function handleFilterChange (value) {
        setPage(1);
        setActiveFilters(value);
    }

    function handleSearchTermChange (value) {
        setPage(1);
        setSearchTerm(value);
    }

    function initiateSearch () {
        getContactList(RESULTS_PER_PAGE, page, searchTerm, searchOrderBy, direction, activeFilters);
    }

    return (
        <>
            <CollectionTitleHeader title="View Contacts" />
            <ContentWrapper>
                <MainToolbar
                    type="Contact"
                    className="main-toolbar"
                    updateActiveFilters={handleFilterChange}
                    searchTerm={searchTerm}
                    searchFields={searchFields}
                    sortOptions={contactSortOptions}
                    updateSearchTerm={handleSearchTermChange}
                    currentOrder={searchOrderBy}
                    handleOrderUpdate={setSearchOrderBy}
                    currentDirection={direction}
                    handleDirectionUpdate={setDirection}
                />
                <ScrollContainer style={ { margin: '2em 2em 0 2em' } } className="scroll-container">
                    {isContactListPending
                        ? (
                            <LoadingSpinner type="spinner" />
                        )
                        : (
                            contacts.results && contacts.results.length
                                ? (
                                    contacts.results.map(contact => {
                                        return (
                                            <ContactCard key={contact.id} contact={contact} />
                                        );
                                    })
                                )
                                : (
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

ContactsBrowse.propTypes = {
    contacts: PropTypes.object.isRequired,
    isContactListPending: PropTypes.bool.isRequired,
    contactListError: PropTypes.string.isRequired,
    getContactList: PropTypes.func.isRequired
};
