# Quizler - Advanced Online Quiz Competition Platform

## Overview
Quizler.com is an advanced online quiz competition platform designed for educational institutions. It aims to provide comprehensive educational assessment capabilities while maintaining interactive engagement. This platform offers a variety of advanced quiz types, sophisticated gamification elements, and superior analytics compared to existing solutions like Slido.

## Features
- **Comprehensive Quiz Types**: Supports multiple question formats including multiple choice, fill-in-the-blanks, diagram annotations, and more.
- **Gamification**: Includes achievement systems, experience points, and customizable avatars to enhance user engagement.
- **Advanced Analytics**: Provides detailed performance tracking, historical data analysis, and AI-powered insights.
- **User Management**: Role-based access control with customizable permissions for different user roles.
- **Live Audience Engagement**: Real-time polls, audience voting, and interactive features to enhance participation.
- **Accessibility and Internationalization**: WCAG compliance, multi-language support, and features for diverse user needs.

## Tech Stack
- **Frontend**: React.js, TailwindCSS, Redux, Socket.io
- **Backend**: Node.js, Express, MongoDB, Redis
- **Deployment**: Docker, Koyeb
- **Payment Integration**: Razorpay, PayPal, Stripe
- **Analytics**: Custom analytics engine with optional integration for Tableau/PowerBI

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance running
- Docker and Docker Compose installed (for deployment)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Pusparaj99op/quizler.git
   cd quizler
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

### Running the Application
- To run the client:
  ```
  cd client
  npm start
  ```

- To run the server:
  ```
  cd server
  npm run dev
  ```

### Docker Deployment
1. Build the Docker images:
   ```
   docker-compose build
   ```

2. Start the services:
   ```
   docker-compose up
   ```

### Environment Variables
Create a `.env` file in the `server` directory and configure the necessary environment variables for database connection, JWT secret, and other configurations.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by existing quiz platforms and educational tools.
- Thanks to the open-source community for their contributions and support.

For more detailed documentation, please refer to the individual components and services within the `client` and `server` directories.