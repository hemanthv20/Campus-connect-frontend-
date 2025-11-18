import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import LoadingSpinner from './common/LoadingSpinner';
import './css/Admin.css';

function Admin() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    if (!currentUser.admin) {
      navigate('/feed');
      return;
    }
    
    loadUsers();
  }, [isLoggedIn, currentUser, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_USERS}`);
      setUsers(response.data);
    } catch (error) {
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.DELETE_USER}/${userId}`);
      setUsers(users.filter(user => user.user_id !== userId));
    } catch (error) {
      alert('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = !filterGender || user.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and monitor platform activity</p>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <i className="fi fi-rr-users"></i>
            <div>
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fi fi-rr-shield-check"></i>
            <div>
              <h3>{users.filter(u => u.admin).length}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fi fi-rr-user"></i>
            <div>
              <h3>{users.filter(u => !u.admin).length}</h3>
              <p>Regular Users</p>
            </div>
          </div>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>College</th>
                <th>Semester</th>
                <th>Batch</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <img
                      src={user.profile_picture || require('../assets/placeholder.png')}
                      alt={user.username}
                      className="table-profile-pic"
                    />
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>@{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.college || 'N/A'}</td>
                  <td>{user.semester || 'N/A'}</td>
                  <td>{user.batch || 'N/A'}</td>
                  <td>{user.gender}</td>
                  <td>
                    {user.admin ? (
                      <span className="badge badge-admin">Admin</span>
                    ) : (
                      <span className="badge badge-user">User</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/profile/${user.username}`)}
                        title="View Profile"
                      >
                        <i className="fi fi-rr-eye"></i>
                      </button>
                      {user.user_id !== currentUser.user_id && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.user_id)}
                          title="Delete User"
                        >
                          <i className="fi fi-rr-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="no-results">
              <p>No users found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
