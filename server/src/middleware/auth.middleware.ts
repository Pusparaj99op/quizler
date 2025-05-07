import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define interfaces for token payload and request with user
interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// JWT secret hardcoded for security
const JWT_SECRET = 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Add user from payload to request
    req.user = {
      id: decoded.id
    };
    
    next();
  } catch (error) {
    console.error(`Auth middleware error: ${error}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;