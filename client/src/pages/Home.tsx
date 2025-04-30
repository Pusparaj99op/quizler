import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { QuizCard } from '../components/quiz/QuizCard';

const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold">Welcome to Quizler!</h1>
                <p className="mt-2 text-lg">Your platform for interactive quiz competitions.</p>
            </header>
            <main className="w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-4">Featured Quizzes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sample Quiz Cards - Replace with dynamic data */}
                    <QuizCard title="Math Challenge" description="Test your math skills!" />
                    <QuizCard title="Science Quiz" description="Explore the wonders of science!" />
                    <QuizCard title="History Trivia" description="How well do you know history?" />
                </div>
            </main>
            <footer className="mt-8">
                <Link to="/login" className="text-blue-500 hover:underline">
                    {user ? 'Go to Dashboard' : 'Login to create your own quizzes'}
                </Link>
            </footer>
        </div>
    );
};

export default Home;