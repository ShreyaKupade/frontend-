import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import './Home.css';

const stats = [
  { value: '500+', label: 'Projects Uploaded', icon: '📁' },
  { value: '1.2K', label: 'Contributors', icon: '👥' },
  { value: '340', label: 'Projects Revived', icon: '🔥' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
];

const features = [
  { icon: '💀', title: 'Find Dead Projects', desc: 'Browse abandoned codebases with potential waiting to be unlocked.' },
  { icon: '⚡', title: 'Ignite Collaboration', desc: 'Connect with developers who can breathe life into dormant ideas.' },
  { icon: '🚀', title: 'Ship Together', desc: 'Track progress, manage contributions, and celebrate revivals.' },
  { icon: '🏆', title: 'Build Your Legacy', desc: 'Earn recognition for reviving projects and making an impact.' },
];

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll({ sort: 'upvotes' })
      .then(({ data }) => setFeaturedProjects(data.projects.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page page-wrapper">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-fade-up">
            <span className="hero-badge-dot"></span>
            Dead Projects Revival Platform
          </div>

          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Give Dead Projects<br />
            <span className="gradient-text">A Second Life</span>
          </h1>

          <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
            ProjectPhoenix connects abandoned codebases with passionate developers.
            Upload your forgotten projects or collaborate to revive others.
          </p>

          <div className="hero-cta animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/projects" className="btn btn-primary btn-lg">
              🔥 Explore Projects
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-lg">
              Join the Community
            </Link>
          </div>

          <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-icon">{s.icon}</span>
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why ProjectPhoenix?</span>
            <h2 className="section-title">Revive. Collaborate. <span className="gradient-text">Ship.</span></h2>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">🔥 Hot Right Now</span>
            <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
          </div>
          {loading ? (
            <div className="loading-screen" style={{ minHeight: 200 }}>
              <div className="phoenix-loader"></div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <>
              <div className="projects-grid">
                {featuredProjects.map((p, i) => (
                  <ProjectCard key={p._id} project={p} index={i} />
                ))}
              </div>
              <div className="view-all-row">
                <Link to="/projects" className="btn btn-secondary">View All Projects →</Link>
              </div>
            </>
          ) : (
            <div className="empty-state glass-card">
              <span className="empty-icon">💀</span>
              <h3>No projects yet</h3>
              <p>Be the first to upload a dead project!</p>
              <Link to="/upload" className="btn btn-primary">Upload Project</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-glow"></div>
            <h2 className="cta-title">Ready to Rise from the Ashes?</h2>
            <p className="cta-desc">Join thousands of developers who are breathing new life into forgotten code.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">🔥 Start Now — It's Free</Link>
              <Link to="/projects" className="btn btn-secondary btn-lg">Browse Projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
