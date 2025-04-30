import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="Quizler Logo" className="h-10 mr-3" />
                <h1 className="text-xl font-bold">Quizler</h1>
            </div>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                    </li>
                    <li>
                        <Link to="/quiz" className="hover:text-gray-300">Quizzes</Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/login" className="hover:text-gray-300">Login</Link>
                    </li>
                    <li>
                        <Link to="/register" className="hover:text-gray-300">Register</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;