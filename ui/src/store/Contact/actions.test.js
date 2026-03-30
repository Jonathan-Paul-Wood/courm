import * as types from './types';
import ServiceError from '../ServiceError';
import { deleteContact, getContact, postContact, putContact } from './actions';
import ContactService from '../../services/ContactService';
import { showErrorToast, showSuccessToast } from '../../common/App/ToastWrapper/toastNotifications';

jest.mock('../../services/ContactService', () => ({
    __esModule: true,
    default: {
        getContact: jest.fn(),
        postContact: jest.fn(),
        putContact: jest.fn(),
        deleteContact: jest.fn()
    }
}));

jest.mock('../../common/App/ToastWrapper/toastNotifications', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn()
}));

describe('Contact actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('dispatches success actions, shows a success toast, and resolves on create', async () => {
        const response = { data: { id: 42 } };
        const dispatch = jest.fn();

        ContactService.postContact.mockResolvedValue(response);

        await expect(postContact({ firstName: 'Ada' })(dispatch)).resolves.toBe(response);

        expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
            types.POST_CONTACT_PENDING,
            types.POST_CONTACT_SUCCESS
        ]);
        expect(showSuccessToast).toHaveBeenCalledWith('Contact created.', {});
        expect(showErrorToast).not.toHaveBeenCalled();
    });

    it('dispatches an error action, shows an error toast, and rejects with ServiceError on update failure', async () => {
        const dispatch = jest.fn();

        ContactService.putContact.mockRejectedValue({ message: 'Update failed' });

        await expect(putContact(7, { firstName: 'Grace' })(dispatch)).rejects.toBeInstanceOf(ServiceError);

        expect(dispatch.mock.calls[0][0].type).toBe(types.PUT_CONTACT_PENDING);
        expect(dispatch.mock.calls[1][0].type).toBe(types.PUT_CONTACT_ERROR);
        expect(dispatch.mock.calls[1][0].error).toBeInstanceOf(ServiceError);
        expect(dispatch.mock.calls[1][0].error.message).toBe('Update failed');
        expect(showErrorToast).toHaveBeenCalledWith(
            expect.any(ServiceError),
            expect.objectContaining({ fallbackMessage: 'Unable to update contact.' })
        );
        expect(showSuccessToast).not.toHaveBeenCalled();
    });

    it('uses a stable toastId for repeated read failures and does not show success toasts for reads', async () => {
        const dispatch = jest.fn();

        ContactService.getContact.mockRejectedValue({ message: 'Not found' });

        await expect(getContact(9)(dispatch)).rejects.toBeInstanceOf(ServiceError);

        expect(showErrorToast).toHaveBeenCalledWith(
            expect.any(ServiceError),
            expect.objectContaining({
                toastId: 'contact-load-9-error',
                fallbackMessage: 'Unable to load contact.'
            })
        );
        expect(showSuccessToast).not.toHaveBeenCalled();
    });

    it('supports suppressing per-request toasts', async () => {
        const dispatch = jest.fn();

        ContactService.deleteContact.mockRejectedValue({ message: 'Cannot delete' });

        await expect(deleteContact(5, { suppressError: true })(dispatch)).rejects.toBeInstanceOf(ServiceError);

        expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
            types.DELETE_CONTACT_PENDING,
            types.DELETE_CONTACT_ERROR
        ]);
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(showSuccessToast).not.toHaveBeenCalled();
    });
});
