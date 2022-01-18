import * as types from './types';

export const initialState = {
    relations: [],
    isRelationListPending: true,
    relationListError: ''
};

export default function relation (state = initialState, action) {
    switch (action.type) {
    case types.GET_RELATION_LIST_PENDING:
        return { ...state, isRelationListPending: true, relationListError: '' };
    case types.GET_RELATION_LIST_ERROR:
        return { ...state, isRelationListPending: false, relationListError: action.error };
    case types.GET_RELATION_LIST_SUCCESS:
        return { ...state, isRelationListPending: false, relationListError: '', relations: action.payload.data };
    default:
        return state;
    }
}
