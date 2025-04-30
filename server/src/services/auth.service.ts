import { User } from '../models/user.model';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { IUser } from '../types/auth.types';
import { JWT_SECRET } from '../config/env';

// Function to register a new user
export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Function to login a user
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user: IUser | null = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Function to verify a token
export const verifyToken = (token: string) => {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};