import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import Button from '../../common/Button';
import Input from '../../common/Input/Input';
import MultiSelect from '../../common/MultiSelect';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { GREY, LIGHT_GREY, PRIMARY, SECONDARY, WHITE } from '../../assets/colorsConstants';

const ContentWrapper = styled.div`
    padding: 0 1em 2em 1em;
`;

const ToolbarRow = styled.div`
    margin: 0 2em 1.5em 2em;
    display: flex;
    justify-content: space-between;
    gap: 1.5em;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 960px) {
        margin: 0 1em 1.25em 1em;
    }
`;

const MonthNavigation = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
    flex-wrap: wrap;
`;

const MonthTitle = styled.h3`
    min-width: 10rem;
    text-align: center;

    @media (max-width: 960px) {
        min-width: 100%;
    }
`;

const ToggleGroup = styled.div`
    display: flex;
    gap: 0.75em;
    flex-wrap: wrap;
`;

const ToggleButton = styled.button`
    border: 1px solid black;
    background-color: ${WHITE};
    color: black;
    cursor: pointer;
    padding: 0.6em 1em;
    font-size: 0.95rem;
    min-width: 6.5rem;
    transition: background-color 0.2s ease, color 0.2s ease;

    ${props => props.$active && css`
        background-color: ${props.$entityType === 'event' ? PRIMARY : SECONDARY};
        color: ${WHITE};
    `}
`;

const SearchRow = styled.div`
    margin: 0 2em 1em 2em;

    @media (max-width: 960px) {
        margin: 0 1em 1em 1em;
    }
`;

const FilterRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1em;
    margin: 0 2em 1.5em 2em;
    align-items: stretch;
    flex-wrap: wrap;

    @media (max-width: 960px) {
        margin: 0 1em 1.25em 1em;
    }
`;

const SummaryPanel = styled.div`
    width: calc(50% - 1em);
    min-height: 8em;
    background-color: ${GREY};
    border-radius: 0.25em;
    padding: 1em 1.25em;
    box-sizing: border-box;

    @media (max-width: 960px) {
        width: 100%;
    }
`;

const SummaryTitle = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${SECONDARY};
    margin-bottom: 0.75em;
`;

const SummaryLine = styled.div`
    margin-bottom: 0.5em;
    line-height: 1.35;
`;

const LegendRow = styled.div`
    display: flex;
    gap: 1.25em;
    margin-top: 0.75em;
    flex-wrap: wrap;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5em;
`;

const LegendSwatch = styled.span`
    width: 0.8em;
    height: 0.8em;
    border-radius: 999px;
    background-color: ${props => props.$entityType === 'event' ? PRIMARY : SECONDARY};
`;

const CalendarShell = styled.div`
    margin: 0 2em;
    border: 1px solid #cccccc;
    background-color: ${WHITE};
    box-shadow: 2px 3px 2px #cccccc;
    overflow-x: auto;

    @media (max-width: 960px) {
        margin: 0 1em;
    }
`;

const WeekdayHeaderRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    background-color: ${LIGHT_GREY};
    border-bottom: 1px solid #cccccc;
    min-width: 48rem;
`;

const WeekdayHeader = styled.div`
    padding: 0.85em 0.5em;
    text-align: center;
    font-weight: 600;
    border-right: 1px solid #e0e0e0;

    &:last-child {
        border-right: none;
    }
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    min-width: 48rem;
`;

const DayCell = styled.div`
    min-height: 10.5rem;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    padding: 0.5em;
    box-sizing: border-box;
    background-color: ${props => props.$isCurrentMonth ? WHITE : LIGHT_GREY};

    ${props => props.$isToday && props.$isCurrentMonth && css`
        box-shadow: inset 0 0 0 2px ${PRIMARY};
    `}

    &:nth-child(7n) {
        border-right: none;
    }
`;

const DayHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5em;
`;

const DayNumber = styled.div`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${props => props.$isCurrentMonth ? 'black' : '#8c8c8c'};
`;

const DayEntryCount = styled.div`
    font-size: 0.75rem;
    color: #666666;
`;

const EntryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4em;
    max-height: 8rem;
    overflow-y: auto;
`;

