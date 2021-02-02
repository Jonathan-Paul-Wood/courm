import * as types from './types';

export const initialState = {
    isAddContactsPending: false,
    addContactsError: '',
}

export default function configure(state = initialState, action) {
    switch (action.type) {
        case types.ADD_CONTACTS_SUCCESS:
            return { ...state, isAddContactsPending: false, addContactsError: '' }
            case types.ADD_CONTACTS_PENDING:
                return { ...state, isAddContactsPending: true, addContactsError: '' };
            case types.ADD_CONTACTS_ERROR:
                return { ...state, isAddContactsPending: false, addContactsError: action.error }
        default:
            return state;
    }
}