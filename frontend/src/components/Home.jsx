import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Home.css";
import smartphone from "../assets/img/smartphone.png";
import couple from "../assets/img/couple.png";
import groceryStore from "../assets/img/grocery-store.png";
import lady from "../assets/img/lady.svg";
import pig from "../assets/img/pig.svg";
import envelope from "../assets/img/envelope.svg";
import creditCard from "../assets/img/credit-card.svg";
import appPreview from "../assets/img/appPreview.png";
import "animate.css/animate.min.css";
import { InView } from "react-intersection-observer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Top Navigation */}
      <header>
        <nav className="top-nav">
          <div className="logo">BudgetWise</div>
          <div className="nav-buttons">
            <button
              className="btn-text"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-text-thumb fadeInUp">
            <h1>Budget with a why</h1>
            <p>Spend, save, and give toward what’s important in life</p>
            <button onClick={() => navigate("/auth")} className="btn-purple">
              CREATE YOUR GOODBUDGET
            </button>
          </div>
          <div className="hero-mobile-thumb zoomIn">
            <div className="mobile-preview shadow floating-animate">
              <img src={appPreview} alt="App Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Great budget software</h2>
        <InView triggerOnce threshold={0.3}>
          {({ inView, ref }) => (
            <ul className="features-grid">
              <li
                ref={ref}
                className={`feature-item ${
                  inView ? "animate__animated animate__zoomIn" : ""
                }`}
              >
                <img src={envelope} alt="Envelope" />
                <p>Budgeting that works</p>
              </li>

              <li
                ref={ref}
                className={`feature-item ${
                  inView ? "animate__animated animate__zoomIn" : ""
                }`}
              >
                <img src={couple} alt="Couple" />
                <p>Sync &amp; share budgets</p>
              </li>
              <li
                ref={ref}
                className={`feature-item ${
                  inView ? "animate__animated animate__zoomIn" : ""
                }`}
              >
                <img src={pig} alt="Piggy bank" />
                <p>Save for big expenses</p>
              </li>
              <li
                ref={ref}
                className={`feature-item ${
                  inView ? "animate__animated animate__zoomIn" : ""
                }`}
              >
                <img src={creditCard} alt="Scissors" />
                <p>Pay off debt</p>
              </li>
            </ul>
          )}
        </InView>

        <button onClick={() => navigate("/auth")} className="btn-outline">
          Get your personal budget manager
        </button>
      </section>

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
            Goodbudget is a budget tracker for the modern age. Say no more to
            carrying paper envelopes. This virtual budget program keeps you on
            track with family and friends with the time-tested envelope
            budgeting method.
          </p>

          <button onClick={() => navigate("/auth")} className="btn-white">
            Try Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
