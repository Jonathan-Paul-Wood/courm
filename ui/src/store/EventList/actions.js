import * as types from './types';
import ServiceError from '../ServiceError';
import EventListService from '../../services/EventListService';
import { runNotifiedRequest } from '../actionNotifications';

function getEventListLoading () {
    return {
        type: types.GET_EVENT_LIST_PENDING
    };
}

function getEventListSuccess (payload) {
    return {
        type: types.GET_EVENT_LIST_SUCCESS,
        payload
    };
}

function getEventListError (error) {
    return {
        type: types.GET_EVENT_LIST_ERROR,
        error: new ServiceError('get events list', error)
    };
}

export function getEventList (results, page, searchTerm, order, direction, filters, appliedContacts, appliedNotes, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getEventListLoading,
            successAction: getEventListSuccess,
            errorAction: getEventListError,
            errorContext: 'get events list',
            serviceCall: () => EventListService.getEventList(results, page, searchTerm, order, direction, filters, appliedContacts, appliedNotes),
            defaultErrorMessage: 'Unable to load events.',
            notificationOptions: {
                toastId: 'event-list-load-error',
                ...notificationOptions
            }
        });
    };
}

function getAllEventsLoading () {
    return {
        type: types.GET_ALL_EVENTS_PENDING
    };
}

function getAllEventsSuccess (payload) {
    return {
        type: types.GET_ALL_EVENTS_SUCCESS,
        payload
    };
}

function getAllEventsError (error) {
    return {
        type: types.GET_ALL_EVENTS_ERROR,
        error: new ServiceError('get events list', error)
    };
}

export function getAllEvents (notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getAllEventsLoading,
            successAction: getAllEventsSuccess,
            errorAction: getAllEventsError,
            errorContext: 'get events list',
            serviceCall: () => EventListService.getAllEvents(),
            defaultErrorMessage: 'Unable to load events.',
            notificationOptions: {
                toastId: 'all-events-load-error',
                ...notificationOptions
            }
        });
    };
}
