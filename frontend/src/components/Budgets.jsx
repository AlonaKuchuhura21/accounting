import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, WalletCards } from 'lucide-react';
import '../assets/css/Budgets.css';
import '../assets/css/Modal.css';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../api/budgets';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA');
};

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await getBudgets();
      setBudgets(response.data.content || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, budget = null) => {
    setSelectedBudget(budget);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedBudget(null);
    setModalType(null);
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const budgetData = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      from: formData.get('from'),
      to: formData.get('to'),
      initialBalance: parseFloat(formData.get('initialBalance')),
    };

    try {
      if (modalType === 'add') {
        await createBudget(budgetData);
      } else if (modalType === 'edit' && selectedBudget?.id) {
        await updateBudget(selectedBudget.id, budgetData);
      }
      closeModal();
      await fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
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
            errorMessage = `Error: ${error.response.status} - ${
              error.response.data?.message || "Unknown error"
            }`;
        }
      } else if (error.request) {
        errorMessage = "No response was received from the server.";
      } else {
        errorMessage = "Request for an installation error.";
      }
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await deleteBudget(id);
      await fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleViewTransactions = (budgetId) => {
    navigate(`/transactions?budgetId=${budgetId}`);
  };

  return (
    <div className="budgets-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">BudgetWise</span>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Budgets</NavLink>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
      </nav>

      <div className="budgets-content">
        <header className="budgets-header">
          <div className="nav-left">
            <h2>My Budgets</h2>
          </div>
          <div className="nav-right">
            <button className="add-budget-btn" onClick={() => openModal('add')}>Add Budget</button>
          </div>
        </header>

        {loading ? (
          <p className="empty-msg">Loading...</p>
        ) : budgets.length === 0 ? (
          <p className="empty-msg">No budgets are added yet.</p>
        ) : (
          <div className="budget-list">
            {budgets.map((budget) => {
              const percent = budget.initialBalance > 0
                ? Math.round((budget.currentBalance / budget.initialBalance) * 100)
                : 0;

              return (
                <div key={budget.id} className="budget-card">
                  <div className="budget-info">
                    <h3>{budget.title}</h3>
                    <p className="type">{budget.type}</p>
                    <p className="dates">
                      {budget.startDate && budget.endDate
                        ? `${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`
                        : '—'}
                    </p>
                  </div>
                  <div className="budget-summary">
                    <h3>{budget.initialBalance != null ? `${budget.initialBalance.toLocaleString()} ₴` : '—'}</h3>
                    <div className="actions">
                      <WalletCards size={20} title="View Transactions" className="icon" onClick={() => handleViewTransactions(budget.id)} />
                      <Eye size={20} title="View" className="icon" onClick={() => openModal('view', budget)} />
                      <Pencil size={20} title="Edit" className="icon" onClick={() => openModal('edit', budget)} />
                      <Trash2 size={20} title="Delete" className="icon" onClick={() => handleDelete(budget.id)} />
                    </div>
                    <div className="progress-bar">
                      <span>Remaining:</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="percent">{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalType === 'view' ? (
              <>
                <h3>Budget Details</h3>
                <p><strong>Title:</strong> {selectedBudget.title}</p>
                <p><strong>Type:</strong> {selectedBudget.type}</p>
                <p><strong>Period:</strong> {selectedBudget.startDate && selectedBudget.endDate ? `${formatDate(selectedBudget.startDate)} - ${formatDate(selectedBudget.endDate)}` : '—'}</p>
                <p><strong>Balance:</strong> {selectedBudget.initialBalance != null ? `${selectedBudget.initialBalance.toLocaleString()} ₴` : '—'}</p>
                <div className="form-buttons">
                  <button type="button" onClick={closeModal} className="btn-outline">Close</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleAddOrEdit} className="budget-form">
                <h3>{modalType === 'add' ? 'Create Budget' : 'Edit Budget'}</h3>
                <label>Title<input type="text" name="title" required defaultValue={selectedBudget?.title} /></label>
                <label>Description<textarea name="description" rows="3" defaultValue={selectedBudget?.description} /></label>
                <label>Type<select name="type" defaultValue={selectedBudget?.type || 'PERSONAL'} required disabled={modalType !== 'add'} >
                  <option value="PERSONAL">Personal</option>
                  <option value="FAMILY">Family</option>
                  <option value="ENTERTAINMENT">Entertainment</option> 
                  <option value="TRANSPORT">Transport</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="HEALTH">Health</option>
                  <option value="HOUSING">Housing</option>
                  <option value="FOOD">Food</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="EDUCATION">Education</option>
                </select></label>
                <label>Initial Balance<input type="number" name="initialBalance" required defaultValue={selectedBudget?.initialBalance} disabled={modalType !== 'add'} /></label>
                <label>Start Date<input type="date" name="from" required defaultValue={selectedBudget?.startDate} /></label>
                <label>End Date<input type="date" name="to" required defaultValue={selectedBudget?.endDate} /></label>
                <div className="form-buttons">
                  <button type="submit" className="btn-purple">Save</button>
                  <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Budgets;
