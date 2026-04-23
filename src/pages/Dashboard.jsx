import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('my');

  useEffect(() => {
    Promise.all([
      projectsAPI.getMy(),
      projectsAPI.getAll({ sort: 'createdAt' })
    ]).then(([my, all]) => {
      setProjects(my.data.projects);
      setAllProjects(all.data.projects);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: projects.length,
    revived: projects.filter(p => p.status === 'Revived').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    totalUpvotes: projects.reduce((acc, p) => acc + (p.upvotes?.length || 0), 0),
  };

  const displayed = activeView === 'my' ? projects : allProjects;

  return (
    <div className="dashboard-page page-wrapper">
      <div className="container">
        {/* WELCOME */}
        <div className="dash-welcome animate-fade-up">
          <div className="welcome-left">
            <div className="welcome-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <h1 className="welcome-title">Hey, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="welcome-sub">
                <span className={`role-badge role-badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
                {user?.email}
              </p>
            </div>
          </div>
          <Link to="/upload" className="btn btn-primary">🔥 Upload Project</Link>
        </div>

        {/* STATS */}
        <div className="dash-stats animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'My Projects', value: stats.total, icon: '📁', color: 'fire' },
            { label: 'Revived', value: stats.revived, icon: '🔥', color: 'green' },
            { label: 'In Progress', value: stats.inProgress, icon: '⚡', color: 'cyan' },
            { label: 'Total Upvotes', value: stats.totalUpvotes, icon: '🔺', color: 'purple' },
          ].map((s, i) => (
            <div key={i} className={`stat-card glass-card stat-${s.color}`}>
              <span className="stat-card-icon">{s.icon}</span>
              <span className="stat-card-value">{s.value}</span>
              <span className="stat-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* PROJECTS */}
        <div className="dash-projects-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="dash-section-header">
            <div className="dash-tabs">
              <button className={`tab-btn ${activeView === 'my' ? 'active' : ''}`} onClick={() => setActiveView('my')}>
                My Projects <span className="tab-count">{projects.length}</span>
              </button>
              <button className={`tab-btn ${activeView === 'all' ? 'active' : ''}`} onClick={() => setActiveView('all')}>
                All Projects <span className="tab-count">{allProjects.length}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-screen" style={{ minHeight: 200 }}>
              <div className="phoenix-loader"></div>
            </div>
          ) : displayed.length === 0 ? (
            <div className="empty-state glass-card">
              <span className="empty-icon">{activeView === 'my' ? '📁' : '🔍'}</span>
              <h3>{activeView === 'my' ? 'No projects yet' : 'No projects found'}</h3>
              {activeView === 'my' && (
                <>
                  <p>Upload your first dead project and start reviving!</p>
                  <Link to="/upload" className="btn btn-primary">Upload Project</Link>
                </>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {displayed.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
