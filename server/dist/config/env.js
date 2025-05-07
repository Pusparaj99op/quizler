"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/quizler',
    JWT_SECRET: process.env.JWT_SECRET || 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH',
};
exports.default = exports.env;
