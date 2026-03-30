import { toast } from 'react-toastify';

export const SUCCESS_TOAST_AUTO_CLOSE_MS = 4000;
const DEFAULT_ERROR_MESSAGE = 'Something went wrong.';

export function normalizeToastMessage (value, fallbackMessage = DEFAULT_ERROR_MESSAGE) {
    if (!value) {
        return fallbackMessage;
    }

    if (typeof value === 'string') {
        return value;
    }

    if (value.message) {
        return value.message;
    }

    if (value.errorMessage) {
        return value.errorMessage;
    }

    if (value.response?.data?.message) {
        return value.response.data.message;
    }

    if (value.data?.message) {
        return value.data.message;
    }

    if (value.statusText) {
        return value.statusText;
    }

    return fallbackMessage;
}

function buildToastOptions (options = {}) {
    const toastOptions = {};

    if (options.toastId) {
        toastOptions.toastId = options.toastId;
    }

    return toastOptions;
}

export function showSuccessToast (message, options = {}) {
    const normalizedMessage = normalizeToastMessage(message, 'Success');
    return toast.success(normalizedMessage, {
        autoClose: SUCCESS_TOAST_AUTO_CLOSE_MS,
        ...buildToastOptions(options)
    });
}

export function showErrorToast (error, options = {}) {
    const normalizedMessage = normalizeToastMessage(error, options.fallbackMessage || DEFAULT_ERROR_MESSAGE);
    return toast.error(normalizedMessage, {
        autoClose: false,
        ...buildToastOptions(options)
    });
}

export function showWarningToast (message, options = {}) {
    const normalizedMessage = normalizeToastMessage(message, 'Warning');
    return toast.warning(normalizedMessage, {
        autoClose: false,
        ...buildToastOptions(options)
    });
}
