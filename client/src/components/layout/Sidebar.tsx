import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-5">
            <h2 className="text-2xl font-bold mb-5">Quizler</h2>
            <ul>
                <li className="mb-3">
                    <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="mb-3">
                    <Link to="/quizzes" className="hover:text-gray-400">Quizzes</Link>
                </li>
                <li className="mb-3">
                    <Link to="/create-quiz" className="hover:text-gray-400">Create Quiz</Link>
                </li>
                <li className="mb-3">
                    <Link to="/analytics" className="hover:text-gray-400">Analytics</Link>
                </li>
                <li className="mb-3">
                    <Link to="/settings" className="hover:text-gray-400">Settings</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;