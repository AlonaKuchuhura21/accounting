import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AddTransactionModal from "../modals/AddTransactionModal";
import EditTransactionModal from "../modals/EditTransactionModal";
import { Eye, Pencil, Trash2 } from "lucide-react";
import "../assets/css/Transactions.css";
import {
  createTransaction,
  deleteTransaction,
  getYearlyTransactions,
  updateTransaction,
} from "../api/transactions";

const Transactions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedBudgetId = queryParams.get("budgetId");
  const [transactions, setTransactions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortOption, setSortOption] = useState("date");

  const fetchTransactions = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const res = await getYearlyTransactions(selectedBudgetId, currentYear);
      const all = Object.values(res.data.data).flatMap((month) => {
        if (!month || typeof month !== 'object') return [];

        const incomeArr = Array.isArray(month.income) ? month.income.map(t => ({ ...t, amount: t.amount, type: 'INCOME' })) : [];
        const expenseArr = Array.isArray(month.expense) ? month.expense.map(t => ({ ...t, amount: -t.amount, type: 'EXPENSE' })) : [];

        return [...incomeArr, ...expenseArr];
      });
      setTransactions(all);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (selectedBudgetId) fetchTransactions();
  }, [selectedBudgetId]);

  const openModal = (type, transaction = null) => {
    setSelectedTransaction(transaction);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setModalType(null);
  };

  const handleAddTransaction = async (data) => {
    try {
      console.log("Creating transaction with data:", data); // 🐞 Debug log
      await createTransaction(data, selectedBudgetId);
      closeModal();
      await fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleUpdateTransaction = async (updatedData) => {
    try {
      await updateTransaction(selectedTransaction.id, selectedBudgetId, updatedData);
      closeModal();
      await fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return sortOption === "sum"
      ? b.amount - a.amount
      : new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="transactions-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">BudgetWise</span>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>
          <NavLink to="/budgets" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Budgets</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Transactions</NavLink>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
      </nav>

      <div className="transactions-content">
        <header className="transactions-header">
          <h2>Transactions</h2>
          <div className="transactions-actions">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="date">Date</option>
              <option value="sum">Sum</option>
            </select>
            <button className="transactions-button" onClick={() => openModal("add")}>Add transaction</button>
          </div>
        </header>

        <main className="transactions-list">
          {sortedTransactions.length ? sortedTransactions.map((txn) => (
            <div key={txn.id} className="transaction-card">
              <div className="transaction-info">
                <h3>{txn.name || txn.title}</h3>
                <p className="sum">Sum: {txn.amount > 0 ? "+" : ""}{txn.amount} ₴</p>
                <p className="date">{txn.date}</p>
              </div>
              <div className="actions">
                <Eye size={20} title="View Details" className="icon" onClick={() => openModal("view", txn)} />
                <Pencil size={20} title="Edit" className="icon" onClick={() => openModal("edit", txn)} />
                <Trash2 size={20} title="Delete" className="icon" onClick={() => handleDeleteTransaction(txn.id)} />
              </div>
            </div>
          )) : (
            <h2>No Transactions are added yet</h2>
          )}
        </main>

        {modalType === "view" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Transaction details</h3>
              <p><strong>Name:</strong> {selectedTransaction.title}</p>
              <p><strong>Date:</strong> {selectedTransaction.date}</p>
              <p><strong>Sum:</strong> {selectedTransaction.amount.toLocaleString()} ₴</p>
              <div className="form-buttons">
                <button type="button" onClick={closeModal} className="btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}

        {modalType === "add" && (
          <AddTransactionModal
            onClose={closeModal}
            onSubmit={handleAddTransaction}
          />
        )}

        {modalType === "edit" && (
          <EditTransactionModal
            transaction={selectedTransaction}
            onClose={closeModal}
            onSubmit={handleUpdateTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
