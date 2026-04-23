import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI, commentsAPI, contributionsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ProjectDetail.css';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Revived', 'Abandoned'];
const CONTRIB_TYPES = ['Bug Fix', 'Feature', 'Documentation', 'Design', 'Testing', 'Other'];
const statusClass = { 'Not Started': 'status-not-started', 'In Progress': 'status-in-progress', 'Revived': 'status-revived', 'Abandoned': 'status-abandoned' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [showContribForm, setShowContribForm] = useState(false);
  const [contribForm, setContribForm] = useState({ title: '', description: '', type: 'Feature', githubPR: '' });
  const [statusEdit, setStatusEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      projectsAPI.getOne(id),
      commentsAPI.get(id),
      contributionsAPI.get(id),
    ]).then(([p, c, co]) => {
      setProject(p.data.project);
      setComments(c.data.comments);
      setContributions(co.data.contributions);
    }).catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUpvote = async () => {
    if (!user) return navigate('/login');
    const { data } = await projectsAPI.upvote(id);
    setProject(prev => ({ ...prev, upvotes: Array(data.upvotes).fill('') }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await commentsAPI.add(id, commentText);
      setComments(prev => [data.comment, ...prev]);
      setCommentText('');
    } catch (err) { setError(err.response?.data?.message || 'Error posting comment'); }
  };

  const handleDeleteComment = async (commentId) => {
    await commentsAPI.delete(commentId);
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  const handleContrib = async (e) => {
    e.preventDefault();
    try {
      const { data } = await contributionsAPI.add(id, contribForm);
      setContributions(prev => [data.contribution, ...prev]);
      setShowContribForm(false);
      setContribForm({ title: '', description: '', type: 'Feature', githubPR: '' });
      setSuccess('Contribution submitted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Error submitting contribution'); }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await projectsAPI.update(id, { status: newStatus });
      setProject(data.project);
      setStatusEdit(false);
    } catch (err) { setError('Could not update status'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    await projectsAPI.delete(id);
    navigate('/projects');
  };

  const isOwner = user && project && project.owner._id === user._id;
  const isUpvoted = user && project && project.upvotes?.some(u => typeof u === 'string' ? u === user._id : u?._id === user._id);

  if (loading) return <div className="loading-screen"><div className="phoenix-loader"></div></div>;
  if (!project) return null;

  return (
    <div className="detail-page page-wrapper">
      <div className="container">
        {/* BACK */}
        <Link to="/projects" className="back-link">← Back to Projects</Link>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* HEADER */}
        <div className="detail-header glass-card animate-fade-up">
          <div className="detail-header-top">
            <div className="detail-badges">
              {statusEdit && isOwner ? (
                <div className="status-edit-dropdown">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} className={`status-opt-btn ${statusClass[s]}`} onClick={() => handleStatusUpdate(s)}>{s}</button>
                  ))}
                  <button className="btn btn-sm btn-secondary" onClick={() => setStatusEdit(false)}>Cancel</button>
                </div>
              ) : (
                <span className={`badge ${statusClass[project.status]}`} style={{ cursor: isOwner ? 'pointer' : 'default' }} onClick={() => isOwner && setStatusEdit(true)}>
                  {project.status} {isOwner && '✏️'}
                </span>
              )}
              {project.difficulty && <span className="badge badge-cool">{project.difficulty}</span>}
            </div>
            {isOwner && (
              <div className="owner-actions">
                <Link to={`/upload?edit=${id}`} className="btn btn-secondary btn-sm">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>

          <h1 className="detail-title">{project.title}</h1>

          <div className="detail-meta">
            <div className="detail-owner-info">
              <div className="owner-avatar lg">{project.owner?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="owner-name-lg">{project.owner?.name}</div>
                <div className="owner-role-lg">{project.owner?.role}</div>
              </div>
            </div>
            <div className="detail-stats">
              <button className={`stat-btn ${isUpvoted ? 'upvoted' : ''}`} onClick={handleUpvote}>
                🔺 {project.upvotes?.length || 0} Upvotes
              </button>
              <span className="stat-pill">👥 {project.contributors?.length || 0} Contributors</span>
              <span className="stat-pill">👁 {project.views} Views</span>
            </div>
          </div>

          <div className="detail-tech-row">
            {project.techStack.map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>

          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm github-btn">
              🐙 View on GitHub
            </a>
          )}
        </div>

        {/* TABS */}
        <div className="detail-tabs animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {['about', 'contributions', 'comments'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'about' && '📋'} {tab === 'contributions' && '⚡'} {tab === 'comments' && '💬'}
              {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'contributions' && <span className="tab-count">{contributions.length}</span>}
              {tab === 'comments' && <span className="tab-count">{comments.length}</span>}
            </button>
          ))}
        </div>

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="detail-body animate-fade">
            <div className="glass-card detail-desc-card">
              <h3 className="section-label">Description</h3>
              <p className="detail-description">{project.description}</p>
              {project.tags?.length > 0 && (
                <>
                  <div className="divider"></div>
                  <h3 className="section-label">Tags</h3>
                  <div className="tags-row">
                    {project.tags.map(t => <span key={t} className="badge badge-purple"># {t}</span>)}
                  </div>
                </>
              )}
            </div>
            {project.contributors?.length > 0 && (
              <div className="glass-card contributors-card">
                <h3 className="section-label">Contributors</h3>
                <div className="contributors-list">
                  {project.contributors.map(c => (
                    <div key={c._id} className="contributor-item">
                      <div className="owner-avatar">{c.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="owner-name">{c.name}</div>
                        <div className="owner-role">{c.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTRIBUTIONS TAB */}
        {activeTab === 'contributions' && (
          <div className="animate-fade">
            {user && (
              <div className="contrib-actions">
                <button className="btn btn-primary" onClick={() => setShowContribForm(!showContribForm)}>
                  {showContribForm ? 'Cancel' : '⚡ Submit Contribution'}
                </button>
              </div>
            )}
            {showContribForm && (
              <div className="glass-card contrib-form-card animate-fade-up">
                <h3 className="section-label">New Contribution</h3>
                <form onSubmit={handleContrib} className="contrib-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input className="form-input" placeholder="What did you contribute?" value={contribForm.title} onChange={e => setContribForm(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="form-select" value={contribForm.type} onChange={e => setContribForm(p => ({ ...p, type: e.target.value }))}>
                        {CONTRIB_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" placeholder="Describe your contribution..." value={contribForm.description} onChange={e => setContribForm(p => ({ ...p, description: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub PR Link (optional)</label>
                    <input className="form-input" placeholder="https://github.com/..." value={contribForm.githubPR} onChange={e => setContribForm(p => ({ ...p, githubPR: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" type="submit">Submit</button>
                </form>
              </div>
            )}
            {contributions.length === 0 ? (
              <div className="empty-state glass-card"><span className="empty-icon">⚡</span><h3>No contributions yet</h3><p>Be the first to contribute!</p></div>
            ) : (
              <div className="contribs-list">
                {contributions.map(c => (
                  <div key={c._id} className="glass-card contrib-card">
                    <div className="contrib-header">
                      <span className="badge badge-cool">{c.type}</span>
                      <span className={`badge ${c.status === 'Accepted' ? 'badge-green' : c.status === 'Rejected' ? 'badge-red' : 'badge-purple'}`}>{c.status}</span>
                    </div>
                    <h4 className="contrib-title">{c.title}</h4>
                    <p className="contrib-desc">{c.description}</p>
                    {c.githubPR && <a href={c.githubPR} target="_blank" rel="noreferrer" className="contrib-pr-link">🐙 View PR</a>}
                    <div className="contrib-meta">
                      <div className="owner-avatar sm">{c.contributor?.name?.[0]}</div>
                      <span className="contrib-author">{c.contributor?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="animate-fade">
            {user ? (
              <div className="glass-card comment-form-card">
                <form onSubmit={handleComment} className="comment-form">
                  <textarea className="form-textarea" placeholder="Share your thoughts or ideas..." value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} />
                  <button className="btn btn-primary btn-sm" type="submit" disabled={!commentText.trim()}>Post Comment</button>
                </form>
              </div>
            ) : (
              <div className="login-prompt glass-card">
                <p>Please <Link to="/login" className="link-fire">login</Link> to comment.</p>
              </div>
            )}
            {comments.length === 0 ? (
              <div className="empty-state glass-card"><span className="empty-icon">💬</span><h3>No comments yet</h3><p>Start the conversation!</p></div>
            ) : (
              <div className="comments-list">
                {comments.map(c => (
                  <div key={c._id} className="glass-card comment-card">
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="owner-avatar sm">{c.author?.name?.[0]}</div>
                        <div>
                          <span className="comment-name">{c.author?.name}</span>
                          <span className="comment-role">{c.author?.role}</span>
                        </div>
                      </div>
                      <div className="comment-right">
                        <span className="comment-time">{new Date(c.createdAt).toLocaleDateString()}</span>
                        {user && (user._id === c.author?._id || user.role === 'Admin') && (
                          <button className="delete-btn" onClick={() => handleDeleteComment(c._id)}>🗑</button>
                        )}
                      </div>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
