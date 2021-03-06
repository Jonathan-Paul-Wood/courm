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

export function getContactList (results, page, searchTerm, order, direction, filters) {
    return async dispatch => {
        dispatch(getContactListLoading());
        try {
            const response = await ContactListService.getContactList(results, page, searchTerm, order, direction, filters);
            dispatch(getContactListSuccess(response));
        } catch (e) {
            dispatch(getContactListError(e));
        }
    };
}
