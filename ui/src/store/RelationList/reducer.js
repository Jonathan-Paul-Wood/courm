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
    case types.GET_ALL_RELATIONS_PENDING:
        return { ...state, isRelationListPending: true, relationListError: '' };
    case types.GET_ALL_RELATIONS_ERROR:
        return { ...state, isRelationListPending: false, relationListError: action.error };
    case types.GET_ALL_RELATIONS_SUCCESS:
        return { ...state, isRelationListPending: false, relationListError: '', relations: action.payload.data };
    default:
        return state;
    }
}
