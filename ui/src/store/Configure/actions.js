import * as types from './types';
import ServiceError from '../ServiceError';
import ConfigureService from '../../services/ConfigureService';
//todo: import notification toasts success/error

function addContactsLoading() {
    return {
        type: types.ADD_CONTACTS_PENDING,
    }
}
function addContactsSuccess(payload) {
    return {
        type: types.ADD_CONTACTS_SUCCESS,
        payload,
    }
}
function addContactsError(error) {
    return {
        type: types.ADD_CONTACTS_ERROR,
        error: new ServiceError('add contacts error ', error)
    }
}
export function addContacts(json) {
    return async dispatch => {
        dispatch(addContactsLoading());
        try {
            const response = await ConfigureService.addContacts(json);
            dispatch(addContactsSuccess(response));
        } catch (e) {
            dispatch(addContactsError(e));
        }
    }
}