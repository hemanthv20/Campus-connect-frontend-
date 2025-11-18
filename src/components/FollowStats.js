import React from 'react';
import './css/FollowStats.css';

const FollowStats = ({ userId, followerCount, followingCount, onFollowersClick, onFollowingClick }) => {
  return (
    <div className="follow-stats">
      <div className="stat-item" onClick={() => onFollowersClick && onFollowersClick()}>
        <span className="stat-count">{followerCount || 0}</span>
        <span className="stat-label">Followers</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item" onClick={() => onFollowingClick && onFollowingClick()}>
        <span className="stat-count">{followingCount || 0}</span>
        <span className="stat-label">Following</span>
      </div>
    </div>
  );
};

export default FollowStats;
