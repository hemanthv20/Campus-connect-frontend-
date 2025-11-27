import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import './css/Register.css';
import LoadingSpinner from './common/LoadingSpinner';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { validateEmail, validatePassword, validateUsername, getPasswordStrength } from '../utils/validation';

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    gender: '',
    password: '',
    profile_picture: null,
    created_on: new Date(),
    college: '',
    semester: '',
    batch: ''
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors({ ...fieldErrors, profile_picture: 'Image size must be less than 5MB' });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFieldErrors({ ...fieldErrors, profile_picture: 'Please upload a valid image file' });
        return;
      }
      
      setImageUpload(file);
      previewImage(file);
      setFieldErrors({ ...fieldErrors, profile_picture: '' });
    }
  };

  // Preview Image
  const previewImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload Image
  const uploadImage = async () => {
    if (imageUpload == null) {
      await handleUserCreation(null);
      return;
    }
    
    try {
      const imageRef = ref(storage, `profile_pictures/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      await handleUserCreation(url);
      setImageUpload(null);
    } catch (error) {
      // If image upload fails, still allow registration without image
      console.error('Image upload failed:', error);
      setFieldErrors({ ...fieldErrors, profile_picture: '' });
      await handleUserCreation(null);
    }
  };

  // Handling Data Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    
    // Check password strength
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    
    if (errorMessage) setErrorMessage('');
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    
    if (!user.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!user.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!validateUsername(user.username)) {
      errors.username = 'Username must be 3-20 characters (letters, numbers, underscores only)';
    }
    
    if (!validateEmail(user.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!user.college.trim()) {
      errors.college = 'College/University is required';
    }
    
    if (!user.semester.trim()) {
      errors.semester = 'Semester is required';
    }
    
    if (!user.batch.trim()) {
      errors.batch = 'Batch is required';
    }
    
    if (!user.gender) {
      errors.gender = 'Please select your gender';
    }
    
    if (!validatePassword(user.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handling Submit Button
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setErrorMessage('Please fix the errors above');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      await uploadImage();
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // Handling User Creation
  const handleUserCreation = async (imageURL) => {
    const newUser = {
      ...user,
      profile_picture: imageURL
    };
    
    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CREATE_USER}`, newUser);
      setUser({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        gender: '',
        password: '',
        college: '',
        semester: '',
        batch: '',
        profile_picture: null,
        created_on: new Date()
      });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      } else if (error.request) {
        setErrorMessage('Unable to connect to server. Please check your connection.');
      } else {
        setErrorMessage('Registration failed. Please check all fields and try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-container fade-in">
      <div className="register-image">
        <img
          src={require('../assets/register.png')}
          alt="Register illustration"
        />
      </div>
      <div className="register-container">
        <div className="register-title">
          <h1>Join Campus Connect!</h1>
          <p>Create your account to get started</p>
        </div>
        <form className="register-body" onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              <i className="fi fi-rr-exclamation"></i>
              {errorMessage}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                placeholder="John"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className={fieldErrors.first_name ? 'error' : ''}
                disabled={loading}
              />
              {fieldErrors.first_name && (
                <span className="error-message">{fieldErrors.first_name}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                placeholder="Doe"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className={fieldErrors.last_name ? 'error' : ''}
                disabled={loading}
              />
              {fieldErrors.last_name && (
                <span className="error-message">{fieldErrors.last_name}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              placeholder="johndoe123"
              name="username"
              value={user.username}
              onChange={handleChange}
              className={fieldErrors.username ? 'error' : ''}
              disabled={loading}
              autoComplete="username"
            />
            {fieldErrors.username && (
              <span className="error-message">{fieldErrors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              placeholder="john.doe@university.edu"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={fieldErrors.email ? 'error' : ''}
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="error-message">{fieldErrors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="college">College/University *</label>
            <input
              type="text"
              id="college"
              placeholder="University of Example"
              name="college"
              value={user.college}
              onChange={handleChange}
              className={fieldErrors.college ? 'error' : ''}
              disabled={loading}
            />
            {fieldErrors.college && (
              <span className="error-message">{fieldErrors.college}</span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <input
                type="text"
                id="semester"
                placeholder="5th Semester"
                name="semester"
                value={user.semester}
                onChange={handleChange}
                className={fieldErrors.semester ? 'error' : ''}
                disabled={loading}
              />
              {fieldErrors.semester && (
                <span className="error-message">{fieldErrors.semester}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="batch">Batch *</label>
              <input
                type="text"
                id="batch"
                placeholder="2023-2027"
                name="batch"
                value={user.batch}
                onChange={handleChange}
                className={fieldErrors.batch ? 'error' : ''}
                disabled={loading}
              />
              {fieldErrors.batch && (
                <span className="error-message">{fieldErrors.batch}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className={fieldErrors.gender ? 'error' : ''}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.gender && (
              <span className="error-message">{fieldErrors.gender}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Create a strong password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className={fieldErrors.password ? 'error' : ''}
              disabled={loading}
              autoComplete="new-password"
            />
            {passwordStrength && user.password && (
              <div className="password-strength">
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: `${(passwordStrength.level === 'weak' ? 33 : passwordStrength.level === 'medium' ? 66 : 100)}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
                <span style={{ color: passwordStrength.color }}>
                  {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                </span>
              </div>
            )}
            {fieldErrors.password && (
              <span className="error-message">{fieldErrors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="profile_picture">Profile Picture (Optional)</label>
            <input 
              type="file" 
              id="profile_picture"
              onChange={handleImageUpload} 
              accept="image/*"
              disabled={loading}
            />
            {fieldErrors.profile_picture && (
              <span className="error-message">{fieldErrors.profile_picture}</span>
            )}
          </div>
          
          {imagePreview && (
            <div className="img-preview">
              <img className="dp-preview" src={imagePreview} alt="Profile Preview" />
            </div>
          )}
          
          <button className="rg-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        <p className="register-subtext">
          Already have an account?{' '}
          <Link to="/login">
            <strong>Log In</strong>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
