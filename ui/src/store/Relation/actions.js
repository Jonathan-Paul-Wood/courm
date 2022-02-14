import * as types from './types';
import ServiceError from '../ServiceError';
import RelationService from '../../services/RelationService';
// todo: import notification toasts success/error

function postRelationLoading () {
    return {
        type: types.POST_RELATION_PENDING
    };
}
function postRelationSuccess (payload) {
    return {
        type: types.POST_RELATION_SUCCESS,
        payload
    };
}
function postRelationError (error) {
    return {
        type: types.POST_RELATION_ERROR,
        error: new ServiceError('post relation ', error)
    };
}
export function postRelation (body) {
    return async dispatch => {
        dispatch(postRelationLoading());
        try {
            const response = await RelationService.postRelation(body);
            dispatch(postRelationSuccess(response));
        } catch (e) {
            dispatch(postRelationError(e));
        }
    };
}

function putRelationLoading () {
    return {
        type: types.PUT_RELATION_PENDING
    };
}
function putRelationSuccess (payload) {
    return {
        type: types.PUT_RELATION_SUCCESS,
        payload
    };
}
function putRelationError (error) {
    return {
        type: types.PUT_RELATION_ERROR,
        error: new ServiceError('put relation error ', error)
    };
}
export function putRelation (id, body) {
    return async dispatch => {
        dispatch(putRelationLoading());
        try {
            const response = await RelationService.putRelation(id, body);
            dispatch(putRelationSuccess(response));
        } catch (e) {
            dispatch(putRelationError(e));
        }
    };
}

function deleteRelationLoading () {
    return {
        type: types.DELETE_RELATION_PENDING
    };
}
function deleteRelationSuccess (payload) {
    return {
        type: types.DELETE_RELATION_SUCCESS,
        payload
    };
}
function deleteRelationError (error) {
    return {
        type: types.DELETE_RELATION_ERROR,
        error: new ServiceError('delete relation error ', error)
    };
}
export function deleteRelation (id) {
    return async dispatch => {
        dispatch(deleteRelationLoading());
        try {
            const response = await RelationService.deleteRelation(id);
            dispatch(deleteRelationSuccess(response));
        } catch (e) {
            dispatch(deleteRelationError(e));
        }
    };
}
