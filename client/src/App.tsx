import React from 'react';
import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
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

// Create router with future flags to eliminate warnings
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="quiz/:id" element={<Quiz />} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
);

// Layout component that includes Header and Footer
function AppLayout() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <RouterProvider router={router} />
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;