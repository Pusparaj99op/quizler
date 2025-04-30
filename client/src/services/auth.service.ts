import axios from 'axios';
import { AuthResponse, UserCredentials } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth/';

const authService = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}login`, credentials);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}register`, credentials);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): any => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
};

export default authService;