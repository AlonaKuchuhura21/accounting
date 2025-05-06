import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import AddTransactionModal from "../modals/AddTransactionModal";
import { Eye, Trash2 } from 'lucide-react';
import "../assets/css/Transactions.css";

const mockTransactionsMap = {
 '1': [
    { id: 1, name: "Купівля продуктів", amount: -1000, date: "2025-04-03" },
    { id: 2, name: "Зарплата", amount: 20000, date: "2025-04-03" },
 ],
 '2': [
    { id: 3, name: "Купівля техніки", amount: -1000, date: "2025-04-04" },
    { id: 4, name: "Пенсія", amount: 18000, date: "2025-15-03" },
 ],
 '3': []
};

const Transactions = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedBudgetId = queryParams.get('budgetId');
    const [transactions, setTransactions] = useState(mockTransactionsMap[selectedBudgetId] ?? []);
    const [modalType, setModalType] = useState(null); // 'add' | 'view'
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [sortOption, setSortOption] = useState("date");

    const openModal = (type, transaction = null) => {
        setSelectedTransaction(transaction);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedTransaction(null);
        setModalType(null);
    };

    const handleAddTransaction = (newTransaction) => {
        setTransactions((prev) => [
          ...prev,
          { ...newTransaction, id: prev.length + 1 },
        ]);
      };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
            <div className="transactions-content">
                <header className="transactions-header">
                    <h2>Transactions</h2>
                    <div className="transactions-actions">
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="date">Date</option>
                            <option value="sum">Sum</option>
                        </select>
                        <button className="transactions-button" onClick={() => openModal('add')}>Add transaction</button>
                        <button className="transactions-button">Download CSV test</button>
                    </div>
                </header>
                <main className="transactions-list">
                    {sortedTransactions.length ? sortedTransactions.map((txn) => (
                        <div key={txn.id} className="transaction-card">
                            <div className="transaction-info">
                                <h3>{txn.name}</h3>
                                <p className="sum">Sum: {txn.amount > 0 ? "+" : ""}{txn.amount} ₴</p>
                                <p className="date">{txn.date}</p>
                            </div>
                            <div className="actions">
                                <Eye size={20} title="View Details" className="icon" onClick={() => openModal('view', txn)} />
                                <Trash2 size={20} title="Remove" className="icon" />
                            </div>
                        </div>
                    )) : (
                        <h2>No Transactions are added yet</h2>
                    )}
                </main>
                {modalType === 'view' && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Budget details</h3>
                            <p><strong>Name:</strong> {selectedTransaction.name}</p>
                            <p><strong>Date:</strong> {selectedTransaction.date}</p>
                            <p><strong>Sum:</strong> {selectedTransaction.amount.toLocaleString()}$</p>
                            <div className="form-buttons">
                                <button type="button" onClick={closeModal} className="btn-outline">Close</button>
                            </div>
                        </div>
                    </div>
                )}
                {modalType === 'add' && (<AddTransactionModal onClose={() => closeModal(null)} onSubmit={(transaction) => handleAddTransaction(transaction)} />)}
            </div>

        </div>
    );
};

export default Transactions;
