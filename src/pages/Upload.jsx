import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import './Upload.css';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['Not Started', 'In Progress', 'Abandoned'];

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', techStack: '', status: 'Not Started',
    difficulty: 'Intermediate', githubUrl: '', tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const { data } = await projectsAPI.create(payload);
      navigate(`/projects/${data.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.description.length;

  return (
    <div className="upload-page page-wrapper">
      <div className="container upload-container">
        <div className="upload-left animate-fade-up">
          <div className="upload-intro">
            <span className="section-eyebrow">Share Your Story</span>
            <h1 className="upload-title">Upload a <span className="gradient-text">Dead Project</span></h1>
            <p className="upload-subtitle">
              Every abandoned project has a story. Share yours and find the collaborators who can bring it back to life.
            </p>
          </div>
          <div className="upload-tips">
            <h3 className="tips-title">Tips for a great listing</h3>
            {[
              { icon: '📝', tip: 'Write a clear, detailed description explaining why the project was abandoned.' },
              { icon: '🛠', tip: 'List all tech stack items separated by commas for better discoverability.' },
              { icon: '🏷', tip: 'Add relevant tags to help contributors find your project.' },
              { icon: '🐙', tip: 'Link to your GitHub repo for contributors to explore the codebase.' },
            ].map((t, i) => (
              <div key={i} className="tip-item">
                <span className="tip-icon">{t.icon}</span>
                <span className="tip-text">{t.tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="upload-form-wrap animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="glass-card upload-form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Project Details</h2>
              <p className="form-card-sub">Fill in the details to upload your project</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input className="form-input" name="title" placeholder="e.g. AI-Powered Inventory Manager" value={form.title} onChange={handle} required maxLength={100} />
              </div>

              <div className="form-group">
                <label className="form-label">Description * <span className="char-count">{charCount}/2000</span></label>
                <textarea className="form-textarea" name="description" placeholder="Explain what the project does, why it was abandoned, and what needs to be done to revive it..." value={form.description} onChange={handle} required maxLength={2000} rows={5} />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handle}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" name="difficulty" value={form.difficulty} onChange={handle}>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tech Stack * <span className="form-hint">comma-separated</span></label>
                <input className="form-input" name="techStack" placeholder="React, Node.js, MongoDB, Express..." value={form.techStack} onChange={handle} required />
                {form.techStack && (
                  <div className="tech-preview">
                    {form.techStack.split(',').filter(t => t.trim()).map((t, i) => (
                      <span key={i} className="tech-tag">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Tags <span className="form-hint">comma-separated</span></label>
                <input className="form-input" name="tags" placeholder="web, mobile, ai, machine-learning..." value={form.tags} onChange={handle} />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub URL <span className="form-hint">optional</span></label>
                <input className="form-input" name="githubUrl" type="url" placeholder="https://github.com/username/repo" value={form.githubUrl} onChange={handle} />
              </div>

              <button className="btn btn-primary upload-submit-btn" type="submit" disabled={loading}>
                {loading ? <><span className="phoenix-loader" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Uploading...</> : '🔥 Upload Project'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
