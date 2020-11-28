import * as types from './types';
import ServiceError from '../ServiceError';
import ContactService from '../../services/ContactService';
//todo: import notification toasts success/error

function getContactLoading() {
    return {
        type: types.GET_CONTACT_LIST_PENDING,
    }
}

function getContactSuccess(payload) {
    return {
        type: types.GET_CONTACT_LIST_SUCCESS,
        payload,
    }
}

function getContactError(error) {
    return {
        type: types.GET_CONTACT_LIST_ERROR,
        error: new ServiceError('get contacts list', error)
    }
}

export function getContactList() { //todo: add search/filter/sort
    return async dispatch => {
        dispatch(getContactLoading());
        try {
            const response = await ContactService.getContactList();
            dispatch(getContactSuccess(response));
        } catch (e) {
            dispatch(getContactError(e));
        }
    }
}