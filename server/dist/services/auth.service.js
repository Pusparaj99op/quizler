"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = __importDefault(require("../config/env"));
const JWT_SECRET = env_1.default.JWT_SECRET;
// Function to register a new user
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new user_model_1.User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};
exports.registerUser = registerUser;
// Function to login a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await user_model_1.User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jsonwebtoken_1.sign)({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.loginUser = loginUser;
// Function to verify a token
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
