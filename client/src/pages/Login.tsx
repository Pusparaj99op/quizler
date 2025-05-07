import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        label="Email address"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        label="Password"
                    />
                    <Button 
                        onClick={() => {}} 
                        className="w-full mt-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;