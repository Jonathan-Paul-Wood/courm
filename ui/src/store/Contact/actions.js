import * as types from './types';
import ServiceError from '../ServiceError';
import ContactService from '../../services/ContactService';
import { runNotifiedRequest } from '../actionNotifications';

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
export function getContact (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getContactLoading,
            successAction: getContactSuccess,
            errorAction: getContactError,
            errorContext: 'get contact',
            serviceCall: () => ContactService.getContact(id),
            defaultErrorMessage: 'Unable to load contact.',
            notificationOptions: {
                toastId: `contact-load-${id}-error`,
                ...notificationOptions
            }
        });
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
export function postContact (body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: postContactLoading,
            successAction: postContactSuccess,
            errorAction: postContactError,
            errorContext: 'post contact',
            serviceCall: () => ContactService.postContact(body),
            defaultSuccessMessage: 'Contact created.',
            defaultErrorMessage: 'Unable to create contact.',
            notificationOptions
        });
    };
}

function putContactLoading () {
    return {
        type: types.PUT_CONTACT_PENDING
    };
}
function putContactSuccess (payload) {
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
export function putContact (id, body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: putContactLoading,
            successAction: putContactSuccess,
            errorAction: putContactError,
            errorContext: 'put contact error',
            serviceCall: () => ContactService.putContact(id, body),
            defaultSuccessMessage: 'Contact updated.',
            defaultErrorMessage: 'Unable to update contact.',
            notificationOptions
        });
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
export function deleteContact (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: deleteContactLoading,
            successAction: deleteContactSuccess,
            errorAction: deleteContactError,
            errorContext: 'delete contact error',
            serviceCall: () => ContactService.deleteContact(id),
            defaultSuccessMessage: 'Contact deleted.',
            defaultErrorMessage: 'Unable to delete contact.',
            notificationOptions
        });
    };
}
