import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';

// Use consistent rendering approach with App.tsx which is using React Router v6
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);