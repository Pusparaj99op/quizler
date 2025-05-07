"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = void 0;
const user_model_1 = require("../models/user.model");
// Get user by ID
const getUserById = async (id) => {
    try {
        return await user_model_1.User.findById(id).select('-password');
    }
    catch (error) {
        console.error(`Error in getUserById: ${error}`);
        return null;
    }
};
exports.getUserById = getUserById;
// Get all users
const getAllUsers = async () => {
    try {
        return await user_model_1.User.find().select('-password');
    }
    catch (error) {
        console.error(`Error in getAllUsers: ${error}`);
        return [];
    }
};
exports.getAllUsers = getAllUsers;
// Update user
const updateUser = async (id, userData) => {
    try {
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return null;
        }
        // Update user fields
        Object.keys(userData).forEach((key) => {
            if (key !== 'password' && key in userData) {
                user[key] = userData[key];
            }
        });
        return await user.save();
    }
    catch (error) {
        console.error(`Error in updateUser: ${error}`);
        return null;
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (id) => {
    try {
        const result = await user_model_1.User.findByIdAndDelete(id);
        return result !== null;
    }
    catch (error) {
        console.error(`Error in deleteUser: ${error}`);
        return false;
    }
};
exports.deleteUser = deleteUser;
