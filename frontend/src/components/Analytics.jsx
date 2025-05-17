import React, { useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
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

  // Mock data

  const spendingByCategory = {
    labels: ["Groceries", "Rent", "Utilities"],
    datasets: [
      {
        data: [300, 1200, 150],
        backgroundColor: ["#8AB4F8", "#FFC466", "#9A6AFF"],
        borderWidth: 0,
      },
    ],
  };

  const incomeOutcomeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Income",
        data: [800, 950, 1000, 1050, 1200, 1000, 1200],
        borderColor: "#9A6AFF",
        backgroundColor: "rgba(154, 106, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expend",
        data: [500, 600, 700, 400, 600, 700, 500],
        borderColor: "#FFC466",
        backgroundColor: "rgba(255, 196, 102, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const budgetInfo = {
    spent: 2000,
    remaining: 1000,
    totalBalance: 3000,
  };

  const columnChartData = {
    labels: ["April Rent", "Groceries Week 2", "Car Repair"],
    datasets: [
      {
        label: "Spendings",
        data: [1200, 250, 200],
        backgroundColor: ["#9A6AFF", "#FFC466", "#8AB4F8"],
        borderRadius: 4,
      },
    ],
  };

  const columnChartOptions = {
    indexAxis: "x", // Column chart (default)
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  return (
    <div className="analytics-page">
      <Navigation/>
      <div className="analytics-content">
        <div className="analytics-header">
          <h2>Analytics</h2>
        </div>
        <div className="period-selector">
          <label>Select period: </label>
          <input type="month" onChange={handlePeriodChange} />
        </div>

        {period && (
          <div className="analytics-grid">
            <div className="analytics-block chart-container">
              <h3>Spending by Category</h3>
              <div className="pie-thumb">
                <Pie
                  data={spendingByCategory}
                  options={{
                    rotation: -90,
                    circumference: 180,
                    cutout: "85%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          pointStyle: "rect",
                          boxWidth: 10,
                          padding: 20,
                        },
                      },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
                        },
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 20,
                        borderColor: "#ffffff",
                        borderRadius: 4,
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
                  <img
                    width={50}
                    className="budget-icon"
                    alt="spent"
                    src={SpentIcon}
                  />
                  Spent:
                </p>
                <p className="budget-value-text"> ${budgetInfo.spent}</p>
                <div className="item-progress-shadow">
                  <div
                    style={{
                      width: `${
                        (budgetInfo.spent / budgetInfo.totalBalance) * 100
                      }%`,
                    }}
                    className="item-progress-line yellow"
                  ></div>
                </div>
              </div>
              <div className="budget-thumb">
                <p className="budget-spent-text">
                  <img
                    width={50}
                    className="budget-icon"
                    alt="remained"
                    src={IncomeIcon}
                  />
                  Remaining:
                </p>
                <p className="budget-value-text"> ${budgetInfo.remaining}</p>

                <div className="item-progress-shadow">
                  <div
                    style={{
                      width: `${
                        (budgetInfo.remaining / budgetInfo.totalBalance) * 100
                      }%`,
                    }}
                    className="item-progress-line violet"
                  ></div>
                </div>
              </div>
            </div>

            <div className="analytics-block chart-container">
              <h3>Income vs Outcome</h3>
              <Line
                data={incomeOutcomeData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
                      },
                    },

                    legend: {
                      display: true,
                      labels: {
                        // pointStyle: "rect",
                        usePointStyle: true,
                        boxWidth: 20,
                        padding: 10,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 4,
                    },
                    point: {
                      radius: 5,
                      borderWidth: 2,
                      backgroundColor: "#fff",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value / 1000}k`,
                      },
                    },
                  },
                }}
              />{" "}
            </div>

            <div className="analytics-block top-spendings">
              <h3>Top 3 Spendings</h3>
              <Bar data={columnChartData} options={columnChartOptions} />

              {/* <ul>
                {topSpendings.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — <strong>${item.amount}</strong>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
