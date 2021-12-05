import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar';
import NoteCard from './NoteCard';
import Paginate from '../../common/Paginate/Paginate';
import { RESULTS_PER_PAGE } from '../../common/constants/constants';
import PropTypes from 'prop-types';
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

export default function NotesBrowse (props) {
    const {
        notes,
        isNoteListPending,
        getNoteList
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('title');
    const [direction, setDirection] = useState('ASC'); // ASC if ascending, DESC if descending

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
            label: 'Address',
            value: 'address',
            selected: false
        },
        {
            label: 'Contacts',
            value: 'contacts',
            selected: false
        },
        {
            label: 'Tag',
            value: 'tags',
            selected: false
        },
        {
            label: 'Note',
            value: 'record',
            selected: false
        }
    ];
    const noteSortOptions = [
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

    function initiateSearch () {
        getNoteList(RESULTS_PER_PAGE, page, searchTerm, searchOrderBy, direction, activeFilters);
    }

    return (
        <>
            <CollectionTitleHeader title="View Notes" />
            <ContentWrapper>
                {/* TODO: MainTollbar need to be passed variables, MainToolbar needs to be abstracted, as does *Browse.js and Pagination controls */}
                <MainToolbar
                    type="Note"
                    className="main-toolbar"
                    updateActiveFilters={setActiveFilters}
                    searchTerm={searchTerm}
                    searchFields={searchFields}
                    sortOptions={noteSortOptions}
                    updateSearchTerm={setSearchTerm}
                    currentOrder={searchOrderBy}
                    handleOrderUpdate={setSearchOrderBy}
                    currentDirection={direction}
                    handleDirectionUpdate={setDirection}
                />
                <ScrollContainer className="scroll-container">
                    {isNoteListPending
                        ? (
                            <LoadingSpinner type="spinner" />
                        )
                        : (
                            notes.results.length
                                ? (
                                    notes.results.map(note => {
                                        return (
                                            <NoteCard key={note.id} note={note} />
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
                {notes.totalCount > RESULTS_PER_PAGE && (
                    <Paginate
                        className="paginate"
                        total={notes.totalCount}
                        page={page}
                        cardsPerPage={RESULTS_PER_PAGE}
                        count={notes.resultCount}
                        updatePage={setPage}
                    />
                )}
            </ContentWrapper>
        </>
    );
}

NotesBrowse.propTypes = {
    notes: PropTypes.object.isRequired,
    isNoteListPending: PropTypes.bool.isRequired,
    noteListError: PropTypes.string.isRequired,
    getNoteList: PropTypes.func.isRequired
};
