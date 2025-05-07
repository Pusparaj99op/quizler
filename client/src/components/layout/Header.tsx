import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    // Instead of using an external service, create a simple text logo
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <div className="bg-blue-500 h-10 w-24 flex items-center justify-center rounded mr-3">
                    <span className="font-bold text-lg">Quizler</span>
                </div>
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