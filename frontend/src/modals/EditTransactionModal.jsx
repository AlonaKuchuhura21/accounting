import React, { useState } from 'react';
import "../assets/css/Modal.css";

const EditTransactionModal = ({ transaction, onClose, onSubmit }) => {
  const [title, setTitle] = useState(transaction.title || '');
  const [amount, setAmount] = useState(transaction.amount || '');
  const [date, setDate] = useState(transaction.date || '');
  const [description, setDescription] = useState(transaction.description || '');
  const [type, setType] = useState(transaction.type || 'EXPENSE');

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      amount: parseFloat(amount),
      date,
      description,
      type
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="budget-form">
          <h3>Edit Transaction</h3>
          <label>Title<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
          <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <label>Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </label>
          <label>Amount<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
          <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
          <div className="form-buttons">
            <button type="submit" className="btn-purple">Save</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
