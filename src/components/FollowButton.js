import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import './css/FollowButton.css';

const FollowButton = ({ targetUserId, currentUserId, initialIsFollowing, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing || false);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // Optimistic UI update
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      const endpoint = isFollowing 
        ? `${API_BASE_URL}${API_ENDPOINTS.UNFOLLOW_USER}`
        : `${API_BASE_URL}${API_ENDPOINTS.FOLLOW_USER}`;

      const method = isFollowing ? 'delete' : 'post';

      const response = await axios[method](endpoint, {
        followerId: currentUserId,
        followingId: targetUserId
      });

      if (response.data.success) {
        // Notify parent component of the change
        if (onFollowChange) {
          onFollowChange(!previousState, response.data);
        }
      } else {
        // Revert on failure
        setIsFollowing(previousState);
        setError(response.data.message || 'Failed to update follow status');
      }
    } catch (err) {
      // Revert on error
      setIsFollowing(previousState);
      setError(err.response?.data?.message || 'Network error. Please try again.');
      console.error('Follow/Unfollow error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="follow-button-container">
      <button
        className={`follow-button ${isFollowing ? 'following' : 'not-following'} ${isLoading ? 'loading' : ''}`}
        onClick={handleFollowToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner"></span>
        ) : (
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        )}
      </button>
      {error && <div className="follow-error">{error}</div>}
    </div>
  );
};

export default FollowButton;
