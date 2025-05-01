# Quizler

Quizler is a full-stack quiz application that allows users to create, take, and share quizzes. Built with React, TypeScript, Node.js, and MongoDB, it provides a modern and responsive interface for quiz management.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Docker](#docker)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration system
- **Quiz Creation**: Create quizzes with multiple-choice questions
- **Quiz Taking**: Take quizzes and get immediate results
- **User Dashboard**: View your created quizzes and past results
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14.x or later)
- npm or yarn
- MongoDB (v4.x or later) or MongoDB Atlas account
- Docker (optional, for containerized deployment)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/quizler.git
cd quizler
```

2. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizler
JWT_SECRET=your_jwt_secret
```

3. **Install dependencies**

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## Running the Application

### Development Mode

1. **Start the backend server**

```bash
# From the root directory
npm run dev:server
```

This will start the Node.js server on http://localhost:5000.

2. **Start the frontend development server**

```bash
# From the root directory
npm run dev:client
```

This will start the React development server on http://localhost:3000.

### Production Mode

1. **Build the frontend**

```bash
# From the root directory
cd client
npm run build
cd ..
```

2. **Start the production server**

```bash
# From the root directory
npm run start
```

The application will be available at http://localhost:5000.

### Docker

You can also use Docker to run both the client and server:

```bash
# Build and start the containers
docker-compose up -d

# Stop the containers
docker-compose down
```

The application will be available at http://localhost:80.

## Project Structure

```
quizler/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and static resources
│   │   ├── components/     # React components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── store/          # Redux store, actions, and reducers
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
├── Dockerfile.client       # Client Docker configuration
├── Dockerfile.server       # Server Docker configuration
└── docker-compose.yml      # Docker Compose configuration
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint          | Description               | Request Body                               |
|--------|-------------------|---------------------------|--------------------------------------------|
| POST   | /api/auth/register | Register a new user       | `{ name, email, password }`               |
| POST   | /api/auth/login    | Login a user              | `{ email, password }`                     |
| GET    | /api/auth/profile  | Get the current user      | Requires authentication token             |

### Quiz Endpoints

| Method | Endpoint                | Description                   | Request Body                               |
|--------|-------------------------|-------------------------------|--------------------------------------------|
| POST   | /api/quizzes           | Create a new quiz             | `{ title, description, questions }`        |
| GET    | /api/quizzes           | Get all quizzes               | Query param: `all=true` for all quizzes    |
| GET    | /api/quizzes/:id       | Get a quiz by ID              | -                                          |
| PUT    | /api/quizzes/:id       | Update a quiz                 | `{ title, description, questions }`        |
| DELETE | /api/quizzes/:id       | Delete a quiz                 | -                                          |
| POST   | /api/quizzes/submit    | Submit a quiz response        | `{ quiz, answers }`                        |
| GET    | /api/quizzes/responses/user | Get user's quiz responses | -                                          |

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user logs in or registers, a token is generated and returned to the client. This token should be included in the `x-auth-token` header for all protected API requests.

Example:

```javascript
// Making an authenticated request
fetch('/api/quizzes', {
  headers: {
    'x-auth-token': 'your_jwt_token_here',
    'Content-Type': 'application/json'
  }
})
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.