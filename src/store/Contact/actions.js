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
        error: new ServiceError('get contact ', error)
    }
}
export function getContact(id) {
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

function postContactLoading() {
    return {
        type: types.POST_CONTACT_PENDING,
    }
}
function postContactSuccess(payload) {
    return {
        type: types.POST_CONTACT_SUCCESS,
        payload,
    }
}
function postContactError(error) {
    return {
        type: types.POST_CONTACT_ERROR,
        error: new ServiceError('post contact ', error)
    }
}
export function postContact(body) {
    return async dispatch => {
        dispatch(postContactLoading());
        try {
            const response = await ContactService.postContact(body);
            dispatch(postContactSuccess(response));
        } catch (e) {
            dispatch(postContactError(e));
        }
    }
}

function putContactLoading() {
    return {
        type: types.PUT_CONTACT_PENDING,
    }
}
function putContactSuccess(payload) {
    return {
        type: types.PUT_CONTACT_SUCCESS,
        payload,
    }
}
function putContactError(error) {
    return {
        type: types.PUT_CONTACT_ERROR,
        error: new ServiceError('put contact error ', error)
    }
}
export function putContact(id, body) {
    return async dispatch => {
        dispatch(putContactLoading());
        try {
            const response = await ContactService.putContact(id, body);
            dispatch(putContactSuccess(response));
        } catch (e) {
            dispatch(putContactError(e));
        }
    }
}