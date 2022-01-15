import * as types from './types';
import ServiceError from '../ServiceError';
import RelationListService from '../../services/RelationListService';
// todo: import notification toasts success/error

function getRelationListLoading () {
    return {
        type: types.GET_RELATION_LIST_PENDING
    };
}

function getRelationListSuccess (payload) {
    return {
        type: types.GET_RELATION_LIST_SUCCESS,
        payload
    };
}

function getRelationListError (error) {
    return {
        type: types.GET_RELATION_LIST_ERROR,
        error: new ServiceError('get relation list', error)
    };
}

export function getRelationList (entity, id) {
    return async dispatch => {
        dispatch(getRelationListLoading());
        try {
            const response = await RelationListService.getRelationList(entity, id);
            dispatch(getRelationListSuccess(response));
        } catch (e) {
            dispatch(getRelationListError(e));
        }
    };
}
