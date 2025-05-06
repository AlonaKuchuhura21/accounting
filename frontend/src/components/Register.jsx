import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/Register.css"; // <-- make sure this line is included
import registerIcon from "../assets/img/registerIcon.svg";
import emailIcon from "../assets/img/emailIcon.svg";
import envelopeWhite from "../assets/img/envelopeWhite.svg";
import showPasswordIcon from "../assets/img/showPasswordIcon.svg";
import hidePassword from "../assets/img/hidePassword.png";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is mandatory").min(2).max(100),
  email: Yup.string().required("Email is mandatory").email("Email is invalid"),
  password: Yup.string().required("Password is mandatory").min(8).max(100),
});

const Register = () => {
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
      await registerUser(data);
      toast.success("Registration successful!", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
      });
      setTimeout(() => navigate("/auth/login"), 5500);
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage =
        status === 409
          ? "A user with this email already exists."
          : "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* <h2>Register</h2> */}
        <div className="register-thumb">
          <div className="register-form-thumb">
            <p className="register-form-title">Create your account</p>
            <p className="register-form-subtitle">Unlock all features!</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <img
                  alt="name"
                  className="input-icon"
                  width={26}
                  height={26}
                  src={emailIcon}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName")}
                />
                <p className="error">{errors.fullName?.message}</p>
              </div>
              <div className="form-group">
                <img
                  alt="email"
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
                <p className="error">{errors.email?.message}</p>
              </div>
              <div className="form-group">
                <input
                  alt="password"
                  type={"password"}
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
                <p className="error">{errors.password?.message}</p>
              </div>
              <div className="form-button">
                <button type="submit" className="register-btn">
                  Register
                </button>
              </div>
              <p className="login-text">
                Already have an account?
                <Link to="/auth/login" className="login-text-link">
                  Login now
                </Link>
              </p>
            </form>
          </div>
          <div className="register-image-thumb">
            <div className="register-image-gradient">
              <div className="register-image-thumb-border">
                <img alt="registration" src={registerIcon} />
              </div>
            </div>
            <p className="register-image-text">Join Us!</p>
            <p className="register-image-subtext">
              Just go through the boring process of creating an account.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
