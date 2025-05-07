"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const errorResponse = {
        message: err.message,
    };
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
