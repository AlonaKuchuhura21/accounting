
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/Register.css';

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is mandatory').min(2).max(100),
    email: Yup.string().required('Email is mandatory').email('Email is invalid'),
    password: Yup.string().required('Password is mandatory').min(8).max(100),
});

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            toast.success('Registration is successful, check your email to verify your account!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                });
            setTimeout(() => {
                navigate('/auth/login');
            }, 5500);
        } catch (error) {
            let errorMessage = 'Registration error, please try again.';
            if (error.response && error.response.status === 409) {
                errorMessage = 'A user with this email already exists.';
            } else if (error.request) {
                errorMessage = 'No response was received from the server.';
            }
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
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
        <div className="register-page">
            <div className="register-card">
                <h2>Register</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Full Name" {...register('fullName')} />
                            <p className="text-danger">{errors.fullName?.message}</p>
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" {...register('email')} />
                            <p className="text-danger">{errors.email?.message}</p>
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" {...register('password')} />
                            <p className="text-danger">{errors.password?.message}</p>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
                    </form>
                </div>
            <ToastContainer />
        </div>
    );    
};

export default Register;
