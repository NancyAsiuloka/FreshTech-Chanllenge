const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    console.log(value)
    const message = `Duplicate field value: $[value], please use another value`;
    return new AppError(message, 400 )
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el=> el.message);


    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please login again!', 401)
const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: 'fail',
        error: err,
        message: err.message,
        stack: err.stack
    })
}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production'){
        let error = {...err};

        if(error.name === "CastError") error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === "validationError") error = handleValidationErrorDB(error)
        if(error.name === "jsonWebTokenError") error = handleJWTError()
        if(error.name === "TokenExpiredError") error = handleJWTExpiredError()

        sendErrorProd(error, res)
    }
    next()
};
