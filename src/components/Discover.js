import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './css/Discover.css';

function Discover() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [quickResults, setQuickResults] = useState([]);
  const [showQuickResults, setShowQuickResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover', 'search', 'recommendations'
  
  // Advanced filters
  const [filters, setFilters] = useState({
    skills: [],
    interests: [],
    college: '',
    semester: '',
    batch: ''
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  
  useEffect(() => {
    loadRecommendations();
  }, []);
  
  const loadRecommendations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/recommendations`, {
        params: { userId: currentUser.user_id }
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };
  
  const handleQuickSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setQuickResults([]);
      setShowQuickResults(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search/quick`, {
        params: { query, userId: currentUser.user_id }
      });
      setQuickResults(response.data);
      setShowQuickResults(true);
    } catch (error) {
      console.error('Error in quick search:', error);
    }
  };
  
  const handleAdvancedSearch = async () => {
    setLoading(true);
    setShowQuickResults(false);
    
    try {
      const criteria = {
        query: searchQuery,
        skills: filters.skills,
        interests: filters.interests,
        college: filters.college,
        semester: filters.semester,
        batch: filters.batch,
        page: 0,
        size: 20
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/api/search/advanced?userId=${currentUser.user_id}`,
        criteria
      );
      
      setSearchResults(response.data.results);
      setActiveTab('search');
    } catch (error) {
      console.error('Error in advanced search:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addSkillFilter = () => {
    if (skillInput && !filters.skills.includes(skillInput)) {
      setFilters({...filters, skills: [...filters.skills, skillInput]});
      setSkillInput('');
    }
  };
  
  const removeSkillFilter = (skill) => {
    setFilters({...filters, skills: filters.skills.filter(s => s !== skill)});
  };
  
  const addInterestFilter = () => {
    if (interestInput && !filters.interests.includes(interestInput)) {
      setFilters({...filters, interests: [...filters.interests, interestInput]});
      setInterestInput('');
    }
  };
  
  const removeInterestFilter = (interest) => {
    setFilters({...filters, interests: filters.interests.filter(i => i !== interest)});
  };
  
  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };
  
  const renderUserCard = (user) => (
    <div key={user.userId} className="user-card" onClick={() => handleUserClick(user.username)}>
      <div className="user-card-header">
        <img 
          src={user.profilePicture || require('../assets/placeholder.png')} 
          alt={user.username}
          className="user-avatar"
        />
        <div className="user-info">
          <h3>{user.firstName} {user.lastName}</h3>
          <p className="username">@{user.username}</p>
          {user.college && <p className="college">{user.college}</p>}
        </div>
        {user.matchScore > 0 && (
          <div className="match-score">
            <span className="score">{Math.round(user.matchScore)}%</span>
            <span className="match-label">Match</span>
          </div>
        )}
      </div>
      
      {user.bio && <p className="user-bio">{user.bio}</p>}
      
      {user.skills && user.skills.length > 0 && (
        <div className="user-tags">
          <strong>Skills:</strong>
          {user.skills.map((skill, idx) => (
            <span key={idx} className="tag skill-tag">{skill}</span>
          ))}
        </div>
      )}
      
      {user.interests && user.interests.length > 0 && (
        <div className="user-tags">
          <strong>Interests:</strong>
          {user.interests.map((interest, idx) => (
            <span key={idx} className="tag interest-tag">{interest}</span>
          ))}
        </div>
      )}
      
      {user.matchReason && (
        <p className="match-reason"><i className="fi fi-rr-bulb"></i> {user.matchReason}</p>
      )}
    </div>
  );
  
  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1><i className="fi fi-rr-search"></i> Discover Students</h1>
        <p>Find like-minded peers based on skills, interests, and goals</p>
      </div>
      
      <div className="search-section">
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <i className="fi fi-rr-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, skills, interests..."
              value={searchQuery}
              onChange={(e) => handleQuickSearch(e.target.value)}
              onFocus={() => quickResults.length > 0 && setShowQuickResults(true)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => {
                setSearchQuery('');
                setQuickResults([]);
                setShowQuickResults(false);
              }}>
                <i className="fi fi-rr-cross-small"></i>
              </button>
            )}
          </div>
          
          {showQuickResults && quickResults.length > 0 && (
            <div className="quick-results-dropdown">
              {quickResults.map(user => (
                <div 
                  key={user.userId} 
                  className="quick-result-item"
                  onClick={() => handleUserClick(user.username)}
                >
                  <img 
                    src={user.profilePicture || require('../assets/placeholder.png')} 
                    alt={user.username}
                    className="quick-result-avatar"
                  />
                  <div>
                    <div className="quick-result-name">{user.firstName} {user.lastName}</div>
                    <div className="quick-result-username">@{user.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button className="search-btn" onClick={handleAdvancedSearch}>
          <i className="fi fi-rr-search"></i> Search
        </button>
      </div>
      
      {/* Advanced Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label>Skills</label>
          <div className="filter-input-group">
            <input
              type="text"
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkillFilter()}
            />
            <button onClick={addSkillFilter}>Add</button>
          </div>
          <div className="filter-tags">
            {filters.skills.map(skill => (
              <span key={skill} className="filter-tag">
                {skill}
                <i className="fi fi-rr-cross-small" onClick={() => removeSkillFilter(skill)}></i>
              </span>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Interests</label>
          <div className="filter-input-group">
            <input
              type="text"
              placeholder="Add interest..."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addInterestFilter()}
            />
            <button onClick={addInterestFilter}>Add</button>
          </div>
          <div className="filter-tags">
            {filters.interests.map(interest => (
              <span key={interest} className="filter-tag">
                {interest}
                <i className="fi fi-rr-cross-small" onClick={() => removeInterestFilter(interest)}></i>
              </span>
            ))}
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>College</label>
            <input
              type="text"
              placeholder="College name..."
              value={filters.college}
              onChange={(e) => setFilters({...filters, college: e.target.value})}
            />
          </div>
          
          <div className="filter-group">
            <label>Semester</label>
            <input
              type="text"
              placeholder="e.g., 5th Sem"
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
            />
          </div>
          
          <div className="filter-group">
            <label>Batch</label>
            <input
              type="text"
              placeholder="e.g., 2024"
              value={filters.batch}
              onChange={(e) => setFilters({...filters, batch: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'discover' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('discover')}
        >
          <i className="fi fi-rr-star"></i> For You
        </button>
        <button 
          className={activeTab === 'search' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('search')}
        >
          <i className="fi fi-rr-search"></i> Search Results
        </button>
      </div>
      
      {/* Results */}
      <div className="results-section">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : (
          <>
            {activeTab === 'discover' && (
              <div className="results-grid">
                {recommendations.length === 0 ? (
                  <div className="empty-state">
                    <i className="fi fi-rr-users-alt"></i>
                    <p>No recommendations yet. Complete your profile to get better matches!</p>
                  </div>
                ) : (
                  recommendations.map(user => renderUserCard(user))
                )}
              </div>
            )}
            
            {activeTab === 'search' && (
              <div className="results-grid">
                {searchResults.length === 0 ? (
                  <div className="empty-state">
                    <i className="fi fi-rr-search"></i>
                    <p>No results found. Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  searchResults.map(user => renderUserCard(user))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Discover;
