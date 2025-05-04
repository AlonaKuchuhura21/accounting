import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import smartphone from  '../assets/img/smartphone.png';
import couple from  '../assets/img/couple.png';
import groceryStore from  '../assets/img/grocery-store.png';
import lady from  '../assets/img/lady.svg';
import pig from  '../assets/img/pig.svg';
import envelope from  '../assets/img/envelope.svg';
import creditCard from  '../assets/img/credit-card.svg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="logo">BudgetWise</div>
        <div className="nav-buttons">
          <button className="btn-text" onClick={() => navigate('/auth/login')}>Login</button>
          <button className="btn-outline" onClick={() => navigate('/auth/signup')}>Sign Up</button>
        </div>
      </nav>
      {/* Header Section */}
      <header className="header">
        <h1>Budget with a why</h1>
        <p>Spend, save, and give toward what’s important in life</p>
        <button onClick={() => navigate('/auth')} className="btn-purple">CREATE YOUR GOODBUDGET</button>
      </header>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="image-phone">
          <img src={smartphone} alt="Phone preview" />
          <img src={lady} alt="Woman preview" />
          <img src={groceryStore} alt="Grocery preview" />
        </div>
        <div className="how-text">
          <h2>How it works</h2>
          <p>
            Goodbudget is a budget tracker for the modern age. Say no more to carrying paper envelopes.
            This virtual budget program keeps you on track with family and friends with the time-tested envelope budgeting method.
          </p>
          
        <button onClick={() => navigate('/auth')}  className="btn-white">Try Now</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Great budget software</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src={envelope} alt="Envelope" />
            <p>Budgeting that works</p>
          </div>
          <div className="feature-item">
            <img src={couple} alt="Couple" />
            <p>Sync &amp; share budgets</p>
          </div>
          <div className="feature-item">
            <img src={pig} alt="Piggy bank" />
            <p>Save for big expenses</p>
          </div>
          <div className="feature-item">
            <img src={creditCard} alt="Scissors" />
            <p>Pay off debt</p>
          </div>
        </div>
        <button onClick={() => navigate('/auth')} className="btn-outline">Get your personal budget manager</button>
      </section>
    </div>
  );
};

export default Home;
