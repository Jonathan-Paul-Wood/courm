import * as types from './types';
import ServiceError from '../ServiceError';
import RelationListService from '../../services/RelationListService';
import { runNotifiedRequest } from '../actionNotifications';

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

export function getRelationList (entity, id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getRelationListLoading,
            successAction: getRelationListSuccess,
            errorAction: getRelationListError,
            errorContext: 'get relation list',
            serviceCall: () => RelationListService.getRelationList(entity, id),
            defaultErrorMessage: 'Unable to load relations.',
            notificationOptions: {
                toastId: `relation-list-${entity}-${id}-error`,
                ...notificationOptions
            }
        });
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

export function getAllRelations (notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getAllRelationsLoading,
            successAction: getAllRelationsSuccess,
            errorAction: getAllRelationsError,
            errorContext: 'get all relations',
            serviceCall: () => RelationListService.getAllRelations(),
            defaultErrorMessage: 'Unable to load relations.',
            notificationOptions: {
                toastId: 'all-relations-load-error',
                ...notificationOptions
            }
        });
    };
}
