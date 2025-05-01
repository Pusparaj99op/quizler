import { User, IUser } from '../models/user.model';
import mongoose from 'mongoose';

// Get user by ID
export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    return await User.findById(id).select('-password');
  } catch (error) {
    console.error(`Error in getUserById: ${error}`);
    return null;
  }
};

// Get all users
export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    return await User.find().select('-password');
  } catch (error) {
    console.error(`Error in getAllUsers: ${error}`);
    return [];
  }
};

// Update user
export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return null;
    }
    
    // Update user fields
    Object.keys(userData).forEach((key) => {
      if (key !== 'password' && key in userData) {
        (user as any)[key] = (userData as any)[key];
      }
    });
    
    return await user.save();
  } catch (error) {
    console.error(`Error in updateUser: ${error}`);
    return null;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  } catch (error) {
    console.error(`Error in deleteUser: ${error}`);
    return false;
  }
};
