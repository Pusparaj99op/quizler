1# <div align="center">🚀 Quizler</div>

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-14.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4.x-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![Vite](https://img.shields.io/badge/Vite-Ready-646CFF?logo=vite)

</div>

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Quizler+Interactive+Quiz+Platform" alt="Quizler App Banner" width="80%">
  <br/>
  <i>✨ Next-Generation Interactive Quiz Platform ✨</i>
</div>

---

## 🌟 Overview

**Quizler** is a feature-rich, full-stack quiz application built with modern web technologies. Create, take, and share quizzes with an intuitive interface designed for both educators and learners. With real-time feedback, detailed analytics, and a responsive design, Quizler transforms how knowledge is tested and shared.

> 💡 **Try it out:** [Live Demo](#) (Coming soon!)

## ⚡ Key Features

- **🔒 Secure Authentication** - JWT-based user authentication system
- **📝 Interactive Quiz Editor** - Create engaging quizzes with a drag-and-drop interface
- **⏱️ Real-time Quiz Taking** - Take quizzes with instant feedback and timer support
- **📊 Advanced Analytics** - Track performance with detailed statistics and visualizations
- **📱 Fully Responsive** - Perfect experience on any device, from mobile to desktop
- **🌓 Light/Dark Mode** - Choose your preferred visual theme
- **🔔 Push Notifications** - Stay updated with quiz activities and results
- **🔄 Quiz Sharing** - Share your quizzes via direct links or social media
- **🗂️ Category Management** - Organize quizzes by subjects and topics

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🖥️ Running the Application](#️-running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Docker Deployment](#docker-deployment)
- [🏗️ Project Structure](#️-project-structure)
- [🔌 API Documentation](#-api-documentation)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

## 🚀 Getting Started

### Prerequisites

Before running Quizler, ensure you have:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later) or **yarn** (v1.22.x or later)
- **MongoDB** (v4.x or later) or MongoDB Atlas account
- **Docker & Docker Compose** (optional, for containerized deployment)

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/yourusername/quizler.git
cd quizler
```

2️⃣ **Configure environment variables**

Create a `.env` file in the root directory with:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizler
JWT_SECRET=your_secure_jwt_secret_key
VITE_API_URL=http://localhost:5000/api
```

3️⃣ **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## 🖥️ Running the Application

### Development Mode

1️⃣ **Start MongoDB**

If using MongoDB locally:
```bash
# On Windows
mongod

# On macOS/Linux (if installed via Homebrew)
brew services start mongodb-community
```

2️⃣ **Launch the backend server**

```bash
cd server
npm run dev
```

3️⃣ **Launch the frontend**

In a new terminal:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Production Mode

1️⃣ **Build the client**

```bash
cd client
npm run build
```

2️⃣ **Build the server**

```bash
cd ../server
npm run build
```

3️⃣ **Start the production server**

```bash
npm start
```

Access the full application at http://localhost:5000

### Docker Deployment

For a one-command setup of the entire stack:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f


docker-compose logs client
docker-compose logs server

# Stop all services
docker-compose down
```

The application will be available at http://localhost:80

## 📱 Application Screenshots

<div align="center">
  <img src="https://via.placeholder.com/400x225?text=Home+Dashboard" alt="Home Dashboard" width="45%">
  <img src="https://via.placeholder.com/400x225?text=Quiz+Creation" alt="Quiz Creation" width="45%">
  <br/><br/>
  <img src="https://via.placeholder.com/400x225?text=Quiz+Taking+Experience" alt="Quiz Taking" width="45%">
  <img src="https://via.placeholder.com/400x225?text=Results+%26+Analytics" alt="Results & Analytics" width="45%">
</div>

## 🏗️ Project Structure

```
quizler/
├── client/                 # Frontend (React + TypeScript + Vite)
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── assets/         # Static resources
│   │   ├── components/     # React components
│   │   │   ├── common/     # Reusable UI components
│   │   │   ├── layout/     # Layout components
│   │   │   └── quiz/       # Quiz-specific components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── store/          # Redux store configuration
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile.client       # Client Dockerfile
└── Dockerfile.server       # Server Dockerfile
```

## 🔌 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint          | Description               | Request Body                  |
|--------|-------------------|---------------------------|-------------------------------|
| POST   | /api/auth/register | Register a new user       | `{ name, email, password }`  |
| POST   | /api/auth/login    | Login a user              | `{ email, password }`        |
| GET    | /api/auth/profile  | Get user profile          | *Requires Auth Token*        |

### 📋 Quiz Endpoints

| Method | Endpoint                | Description                | Request Body                      |
|--------|-------------------------|----------------------------|-----------------------------------|
| POST   | /api/quizzes           | Create quiz                | `{ title, description, questions }`|
| GET    | /api/quizzes           | Get all quizzes            | *Optional: ?all=true*             |
| GET    | /api/quizzes/:id       | Get quiz by ID             | -                                 |
| PUT    | /api/quizzes/:id       | Update quiz                | `{ title, description, questions }`|
| DELETE | /api/quizzes/:id       | Delete quiz                | -                                 |
| POST   | /api/quizzes/submit    | Submit quiz response       | `{ quiz, answers }`               |
| GET    | /api/quizzes/responses/user | Get user's responses   | *Requires Auth Token*             |

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communications

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy for production

## 🔍 Troubleshooting

### Common Issues

#### 🔴 MongoDB Connection Problems
- Verify MongoDB is running: `mongo --eval "db.serverStatus()"`
- Check connection string in `.env` file
- Ensure network allows MongoDB connections (typically port 27017)

#### 🔴 Authentication Errors
- Check that JWT_SECRET is consistent between environment and code
- Verify token expiration hasn't occurred
- Ensure token is properly included in request headers as `x-auth-token`

#### 🔴 API Connection Issues
- Confirm CORS is properly configured on the server
- Verify API URL in client's environment variables
- Check network tab in browser devtools for specific errors

## 🤝 Contributing

We welcome contributions to Quizler! Here's how:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests and documentation as appropriate.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📫 Pushing to Git

After making changes to your project, here's how to push to Git:

```bash
# Add all changes to staging
git add .

# Commit your changes with a descriptive message
git commit -m "Add comprehensive README with setup instructions"

# Push to your repository
git push origin main
```

---

<div align="center">

### ⭐ Star this repo if you find it useful! ⭐

[Report Bug](https://github.com/yourusername/quizler/issues) · [Request Feature](https://github.com/yourusername/quizler/issues)

</div>





cd c:\Users\kalvi\OneDrive\Documents\GitHub\my github website\quizler\client && npm install @tailwindcss/forms @tailwindcss/typography --save-dev


cd "c:\Users\kalvi\OneDrive\Documents\GitHub\my github website\quizler\client" && npm install @tailwindcss/forms @tailwindcss/typography --save-dev