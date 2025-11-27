import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import './css/ChatList.css';

const ChatList = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFollowingUsers();
    const interval = setInterval(fetchFollowingUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFollowingUsers = async () => {
    try {
      // Fetch all users that current user follows
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_FOLLOWING}/${user.user_id}`
      );
      setFollowingUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching following users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = followingUsers.filter(person =>
    person.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = async (otherUserId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_OR_CREATE_CHAT}/${otherUserId}?userId=${user.user_id}`
      );
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      if (error.response?.status === 400) {
        alert('You must follow this user to message them');
      } else {
        alert('Unable to start chat. Please try again.');
      }
    }
  };

  return (
    <div className="chat-list-page">
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2>Messages</h2>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chat-search"
          />
        </div>

        {!loading && followingUsers.length > 0 && (
          <div className="following-count">
            <span>Following ({followingUsers.length})</span>
          </div>
        )}

        <div className="following-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <div className="no-results">
                  <p>No users found matching "{searchTerm}"</p>
                </div>
              ) : (
                <div className="no-following">
                  <div className="empty-icon">👥</div>
                  <h3>You're not following anyone yet</h3>
                  <p>Follow users to start messaging them!</p>
                  <button 
                    className="discover-btn"
                    onClick={() => navigate('/feed')}
                  >
                    Discover Users
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredUsers.map(person => (
              <div key={person.userId} className="following-user-card">
                <img
                  src={person.profilePicture || require('../assets/placeholder.png')}
                  alt={person.username}
                  className="user-avatar"
                  onClick={() => navigate(`/profile/${person.username}`)}
                />
                <div className="user-info">
                  <div className="user-name" onClick={() => navigate(`/profile/${person.username}`)}>
                    {person.firstName} {person.lastName}
                  </div>
                  <div className="user-details">
                    <span className="username">@{person.username}</span>
                    {person.follower && (
                      <span className="follows-badge">• Follows you</span>
                    )}
                  </div>
                </div>
                <button
                  className="chat-button"
                  onClick={() => handleChatClick(person.userId)}
                  title="Send message"
                >
                  💬 Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
