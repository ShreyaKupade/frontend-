import React, { useState, useEffect, useCallback } from 'react';
import { projectsAPI } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import './Projects.css';

const STATUS_OPTS = ['All', 'Not Started', 'In Progress', 'Revived', 'Abandoned'];
const SORT_OPTS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'upvotes', label: 'Most Upvoted' },
  { value: 'views', label: 'Most Viewed' },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('createdAt');
  const [total, setTotal] = useState(0);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (search) params.search = search;
      if (status !== 'All') params.status = status;
      const { data } = await projectsAPI.getAll(params);
      setProjects(data.projects);
      setTotal(data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  return (
    <div className="projects-page page-wrapper">
      <div className="container">
        <div className="projects-header animate-fade-up">
          <div>
            <h1 className="projects-title">
              Explore <span className="gradient-text">Projects</span>
            </h1>
            <p className="projects-subtitle">{total} projects waiting to be revived</p>
          </div>
        </div>

        <div className="filters-bar glass-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search projects, tech, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="filter-group">
            <div className="status-pills">
              {STATUS_OPTS.map(s => (
                <button
                  key={s}
                  className={`status-pill ${status === s ? 'active' : ''}`}
                  onClick={() => setStatus(s)}
                >{s}</button>
              ))}
            </div>

            <select
              className="form-select sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 300 }}>
            <div className="phoenix-loader"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state glass-card">
            <span className="empty-icon">🔍</span>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
