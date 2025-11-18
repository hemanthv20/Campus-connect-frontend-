import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css';
import LoadingSpinner from './common/LoadingSpinner';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { validateRequired } from '../utils/validation';

function Login() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [userDetails, setUserDetails] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
        if (error) setError('');
    };

    const validateForm = () => {
        const errors = {};
        
        if (!validateRequired(userDetails.username)) {
            errors.username = 'Username is required';
        }
        
        if (!validateRequired(userDetails.password)) {
            errors.password = 'Password is required';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const params = new URLSearchParams();
        params.append('username', userDetails.username);
        params.append('password', userDetails.password);

        try {
            const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, params);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/feed');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password. Please try again.');
            } else if (error.request) {
                setError('Unable to connect to server. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/feed');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className='lg-container fade-in'>
            <div className='login-image'>
                <img src={require('../assets/login.png')} alt='Login illustration' />
            </div>
            <div className='login-container'>
                <div className='login-title'>
                    <h1>Welcome Back!</h1>
                    <p>Log into your account to continue</p>
                </div>

                <div className='login-body'>
                    <form onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fi fi-rr-exclamation"></i>
                                {error}
                            </div>
                        )}
                        
                        <div className='form-group'>
                            <label htmlFor='username'>Username</label>
                            <input 
                                type='text' 
                                id='username' 
                                name="username" 
                                onChange={handleChange} 
                                value={userDetails.username} 
                                placeholder='Enter your username' 
                                className={`form-control ${fieldErrors.username ? 'error' : ''}`}
                                disabled={loading}
                                autoComplete="username"
                            />
                            {fieldErrors.username && (
                                <span className="error-message">{fieldErrors.username}</span>
                            )}
                        </div>
                        
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                type='password' 
                                id='password' 
                                name="password" 
                                onChange={handleChange} 
                                value={userDetails.password} 
                                placeholder='Enter your password' 
                                className={`form-control ${fieldErrors.password ? 'error' : ''}`}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            {fieldErrors.password && (
                                <span className="error-message">{fieldErrors.password}</span>
                            )}
                        </div>
                        
                        <button 
                            id='lgn-btn' 
                            type='submit' 
                            disabled={loading}
                            className={loading ? 'loading' : ''}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>
                </div>

                <p id='login-subtext'>
                    Don't have an account? <Link to='/register'><strong>Sign Up</strong></Link>
                </p>
            </div>
        </div>
    );
}

export default Login;