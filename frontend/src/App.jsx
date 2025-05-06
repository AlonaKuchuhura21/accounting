import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Authentication from "./components/Authentication";
import Budgets from "./components/Budgets";
import Transactions from "./components/Transactions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          !!localStorage.getItem("token") ? (
            <Dashboard />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      <Route
        path="/budgets"
        element={
          !!localStorage.getItem("token") ? (
            <Budgets />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      <Route
        path="/transactions"
        element={
          !!localStorage.getItem('token') ? (
            <Transactions />
          ): (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}

export default App;
