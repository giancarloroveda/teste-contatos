type ValidationErrorDetails = {
    location: string,
    msg: string
}

export default class ValidationError extends Error {
    public statusCode: number;
    public details: ValidationErrorDetails;

    constructor(
        message: string,
        details: ValidationErrorDetails,
        code: number
    ) {
        super(message);
        this.statusCode = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}