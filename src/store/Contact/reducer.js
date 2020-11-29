import * as types from './types';

export const initialState = {
    contact: {},
    isContactPending: false,
    contactError: '',
}

export default function contact(state = initialState, action) {
    switch (action.type) {
        case types.GET_CONTACT_PENDING:
            return { ...state, isContactPending: true, contactError: '' };
        case types.GET_CONTACT_ERROR:
            return { ...state, isContactPending: false, contactError: action.error }
        case types.GET_CONTACT_SUCCESS:
            return { ...state, isContactPending: true, contactError: '', contacts: action.payload || action.payload.data } //todo: figure out which one
        default:
            return state;
    }
}