import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import '../css/ProfileSections.css';

function SkillsSection({ userId, isOwnProfile }) {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
    if (isOwnProfile) {
      loadAllSkills();
    }
  }, [userId]);

  const loadSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/skills/all`);
      setAllSkills(response.data);
    } catch (error) {
      console.error('Error loading all skills:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/profile/${userId}/skills`, {
        skillId: parseInt(selectedSkill),
        proficiencyLevel: proficiency
      });
      loadSkills();
      setShowAddModal(false);
      setSelectedSkill('');
      setProficiency('INTERMEDIATE');
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm('Remove this skill?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/profile/skills/${userSkillId}`);
      loadSkills();
    } catch (error) {
      alert('Failed to remove skill');
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      BEGINNER: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      INTERMEDIATE: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
      ADVANCED: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      EXPERT: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    };
    return colors[level] || 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
  };

  if (loading) return <div className="section-loading">Loading skills...</div>;

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3><i className="fi fi-rr-bulb"></i> Skills</h3>
        {isOwnProfile && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Skill
          </button>
        )}
      </div>
      
      <div className="skills-grid">
        {skills.length === 0 ? (
          <p className="empty-message">No skills added yet</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="skill-card-content">
                <div className="skill-info">
                  <span className="skill-name">{skill.skillName}</span>
                  <span 
                    className="skill-level" 
                    style={{ background: getProficiencyColor(skill.proficiencyLevel) }}
                  >
                    {skill.proficiencyLevel}
                  </span>
                </div>
                <span className="skill-category">{skill.categoryName}</span>
              </div>
              {isOwnProfile && (
                <button 
                  className="delete-btn-small" 
                  onClick={() => handleDeleteSkill(skill.id)}
                  title="Remove skill"
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
            <h3>Add Skill</h3>
            <select 
              value={selectedSkill} 
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="form-select"
            >
              <option value="">Select a skill</option>
              {allSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.categoryName})
                </option>
              ))}
            </select>
            
            <select 
              value={proficiency} 
              onChange={(e) => setProficiency(e.target.value)}
              className="form-select"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
            
            <div className="modal-actions">
              <button onClick={handleAddSkill} className="btn-primary">Add</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsSection;
