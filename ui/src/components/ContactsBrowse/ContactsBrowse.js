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
import Select from '../../common/Select';
import Button from '../../common/Button';
import { GREY, WHITE, SECONDARY } from '../../assets/colorsConstants';

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

const RelationContainer = styled.div`
    width: calc(50% - 1em);

    .relationSelectRow {
        display: flex;
        justify-content: space-between;
        
        Select {
            display: flex;
            flex: 3;
            height: 2em;

            .input-field {
                width: 100%;
                height: 2em;
            }
        }
        Button {
            display: flex;
            flex: 1;
            margin-left: 2em;
        }
    }

    .selectedRelationsBox {
        padding: 0.25em;
        margin: 0.5em 0;
        border-radius: 0.25em;
    }

    svg {
        margin: 0;
    }
`;

const Relation = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.25em 1em;

    padding: 0.25em;
    background-color: ${WHITE};
    border-radius: 0.25em;

    .pendingRelationText {
        width: calc(100% - 5em);
        white-space: nowrap;
        display: flex;
        cursor: default;

        .pendingRelationLabel {
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 2em;
            height: 2em;
        }
        .pendingRelationId {
            line-height: 2em;
            height: 2em;
            display: flex;
            flex: 1;
        }
    }

    Button {
        margin-left: 1em;
    }
`;

export default function ContactsBrowse (props) {
    const {
        contacts,
        isContactListPending,
        getContactList,
        events,
        isEventListPending,
        getEventList,
        notes,
        isNoteListPending,
        getNoteList
    } = props;
    const [activeFilters, setActiveFilters] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderBy, setSearchOrderBy] = useState('firstName');
    const [direction, setDirection] = useState('ASC'); // ASC if ascending, DESC if descending

    const [remainingOptions, setRemainingOptions] = useState([{ label: 'Select Option' }]);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [pendingSelection, setPendingSelection] = useState(0);

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
        getEventList();
        getNoteList();
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

    function handleRemovePendingRelation (index) {
        setRemainingOptions([...remainingOptions, pendingChanges[index]]);
        const newPending = pendingChanges.filter((_, i) => i !== index);
        setPendingChanges(newPending);
    }

    function handleAddPendingRelation () {
        setPendingChanges([...pendingChanges, remainingOptions[pendingSelection]]);
        const newRemainingOptions = remainingOptions.filter((_, i) => i !== pendingSelection);
        setRemainingOptions(newRemainingOptions);
        setPendingSelection(0);
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
                {isEventListPending || isNoteListPending
                    ? <></>
                    : (
                        <RelationMatchContainer>
                            <RelationContainer>
                                <div style={{
                                    width: '100%',
                                    color: `${SECONDARY}`,
                                    fontWeight: '600'
                                }}>
                            EVENT RELATIONS
                                </div>
                                <div className="relationSelectRow">
                                    <Select
                                        options={events.results.map(x => { return { label: x.title }; })}
                                        selectedIndex={pendingSelection}
                                        // searchable={true}
                                        // icon={'search'}
                                        onSelect={(value) => setPendingSelection(value)}
                                    />
                                    <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation()} />
                                </div>
                                <ScrollContainer
                                    style={{
                                        height: '8em',
                                        width: '100%',
                                        backgroundColor: `${GREY}`,
                                        margin: '0.25em 0',
                                        borderRadius: '0.25em'
                                    }}
                                    className="selectedRelationsBox"
                                >
                                    {pendingChanges.map((pendingChange, index) => {
                                        return (
                                            <Relation key={index}>
                                                <div className="pendingRelationText">
                                                    <span className="pendingRelationLabel" title={pendingChange.title}>{pendingChange.title}</span>
                                                    <span className="pendingRelationId">{` (Id: ${pendingChange.id})`}</span>
                                                </div>
                                                <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                                            </Relation>
                                        );
                                    })}
                                </ScrollContainer>
                            </RelationContainer>
                            <RelationContainer>
                                <div style={{
                                    width: '100%',
                                    color: `${SECONDARY}`,
                                    fontWeight: '600'
                                }}>
                            NOTE RELATIONS
                                </div>
                                <div className="relationSelectRow">
                                    <Select
                                        options={notes.results.map(x => { return { label: x.title }; })}
                                        selectedIndex={pendingSelection}
                                        // searchable={true}
                                        // icon={'search'}
                                        onSelect={(value) => setPendingSelection(value)}
                                    />
                                    <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation()} />
                                </div>
                                <ScrollContainer
                                    style={{
                                        height: '8em',
                                        width: '100%',
                                        backgroundColor: `${GREY}`,
                                        margin: '0.25em 0',
                                        borderRadius: '0.25em'
                                    }}
                                    className="selectedRelationsBox"
                                >
                                    {pendingChanges.map((pendingChange, index) => {
                                        return (
                                            <Relation key={index}>
                                                <div className="pendingRelationText">
                                                    <span className="pendingRelationLabel" title={pendingChange.title}>{pendingChange.title}</span>
                                                    <span className="pendingRelationId">{` (Id: ${pendingChange.id})`}</span>
                                                </div>
                                                <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                                            </Relation>
                                        );
                                    })}
                                </ScrollContainer>
                            </RelationContainer>
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
    isEventListPending: PropTypes.bool.isRequired,
    eventListError: PropTypes.string.isRequired,
    getEventList: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired,
    isNoteListPending: PropTypes.bool.isRequired,
    noteListError: PropTypes.string.isRequired,
    getNoteList: PropTypes.func.isRequired
};
