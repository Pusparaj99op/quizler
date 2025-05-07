"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizler';
const connectDB = async () => {
    try {
        // Modern MongoDB driver no longer needs these options
        await mongoose_1.default.connect(MONGO_URI);
        logger_1.logger.info('MongoDB connected successfully');
    }
    catch (error) {
        logger_1.logger.error(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
};
exports.default = connectDB;
