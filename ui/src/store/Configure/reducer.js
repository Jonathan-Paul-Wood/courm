import * as types from './types';

export const initialState = {
    isInitializingDB: false,
    initializeDBError: ''
};

export default function configure (state = initialState, action) {
    switch (action.type) {
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
