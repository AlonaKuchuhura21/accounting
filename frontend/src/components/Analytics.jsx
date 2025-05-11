import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import '../assets/css/Analytics.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const Analytics = () => {
    const [period, setPeriod] = useState('');

    // Mock data
    const spendingByCategory = {
        labels: ['Groceries', 'Rent', 'Utilities'],
        datasets: [{
            label: 'Spendings',
            data: [300, 1200, 150],
            backgroundColor: ['#8e44ad', '#f39c12', '#e74c3c'],
        }],
    };

    const incomeOutcomeData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Incomes',
                data: [800, 950, 1000, 1050],
                borderColor: '#27ae60',
                fill: false,
            },
            {
                label: 'Outcomes',
                data: [500, 750, 850, 900],
                borderColor: '#c0392b',
                fill: false,
            },
        ],
    };

    const budgetInfo = {
        spent: 2000,
        remaining: 1000,
    };

    const topSpendings = [
        { name: 'April Rent', amount: 1200 },
        { name: 'Groceries Week 2', amount: 250 },
        { name: 'Car Repair', amount: 200 },
    ];

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };


    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="analytics-page">
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
                    <NavLink
                        to="/transactions"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Transactions
                    </NavLink>
                </div>
                <div className="nav-right">
                    <button onClick={handleLogout} className="nav-link logout-btn">
                        Logout
                    </button>
                </div>
            </nav>
            <div className="analytics-content">
                <div className="analytics-header">
                    <h2>Analytics</h2>
                </div>
                <div className="period-selector">
                    <label>Виберіть період:</label>
                    <input type="month" onChange={handlePeriodChange} />
                </div>

                {period && (<div className="analytics-grid">
                    <div className="analytics-block chart-container">
                        <h3>Spending by Category</h3>
                        <Pie data={spendingByCategory} />
                    </div>

                    <div className="analytics-block budget-summary">
                        <h3>Budget Summary</h3>
                        <p><strong>Spent:</strong> ${budgetInfo.spent}</p>
                        <p><strong>Remaining:</strong> ${budgetInfo.remaining}</p>
                    </div>

                    <div className="analytics-block chart-container">
                        <h3>Income vs Outcome</h3>
                        <Line data={incomeOutcomeData} />
                    </div>

                    <div className="analytics-block top-spendings">
                        <h3>Top 3 Spendings</h3>
                        <ul>
                            {topSpendings.map((item, idx) => (
                                <li key={idx}>
                                    {item.name} — <strong>${item.amount}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>)}
            </div>
        </div>
    );
};

export default Analytics;