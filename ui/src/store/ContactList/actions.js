import * as types from './types';
import ServiceError from '../ServiceError';
import ContactListService from '../../services/ContactListService';

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

export function getContactList (results, page, searchTerm, order, direction, filters, appliedEvents, appliedNotes) {
    return async dispatch => {
        dispatch(getContactListLoading());
        try {
            const response = await ContactListService.getContactList(results, page, searchTerm, order, direction, filters, appliedEvents, appliedNotes);
            dispatch(getContactListSuccess(response));
        } catch (e) {
            dispatch(getContactListError(e));
        }
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

export function getAllContacts () {
    return async dispatch => {
        dispatch(getAllContactsLoading());
        try {
            const response = await ContactListService.getAllContacts();
            dispatch(getAllContactsSuccess(response));
        } catch (e) {
            dispatch(getAllContactsError(e));
        }
    };
}
