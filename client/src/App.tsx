import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <BrowserRouter>
          <Header />
          <div className="container mx-auto px-4 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:id" element={<Quiz />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;