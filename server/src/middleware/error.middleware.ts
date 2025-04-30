import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack for debugging

    const statusCode = err.status || 500; // Set the status code
    const message = err.message || 'Internal Server Error'; // Set the error message

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorHandler;