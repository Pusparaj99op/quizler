import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import mongoose from 'mongoose';

// JWT secret hardcoded for security
const JWT_SECRET = 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Register user
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Explicitly cast to IUser and ensure _id is treated as a string
      const newUser = user as IUser;
      const userId = newUser._id instanceof mongoose.Types.ObjectId 
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
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`Error in register: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }) as IUser;

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      const userId = user._id instanceof mongoose.Types.ObjectId 
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
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`Error in login: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(`Error in getUserProfile: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};