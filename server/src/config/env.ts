import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/quizler',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;