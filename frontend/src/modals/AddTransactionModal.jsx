import React, { useState } from "react";
import "../assets/css/Modal.css";

const AddTransactionModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !date) return;

    onSubmit({
      name,
      amount: parseFloat(amount),
      date,
    });

    onClose(); // Close modal
  };

  return (

    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="budget-form">
          <h3>Create transaction</h3>
          <label>Name<input type="text" name="name" required onChange={(e) => setName(e.target.value)} /></label>
          <label>Sum<input type="number" name="sum" required onChange={(e) => setAmount(e.target.value)} /></label>
          <label>Date<input type="date" name="date" required onChange={(e) => setDate(e.target.value)} /></label>
          <div className="form-buttons">
            <button type="submit" className="btn-purple">Save</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
