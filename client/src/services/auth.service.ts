import axios, { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, credentials);
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      return { ...user, token };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to login';
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/register`, userData);
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      return { ...user, token };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to register';
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // In a real app, you might decode the JWT token here to get user info
    // For simplicity, we'll just return a placeholder
    return {
      id: 'user-id',
      name: 'User',
      email: 'user@example.com',
      token
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthHeader(): { Authorization: string } {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
}

export const authService = new AuthService();
// Add default export for backward compatibility
export default authService;