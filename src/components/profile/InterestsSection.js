import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import '../css/ProfileSections.css';

function InterestsSection({ userId, isOwnProfile }) {
  const [interests, setInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterests();
    if (isOwnProfile) {
      loadAllInterests();
    }
  }, [userId]);

  const loadInterests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}/interests`);
      setInterests(response.data);
    } catch (error) {
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllInterests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/interests/all`);
      setAllInterests(response.data);
    } catch (error) {
      console.error('Error loading all interests:', error);
    }
  };

  const handleAddInterest = async () => {
    if (!selectedInterest) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/profile/${userId}/interests`, {
        interestId: parseInt(selectedInterest)
      });
      loadInterests();
      setShowAddModal(false);
      setSelectedInterest('');
    } catch (error) {
      alert('Failed to add interest');
    }
  };

  const handleDeleteInterest = async (userInterestId) => {
    if (!window.confirm('Remove this interest?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/profile/interests/${userInterestId}`);
      loadInterests();
    } catch (error) {
      alert('Failed to remove interest');
    }
  };

  if (loading) return <div className="section-loading">Loading interests...</div>;

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3><i className="fi fi-rr-heart"></i> Interests</h3>
        {isOwnProfile && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Interest
          </button>
        )}
      </div>
      
      <div className="interests-grid">
        {interests.length === 0 ? (
          <p className="empty-message">No interests added yet</p>
        ) : (
          interests.map((interest) => (
            <div key={interest.id} className="interest-tag">
              <span className="interest-name">{interest.interestName}</span>
              <span className="interest-category">{interest.categoryName}</span>
              {isOwnProfile && (
                <button 
                  className="delete-btn-small" 
                  onClick={() => handleDeleteInterest(interest.id)}
                  title="Remove interest"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Interest</h3>
            <select 
              value={selectedInterest} 
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="form-select"
            >
              <option value="">Select an interest</option>
              {allInterests.map((interest) => (
                <option key={interest.id} value={interest.id}>
                  {interest.name} ({interest.categoryName})
                </option>
              ))}
            </select>
            
            <div className="modal-actions">
              <button onClick={handleAddInterest} className="btn-primary">Add</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterestsSection;
