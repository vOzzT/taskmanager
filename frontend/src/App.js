import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CalendarPage from './pages/CalandarPage';
import ForgotPage from './pages/ForgotPage';
import ResetPage from './pages/ResetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/reset" element={<ResetPage />} />
      </Routes>
    </Router>
  );
}

export default App;

