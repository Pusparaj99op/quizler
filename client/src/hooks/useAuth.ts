import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { User } from '../types/auth.types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Helper to convert between service User (with id) and context User (with _id)
const mapServiceUserToContextUser = (serviceUser: any): User => ({
  _id: serviceUser.id || serviceUser._id,
  name: serviceUser.name,
  email: serviceUser.email,
  token: serviceUser.token
});

const useAuth = () => {
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { user, isAuthenticated, setUser, setIsAuthenticated } = context;
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const credentials: LoginCredentials = { email, password };
      const userData = await authService.login(credentials);
      const contextUser = mapServiceUserToContextUser(userData);
      setUser(contextUser);
      setIsAuthenticated(true);
      return contextUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      const contextUser = mapServiceUserToContextUser(newUser);
      setUser(contextUser);
      setIsAuthenticated(true);
      return contextUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  };
};

export { useAuth };
export default useAuth;