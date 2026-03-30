/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EditContact from './EditContact/EditContact';
import EditEvent from './EditEvent/EditEvent';
import EditNote from './EditNote/EditNote';

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/contacts/1/edit' };
const mockParams = {};

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => mockParams
}), { virtual: true });

jest.mock('../common/EntityTitleHeader/EntityTitleHeader', () => function MockEntityTitleHeader (props) {
    return <button onClick={props.handleSave}>save</button>;
});

jest.mock('../common/Button', () => function MockButton (props) {
    return (
        <button disabled={props.disabled} onClick={props.onClick}>
            {props.label || props.icon || 'button'}
        </button>
    );
});

jest.mock('../common/Input/Input', () => function MockInput (props) {
    return (
        <input
            aria-label={props.label}
            value={props.value || ''}
            onChange={props.onChange}
        />
    );
});

jest.mock('../common/DateInput/DateInput', () => function MockDateInput (props) {
    return (
        <input
            aria-label={props.label}
            value={props.value || ''}
            onChange={event => props.onChange && props.onChange(event.target.value)}
        />
    );
});

jest.mock('../common/TextArea/TextArea', () => function MockTextArea (props) {
    return (
        <textarea
            aria-label={props.label}
            value={props.value || ''}
            onChange={props.onChange}
        />
    );
});

jest.mock('../common/CommonModal/CommonModal', () => function MockCommonModal (props) {
    return props.show ? <button onClick={props.onSubmit}>Confirm</button> : null;
});

jest.mock('../common/ScrollContainer', () => function MockScrollContainer (props) {
    return <div>{props.children}</div>;
});

jest.mock('../common/LoadingSpinner/LoadingSpinner', () => function MockLoadingSpinner () {
    return <div>loading</div>;
});

jest.mock('../common/Utilities/utilities', () => ({
    buildStoredFileUrl: jest.fn((path) => path || '')
}));

describe('Edit flow navigation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('navigates after a successful contact update and stays put after a failed delete', async () => {
        mockLocation.pathname = '/contacts/5/edit';
        Object.assign(mockParams, { contactId: '5' });

        const putContact = jest.fn().mockResolvedValue({ data: {} });
        const deleteContact = jest.fn().mockRejectedValue(new Error('delete failed'));

        render(
            <EditContact
                contact={{
                    firstName: 'Ada',
                    lastName: 'Lovelace',
                    profilePicture: '',
                    phoneNumber: '',
                    email: '',
                    address: '',
                    firm: '',
                    industry: '',
                    dateOfBirth: '',
                    bio: '',
                    entityType: 'person'
                }}
                isContactPending={false}
                contactError=""
                getContact={jest.fn().mockResolvedValue({})}
                postContact={jest.fn()}
                isContactPostPending={false}
                contactPostError={''}
                putContact={putContact}
                isContactPutPending={false}
                contactPutError={''}
                deleteContact={deleteContact}
                isContactDeletePending={false}
                contactDeleteError=""
            />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => expect(putContact).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/contacts/5');

        mockNavigate.mockClear();
        fireEvent.click(screen.getByText('DELETE'));
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => expect(deleteContact).toHaveBeenCalled());
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates after a successful event update and does not navigate on event delete failure', async () => {
        mockLocation.pathname = '/events/8/edit';
        Object.assign(mockParams, { eventId: '8' });

        const putEvent = jest.fn().mockResolvedValue({ data: {} });
        const deleteEvent = jest.fn().mockRejectedValue(new Error('delete failed'));

        render(
            <EditEvent
                event={{
                    title: 'Launch',
                    date: '2026-03-29T10:00:00',
                    address: 'HQ',
                    description: 'Demo'
                }}
                isEventPending={false}
                eventError=""
                getEvent={jest.fn().mockResolvedValue({})}
                postEvent={jest.fn()}
                isEventPostPending={false}
                eventPostError=""
                putEvent={putEvent}
                isEventPutPending={false}
                eventPutError=""
                deleteEvent={deleteEvent}
                isEventDeletePending={false}
                eventDeleteError=""
            />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => expect(putEvent).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/events/8');

        mockNavigate.mockClear();
        fireEvent.click(screen.getByText('DELETE'));
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => expect(deleteEvent).toHaveBeenCalled());
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates after a successful note update and does not navigate on note delete failure', async () => {
        mockLocation.pathname = '/notes/11/edit';
        Object.assign(mockParams, { noteId: '11' });

        const putNote = jest.fn().mockResolvedValue({ data: {} });
        const deleteNote = jest.fn().mockRejectedValue(new Error('delete failed'));

        render(
            <EditNote
                note={{
                    title: 'Observation',
                    date: '2026-03-29T10:00:00',
                    address: '',
                    record: 'Body',
                    mediaFiles: []
                }}
                isNotePending={false}
                noteError=""
                getNote={jest.fn().mockResolvedValue({})}
                postNote={jest.fn()}
                isNotePostPending={false}
                notePostError=""
                putNote={putNote}
                isNotePutPending={false}
                notePutError=""
                deleteNote={deleteNote}
                isNoteDeletePending={false}
                noteDeleteError=""
            />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => expect(putNote).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/notes/11');

        mockNavigate.mockClear();
        fireEvent.click(screen.getByText('DELETE'));
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => expect(deleteNote).toHaveBeenCalled());
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
