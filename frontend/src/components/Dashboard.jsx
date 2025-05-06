import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="dashboard-thumb">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-left">
            <span className="logo">BudgetWise</span>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/budgets"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
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

        <div className="dashboard-page">
          <div className="dashboard-content">
            <div className="month-summary">
              <div className="month-plan-thumb">
                <p className="month-plan-text">Plan</p>
              </div>
              <div className="month-summary-thumb">
                <p className="month-summary-text shimmer">
                  Current Month Summary
                </p>

                <div className="summary-card">
                  <div className="summary-thumb">
                    <h4 className="summary-income-text">Income:</h4>

                    <div className="income-values-thumb">
                      <p className="income-value">$500 earned</p>
                    </div>
                  </div>

                  <div className="outcome-thumb">
                    <p className="summary-outcome-text">Outcome:</p>

                    <div className="outcome-values-thumb">
                      <p className="outcome-value">$250 spent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
