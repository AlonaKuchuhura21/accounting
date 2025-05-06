import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import '../assets/css/Budgets.css';
import '../assets/css/Modal.css';

const mockBudgets = [
    {
        id: 1,
        name: 'Продукти',
        type: 'спільний',
        start: '01.04.2025',
        end: '30.04.2025',
        total: 10000,
        remaining: 6400,
    },
    {
        id: 2,
        name: 'Відпустка',
        type: 'особистий',
        start: '05.07.2025',
        end: '15.07.2025',
        total: 25000,
        remaining: 25000,
    }
];

const Budgets = () => {
    const [budgets] = useState(mockBudgets);
    const [modalType, setModalType] = useState(null); // 'add' | 'view' | 'edit'
    const [selectedBudget, setSelectedBudget] = useState(null);

    const navigate = useNavigate();

    const openModal = (type, budget = null) => {
        setSelectedBudget(budget);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedBudget(null);
        setModalType(null);
    };

    const handleAddOrEdit = (e) => {
        e.preventDefault();
        // Implement form submission logic
        closeModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="budgets-page">
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
                </div>
                <div className="nav-right">
                    <button onClick={handleLogout} className="nav-link logout-btn">
                        Logout
                    </button>
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

                <div className="budget-list">
                    {budgets.map(budget => {
                        const percent = Math.round((budget.remaining / budget.total) * 100);
                        return (
                            <div key={budget.id} className="budget-card">
                                <div className="budget-info">
                                    <h3>{budget.name}</h3>
                                    <p className="type">{budget.type}</p>
                                    <p className="dates">{budget.start} - {budget.end}</p>
                                </div>
                                <div className="budget-summary">
                                    <h3>{budget.total.toLocaleString()} ₴</h3>
                                    <div className="actions">
                                        <Eye size={20} title="View Details" className="icon" onClick={() => openModal('view', budget)} />
                                        <Pencil size={20} title="Edit" className="icon"  onClick={() => openModal('edit', budget)} />
                                        <Trash2 size={20} title="Remove" className="icon" />
                                    </div>
                                    <div className="progress-bar">
                                        <span>Залишок:</span>
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
            </div>
            {modalType && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {modalType === 'view' ? (
                            <>
                                <h3>Budget details</h3>
                                <p><strong>Name:</strong> {selectedBudget.name}</p>
                                <p><strong>Type:</strong> {selectedBudget.type}</p>
                                <p><strong>Period:</strong> {selectedBudget.startDate} - {selectedBudget.endDate}</p>
                                <p><strong>Total sum:</strong> {selectedBudget.total.toLocaleString()}$</p>
                                <p><strong>Remaining balance:</strong> {selectedBudget.remaining.toLocaleString()}$</p>
                                <div className="form-buttons">
                                    <button type="button" onClick={closeModal} className="btn-outline">Close</button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleAddOrEdit} className="budget-form">
                                <h3>{modalType === 'add' ? 'Create budget' : 'Edit budget'}</h3>
                                <label>Назва<input type="text" name="name" required defaultValue={selectedBudget?.name} /></label>
                                <label>Description <textarea name="description" rows="3" /></label>
                                <label>Type<select
                                    name="type"
                                    defaultValue={selectedBudget?.type || 'Personal'}
                                    required={modalType === 'add'}
                                    disabled={modalType !== 'add'}
                                >
                                    <option value="personal">Personal</option>
                                    <option value="shared">Shared</option>
                                </select></label>
                                <label>Total sum<input type="number" name="total" required defaultValue={selectedBudget?.total} /></label>
                                <label>Start date<input type="date" name="startDate" required defaultValue={selectedBudget?.startDate} /></label>
                                <label>End date<input type="date" name="endDate" required defaultValue={selectedBudget?.endDate} /></label>
                                <div className="form-buttons">
                                    <button type="submit" className="btn-purple">Save</button>
                                    <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budgets;
