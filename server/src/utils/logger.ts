import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Function to log errors
const logError = (message: string) => {
    logger.error(message);
};

// Function to log info
const logInfo = (message: string) => {
    logger.info(message);
};

// Function to log warnings
const logWarning = (message: string) => {
    logger.warn(message);
};

// Export the logger and logging functions
export { logger, logError, logInfo, logWarning };