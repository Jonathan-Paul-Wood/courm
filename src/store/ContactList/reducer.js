import * as types from './types';

export const initialState = {
    contacts: [],
    isContactListPending: false,
    contactListError: '',
}

export default function contact(state = initialState, action) {
    switch (action.type) {
        case types.GET_CONTACT_LIST_PENDING:
            return { ...state, isContactListPending: true, contactListError: '' };
        case types.GET_CONTACT_LIST_ERROR:
            return { ...state, isContactListPending: false, contactListError: action.error }
        case types.GET_CONTACT_LIST_SUCCESS:
            return { ...state, isContactListPending: true, contactListError: '', contacts: action.payload || action.payload.data } //todo: figure out which one
        default:
            return state;
    }
}