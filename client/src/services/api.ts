import axios from 'axios';

// Declare the process variable to avoid TypeScript errors
declare const process: {
  env: {
    REACT_APP_API_URL?: string;
    [key: string]: string | undefined;
  };
};

// Base API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get auth header
export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': user.token
    }
  };
};

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers['x-auth-token'] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;