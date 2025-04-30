import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle GET requests
export const get = async (url: string) => {
  const response = await apiClient.get(url);
  return response.data;
};

// Function to handle POST requests
export const post = async (url: string, data: any) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

// Function to handle PUT requests
export const put = async (url: string, data: any) => {
  const response = await apiClient.put(url, data);
  return response.data;
};

// Function to handle DELETE requests
export const del = async (url: string) => {
  const response = await apiClient.delete(url);
  return response.data;
};

export default {
  get,
  post,
  put,
  del,
};