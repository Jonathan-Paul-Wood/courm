export default class ServiceError {
    constructor (action, error = {}) {
        const responseData = error?.response?.data || error?.data || {};
        const source = error instanceof ServiceError
            ? error
            : (typeof responseData === 'string' ? { message: responseData } : { ...responseData, ...error });

        this.action = source.action || action;
        this.message = source.errorMessage || source.message || error?.statusText || 'Unexpected error';
        this.status = source.status || error?.status || error?.response?.status;
        this.uuid = source.uuid;
        this.type = source.type;
    }

    toString () {
        return this.message;
    }
}