const EntryButton = styled.button`
    border: 1px solid ${props => props.$entityType === 'event' ? PRIMARY : SECONDARY};
    background-color: ${props => props.$entityType === 'event' ? '#f3f9ff' : '#f7f2ff'};
    border-left-width: 0.35rem;
    border-radius: 0.25em;
    text-align: left;
    padding: 0.45em 0.55em;
    cursor: pointer;

    &:hover {
        opacity: 0.85;
    }
`;

const EntryEyebrow = styled.div`
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.2em;
`;

const EntryTitle = styled.div`
    font-size: 0.86rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const EntryMeta = styled.div`
    font-size: 0.72rem;
    color: #4d4d4d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 0.15em;
`;

const NoResultsMessage = styled.div`
    margin: 0 2em 1.5em 2em;
    padding: 1em 1.25em;
    background-color: ${LIGHT_GREY};
    font-size: 1rem;
    font-style: italic;
    border-radius: 0.25em;

    @media (max-width: 960px) {
        margin: 0 1em 1.25em 1em;
    }
`;

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getStartOfMonth (date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths (date, count) {
    return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function formatMonthLabel (date) {
    return date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
    });
}

function formatDateKey (date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseStoredDate (value) {
    if (!value) {
        return null;
    }

    const [datePart] = value.split('T');
    const [year, month, day] = datePart.split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}

function isSameCalendarMonth (left, right) {
    return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function isSameCalendarDay (left, right) {
    return formatDateKey(left) === formatDateKey(right);
}

function buildCalendarCells (activeMonth) {
    const monthStart = getStartOfMonth(activeMonth);
    const gridStart = new Date(monthStart);
    gridStart.setDate(gridStart.getDate() - monthStart.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + index);

        return {
            date,
            dateKey: formatDateKey(date),
            isCurrentMonth: isSameCalendarMonth(date, activeMonth)
        };
    });
}

function normalizeRecords (records) {
    if (Array.isArray(records)) {
        return records;
    }

    if (records && Array.isArray(records.results)) {
        return records.results;
    }

    return [];
}

function formatContactName (contact) {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();

    return fullName || `Contact ${contact.id}`;
}

function buildContactRelationMaps (relations) {
    return relations.reduce((accumulator, relation) => {
        if (relation.contactId && relation.eventId) {
            if (!accumulator.events[relation.eventId]) {
                accumulator.events[relation.eventId] = [];
            }

            if (!accumulator.events[relation.eventId].includes(relation.contactId)) {
                accumulator.events[relation.eventId].push(relation.contactId);
            }
        }

        if (relation.contactId && relation.noteId) {
            if (!accumulator.notes[relation.noteId]) {
                accumulator.notes[relation.noteId] = [];
            }

            if (!accumulator.notes[relation.noteId].includes(relation.contactId)) {
                accumulator.notes[relation.noteId].push(relation.contactId);
            }
        }

        return accumulator;
    }, {
        events: {},
        notes: {}
    });
}

function getContactSummaryLabel (contactNames) {
    if (!contactNames.length) {
        return 'No related contacts';
    }

    if (contactNames.length <= 2) {
        return contactNames.join(', ');
    }

    return `${contactNames.slice(0, 2).join(', ')} +${contactNames.length - 2}`;
}

export default function CalendarBrowse (props) {
    const {
        events,
        notes,
        contacts,
        relations,
        isAllEventsPending,
        isAllNotesPending,
        isAllContactsPending,
        isRelationListPending,
        getAllEvents,
        getAllNotes,
        getAllContacts,
        getAllRelations
    } = props;
    const navigate = useNavigate();
    const [activeMonth, setActiveMonth] = useState(() => getStartOfMonth(new Date()));
    const [showEvents, setShowEvents] = useState(true);
    const [showNotes, setShowNotes] = useState(true);
    const [contactSearchTerm, setContactSearchTerm] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);

    useEffect(() => {
        getAllEvents();
        getAllNotes();
        getAllContacts();
        getAllRelations();
    }, []);

    const today = new Date();
    const allEvents = normalizeRecords(events);
    const allNotes = normalizeRecords(notes);
    const allContacts = normalizeRecords(contacts);
    const allRelations = Array.isArray(relations) ? relations : [];
    const relationMaps = buildContactRelationMaps(allRelations);

    const contactLookup = allContacts.reduce((accumulator, contact) => {
        accumulator[contact.id] = formatContactName(contact);
        return accumulator;
    }, {});

    const availableContacts = allContacts
        .map(contact => ({
            ...contact,
            title: formatContactName(contact)
        }))
        .sort((left, right) => left.title.localeCompare(right.title));

    const filteredContactOptions = availableContacts.filter(contact => {
        if (!contactSearchTerm.trim()) {
            return true;
        }

        return contact.title.toLowerCase().includes(contactSearchTerm.trim().toLowerCase());
    });

    const selectedContactIds = selectedContacts.map(contact => contact.id);

    const visibleEntries = [
        ...(
            showEvents
                ? allEvents.map(event => ({
                    id: event.id,
                    entityType: 'event',
                    title: event.title || `Event ${event.id}`,
                    date: parseStoredDate(event.date),
                    path: `/events/${event.id}`,
                    contactIds: relationMaps.events[event.id] || []
                }))
                : []
        ),
        ...(
            showNotes
                ? allNotes.map(note => ({
                    id: note.id,
                    entityType: 'note',
                    title: note.title || `Note ${note.id}`,
                    date: parseStoredDate(note.date),
                    path: `/notes/${note.id}`,
                    contactIds: relationMaps.notes[note.id] || []
                }))
                : []
        )
    ]
        .filter(entry => entry.date && isSameCalendarMonth(entry.date, activeMonth))
        .filter(entry => {
            if (!selectedContactIds.length) {
                return true;
            }

            return entry.contactIds.some(contactId => selectedContactIds.includes(contactId));
        })
        .map(entry => ({
            ...entry,
            contactNames: entry.contactIds
                .map(contactId => contactLookup[contactId])
                .filter(Boolean),
            dateKey: formatDateKey(entry.date)
        }))
        .sort((left, right) => {
            const dateDifference = left.date.getTime() - right.date.getTime();

            if (dateDifference !== 0) {
                return dateDifference;
            }

            if (left.entityType !== right.entityType) {
                return left.entityType.localeCompare(right.entityType);
            }

            return left.title.localeCompare(right.title);
        });

    const entriesByDateKey = visibleEntries.reduce((accumulator, entry) => {
        if (!accumulator[entry.dateKey]) {
            accumulator[entry.dateKey] = [];
        }

        accumulator[entry.dateKey].push(entry);
        return accumulator;
    }, {});

    const visibleEventCount = visibleEntries.filter(entry => entry.entityType === 'event').length;
    const visibleNoteCount = visibleEntries.filter(entry => entry.entityType === 'note').length;
    const calendarCells = buildCalendarCells(activeMonth);
    const isLoading = isAllEventsPending || isAllNotesPending || isAllContactsPending || isRelationListPending;
    const selectedContactLabel = selectedContacts.length
        ? getContactSummaryLabel(selectedContacts.map(contact => contact.title))
        : 'All contacts';

    return (
        <>
            <CollectionTitleHeader title="Calendar" />
            <ContentWrapper>
                {isLoading
                    ? (
                        <LoadingSpinner type="spinner" />
                    )
                    : (
                        <>
                            <ToolbarRow>
                                <MonthNavigation>
                                    <Button
                                        icon="chevronLeft"
                                        label=""
                                        type="secondary"
                                        onClick={() => setActiveMonth(addMonths(activeMonth, -1))}
                                    />
                                    <MonthTitle>{formatMonthLabel(activeMonth)}</MonthTitle>
                                    <Button
                                        icon="chevronRight"
                                        label=""
                                        type="secondary"
                                        onClick={() => setActiveMonth(addMonths(activeMonth, 1))}
                                    />
                                    <Button
                                        label="Today"
                                        type="secondary"
                                        onClick={() => setActiveMonth(getStartOfMonth(new Date()))}
                                    />
                                </MonthNavigation>
                                <ToggleGroup>
                                    <ToggleButton
                                        type="button"
                                        $active={showEvents}
                                        $entityType="event"
                                        onClick={() => setShowEvents(!showEvents)}
                                    >
                                        Events
                                    </ToggleButton>
                                    <ToggleButton
                                        type="button"
                                        $active={showNotes}
                                        $entityType="note"
                                        onClick={() => setShowNotes(!showNotes)}
                                    >
                                        Notes
                                    </ToggleButton>
                                </ToggleGroup>
                            </ToolbarRow>
                            <SearchRow>
                                <Input
                                    placeholder="Search contacts to narrow the filter list"
                                    label="Search Contacts"
                                    value={contactSearchTerm}
                                    onChange={event => setContactSearchTerm(event.target.value)}
                                />
                            </SearchRow>
                            <FilterRow>
                                <MultiSelect
                                    title={'CONTACT FILTER'}
                                    options={filteredContactOptions}
                                    onChange={setSelectedContacts}
                                />
                                <SummaryPanel>
                                    <SummaryTitle>ACTIVE FILTERS</SummaryTitle>
                                    <SummaryLine>
                                        <strong>Month:</strong> {formatMonthLabel(activeMonth)}
                                    </SummaryLine>
                                    <SummaryLine>
                                        <strong>Contacts:</strong> {selectedContactLabel}
                                    </SummaryLine>
                                    <SummaryLine>
                                        <strong>Showing:</strong> {showEvents ? 'Events' : ''}{showEvents && showNotes ? ' and ' : ''}{showNotes ? 'Notes' : ''}{!showEvents && !showNotes ? 'Nothing selected' : ''}
                                    </SummaryLine>
                                    <LegendRow>
                                        <LegendItem>
                                            <LegendSwatch $entityType="event" />
                                            <span>{visibleEventCount} events</span>
                                        </LegendItem>
                                        <LegendItem>
                                            <LegendSwatch $entityType="note" />
                                            <span>{visibleNoteCount} notes</span>
                                        </LegendItem>
                                    </LegendRow>
                                </SummaryPanel>
                            </FilterRow>
                            {!showEvents && !showNotes && (
                                <NoResultsMessage className="warningMessage">
                                    Select at least one entity type to populate the calendar.
                                </NoResultsMessage>
                            )}
                            {showEvents || showNotes
                                ? (
                                    <>
                                        {!visibleEntries.length && (
                                            <NoResultsMessage className="warningMessage">
                                                No notes or events match the active month and selected contacts.
                                            </NoResultsMessage>
                                        )}
                                        <CalendarShell>
                                            <WeekdayHeaderRow>
                                                {weekdayLabels.map(label => (
                                                    <WeekdayHeader key={label}>{label}</WeekdayHeader>
                                                ))}
                                            </WeekdayHeaderRow>
                                            <CalendarGrid>
                                                {calendarCells.map(cell => {
                                                    const dayEntries = cell.isCurrentMonth ? (entriesByDateKey[cell.dateKey] || []) : [];

                                                    return (
                                                        <DayCell
                                                            key={cell.dateKey}
                                                            $isCurrentMonth={cell.isCurrentMonth}
                                                            $isToday={isSameCalendarDay(cell.date, today)}
                                                        >
                                                            <DayHeader>
                                                                <DayNumber $isCurrentMonth={cell.isCurrentMonth}>
                                                                    {cell.date.getDate()}
                                                                </DayNumber>
                                                                <DayEntryCount>
                                                                    {dayEntries.length ? `${dayEntries.length} item${dayEntries.length === 1 ? '' : 's'}` : ''}
                                                                </DayEntryCount>
                                                            </DayHeader>
                                                            <EntryList>
                                                                {dayEntries.map(entry => (
                                                                    <EntryButton
                                                                        key={`${entry.entityType}-${entry.id}`}
                                                                        type="button"
                                                                        $entityType={entry.entityType}
                                                                        title={entry.title}
                                                                        onClick={() => navigate(entry.path)}
                                                                    >
                                                                        <EntryEyebrow>{entry.entityType}</EntryEyebrow>
                                                                        <EntryTitle>{entry.title}</EntryTitle>
                                                                        <EntryMeta>{getContactSummaryLabel(entry.contactNames)}</EntryMeta>
                                                                    </EntryButton>
                                                                ))}
                                                            </EntryList>
                                                        </DayCell>
                                                    );
                                                })}
                                            </CalendarGrid>
                                        </CalendarShell>
                                    </>
                                )
                                : null}
                        </>
                    )}
            </ContentWrapper>
        </>
    );
}

CalendarBrowse.propTypes = {
    events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    notes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    contacts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    relations: PropTypes.array.isRequired,
    isAllEventsPending: PropTypes.bool.isRequired,
    isAllNotesPending: PropTypes.bool.isRequired,
    isAllContactsPending: PropTypes.bool.isRequired,
    isRelationListPending: PropTypes.bool.isRequired,
    getAllEvents: PropTypes.func.isRequired,
    getAllNotes: PropTypes.func.isRequired,
    getAllContacts: PropTypes.func.isRequired,
    getAllRelations: PropTypes.func.isRequired
};
