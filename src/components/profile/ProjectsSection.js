import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import '../css/ProfileSections.css';

function ProjectsSection({ userId, isOwnProfile }) {
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!formData.title) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/profile/${userId}/projects`, formData);
      loadProjects();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      alert('Failed to add project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/profile/projects/${projectId}`);
      loadProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      demoUrl: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) return <div className="section-loading">Loading projects...</div>;

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3><i className="fi fi-rr-laptop-code"></i> Projects</h3>
        {isOwnProfile && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Project
          </button>
        )}
      </div>
      
      <div className="projects-list">
        {projects.length === 0 ? (
          <p className="empty-message">No projects added yet</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.title}</h4>
                {isOwnProfile && (
                  <button 
                    className="delete-btn-small" 
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                )}
              </div>
              
              {project.description && <p className="project-description">{project.description}</p>}
              
              {project.techStack && (
                <div className="tech-stack">
                  {project.techStack.split(',').map((tech, index) => (
                    <span key={index} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
              )}
              
              <div className="project-links">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <i className="fi fi-brands-github"></i> GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <i className="fi fi-rr-link"></i> Live Demo
                  </a>
                )}
              </div>
              
              {(project.startDate || project.endDate) && (
                <div className="project-dates">
                  <i className="fi fi-rr-calendar"></i>
                  {project.startDate && new Date(project.startDate).toLocaleDateString()}
                  {project.startDate && project.endDate && ' - '}
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Project</h3>
            
            <input 
              type="text"
              placeholder="Project title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="form-input"
            />
            
            <textarea 
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-textarea"
              rows="3"
            />
            
            <input 
              type="text"
              placeholder="Tech stack (comma separated)"
              value={formData.techStack}
              onChange={(e) => setFormData({...formData, techStack: e.target.value})}
              className="form-input"
            />
            
            <input 
              type="url"
              placeholder="GitHub URL"
              value={formData.githubUrl}
              onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              className="form-input"
            />
            
            <input 
              type="url"
              placeholder="Demo URL"
              value={formData.demoUrl}
              onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
              className="form-input"
            />
            
            <div className="date-row">
              <input 
                type="date"
                placeholder="Start date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="form-input"
              />
              <input 
                type="date"
                placeholder="End date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={handleAddProject} className="btn-primary">Add Project</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsSection;
