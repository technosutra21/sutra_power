import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCharacters } from '../../contexts/CharacterContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

const Header = ({ onMenuToggle, showNavigation }) => {
  const location = useLocation();
  const { getStats } = useCharacters();
  const { theme } = useTheme();
  const stats = getStats();

  return (
    <header className="header glass">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <div className="logo-icon">
              <span className="logo-symbol">🧘</span>
            </div>
            <div className="logo-text">
              <span className="logo-title gradient-text">Stem Array</span>
              <span className="logo-subtitle">Sutra Experience</span>
            </div>
          </Link>
        </div>

        <div className="header-center">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.available}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.completionRate}%</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.favorites}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <nav className="header-nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">🏛️</span>
              Gallery
            </Link>
            <Link 
              to="/ar" 
              className={`nav-link ${location.pathname === '/ar' ? 'active' : ''}`}
            >
              <span className="nav-icon">📱</span>
              AR View
            </Link>
          </nav>

          <ThemeToggle />

          <button 
            className="menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger ${showNavigation ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;