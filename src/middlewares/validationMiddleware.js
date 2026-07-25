const validationMiddlewares = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;

        console.log(err.name);

        if (err.name === 'CastError') {
            const message = 'Invalid input data';
            error = new Error(message);
            error.statusCode = 404;
        }

        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }


        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message
        });
    } catch (error) {
        next(error);
    }
}



export default validationMiddlewares;
