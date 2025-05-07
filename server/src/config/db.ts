import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizler';
const MONGO_REQUIRED = process.env.NODE_ENV === 'production';

const connectDB = async (): Promise<void> => {
  try {
    // Modern MongoDB driver no longer needs these options
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    
    // Don't exit the process if we're in development mode
    if (MONGO_REQUIRED) {
      process.exit(1);
    } else {
      logger.warn('Continuing without MongoDB in development mode');
    }
  }
};

export default connectDB;