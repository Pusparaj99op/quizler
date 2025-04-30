import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
        <Router>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/quiz/:id" component={Quiz} />
          </Switch>
          <Footer />
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;