import { body, validationResult } from 'express-validator';

// Validator for user registration
export const registerValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters long'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

// Validator for user login
export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty'),
];

// Function to validate request data
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};