import React from 'react';
import './StatsDisplay.css';

const StatsDisplay = ({ stats }) => {
  const statsItems = [
    {
      label: 'Total Characters',
      value: stats.total,
      icon: '🌟',
      color: 'var(--primary-violet)'
    },
    {
      label: 'Available',
      value: stats.available,
      icon: '✅',
      color: 'var(--primary-emerald)'
    },
    {
      label: 'Bodhisattvas',
      value: stats.bodhisattvas,
      icon: '🧘',
      color: 'var(--primary-cyan)'
    },
    {
      label: 'Completion',
      value: `${stats.completionRate}%`,
      icon: '📈',
      color: 'var(--primary-gold)'
    },
    {
      label: 'Favorites',
      value: stats.favorites,
      icon: '❤️',
      color: 'var(--primary-rose)'
    }
  ];

  return (
    <div className="stats-display">
      <div className="stats-grid">
        {statsItems.map((item, index) => (
          <div 
            key={item.label}
            className="stat-card"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              '--accent-color': item.color
            }}
          >
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
            <div className="stat-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;