import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadReport } from "../api/reports";
import Navigation from "./common/Navigation";

const Transactions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortOption, setSortOption] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromURL = queryParams.get("budgetId");
    if (fromURL) {
      localStorage.setItem("activeBudgetId", fromURL);
      setSelectedBudgetId(fromURL);
    } else {
      const stored = localStorage.getItem("activeBudgetId");
      if (stored) {
        setSelectedBudgetId(stored);
      }
    }
  }, [location.search]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const res = await getYearlyTransactions(selectedBudgetId, currentYear);

      const all = Object.values(res.data.data).flatMap((month) => {
        if (!month || typeof month !== "object") return [];

        const incomeArr = Array.isArray(month.income)
          ? month.income.map((t) => ({ ...t, type: "INCOME" }))
          : [];

        const expenseArr = Array.isArray(month.expense)
          ? month.expense.map((t) => ({ ...t, type: "EXPENSE", amount: -t.amount }))
          : [];

        return [...incomeArr, ...expenseArr];
      });

      setTransactions(all);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBudgetId) {
      fetchTransactions();
    }
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
      await createTransaction(data, selectedBudgetId);
      closeModal();
      await fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
      showToast(error);
    }
  };

  const handleUpdateTransaction = async (updatedData) => {
    try {
      await updateTransaction(selectedTransaction.id, selectedBudgetId, updatedData);
      closeModal();
      await fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      showToast(error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast(error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await loadReport(selectedBudgetId);
      const { fileName, fileData } = response.data;

      const byteCharacters = atob(fileData);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "transactions.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again later.");
    }
  };

  const showToast = (error) => {
    let errorMessage = "There was an error. Please try again.";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "Incorrect email address or password";
          break;
        case 403:
          errorMessage = "You do not have the required permissions.";
          break;
        default:
          errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
      }
    } else if (error.request) {
      errorMessage = "No response was received from the server.";
    } else {
      errorMessage = "Request error.";
    }

    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) =>
    sortOption === "sum" ? b.amount - a.amount : new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="transactions-page">
      <Navigation/>
      <div className="transactions-content">
        <header className="transactions-header">
          <h2>Transactions</h2>
          <div className="transactions-actions">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="date">Date</option>
              <option value="sum">Sum</option>
            </select>
            <button className="transactions-button" onClick={() => openModal("add")}>Add transaction</button>
            <button className="transactions-button" onClick={handleDownload}>Load CVS</button>
          </div>
        </header>

        <main className="transactions-list">
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : sortedTransactions.length === 0 ? (
            <p className="empty-msg">
              <h2>No transactions are added yet.</h2>
            </p>
          ) : (
            sortedTransactions.map((txn) => (
              <div key={txn.id} className="transaction-card">
                <div className="transaction-info">
                  <h3>{txn.title}</h3>
                  <p className="sum">Sum: {txn.amount > 0 ? "+" : ""}{txn.amount} ₴</p>
                  <p className="date">{txn.date}</p>
                </div>
                <div className="actions">
                  <Eye size={20} title="View Details" className="icon" onClick={() => openModal("view", txn)} />
                  <Pencil size={20} title="Edit" className="icon" onClick={() => openModal("edit", txn)} />
                  <Trash2 size={20} title="Delete" className="icon" onClick={() => handleDeleteTransaction(txn.id)} />
                </div>
              </div>
            ))
          )}
        </main>

        {modalType === "view" && selectedTransaction && (
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
          <AddTransactionModal onClose={closeModal} onSubmit={handleAddTransaction} />
        )}

        {modalType === "edit" && (
          <EditTransactionModal transaction={selectedTransaction} onClose={closeModal} onSubmit={handleUpdateTransaction} />
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Transactions;
