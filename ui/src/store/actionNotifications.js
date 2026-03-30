import ServiceError from './ServiceError';
import { showErrorToast, showSuccessToast } from '../common/App/ToastWrapper/toastNotifications';

function buildToastOptions (notificationOptions = {}) {
    const toastOptions = {};

    if (notificationOptions.toastId) {
        toastOptions.toastId = notificationOptions.toastId;
    }

    return toastOptions;
}

export function normalizeServiceError (action, error) {
    return error instanceof ServiceError ? error : new ServiceError(action, error);
}

export async function runNotifiedRequest ({
    dispatch,
    pendingAction,
    successAction,
    errorAction,
    errorContext,
    serviceCall,
    defaultSuccessMessage = false,
    defaultErrorMessage,
    notificationOptions = {}
}) {
    dispatch(pendingAction());

    try {
        const response = await serviceCall();
        dispatch(successAction(response));

        const successMessage = notificationOptions.successMessage === false || notificationOptions.suppressSuccess
            ? false
            : (notificationOptions.successMessage || defaultSuccessMessage);

        if (successMessage) {
            showSuccessToast(successMessage, buildToastOptions(notificationOptions));
        }

        return response;
    } catch (error) {
        const serviceError = normalizeServiceError(errorContext, error);
        dispatch(errorAction(serviceError));

        if (!notificationOptions.suppressError) {
            showErrorToast(notificationOptions.errorMessage || serviceError, {
                ...buildToastOptions(notificationOptions),
                fallbackMessage: defaultErrorMessage
            });
        }

        throw serviceError;
    }
}
