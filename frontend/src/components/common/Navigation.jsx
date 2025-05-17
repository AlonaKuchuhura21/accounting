import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const budgetId = queryParams.get("budgetId");

  const isActiveLink = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">BudgetWise</span>
        <NavLink to="/dashboard" className={isActiveLink}>Dashboard</NavLink>
        <NavLink to="/budgets" className={isActiveLink}>Budgets</NavLink>

        {budgetId && (
          <>
            <NavLink to={`/transactions?budgetId=${budgetId}`} className={isActiveLink}>Transactions</NavLink>
            <NavLink to={`/analytics?budgetId=${budgetId}`} className={isActiveLink}>Analytics</NavLink>
          </>
        )}
      </div>
      <div className="nav-right">
        <NavLink to="/user-profile" className={isActiveLink}>Profile</NavLink>
        <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navigation;
