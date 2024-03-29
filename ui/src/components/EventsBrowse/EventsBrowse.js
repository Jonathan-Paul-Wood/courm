import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar';
import EventCard from './EventCard';
import Paginate from '../../common/Paginate/Paginate';
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

export default function EventsBrowse (props) {
    const {
        events,
        isEventListPending,
        getEventList,
        isAllContactsPending,
        getAllContacts,
        contacts,
        isAllNotesPending,
        getAllNotes,
        notes
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('title');
    const [direction, setDirection] = useState('ASC'); // ASC if ascending, DESC if descending
    const [appliedContacts, setAppliedContacts] = useState('');
    const [appliedNotes, setAppliedNotes] = useState('');

    const searchFields = [
        {
            label: 'Title',
            value: 'title',
            selected: false
        },
        {
            label: 'Date',
            value: 'date',
            selected: false
        },
        {
            label: 'Description',
            value: 'description',
            selected: false
        },
        {
            label: 'Address',
            value: 'address',
            selected: false
        }
    ];
    const eventSortOptions = [
        {
            label: 'Title',
            value: 'title'
        },
        {
            label: 'Date',
            value: 'date'
        },
        {
            label: 'Date Created',
            value: 'createdOn'
        },
        {
            label: 'Date of Last Change',
            value: 'lastModifiedOn'
        }
    ];

    useEffect(() => {
        initiateSearch();
        getAllContacts();
        getAllNotes();
    }, []);

    useEffect(() => {
        initiateSearch();
    }, [page, searchOrderBy, direction, appliedContacts, appliedNotes]);

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
        getEventList(RESULTS_PER_PAGE, page, searchTerm, searchOrderBy, direction, activeFilters, appliedContacts, appliedNotes);
    }

    return (
        <>
            <CollectionTitleHeader title="View Events" />
            <ContentWrapper>
                {/* TODO: MainTollbar need to be passed variables, MainToolbar needs to be abstracted, as does *Browse.js and Pagination controls */}
                <MainToolbar
                    type="Event"
                    className="main-toolbar"
                    updateActiveFilters={handleFilterChange}
                    searchTerm={searchTerm}
                    searchFields={searchFields}
                    sortOptions={eventSortOptions}
                    updateSearchTerm={handleSearchTermChange}
                    currentOrder={searchOrderBy}
                    handleOrderUpdate={setSearchOrderBy}
                    currentDirection={direction}
                    handleDirectionUpdate={setDirection}
                />
                {isAllContactsPending || isAllNotesPending
                    ? <></>
                    : (
                        <RelationMatchContainer>
                            <MultiSelect
                                title={'CONTACT RELATIONS'}
                                options={contacts.results.map(contact => { return { ...contact, title: `${contact.firstName} ${contact.lastName}` }; })}
                                onChange={(val) => { setAppliedContacts(val.map(v => v.id)); }}
                            />
                            <MultiSelect
                                title={'NOTE RELATIONS'}
                                options={notes.results}
                                onChange={(val) => setAppliedNotes(val.map(v => v.id))}
                            />
                        </RelationMatchContainer>
                    )}
                <ScrollContainer
                    className="scroll-container"
                    style={ { margin: '2em 2em 0 2em' } }
                >
                    {isEventListPending
                        ? (
                            <LoadingSpinner type="spinner" />
                        )
                        : (
                            events.results && events.results.length
                                ? (
                                    events.results.map(event => {
                                        return (
                                            <EventCard key={event.id} event={event} />
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
                {!isEventListPending && events.totalCount > RESULTS_PER_PAGE && (
                    <Paginate
                        className="paginate"
                        total={events.totalCount}
                        page={page}
                        cardsPerPage={RESULTS_PER_PAGE}
                        count={events.resultCount}
                        updatePage={setPage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}

EventsBrowse.propTypes = {
    events: PropTypes.object.isRequired,
    isEventListPending: PropTypes.bool.isRequired,
    eventListError: PropTypes.string.isRequired,
    getEventList: PropTypes.func.isRequired,
    contacts: PropTypes.object.isRequired,
    isAllContactsPending: PropTypes.bool.isRequired,
    allContactsError: PropTypes.string.isRequired,
    getAllContacts: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired,
    isAllNotesPending: PropTypes.bool.isRequired,
    allNotesError: PropTypes.string.isRequired,
    getAllNotes: PropTypes.func.isRequired
};
