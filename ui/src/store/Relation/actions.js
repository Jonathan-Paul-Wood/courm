import * as types from './types';
import ServiceError from '../ServiceError';
import RelationService from '../../services/RelationService';
import { runNotifiedRequest } from '../actionNotifications';

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
export function postRelation (body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: postRelationLoading,
            successAction: postRelationSuccess,
            errorAction: postRelationError,
            errorContext: 'post relation',
            serviceCall: () => RelationService.postRelation(body),
            defaultSuccessMessage: 'Relation created.',
            defaultErrorMessage: 'Unable to create relation.',
            notificationOptions
        });
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
export function putRelation (id, body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: putRelationLoading,
            successAction: putRelationSuccess,
            errorAction: putRelationError,
            errorContext: 'put relation error',
            serviceCall: () => RelationService.putRelation(id, body),
            defaultSuccessMessage: 'Relation updated.',
            defaultErrorMessage: 'Unable to update relation.',
            notificationOptions
        });
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
export function deleteRelation (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: deleteRelationLoading,
            successAction: deleteRelationSuccess,
            errorAction: deleteRelationError,
            errorContext: 'delete relation error',
            serviceCall: () => RelationService.deleteRelation(id),
            defaultSuccessMessage: 'Relation deleted.',
            defaultErrorMessage: 'Unable to delete relation.',
            notificationOptions
        });
    };
}
