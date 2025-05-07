"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH';
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');
        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Add user from payload to request
        req.user = {
            id: decoded.id
        };
        next();
    }
    catch (error) {
        console.error(`Auth middleware error: ${error}`);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
