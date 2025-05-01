import { Request, Response } from 'express';
import * as userService from '../services/user.service';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // This would typically be handled by the auth.controller for registration
    // But we'll add it here for admin user creation
    const userData = req.body;
    
    // Here you would typically validate the user data and then create the user
    // For now, we'll just return a placeholder response
    return res.status(501).json({ 
      message: 'User creation through this endpoint is not implemented. Use /auth/register instead.' 
    });
  } catch (error) {
    console.error('Error in createUser controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateUser controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const success = await userService.deleteUser(userId);
    
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};