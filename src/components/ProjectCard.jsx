import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

const statusConfig = {
  'Not Started': { class: 'status-not-started', icon: '⏸', label: 'Not Started' },
  'In Progress': { class: 'status-in-progress', icon: '⚡', label: 'In Progress' },
  'Revived': { class: 'status-revived', icon: '🔥', label: 'Revived' },
  'Abandoned': { class: 'status-abandoned', icon: '💀', label: 'Abandoned' },
};

const difficultyColors = {
  Beginner: 'badge-green',
  Intermediate: 'badge-cool',
  Advanced: 'badge-red',
};

export default function ProjectCard({ project, index = 0 }) {
  const status = statusConfig[project.status] || statusConfig['Not Started'];
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <Link
      to={`/projects/${project._id}`}
      className="project-card glass-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="card-glow-line"></div>

      <div className="card-header">
        <div className="card-status-row">
          <span className={`badge ${status.class}`}>{status.icon} {status.label}</span>
          {project.difficulty && (
            <span className={`badge ${difficultyColors[project.difficulty]}`}>{project.difficulty}</span>
          )}
        </div>
        <div className="card-meta-time">{timeAgo(project.createdAt)}</div>
      </div>

      <h3 className="card-title">{project.title}</h3>
      <p className="card-description">{project.description.slice(0, 120)}{project.description.length > 120 ? '…' : ''}</p>

      <div className="card-tech-row">
        {project.techStack.slice(0, 4).map(tech => (
          <span key={tech} className="tech-tag">{tech}</span>
        ))}
        {project.techStack.length > 4 && (
          <span className="tech-tag">+{project.techStack.length - 4}</span>
        )}
      </div>

      <div className="card-footer">
        <div className="card-owner">
          <div className="owner-avatar">{project.owner?.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="owner-info">
            <span className="owner-name">{project.owner?.name || 'Unknown'}</span>
            <span className="owner-role">{project.owner?.role || 'Student'}</span>
          </div>
        </div>
        <div className="card-stats">
          <span className="stat-item">🔺 {project.upvotes?.length || 0}</span>
          <span className="stat-item">👥 {project.contributors?.length || 0}</span>
          <span className="stat-item">👁 {project.views || 0}</span>
        </div>
      </div>
    </Link>
  );
}
