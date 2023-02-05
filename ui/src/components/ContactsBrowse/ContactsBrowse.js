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
import MultiSelect from '../../common/MultiSelect';

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

const RelationMatchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 2.5em;
`;

export default function ContactsBrowse (props) {
    const {
        contacts,
        isContactListPending,
        getContactList,
        events,
        isAllEventsPending,
        getAllEvents,
        notes,
        isAllNotesPending,
        getAllNotes
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('firstName');
    const [direction, setDirection] = useState('ASC'); // ASC if ascending, DESC if descending
    const [appliedEvents, setAppliedEvents] = useState('');
    const [appliedNotes, setAppliedNotes] = useState('');

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
        getAllEvents();
        getAllNotes();
    }, []);

    useEffect(() => {
        initiateSearch();
    }, [page, searchOrderBy, direction, appliedEvents, appliedNotes]);

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
        getContactList(RESULTS_PER_PAGE, page, searchTerm, searchOrderBy, direction, activeFilters, appliedEvents, appliedNotes);
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
                {isAllEventsPending || isAllNotesPending
                    ? <></>
                    : (
                        <RelationMatchContainer>
                            <MultiSelect
                                title={'EVENT RELATIONS'}
                                options={events.results}
                                onChange={(val) => { setAppliedEvents(val.map(v => v.id)); }}
                            />
                            <MultiSelect
                                title={'NOTE RELATIONS'}
                                options={notes.results}
                                onChange={(val) => setAppliedNotes(val.map(v => v.id))}
                            />
                        </RelationMatchContainer>
                    )}

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
    getContactList: PropTypes.func.isRequired,
    events: PropTypes.object.isRequired,
    isAllEventsPending: PropTypes.bool.isRequired,
    allEventsError: PropTypes.string.isRequired,
    getAllEvents: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired,
    isAllNotesPending: PropTypes.bool.isRequired,
    allNotesError: PropTypes.string.isRequired,
    getAllNotes: PropTypes.func.isRequired
};
