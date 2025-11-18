import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import LoadingSpinner from './common/LoadingSpinner';
import FollowButton from './FollowButton';
import FollowStats from './FollowStats';
import FollowersList from './FollowersList';
import FollowingList from './FollowingList';
import './css/Profile.css';

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [canChat, setCanChat] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    loadProfile();
  }, [username, isLoggedIn, navigate]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch user profile
      const userResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.SEARCH_USER}/${username}`);
      setProfileUser(userResponse.data);
      
      // Fetch user posts
      const postsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_USER_POSTS}/${userResponse.data.user_id}`);
      const sortedPosts = postsResponse.data.sort((a, b) => b.post_id - a.post_id);
      setUserPosts(sortedPosts);
      
      // Fetch follow status and counts
      await loadFollowData(userResponse.data.user_id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFollowData = async (userId) => {
    try {
      // Check if current user is following this profile
      if (currentUser.user_id !== userId) {
        const followCheckResponse = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.CHECK_FOLLOWING}`,
          { params: { followerId: currentUser.user_id, followingId: userId } }
        );
        setIsFollowing(followCheckResponse.data.isFollowing);
        
        // Check if users can chat (mutual follow)
        const canChatResponse = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.CAN_CHAT}`,
          { params: { user1Id: currentUser.user_id, user2Id: userId } }
        );
        setCanChat(canChatResponse.data.canChat);
      }
      
      // Get follower and following counts
      const countsResponse = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_FOLLOW_COUNTS}/${userId}`
      );
      setFollowerCount(countsResponse.data.followers);
      setFollowingCount(countsResponse.data.following);
    } catch (error) {
      console.error('Error loading follow data:', error);
    }
  };

  const handleFollowChange = async (newFollowState, responseData) => {
    setIsFollowing(newFollowState);
    if (responseData) {
      setFollowerCount(responseData.followerCount);
    }
    
    // Update chat permission - can chat if current user follows the profile user
    setCanChat(newFollowState);
  };
  
  const handleMessageClick = async () => {
    if (!canChat) {
      alert('You must follow this user to message them!');
      return;
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_OR_CREATE_CHAT}/${profileUser.user_id}?userId=${currentUser.user_id}`
      );
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      alert(error.response?.data || 'Unable to start chat. Please follow this user first!');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.DELETE_POST}/${postId}`);
      setUserPosts(userPosts.filter(post => post.post_id !== postId));
    } catch (error) {
      alert('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <button onClick={() => navigate('/feed')}>Go to Feed</button>
      </div>
    );
  }

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-picture-container">
            {profileUser.profile_picture ? (
              <img src={profileUser.profile_picture} alt={`${profileUser.username}'s profile`} className="profile-picture-large" />
            ) : (
              <img src={require('../assets/placeholder.png')} alt="Default profile" className="profile-picture-large" />
            )}
          </div>
          <div className="profile-details">
            <h1>{profileUser.first_name} {profileUser.last_name}</h1>
            <p className="username">@{profileUser.username}</p>
            {profileUser.admin && (
              <span className="admin-badge">Admin</span>
            )}
            
            {currentUser.user_id !== profileUser.user_id && (
              <div className="profile-actions">
                <FollowButton
                  targetUserId={profileUser.user_id}
                  currentUserId={currentUser.user_id}
                  initialIsFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
                <button
                  className={`message-button ${!canChat ? 'disabled' : ''}`}
                  onClick={handleMessageClick}
                  disabled={!canChat}
                  title={canChat ? 'Send message' : 'Follow this user to send messages'}
                >
                  <i className="fi fi-rr-comment-alt"></i>
                  Message
                </button>
              </div>
            )}
            
            <FollowStats
              userId={profileUser.user_id}
              followerCount={followerCount}
              followingCount={followingCount}
              onFollowersClick={() => setShowFollowersList(true)}
              onFollowingClick={() => setShowFollowingList(true)}
            />
            
            <div className="profile-meta">
              {profileUser.college && (
                <div className="meta-item">
                  <i className="fi fi-rr-graduation-cap"></i>
                  <span>{profileUser.college}</span>
                </div>
              )}
              {profileUser.semester && (
                <div className="meta-item">
                  <i className="fi fi-rr-book"></i>
                  <span>{profileUser.semester}</span>
                </div>
              )}
              {profileUser.batch && (
                <div className="meta-item">
                  <i className="fi fi-rr-calendar"></i>
                  <span>{profileUser.batch}</span>
                </div>
              )}
              {profileUser.email && (
                <div className="meta-item">
                  <i className="fi fi-rr-envelope"></i>
                  <span>{profileUser.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="posts-section">
          <h2>Posts ({userPosts.length})</h2>
          {userPosts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet</p>
            </div>
          ) : (
            <div className="posts-grid">
              {userPosts.map((post) => (
                <div className="post-card" key={post.post_id}>
                  {post.image && (
                    <img src={post.image} alt="Post" className="post-media" />
                  )}
                  {post.video && (
                    <video src={post.video} controls className="post-media" />
                  )}
                  <div className="post-content">
                    <p>{post.content}</p>
                    <small>{new Date(post.created_on).toLocaleDateString()}</small>
                  </div>
                  {(currentUser.admin || currentUser.user_id === profileUser.user_id) && (
                    <button 
                      className="delete-post-btn" 
                      onClick={() => handleDeletePost(post.post_id)}
                      title="Delete post"
                    >
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <FollowersList
        userId={profileUser?.user_id}
        currentUserId={currentUser.user_id}
        isOpen={showFollowersList}
        onClose={() => setShowFollowersList(false)}
      />
      
      <FollowingList
        userId={profileUser?.user_id}
        currentUserId={currentUser.user_id}
        isOpen={showFollowingList}
        onClose={() => setShowFollowingList(false)}
      />
    </div>
  );
}

export default Profile;
