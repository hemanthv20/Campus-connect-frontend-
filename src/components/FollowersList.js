import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import FollowButton from './FollowButton';
import './css/FollowersList.css';

const FollowersList = ({ userId, currentUserId, isOpen, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowers();
    }
  }, [isOpen, userId]);

  const fetchFollowers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_FOLLOWERS}/${userId}`
      );
      setFollowers(response.data || []);
    } catch (err) {
      setError('Failed to load followers');
      console.error('Error fetching followers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowChange = (userId, newFollowState) => {
    // Refresh the list after follow/unfollow
    fetchFollowers();
  };

  const filteredFollowers = followers.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="followers-modal-overlay" onClick={onClose}>
      <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="followers-modal-header">
          <h2>Followers</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="followers-search">
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="followers-list">
          {isLoading ? (
            <div className="loading-state">Loading followers...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filteredFollowers.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? 'No followers found' : 'No followers yet'}
            </div>
          ) : (
            filteredFollowers.map((user) => (
              <div key={user.userId} className="follower-card">
                <div className="follower-info">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username}
                    className="follower-avatar"
                  />
                  <div className="follower-details">
                    <div className="follower-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="follower-username">@{user.username}</div>
                    {user.college && (
                      <div className="follower-college">{user.college}</div>
                    )}
                  </div>
                </div>
                {user.userId !== currentUserId && (
                  <FollowButton
                    targetUserId={user.userId}
                    currentUserId={currentUserId}
                    initialIsFollowing={user.isFollowing}
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

export default FollowersList;
