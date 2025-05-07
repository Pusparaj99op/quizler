import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import quizRoutes from './routes/quiz.routes';
import errorHandler from './middleware/error.middleware';
import connectDB from './config/db';
import env from './config/env';
import { logger } from './utils/logger';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

// Serve static assets in production
if (env.NODE_ENV === 'production') {
  // Set static folder
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // Serve the index.html file for any route not matching API routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });

  logger.info(`Serving static files from ${clientBuildPath}`);
}

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001; // Explicitly set to 5001 to avoid conflicts
app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});