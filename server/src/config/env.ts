import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/quizler',
  JWT_SECRET: process.env.JWT_SECRET || 'J2s9$aP4qR7#tL5gZ3vX6*bN1mC8eD0fH',
};

export default env;