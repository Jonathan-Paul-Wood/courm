import * as types from './types';
import ServiceError from '../ServiceError';
import ContactService from '../../services/ContactService';
//todo: import notification toasts success/error

function getContactLoading() {
    return {
        type: types.GET_CONTACT_PENDING,
    }
}

function getContactSuccess(payload) {
    return {
        type: types.GET_CONTACT_SUCCESS,
        payload,
    }
}

function getContactError(error) {
    return {
        type: types.GET_CONTACT_ERROR,
        error: new ServiceError('get contacts list', error)
    }
}

export function getContact(id) { //todo: add search/filter/sort
    return async dispatch => {
        dispatch(getContactLoading());
        try {
            const response = await ContactService.getContact(id);
            dispatch(getContactSuccess(response));
        } catch (e) {
            dispatch(getContactError(e));
        }
    }
}