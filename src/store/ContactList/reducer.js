import * as types from './types';

export const initialState = {
    contacts: [],
    isContactListPending: true,
    contactListError: '',
    contactsMetadata: {
        total: 0,
    },
    isContactListMetadataPending: true,
    contactListMetadataError: '',
}

export default function contact(state = initialState, action) {
    switch (action.type) {
        case types.GET_CONTACT_LIST_PENDING:
            return { ...state, isContactListPending: true, contactListError: '' };
        case types.GET_CONTACT_LIST_ERROR:
            return { ...state, isContactListPending: false, contactListError: action.error }
        case types.GET_CONTACT_LIST_SUCCESS:
            return { ...state, isContactListPending: false, contactListError: '', contacts: action.payload.data }
        case types.GET_CONTACT_LIST_METADATA_PENDING:
            return { ...state, isContactListMetadataPending: true, contactListMetadataError: '' };
        case types.GET_CONTACT_LIST_METADATA_ERROR:
            return { ...state, isContactListMetadataPending: false, contactListMetadataError: action.error }
        case types.GET_CONTACT_LIST_METADATA_SUCCESS:
            return { ...state, isContactListMetadataPending: false, contactListMetadataError: '', contactsMetadata: action.payload.data }
        default:
            return state;
    }
}