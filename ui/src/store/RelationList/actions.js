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

function getAllRelationsLoading () {
    return {
        type: types.GET_ALL_RELATIONS_PENDING
    };
}

function getAllRelationsSuccess (payload) {
    return {
        type: types.GET_ALL_RELATIONS_SUCCESS,
        payload
    };
}

function getAllRelationsError (error) {
    return {
        type: types.GET_ALL_RELATIONS_ERROR,
        error: new ServiceError('get all relations', error)
    };
}

export function getAllRelations () {
    return async dispatch => {
        dispatch(getAllRelationsLoading());
        try {
            const response = await RelationListService.getAllRelations();
            dispatch(getAllRelationsSuccess(response));
        } catch (e) {
            dispatch(getAllRelationsError(e));
        }
    };
}
