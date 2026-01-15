export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "Server down";

    res.status(statusCode).json({
        status: status,
        message: error.message,
    })
};

