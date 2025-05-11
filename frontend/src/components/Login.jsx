import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/Login.css";
import loginIcon from "../assets/img/loginIcon.svg";
import envelopeWhite from "../assets/img/envelopeWhite.svg";
import showPasswordIcon from "../assets/img/showPasswordIcon.svg";
import hidePassword from "../assets/img/hidePassword.png";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is mandatory").email("Email is invalid"),
  password: Yup.string().required("Password is mandatory").min(8).max(100),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      localStorage.setItem("token", response.data);
      toast.success("Success! Redirecting to the home page", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
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

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* <h2>Login</h2> */}
        <div className="login-thumb">
          <div className="login-form-thumb">
            <p className="login-form-title">Login to your Account</p>
            <p className="login-form-subtitle">Welcome back!</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <img
                  alt="name"
                  className="input-icon"
                  width={26}
                  height={26}
                  src={envelopeWhite}
                />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
                <p className="error-text">{errors.email?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  <img
                    alt="password"
                    className="input-icon"
                    width={26}
                    height={26}
                    src={showPassword ? hidePassword : showPasswordIcon}
                  />
                </span>
                <p className="error-text">{errors.password?.message}</p>
              </div>
              <div className="form-button">
                <button type="submit" className="login-btn">
                  Login
                </button>
              </div>
              <p className="login-text">
                Don’t have account?
                <Link to="/auth/signup" className="login-text-link">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
          <div className="login-image-thumb">
            <div className="login-image-gradient">
              <div className="login-image-thumb-border">
                <img alt="loginization" src={loginIcon} />
              </div>
            </div>
            <p className="login-image-text">Connect with any device.</p>
            <p className="login-image-subtext">
              Everything you need is an internet connection.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
