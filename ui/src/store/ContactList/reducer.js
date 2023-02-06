import * as types from './types';

export const initialState = {
    contacts: {},
    isContactListPending: true,
    contactListError: '',
    isAllContactsPending: false,
    allContactsError: ''
};

export default function contact (state = initialState, action) {
    switch (action.type) {
    case types.GET_CONTACT_LIST_PENDING:
        return { ...state, isContactListPending: true, contactListError: '' };
    case types.GET_CONTACT_LIST_ERROR:
        return { ...state, isContactListPending: false, contactListError: action.error };
    case types.GET_CONTACT_LIST_SUCCESS:
        return { ...state, isContactListPending: false, contactListError: '', contacts: action.payload.data };
    case types.GET_ALL_CONTACTS_PENDING:
        return { ...state, isAllContactsPending: true, allContactsError: '' };
    case types.GET_ALL_CONTACTS_ERROR:
        return { ...state, isAllContactsPending: false, allContactsError: action.error };
    case types.GET_ALL_CONTACTS_SUCCESS:
        return { ...state, isAllContactsPending: false, allContactsError: '', contacts: action.payload.data };
    default:
        return state;
    }
}
