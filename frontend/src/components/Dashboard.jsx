import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">BudgetWise</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/budgets"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Budgets
          </NavLink>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="month-summary">
          <h2>Current Month Summary</h2>

          <div className="summary-card">
            <div className="summary-section">
              <h4>Total Income</h4>
              <p>$4,000.00</p>
            </div>

            <div className="summary-section">
              <h4>Total Outcome</h4>
              <p>$2,500.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
