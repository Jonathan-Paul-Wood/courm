import * as types from './types';
import ServiceError from '../ServiceError';
import ContactListService from '../../services/ContactListService';
//todo: import notification toasts success/error

function getContactListLoading() {
    return {
        type: types.GET_CONTACT_LIST_PENDING,
    }
}

function getContactListSuccess(payload) {
    return {
        type: types.GET_CONTACT_LIST_SUCCESS,
        payload,
    }
}

function getContactListError(error) {
    return {
        type: types.GET_CONTACT_LIST_ERROR,
        error: new ServiceError('get contacts list', error)
    }
}

export function getContactList(results, page, searchTerm, order, direction, filters=[]) {
    return async dispatch => {
        dispatch(getContactListLoading());
        try {
            const response = await ContactListService.getContactList(results, page, searchTerm, order, direction, filters);
            dispatch(getContactListSuccess(response));
        } catch (e) {
            dispatch(getContactListError(e));
        }
    }
}


function getContactListMetadataLoading() {
    return {
        type: types.GET_CONTACT_LIST_METADATA_PENDING,
    }
}

function getContactListMetadataSuccess(payload) {
    return {
        type: types.GET_CONTACT_LIST_METADATA_SUCCESS,
        payload,
    }
}

function getContactListMetadataError(error) {
    return {
        type: types.GET_CONTACT_LIST_METADATA_ERROR,
        error: new ServiceError('get contacts list metadata', error)
    }
}

export function getContactListMetadata(searchTerm) {
    return async dispatch => {
        dispatch(getContactListMetadataLoading());
        try {
            const response = await ContactListService.getContactListMetadata(searchTerm);
            dispatch(getContactListMetadataSuccess(response));
        } catch (e) {
            dispatch(getContactListMetadataError(e));
        }
    }
}