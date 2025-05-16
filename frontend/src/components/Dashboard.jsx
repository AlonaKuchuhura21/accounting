import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/Dashboard.css";
import { getMonthlySummary } from "../api/dashboard";
import { getBudgets } from "../api/budgets";

const Dashboard = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      try {
        const budgetsResponse = await getBudgets();
        const budgets = budgetsResponse.data.content || [];

        let totalIncome = 0;
        let totalExpense = 0;

        for (const budget of budgets) {
          try {
            const response = await getMonthlySummary(budget.id, year, month);
            totalIncome += response.data.income;
            totalExpense += response.data.expense;
          } catch (error) {
            console.error(`Failed to fetch summary for budget ${budget.id}:`, error);
          }
        }

        setIncome(totalIncome);
        setOutcome(totalExpense);
      } catch (error) {
        console.error("Failed to fetch budgets or summaries:", error);
      }
    };

    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-thumb">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">BudgetWise</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/budgets"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
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
              <p className="month-summary-text shimmer">Current Month Summary</p>

              <div className="summary-card">
                <div className="summary-thumb">
                  <h4 className="summary-income-text">Income:</h4>
                  <div className="income-values-thumb">
                    <p className="income-value">{`₴${income.toLocaleString()} earned`}</p>
                  </div>
                </div>

                <div className="outcome-thumb">
                  <p className="summary-outcome-text">Outcome:</p>
                  <div className="outcome-values-thumb">
                    <p className="outcome-value">{`₴${outcome.toLocaleString()} spent`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
