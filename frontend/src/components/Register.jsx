import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/Register.css'; // <-- make sure this line is included

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is mandatory').min(2).max(100),
  email: Yup.string().required('Email is mandatory').email('Email is invalid'),
  password: Yup.string().required('Password is mandatory').min(8).max(100),
});

const Register = () => {
  const navigate = useNavigate();
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
      toast.success('Registration successful!', {
        position: 'bottom-right',
        autoClose: 5000,
        transition: Bounce,
      });
      setTimeout(() => navigate('/auth/login'), 5500);
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage =
        status === 409
          ? 'A user with this email already exists.'
          : 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 5000,
        transition: Bounce,
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input type="text" placeholder="Full Name" {...register('fullName')} />
            <p className="error">{errors.fullName?.message}</p>
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" {...register('email')} />
            <p className="error">{errors.email?.message}</p>
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" {...register('password')} />
            <p className="error">{errors.password?.message}</p>
          </div>
          <div className="form-button">
            <button type="submit" className="btn-purple">Register</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
