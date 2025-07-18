import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CharacterModal.css';

const CharacterModal = ({ 
  character, 
  isOpen, 
  onClose, 
  onViewInAR, 
  onViewDetails,
  onShare, 
  onFavorite,
  isFavorite
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActionClick = (action) => {
    action();
    onClose();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👁️' },
    { id: 'profile', label: 'Profile', icon: '📋' },
    { id: 'powers', label: 'Powers', icon: '⚡' },
    { id: 'spiritual', label: 'Spiritual', icon: '🧘' },
  ];

  if (!isOpen || !character) return null;

  return (
    <motion.div
      className="character-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        className="character-modal cyberpunk"
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -100 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="character-avatar">
              <img 
                src={character.imageUrl || `/images/placeholder-${character.id}.jpg`}
                alt={character.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-character.jpg';
                }}
              />
              <div className="avatar-glow" />
            </div>
            <div className="character-info">
              <h2 className="character-name">{character.name}</h2>
              <p className="character-type">{character.type}</p>
              <p className="character-chapter">Chapter {character.chapter}</p>
            </div>
            <button 
              className="favorite-btn"
              onClick={() => onFavorite(character)}
            >
              {isFavorite ? '💛' : '🤍'}
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <div className="content-container">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{character.description}</p>
                </div>
                
                <div className="stats-section">
                  <h3>Statistics</h3>
                  <div className="stat-grid">
                    <div className="stat-item">
                      <span className="stat-label">Type</span>
                      <span className="stat-value">{character.type}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Chapter</span>
                      <span className="stat-value">{character.chapter}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <span className={`stat-value ${character.available ? 'available' : 'unavailable'}`}>
                        {character.available ? 'Available' : 'Locked'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="tags-section">
                  <h3>Attributes</h3>
                  <div className="tag-list">
                    {character.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-content">
                <div className="profile-section">
                  <h3>Location</h3>
                  <p>{character.location}</p>
                </div>
                
                <div className="profile-section">
                  <h3>Physical Description</h3>
                  <p>{character.physicalDescription}</p>
                </div>
                
                <div className="profile-section">
                  <h3>Mystic Experience</h3>
                  <p>{character.mysticExperience}</p>
                </div>
              </div>
            )}

            {activeTab === 'powers' && (
              <div className="powers-content">
                <h3>Special Powers</h3>
                <div className="powers-grid">
                  {(character.specialPowers || []).map((power, index) => (
                    <div key={index} className="power-item">
                      <div className="power-icon">⚡</div>
                      <div className="power-text">{power}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spiritual' && (
              <div className="spiritual-content">
                <h3>Spiritual Attributes</h3>
                <div className="spiritual-grid">
                  {(character.spiritualAttributes || []).map((attr, index) => (
                    <div key={index} className="spiritual-item">
                      <div className="spiritual-icon">🧘</div>
                      <div className="spiritual-text">{attr}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            className="action-btn primary"
            onClick={() => handleActionClick(onViewDetails)}
          >
            View Full Profile
          </button>
          
          {character.available && (
            <button
              className="action-btn secondary"
              onClick={() => handleActionClick(onViewInAR)}
            >
              Experience in AR
            </button>
          )}
          
          <button
            className="action-btn tertiary"
            onClick={() => handleActionClick(onShare)}
          >
            Share Character
          </button>
        </div>

        {/* Holographic Effects */}
        <div className="modal-holo-effects">
          <div className="holo-line holo-line-1" />
          <div className="holo-line holo-line-2" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CharacterModal;