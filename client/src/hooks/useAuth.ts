import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';

const useAuth = () => {
    const { setUser, setIsAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUser(user);
                setIsAuthenticated(true);
            } catch (err) {
                setError(err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [setUser, setIsAuthenticated]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const user = await authService.login(credentials);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        login,
        logout,
    };
};

export default useAuth;