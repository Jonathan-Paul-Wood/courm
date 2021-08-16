import * as types from './types';

export const initialState = {
    isAddContactsPending: false,
    addContactsError: '',
    isInitializingDB: false,
    initializeDBError: ''
};

export default function configure (state = initialState, action) {
    switch (action.type) {
    case types.ADD_CONTACTS_SUCCESS:
        return { ...state, isAddContactsPending: false, addContactsError: '' };
    case types.ADD_CONTACTS_PENDING:
        return { ...state, isAddContactsPending: true, addContactsError: '' };
    case types.ADD_CONTACTS_ERROR:
        return { ...state, isAddContactsPending: false, addContactsError: action.error };
    case types.INITIALIZE_DB_SUCCESS:
        return { ...state, isInitializingDB: false, initializeDBError: '' };
    case types.INITIALIZE_DB_PENDING:
        return { ...state, isInitializingDB: true, initializeDBError: '' };
    case types.INITIALIZE_DB_ERROR:
        return { ...state, isInitializingDB: false, initializeDBError: action.error };
    default:
        return state;
    }
}
