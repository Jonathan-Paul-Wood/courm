export default class ServiceError {
    constructor(action, error) {
        this.action = action;
        this.message = error.errorMessage || error.message;
        this.status = error.status;
        this.uuid = error.uuid;
        this.type = error.type;
    }
}