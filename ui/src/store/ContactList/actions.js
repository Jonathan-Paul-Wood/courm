import * as types from './types';
import ServiceError from '../ServiceError';
import ContactListService from '../../services/ContactListService';
import { runNotifiedRequest } from '../actionNotifications';

function getContactListLoading () {
    return {
        type: types.GET_CONTACT_LIST_PENDING
    };
}

function getContactListSuccess (payload) {
    return {
        type: types.GET_CONTACT_LIST_SUCCESS,
        payload
    };
}

function getContactListError (error) {
    return {
        type: types.GET_CONTACT_LIST_ERROR,
        error: new ServiceError('get contacts list', error)
    };
}

export function getContactList (results, page, searchTerm, order, direction, filters, appliedEvents, appliedNotes, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getContactListLoading,
            successAction: getContactListSuccess,
            errorAction: getContactListError,
            errorContext: 'get contacts list',
            serviceCall: () => ContactListService.getContactList(results, page, searchTerm, order, direction, filters, appliedEvents, appliedNotes),
            defaultErrorMessage: 'Unable to load contacts.',
            notificationOptions: {
                toastId: 'contact-list-load-error',
                ...notificationOptions
            }
        });
    };
}

function getAllContactsLoading () {
    return {
        type: types.GET_ALL_CONTACTS_PENDING
    };
}

function getAllContactsSuccess (payload) {
    return {
        type: types.GET_ALL_CONTACTS_SUCCESS,
        payload
    };
}

function getAllContactsError (error) {
    return {
        type: types.GET_ALL_CONTACTS_ERROR,
        error: new ServiceError('get all contacts', error)
    };
}

export function getAllContacts (notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getAllContactsLoading,
            successAction: getAllContactsSuccess,
            errorAction: getAllContactsError,
            errorContext: 'get all contacts',
            serviceCall: () => ContactListService.getAllContacts(),
            defaultErrorMessage: 'Unable to load contacts.',
            notificationOptions: {
                toastId: 'all-contacts-load-error',
                ...notificationOptions
            }
        });
    };
}
