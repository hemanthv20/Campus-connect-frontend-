import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import FollowButton from './FollowButton';
import './css/FollowingList.css';

const FollowingList = ({ userId, currentUserId, isOpen, onClose }) => {
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowing();
    }
  }, [isOpen, userId]);

  const fetchFollowing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_FOLLOWING}/${userId}`
      );
      setFollowing(response.data || []);
    } catch (err) {
      setError('Failed to load following');
      console.error('Error fetching following:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowChange = (userId, newFollowState) => {
    // Refresh the list after follow/unfollow
    fetchFollowing();
  };

  const filteredFollowing = following.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="following-modal-overlay" onClick={onClose}>
      <div className="following-modal" onClick={(e) => e.stopPropagation()}>
        <div className="following-modal-header">
          <h2>Following</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="following-search">
          <input
            type="text"
            placeholder="Search following..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="following-list">
          {isLoading ? (
            <div className="loading-state">Loading following...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filteredFollowing.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? 'No users found' : 'Not following anyone yet'}
            </div>
          ) : (
            filteredFollowing.map((user) => (
              <div key={user.userId} className="following-card">
                <div className="following-info">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username}
                    className="following-avatar"
                  />
                  <div className="following-details">
                    <div className="following-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="following-username">@{user.username}</div>
                    {user.college && (
                      <div className="following-college">{user.college}</div>
                    )}
                  </div>
                </div>
                {user.userId !== currentUserId && (
                  <FollowButton
                    targetUserId={user.userId}
                    currentUserId={currentUserId}
                    initialIsFollowing={true}
                    onFollowChange={() => handleFollowChange(user.userId)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingList;
