import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/Login.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is mandatory').email('Email is invalid'),
  password: Yup.string().required('Password is mandatory').min(8).max(100),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  
  const onSubmit = async (data) => {
    try {
        const response = await loginUser(data);
        localStorage.setItem('token', response.data);
        const roleResponse = await axios.get('http://localhost:8080/users/me/role', {
            headers: { 'Authorization': `Bearer ${response.data}` }
        });
        localStorage.setItem('role', roleResponse.data);
        toast.success('Success! Redirecting to the home page', {
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
            navigate('/dashboard');
        }, 1500);
    } catch (error) {
        let errorMessage = 'There was an error. Please try again.';
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    errorMessage = 'Incorrect email address or password';
                    break;
                case 403:
                    errorMessage = 'You do not have the required permissions.';
                    break;
                default:
                    errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
            }
        } else if (error.request) {
            errorMessage = 'No response was received from the server.';
        } else {
            errorMessage = 'Request for an installation error.';
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

const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
        try {
            const googleUser = await googleLoginUser(credentialResponse.access_token);
            const response = await loginOAuth2User(googleUser);
            localStorage.setItem('token', response.data);
            const roleResponse = await axios.get('http://localhost:8080/users/me/role', {
                headers: { 'Authorization': `Bearer ${response.data}` }
            });
            localStorage.setItem('role', roleResponse.data);
            navigate('/dashboard');
        } catch (error) {
            let errorMessage = 'An error occurred while signing in to Google.';
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Invalid request. Check the input data.';
                        break;
                    default:
                        errorMessage = `Google Login Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
                }
            } else if (error.request) {
                errorMessage = 'No response was received from the server.';
            } else {
                errorMessage = 'Error setting up Google login.';
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
    },
    onError: (error) => {
        toast.error(error, {
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
    },
});

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input type="email" placeholder="Email" {...register('email')} />
            <p className="error-text">{errors.email?.message}</p>
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" {...register('password')} />
            <p className="error-text">{errors.password?.message}</p>
          </div>
          <div className="form-button">
            <button type="submit" className="btn-purple">Login</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;