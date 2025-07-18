import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCharacters } from '../../contexts/CharacterContext';
import './Navigation.css';

const Navigation = ({ isOpen, onClose, isARPage }) => {
  const location = useLocation();
  const { getStats } = useCharacters();
  const stats = getStats();

  const navigationItems = [
    { path: '/', label: 'Gallery', icon: '🏛️', description: 'Browse all characters' },
    { path: '/ar', label: 'AR Experience', icon: '📱', description: 'Immersive AR viewing' },
  ];

  if (isARPage) {
    return (
      <nav className="ar-navigation">
        <Link to="/" className="ar-nav-link">
          <span className="ar-nav-icon">🏛️</span>
          <span className="ar-nav-text">Gallery</span>
        </Link>
      </nav>
    );
  }

  return (
    <>
      <div className={`navigation-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="navigation-header">
          <h2 className="navigation-title gradient-text">Navigation</h2>
          <button className="navigation-close" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="navigation-content">
          <div className="navigation-section">
            <h3 className="section-title">Main</h3>
            <ul className="navigation-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="navigation-item">
                  <Link 
                    to={item.path} 
                    className={`navigation-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="navigation-section">
            <h3 className="section-title">Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Characters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.available}</div>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.bodhisattvas}</div>
                <div className="stat-label">Bodhisattvas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.favorites}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>
          </div>

          <div className="navigation-section">
            <h3 className="section-title">About</h3>
            <div className="about-content">
              <p className="about-text">
                Experience the wisdom of the Stem Array Sutra through cutting-edge 
                3D visualization and augmented reality technology.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <span>3D Character Models</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <span>Advanced Search</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>AR Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;