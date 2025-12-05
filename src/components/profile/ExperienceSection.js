import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import '../css/ProfileSections.css';

function ExperienceSection({ userId, isOwnProfile }) {
  const [experiences, setExperiences] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    companyOrganization: '',
    description: '',
    experienceType: 'INTERNSHIP',
    startDate: '',
    endDate: '',
    isCurrent: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, [userId]);

  const loadExperiences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}/experience`);
      setExperiences(response.data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!formData.title || !formData.companyOrganization) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/profile/${userId}/experience`, formData);
      loadExperiences();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      alert('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Delete this experience?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/profile/experience/${experienceId}`);
      loadExperiences();
    } catch (error) {
      alert('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      companyOrganization: '',
      description: '',
      experienceType: 'INTERNSHIP',
      startDate: '',
      endDate: '',
      isCurrent: false
    });
  };

  const getExperienceIcon = (type) => {
    const icons = {
      INTERNSHIP: 'fi-rr-briefcase',
      JOB: 'fi-rr-building',
      VOLUNTEER: 'fi-rr-hands-heart',
      ACTIVITY: 'fi-rr-users-alt'
    };
    return icons[type] || 'fi-rr-briefcase';
  };

  if (loading) return <div className="section-loading">Loading experience...</div>;

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3><i className="fi fi-rr-briefcase"></i> Experience</h3>
        {isOwnProfile && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Experience
          </button>
        )}
      </div>
      
      <div className="experience-timeline">
        {experiences.length === 0 ? (
          <p className="empty-message">No experience added yet</p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="experience-card">
              <div className="experience-header">
                <div className="experience-title-row">
                  <i className={`fi ${getExperienceIcon(exp.experienceType)}`}></i>
                  <div>
                    <h4>{exp.title}</h4>
                    <p className="company-name">{exp.companyOrganization}</p>
                  </div>
                  <span className="experience-type-badge">{exp.experienceType}</span>
                </div>
                {isOwnProfile && (
                  <button 
                    className="delete-btn-small" 
                    onClick={() => handleDeleteExperience(exp.id)}
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                )}
              </div>
              
              {exp.description && <p className="experience-description">{exp.description}</p>}
              
              <div className="experience-dates">
                <i className="fi fi-rr-calendar"></i>
                {exp.startDate && new Date(exp.startDate).toLocaleDateString()}
                {' - '}
                {exp.isCurrent ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString())}
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Experience</h3>
            
            <input 
              type="text"
              placeholder="Title/Position"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="form-input"
            />
            
            <input 
              type="text"
              placeholder="Company/Organization"
              value={formData.companyOrganization}
              onChange={(e) => setFormData({...formData, companyOrganization: e.target.value})}
              className="form-input"
            />
            
            <textarea 
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-textarea"
              rows="3"
            />
            
            <select 
              value={formData.experienceType}
              onChange={(e) => setFormData({...formData, experienceType: e.target.value})}
              className="form-select"
            >
              <option value="INTERNSHIP">Internship</option>
              <option value="JOB">Job</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="ACTIVITY">Activity</option>
            </select>
            
            <div className="date-row">
              <input 
                type="date"
                placeholder="Start date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="form-input"
              />
              {!formData.isCurrent && (
                <input 
                  type="date"
                  placeholder="End date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="form-input"
                />
              )}
            </div>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
              />
              I currently work here
            </label>
            
            <div className="modal-actions">
              <button onClick={handleAddExperience} className="btn-primary">Add Experience</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperienceSection;
