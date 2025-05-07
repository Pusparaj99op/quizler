"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const userService = __importStar(require("../services/user.service"));
// Create a new user
const createUser = async (req, res) => {
    try {
        // This would typically be handled by the auth.controller for registration
        // But we'll add it here for admin user creation
        const userData = req.body;
        // Here you would typically validate the user data and then create the user
        // For now, we'll just return a placeholder response
        return res.status(501).json({
            message: 'User creation through this endpoint is not implemented. Use /auth/register instead.'
        });
    }
    catch (error) {
        console.error('Error in createUser controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.createUser = createUser;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error('Error in getUserById controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserById = getUserById;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Error in getAllUsers controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await userService.updateUser(userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error in updateUser controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const success = await userService.deleteUser(userId);
        if (!success) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteUser controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
