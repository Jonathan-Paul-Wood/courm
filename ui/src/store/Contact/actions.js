import * as types from './types';
import ServiceError from '../ServiceError';
import ContactService from '../../services/ContactService';
import SuccessNotification from '../../../src/common/ToastNotifications/SuccessNotification';

function getContactLoading () {
    return {
        type: types.GET_CONTACT_PENDING
    };
}
function getContactSuccess (payload) {
    return {
        type: types.GET_CONTACT_SUCCESS,
        payload
    };
}
function getContactError (error) {
    return {
        type: types.GET_CONTACT_ERROR,
        error: new ServiceError('get contact ', error)
    };
}
export function getContact (id) {
    return async dispatch => {
        dispatch(getContactLoading());
        try {
            const response = await ContactService.getContact(id);
            dispatch(getContactSuccess(response));
        } catch (e) {
            dispatch(getContactError(e));
        }
    };
}

function postContactLoading () {
    return {
        type: types.POST_CONTACT_PENDING
    };
}
function postContactSuccess (payload) {
    return {
        type: types.POST_CONTACT_SUCCESS,
        payload
    };
}
function postContactError (error) {
    return {
        type: types.POST_CONTACT_ERROR,
        error: new ServiceError('post contact ', error)
    };
}
export function postContact (body) {
    return async dispatch => {
        dispatch(postContactLoading());
        try {
            const response = await ContactService.postContact(body);
            dispatch(postContactSuccess(response));
        } catch (e) {
            dispatch(postContactError(e));
        }
    };
}

function putContactLoading () {
    return {
        type: types.PUT_CONTACT_PENDING
    };
}
function putContactSuccess (payload) {
    console.log('successfully saved');
    SuccessNotification('Contact Saved');
    return {
        type: types.PUT_CONTACT_SUCCESS,
        payload
    };
}
function putContactError (error) {
    return {
        type: types.PUT_CONTACT_ERROR,
        error: new ServiceError('put contact error ', error)
    };
}
export function putContact (id, body) {
    return async dispatch => {
        dispatch(putContactLoading());
        try {
            const response = await ContactService.putContact(id, body);
            dispatch(putContactSuccess(response));
        } catch (e) {
            dispatch(putContactError(e));
        }
    };
}

function deleteContactLoading () {
    return {
        type: types.DELETE_CONTACT_PENDING
    };
}
function deleteContactSuccess (payload) {
    return {
        type: types.DELETE_CONTACT_SUCCESS,
        payload
    };
}
function deleteContactError (error) {
    return {
        type: types.DELETE_CONTACT_ERROR,
        error: new ServiceError('delete contact error ', error)
    };
}
export function deleteContact (id) {
    return async dispatch => {
        dispatch(deleteContactLoading());
        try {
            const response = await ContactService.deleteContact(id);
            dispatch(deleteContactSuccess(response));
        } catch (e) {
            dispatch(deleteContactError(e));
        }
    };
}
