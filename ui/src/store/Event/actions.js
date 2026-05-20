import * as types from './types';
import ServiceError from '../ServiceError';
import EventService from '../../services/EventService';
import { runNotifiedRequest } from '../actionNotifications';

function getEventLoading () {
    return {
        type: types.GET_EVENT_PENDING
    };
}
function getEventSuccess (payload) {
    return {
        type: types.GET_EVENT_SUCCESS,
        payload
    };
}
function getEventError (error) {
    return {
        type: types.GET_EVENT_ERROR,
        error: new ServiceError('get event ', error)
    };
}
export function getEvent (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getEventLoading,
            successAction: getEventSuccess,
            errorAction: getEventError,
            errorContext: 'get event',
            serviceCall: () => EventService.getEvent(id),
            defaultErrorMessage: 'Unable to load event.',
            notificationOptions: {
                toastId: `event-load-${id}-error`,
                ...notificationOptions
            }
        });
    };
}

function postEventLoading () {
    return {
        type: types.POST_EVENT_PENDING
    };
}
function postEventSuccess (payload) {
    return {
        type: types.POST_EVENT_SUCCESS,
        payload
    };
}
function postEventError (error) {
    return {
        type: types.POST_EVENT_ERROR,
        error: new ServiceError('post event ', error)
    };
}
export function postEvent (body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: postEventLoading,
            successAction: postEventSuccess,
            errorAction: postEventError,
            errorContext: 'post event',
            serviceCall: () => EventService.postEvent(body),
            defaultSuccessMessage: 'Event created.',
            defaultErrorMessage: 'Unable to create event.',
            notificationOptions
        });
    };
}

function putEventLoading () {
    return {
        type: types.PUT_EVENT_PENDING
    };
}
function putEventSuccess (payload) {
    return {
        type: types.PUT_EVENT_SUCCESS,
        payload
    };
}
function putEventError (error) {
    return {
        type: types.PUT_EVENT_ERROR,
        error: new ServiceError('put event error ', error)
    };
}
export function putEvent (id, body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: putEventLoading,
            successAction: putEventSuccess,
            errorAction: putEventError,
            errorContext: 'put event error',
            serviceCall: () => EventService.putEvent(id, body),
            defaultSuccessMessage: 'Event updated.',
            defaultErrorMessage: 'Unable to update event.',
            notificationOptions
        });
    };
}

function deleteEventLoading () {
    return {
        type: types.DELETE_EVENT_PENDING
    };
}
function deleteEventSuccess (payload) {
    return {
        type: types.DELETE_EVENT_SUCCESS,
        payload
    };
}
function deleteEventError (error) {
    return {
        type: types.DELETE_EVENT_ERROR,
        error: new ServiceError('delete event error ', error)
    };
}
export function deleteEvent (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: deleteEventLoading,
            successAction: deleteEventSuccess,
            errorAction: deleteEventError,
            errorContext: 'delete event error',
            serviceCall: () => EventService.deleteEvent(id),
            defaultSuccessMessage: 'Event deleted.',
            defaultErrorMessage: 'Unable to delete event.',
            notificationOptions
        });
    };
}
