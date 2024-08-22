export default class ApplicationError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.code = statusCode;
    }
}