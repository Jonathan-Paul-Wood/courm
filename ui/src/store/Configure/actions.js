import * as types from './types';
import ServiceError from '../ServiceError';
import ConfigureService from '../../services/ConfigureService';
import { runNotifiedRequest } from '../actionNotifications';

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
export function initializeDB (notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: initializeDBLoading,
            successAction: initializeDBSuccess,
            errorAction: initializeDBError,
            errorContext: 'Error initializing the database:',
            serviceCall: () => ConfigureService.initializeDB(),
            defaultSuccessMessage: 'Application data store initialized.',
            defaultErrorMessage: 'Unable to initialize the application data store.',
            notificationOptions: {
                toastId: 'initialize-db',
                ...notificationOptions
            }
        });
    };
}
