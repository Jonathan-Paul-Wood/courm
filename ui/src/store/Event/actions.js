import * as types from './types';
import ServiceError from '../ServiceError';
import EventService from '../../services/EventService';
// todo: import notification toasts success/error

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
export function getEvent (id) {
    return async dispatch => {
        dispatch(getEventLoading());
        try {
            const response = await EventService.getEvent(id);
            dispatch(getEventSuccess(response));
        } catch (e) {
            dispatch(getEventError(e));
        }
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
export function postEvent (body) {
    return async dispatch => {
        dispatch(postEventLoading());
        try {
            const response = await EventService.postEvent(body);
            dispatch(postEventSuccess(response));
        } catch (e) {
            dispatch(postEventError(e));
        }
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
export function putEvent (id, body) {
    return async dispatch => {
        dispatch(putEventLoading());
        try {
            const response = await EventService.putEvent(id, body);
            dispatch(putEventSuccess(response));
        } catch (e) {
            dispatch(putEventError(e));
        }
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
export function deleteEvent (id) {
    return async dispatch => {
        dispatch(deleteEventLoading());
        try {
            const response = await EventService.deleteEvent(id);
            dispatch(deleteEventSuccess(response));
        } catch (e) {
            dispatch(deleteEventError(e));
        }
    };
}
