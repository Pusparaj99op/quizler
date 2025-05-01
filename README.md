# <div align="center">🎯 Quizler</div>

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-14.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4.x-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

</div>

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Pusparaj99op">Pusparaj</a></sub>
</div>

<br/>

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Quizler+App+Screenshot" alt="Quizler App Screenshot" width="80%">
  <br/>
  <i>Modern and responsive quiz platform for knowledge enthusiasts</i>
</div>

---

## 🚀 Overview

**Quizler** is a full-stack quiz application that allows users to create, take, and share quizzes. Built with React, TypeScript, Node.js, and MongoDB, it provides a modern and responsive interface for quiz management and an engaging learning experience.

> 💡 **Try it out:** [Live Demo](#) (Coming soon!)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📚 Prerequisites](#-prerequisites)
- [🔧 Installation](#-installation)
- [▶️ Running the Application](#️-running-the-application)
- [🏗️ Project Structure](#️-project-structure)
- [📡 API Documentation](#-api-documentation)
- [🔐 Authentication](#-authentication)
- [🔄 Contributing](#-contributing)
- [📜 License](#-license)

## ✨ Features

- **🔒 User Authentication** - Secure login and registration system
- **📝 Quiz Creation** - Create quizzes with multiple-choice questions
- **📋 Quiz Taking** - Take quizzes and get immediate results
- **📊 User Dashboard** - View your created quizzes and past results  
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🌙 Dark Mode** - Eye-friendly dark mode interface
- **🔔 Notifications** - Real-time updates on quiz activities
- **📊 Progress Tracking** - Track your learning progress over time

## 🛠️ Tech Stack

<div align="center">
  
| Frontend | Backend | Database | Tools |
|:--------:|:-------:|:--------:|:-----:|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat) | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat) | ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=flat) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat) | ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat) | ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat) | ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white&style=flat) |
| ![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white&style=flat) | ![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white&style=flat) | | ![NPM](https://img.shields.io/badge/-NPM-CB3837?logo=npm&logoColor=white&style=flat) |
| ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat) | | | |

</div>

## 📚 Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v14.x or later)
- **npm** or **yarn**
- **MongoDB** (v4.x or later) or MongoDB Atlas account
- **Docker** (optional, for containerized deployment)

## 🔧 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Pusparaj99op/quizler.git
cd quizler
```

### 2️⃣ Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizler
JWT_SECRET=your_jwt_secret
```

### 3️⃣ Install dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## ▶️ Running the Application

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

## 📱 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/400x200?text=Home+Page" alt="Home Page" width="45%">
  <img src="https://via.placeholder.com/400x200?text=Quiz+Taking" alt="Quiz Taking" width="45%">
  <br/>
  <img src="https://via.placeholder.com/400x200?text=User+Dashboard" alt="User Dashboard" width="45%">
  <img src="https://via.placeholder.com/400x200?text=Quiz+Creation" alt="Quiz Creation" width="45%">
</div>

## 🏗️ Project Structure

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

## 📡 API Documentation

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

## 🔐 Authentication

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

## 🔄 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

### ⭐ Star the repo if you like Quizler! ⭐

[Report Bug](https://github.com/Pusparaj99op/quizler/issues) · [Request Feature](https://github.com/Pusparaj99op/quizler/issues)

</div>