class AppError extends Error{
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational =  true;
        // Capture stack trace for debugging purposes
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;