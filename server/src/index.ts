import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { connectDB } from './config/db';
import { env } from './config/env';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(json());
app.use(routes);
app.use(errorHandler);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Additional socket event handlers can be added here
});

// Connect to MongoDB
connectDB()
    .then(() => {
        server.listen(env.PORT, () => {
            console.log(`Server is running on http://localhost:${env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });