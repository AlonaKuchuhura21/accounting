import React, { useState, useEffect } from "react";
import "../assets/css/Modal.css";

const TransactionFormModal = ({ onClose, onSubmit, transaction }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('INCOME');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title || '');
      setAmount(transaction.amount || '');
      setType(transaction.type || 'INCOME');
      setDate(transaction.date?.substring(0, 10) || '');
      setDescription(transaction.description || '');
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !type) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      type,
      date,
      description,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="budget-form">
          <h3>{transaction ? 'Edit Transaction' : 'Create Transaction'}</h3>

          <label>Title
            <input type="text" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>Amount
            <input type="number" name="amount" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>

          <label>Type
            <select name="type" required value={type} onChange={(e) => setType(e.target.value)}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </label>

          <label>Date
            <input type="date" name="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label>Description
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <div className="form-buttons">
            <button type="submit" className="btn-purple">Save</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
