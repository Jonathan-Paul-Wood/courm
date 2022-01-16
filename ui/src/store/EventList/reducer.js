import * as types from './types';

export const initialState = {
    events: {},
    isEventListPending: true,
    eventListError: ''
};

export default function event (state = initialState, action) {
    switch (action.type) {
    case types.GET_EVENT_LIST_PENDING:
        return { ...state, isEventListPending: true, eventListError: '' };
    case types.GET_EVENT_LIST_ERROR:
        return { ...state, isEventListPending: false, eventListError: action.error };
    case types.GET_EVENT_LIST_SUCCESS:
        return { ...state, isEventListPending: false, eventListError: '', events: action.payload.data };
    default:
        return state;
    }
}
