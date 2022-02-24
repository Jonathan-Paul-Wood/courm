import * as types from './types';
import ServiceError from '../ServiceError';
import ConfigureService from '../../services/ConfigureService';

function initializeDBLoading () {
    return {
        type: types.INITIALIZE_DB_PENDING
    };
}
function initializeDBSuccess () {
    return {
        type: types.INITIALIZE_DB_SUCCESS
    };
}
function initializeDBError (error) {
    return {
        type: types.INITIALIZE_DB_ERROR,
        error: new ServiceError('Error initializing the database: ', error)
    };
}
export function initializeDB () {
    return async dispatch => {
        dispatch(initializeDBLoading());
        try {
            const response = await ConfigureService.initializeDB();
            dispatch(initializeDBSuccess(response));
        } catch (e) {
            dispatch(initializeDBError(e));
            // TODO: display detailed Error screen for user debugging
        }
    };
}
