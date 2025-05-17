import React, { useState, useEffect } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  BarElement,
} from "chart.js";
import "../assets/css/Analytics.css";
import IncomeIcon from "../assets/img/IncomeIcon.svg";
import SpentIcon from "../assets/img/SpentIcon.svg";
import Navigation from "./common/Navigation";
import { getYearlyTransactions } from "../api/transactions";
import { getBudgetById } from "../api/budgets";

ChartJS.register(
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineElement
);

const Analytics = () => {
  const [period, setPeriod] = useState("");
  const [spendingByCategory, setSpendingByCategory] = useState(null);
  const [incomeOutcomeData, setIncomeOutcomeData] = useState(null);
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [columnChartData, setColumnChartData] = useState(null);

  const selectedBudgetId = localStorage.getItem("activeBudgetId");

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBudgetId || !period) return;
      const [year, month] = period.split("-").map(Number);
      const monthName = new Date(year, month - 1).toLocaleString("en-US", { month: "long" }).toUpperCase();

      try {
        const [transactionsRes, budgetRes] = await Promise.all([
          getYearlyTransactions(selectedBudgetId, year),
          getBudgetById(selectedBudgetId),
        ]);

        const res = transactionsRes;
        const monthData = res.data.data[monthName];
        if (!monthData) return;

        const incomeArr = monthData.income || [];
        const expenseArr = monthData.expense || [];

        let totalIncome = 0;
        let totalExpense = 0;
        const titleMap = {};
        const topSpendingsArr = [];
        const incomeWeeks = Array(5).fill(0);
        const expenseWeeks = Array(5).fill(0);

        incomeArr.forEach((t) => {
          if (!t.date || isNaN(new Date(t.date))) return;
          totalIncome += t.amount;
          const week = Math.min(Math.floor(new Date(t.date).getDate() / 7), 4);
          incomeWeeks[week] += t.amount;
        });

        expenseArr.forEach((t) => {
          if (!t.date || isNaN(new Date(t.date))) return;
          totalExpense += t.amount;
          const week = Math.min(Math.floor(new Date(t.date).getDate() / 7), 4);
          expenseWeeks[week] += t.amount;
          titleMap[t.title] = (titleMap[t.title] || 0) + t.amount;
          topSpendingsArr.push({ name: t.title, amount: t.amount });
        });

        const pieLabels = Object.keys(titleMap);
        const pieValues = Object.values(titleMap);

        setSpendingByCategory({
          labels: pieLabels,
          datasets: [{
            data: pieValues,
            backgroundColor: ["#8AB4F8", "#FFC466", "#9A6AFF", "#FF6B6B", "#00C49F", "#F67280", "#6C5B7B"],
            borderWidth: 0,
          }],
        });

        setIncomeOutcomeData({
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
          datasets: [
            {
              label: "Income",
              data: incomeWeeks,
              borderColor: "#9A6AFF",
              backgroundColor: "rgba(154, 106, 255, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Expend",
              data: expenseWeeks,
              borderColor: "#FFC466",
              backgroundColor: "rgba(255, 196, 102, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        const initialBalance = budgetRes.data.initialBalance || 0;

        setBudgetInfo({
          spent: totalExpense,
          remaining: initialBalance + totalIncome - totalExpense,
          totalBalance: initialBalance + totalIncome,
        });

        const top3 = topSpendingsArr
          .reduce((acc, t) => {
            const existing = acc.find((item) => item.name === t.name);
            if (existing) existing.amount += t.amount;
            else acc.push({ name: t.name, amount: t.amount });
            return acc;
          }, [])
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);

        setColumnChartData({
          labels: top3.map((t) => t.name),
          datasets: [{
            label: "Spendings",
            data: top3.map((t) => t.amount),
            backgroundColor: ["#9A6AFF", "#FFC466", "#8AB4F8"],
            borderRadius: 4,
          }],
        });
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };

    fetchData();
  }, [selectedBudgetId, period]);

  return (
    <div className="analytics-page">
      <Navigation />
      <div className="analytics-content">
        <div className="analytics-header">
          <h2>Analytics</h2>
        </div>
        <div className="period-selector">
          <label>Select period: </label>
          <input type="month" onChange={(e) => setPeriod(e.target.value)} />
        </div>

        {period && spendingByCategory && incomeOutcomeData && budgetInfo && columnChartData ? (
          <div className="analytics-grid">
            <div className="analytics-block chart-container">
              <h3>Spending by Category</h3>
              <div className="pie-thumb" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
                <Pie
                  data={spendingByCategory}
                  options={{
                    rotation: -90,
                    circumference: 180,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          pointStyle: "circle",
                          padding: 15,
                          boxWidth: 12,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `${ctx.label}: ₴${ctx.raw.toLocaleString()}`,
                        },
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 14,
                        borderColor: "#ffffff",
                        borderRadius: 6,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="analytics-block budget-summary">
              <h3 className="budget-summary-title">Budget Summary</h3>
              <div className="budget-thumb">
                <p className="budget-spent-text">
                  <img width={50} className="budget-icon" alt="spent" src={SpentIcon} />
                  Spent:
                </p>
                <p className="budget-value-text">₴{budgetInfo.spent}</p>
                <div className="item-progress-shadow">
                  <div
                    style={{ width: `${(budgetInfo.spent / budgetInfo.totalBalance) * 100}%` }}
                    className="item-progress-line yellow"
                  ></div>
                </div>
              </div>
              <div className="budget-thumb">
                <p className="budget-spent-text">
                  <img width={50} className="budget-icon" alt="remained" src={IncomeIcon} />
                  Remaining:
                </p>
                <p className="budget-value-text">₴{budgetInfo.remaining}</p>
                <div className="item-progress-shadow">
                  <div
                    style={{ width: `${(budgetInfo.remaining / budgetInfo.totalBalance) * 100}%` }}
                    className="item-progress-line violet"
                  ></div>
                </div>
              </div>
            </div>

            <div className="analytics-block chart-container">
              <h3>Income vs Outcome</h3>
              <Line data={incomeOutcomeData} />
            </div>

            <div className="analytics-block top-spendings">
              <h3>Top 3 Spendings</h3>
              <Bar data={columnChartData} />
            </div>
          </div>
        ) : (
          <p className="empty-msg">No data available for the selected month.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
