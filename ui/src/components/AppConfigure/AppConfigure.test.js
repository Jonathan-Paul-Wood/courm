/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppConfigure from './AppConfigure';
import { showErrorToast } from '../../common/App/ToastWrapper/toastNotifications';

let mockReaderResult = '';

jest.mock('../../common/Button', () => function MockButton (props) {
    return (
        <button disabled={props.disabled} onClick={props.onClick}>
            {props.label || props.icon || 'button'}
        </button>
    );
});

jest.mock('../../common/Select', () => function MockSelect () {
    return <div>Select</div>;
});

jest.mock('../../common/LoadingSpinner', () => function MockLoadingSpinner () {
    return <div>loading</div>;
});

jest.mock('../../common/App/ToastWrapper/toastNotifications', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
    showWarningToast: jest.fn()
}));

describe('AppConfigure bulk notifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        global.FileReader = class MockFileReader {
            readAsText () {
                this.result = mockReaderResult;
            }
        };
    });

    it('shows a single aggregate error toast for mixed bulk import results', async () => {
        mockReaderResult = JSON.stringify({
            data: {
                contacts: {
                    data: [{ id: 1, firstName: 'Ada' }]
                },
                events: {
                    data: [{ id: 2, title: 'Launch' }]
                }
            }
        });

        const postContact = jest.fn().mockResolvedValue({ data: {} });
        const postEvent = jest.fn().mockRejectedValue(new Error('event failed'));

        const { container } = render(
            <AppConfigure
                getAllContacts={jest.fn().mockResolvedValue({})}
                postContact={postContact}
                deleteContact={jest.fn()}
                contacts={{ results: [] }}
                isAllContactsPending={false}
                contactListError=""
                isContactPostPending={false}
                contactPostError=""
                isContactDeletePending={false}
                getAllEvents={jest.fn().mockResolvedValue({})}
                postEvent={postEvent}
                deleteEvent={jest.fn()}
                events={{ results: [] }}
                isAllEventsPending={false}
                eventListError=""
                isEventPostPending={false}
                eventPostError=""
                isEventDeletePending={false}
                getAllNotes={jest.fn().mockResolvedValue({})}
                postNote={jest.fn()}
                deleteNote={jest.fn()}
                notes={{ results: [] }}
                isAllNotesPending={false}
                noteListError=""
                isNotePostPending={false}
                notePostError=""
                isNoteDeletePending={false}
                getAllRelations={jest.fn().mockResolvedValue({})}
                postRelation={jest.fn()}
                deleteRelation={jest.fn()}
                relations={[]}
                isRelationListPending={false}
                relationListError=""
            />
        );

        fireEvent.change(container.querySelector('#uploadedFile'), {
            target: { files: [{}] }
        });
        fireEvent.click(screen.getByText('Add All Data'));

        await waitFor(() => expect(postContact).toHaveBeenCalled());
        await waitFor(() => expect(postEvent).toHaveBeenCalled());

        expect(postContact).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Ada' }), {
            suppressSuccess: true,
            suppressError: true
        });
        expect(postEvent).toHaveBeenCalledWith(expect.objectContaining({ title: 'Launch' }), {
            suppressSuccess: true,
            suppressError: true
        });
        expect(showErrorToast).toHaveBeenCalledTimes(1);
        expect(showErrorToast.mock.calls[0][0]).toContain('Import All Data finished with 1 failure');
    });
});
