import * as types from './types';

export const initialState = {
    relation: {
        title: '',
        date: '',
        record: '',
        address: '',
        contacts: '',
        createdOn: '',
        lastModifiedOn: ''
    },
    isRelationPending: false,
    relationError: '',
    isRelationPostPending: false,
    relationPostError: '',
    isRelationPutPending: false,
    relationPutError: '',
    isRelationDeletePending: false,
    relationDeleteError: ''
};

export default function relation (state = initialState, action) {
    switch (action.type) {
    case types.POST_RELATION_PENDING:
        return { ...state, isRelationPostPending: true, relationPostError: '' };
    case types.POST_RELATION_ERROR:
        return { ...state, isRelationPostPending: false, relationPostError: action.error };
    case types.POST_RELATION_SUCCESS:
        return { ...state, isRelationPostPending: false, relationPostError: '' };
    case types.PUT_RELATION_PENDING:
        return { ...state, isRelationPutPending: true, relationPutError: '' };
    case types.PUT_RELATION_ERROR:
        return { ...state, isRelationPutPending: false, relationPutError: action.error };
    case types.PUT_RELATION_SUCCESS:
        return { ...state, isRelationPutPending: false, relationPutError: '' };
    case types.DELETE_RELATION_PENDING:
        return { ...state, isRelationDeletePending: true, relationDeleteError: '' };
    case types.DELETE_RELATION_ERROR:
        return { ...state, isRelationDeletePending: false, relationDeleteError: action.error };
    case types.DELETE_RELATION_SUCCESS:
        return { ...state, isRelationDeletePending: false, relationDeleteError: '' };
    default:
        return state;
    }
};
