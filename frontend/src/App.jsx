import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Authentication from './components/Authentication';
import Budgets from './components/Budgets';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');  // simple auth check

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Register />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/budgets" element={<Budgets />} />
    </Routes>
  );
}

export default App;
