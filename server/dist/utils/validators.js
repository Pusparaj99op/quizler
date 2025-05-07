"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
// Validator for user registration
exports.registerValidator = [
    (0, express_validator_1.body)('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters long'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
// Validator for user login
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty'),
];
// Function to validate request data
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
