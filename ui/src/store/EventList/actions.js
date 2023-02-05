import * as types from './types';
import ServiceError from '../ServiceError';
import EventListService from '../../services/EventListService';
// todo: import notification toasts success/error

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

export function getEventList (results, page, searchTerm, order, direction, filters) {
    return async dispatch => {
        dispatch(getEventListLoading());
        try {
            const response = await EventListService.getEventList(results, page, searchTerm, order, direction, filters);
            dispatch(getEventListSuccess(response));
        } catch (e) {
            dispatch(getEventListError(e));
        }
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

export function getAllEvents () {
    return async dispatch => {
        dispatch(getAllEventsLoading());
        try {
            const response = await EventListService.getAllEvents();
            dispatch(getAllEventsSuccess(response));
        } catch (e) {
            dispatch(getAllEventsError(e));
        }
    };
}
