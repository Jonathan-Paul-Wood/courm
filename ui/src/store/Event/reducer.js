import * as types from './types';

export const initialState = {
    event: {
        title: '',
        date: '',
        record: '',
        address: '',
        contacts: '',
        createdOn: '',
        lastModifiedOn: ''
    },
    isEventPending: false,
    eventError: '',
    isEventPostPending: false,
    eventPostError: '',
    isEventPutPending: false,
    eventPutError: '',
    isEventDeletePending: false,
    eventDeleteError: ''
};

export default function event (state = initialState, action) {
    switch (action.type) {
    case types.GET_EVENT_PENDING:
        return { ...state, isEventPending: true, eventError: '' };
    case types.GET_EVENT_ERROR:
        return { ...state, isEventPending: false, eventError: action.error };
    case types.GET_EVENT_SUCCESS:
        return { ...state, isEventPending: false, eventError: '', event: action.payload.data };
    case types.POST_EVENT_PENDING:
        return { ...state, isEventPostPending: true, eventPostError: '' };
    case types.POST_EVENT_ERROR:
        return { ...state, isEventPostPending: false, eventPostError: action.error };
    case types.POST_EVENT_SUCCESS:
        return { ...state, isEventPostPending: false, eventPostError: '' };
    case types.PUT_EVENT_PENDING:
        return { ...state, isEventPutPending: true, eventPutError: '' };
    case types.PUT_EVENT_ERROR:
        return { ...state, isEventPutPending: false, eventPutError: action.error };
    case types.PUT_EVENT_SUCCESS:
        return { ...state, isEventPutPending: false, eventPutError: '' };
    case types.DELETE_EVENT_PENDING:
        return { ...state, isEventDeletePending: true, eventDeleteError: '' };
    case types.DELETE_EVENT_ERROR:
        return { ...state, isEventDeletePending: false, eventDeleteError: action.error };
    case types.DELETE_EVENT_SUCCESS:
        return { ...state, isEventDeletePending: false, eventDeleteError: '' };
    default:
        return state;
    }
};
