import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ROLES = ['Student', 'Contributor'];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-bg-orb auth-orb-1"></div>
      <div className="auth-bg-orb auth-orb-2"></div>

      <div className="auth-container">
        <div className="auth-card glass-card animate-fade-up">
          <div className="auth-header">
            <div className="auth-logo">🔥</div>
            <h1 className="auth-title">Join ProjectPhoenix</h1>
            <p className="auth-sub">Create your account and start reviving projects</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handle} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-selector">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`role-btn ${form.role === r ? 'active' : ''}`}
                    onClick={() => setForm(p => ({ ...p, role: r }))}
                  >
                    {r === 'Student' ? '🎓' : '⚡'} {r}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? <span className="phoenix-loader" style={{ width: 18, height: 18, borderWidth: 2 }}></span> : '🚀 Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="link-fire">Sign in →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
