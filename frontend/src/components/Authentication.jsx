import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Authentication.css';

function Authentication() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Join BudgetWise</h2>
        <p>Login to your account or create one to start managing your budgets.</p>

        <div className="auth-buttons">
          <button onClick={() => navigate('/auth/login')} className="btn-purple">Login</button>
          <button onClick={() => navigate('/auth/signup')} className="btn-outline">Register</button>
        </div>
      </div>
    </div>
  );
}

export default Authentication;