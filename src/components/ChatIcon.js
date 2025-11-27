import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import './css/ChatIcon.css';

const ChatIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_UNREAD_COUNT}?userId=${user.user_id}`
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <div className="chat-icon-container" onClick={() => navigate('/chat')}>
      <i className="fi fi-rr-comment-alt"></i>
      {unreadCount > 0 && (
        <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </div>
  );
};

export default ChatIcon;
