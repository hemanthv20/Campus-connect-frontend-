import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import '../css/ProfileSections.css';

function GoalsSection({ userId, isOwnProfile }) {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'PERSONAL',
    targetDate: '',
    progressPercentage: 0,
    isPublic: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}/goals`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!formData.title) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/profile/${userId}/goals`, formData);
      loadGoals();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      alert('Failed to add goal');
    }
  };

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      await axios.put(`${API_BASE_URL}/api/profile/goals/${goalId}`, {
        progressPercentage: newProgress
      });
      loadGoals();
    } catch (error) {
      alert('Failed to update progress');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Delete this goal?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/profile/goals/${goalId}`);
      loadGoals();
    } catch (error) {
      alert('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'PERSONAL',
      targetDate: '',
      progressPercentage: 0,
      isPublic: true
    });
  };

  const getGoalCategoryIcon = (category) => {
    const icons = {
      PERSONAL: 'fi-rr-user',
      CAREER: 'fi-rr-briefcase',
      ACADEMIC: 'fi-rr-graduation-cap'
    };
    return icons[category] || 'fi-rr-target';
  };

  if (loading) return <div className="section-loading">Loading goals...</div>;

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3><i className="fi fi-rr-target"></i> Goals</h3>
        {isOwnProfile && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Goal
          </button>
        )}
      </div>
      
      <div className="goals-list">
        {goals.length === 0 ? (
          <p className="empty-message">No goals set yet</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-title-row">
                  <i className={`fi ${getGoalCategoryIcon(goal.category)}`}></i>
                  <h4>{goal.title}</h4>
                  <span className="goal-type-badge">{goal.category}</span>
                </div>
                {isOwnProfile && (
                  <button 
                    className="delete-btn-small" 
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                )}
              </div>
              
              {goal.description && <p className="goal-description">{goal.description}</p>}
              
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${goal.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">{goal.progressPercentage}%</span>
              </div>
              
              {isOwnProfile && (
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={goal.progressPercentage}
                  onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                  className="progress-slider"
                />
              )}
              
              {goal.targetDate && (
                <div className="goal-date">
                  <i className="fi fi-rr-calendar"></i>
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Goal</h3>
            
            <input 
              type="text"
              placeholder="Goal title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="form-input"
            />
            
            <textarea 
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-textarea"
              rows="3"
            />
            
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="form-select"
            >
              <option value="PERSONAL">Personal</option>
              <option value="CAREER">Career</option>
              <option value="ACADEMIC">Academic</option>
            </select>
            
            <input 
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
              className="form-input"
            />
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
              />
              Make this goal public
            </label>
            
            <div className="modal-actions">
              <button onClick={handleAddGoal} className="btn-primary">Add Goal</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalsSection;
