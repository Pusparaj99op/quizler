"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH';
// Generate JWT token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};
// Register user
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const userExists = await user_model_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user
        const user = await user_model_1.User.create({
            name,
            email,
            password,
        });
        if (user) {
            // Explicitly cast to IUser and ensure _id is treated as a string
            const newUser = user;
            const userId = newUser._id instanceof mongoose_1.default.Types.ObjectId
                ? newUser._id.toString()
                : typeof newUser._id === 'string'
                    ? newUser._id
                    : String(newUser._id);
            res.status(201).json({
                _id: userId,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(userId),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error(`Error in register: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await user_model_1.User.findOne({ email });
        // Check if user exists and password matches
        if (user && (await user.comparePassword(password))) {
            const userId = user._id instanceof mongoose_1.default.Types.ObjectId
                ? user._id.toString()
                : typeof user._id === 'string'
                    ? user._id
                    : String(user._id);
            res.json({
                _id: userId,
                name: user.name,
                email: user.email,
                token: generateToken(userId),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error(`Error in login: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
// Get user profile
const getUserProfile = async (req, res) => {
    try {
        // @ts-ignore - req.user is added by auth middleware
        const user = await user_model_1.User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(`Error in getUserProfile: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserProfile = getUserProfile;
