import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { textLoader, parseCharacterProfile, getCharacterFilename } from '../../utils/textLoader';
import CyberpunkLoader from '../CyberpunkLoader/CyberpunkLoader';
import './CharacterModal.css';

const CharacterModal = ({ 
  character, 
  isOpen, 
  onClose, 
  onViewInAR, 
  onViewDetails,
  onShare, 
  onFavorite,
  isFavorite,
  variant = 'cyberpunk'
}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && character) {
      loadCharacterProfile();
    }
  }, [isOpen, character]);

  const loadCharacterProfile = async () => {
    if (!character) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filename = getCharacterFilename(character.name);
      const textContent = await textLoader.loadText(filename);
      const parsed = parseCharacterProfile(textContent);
      setProfileData(parsed);
    } catch (err) {
      console.error('Error loading character profile:', err);
      setError('Failed to load character profile');
    } finally {
      setLoading(false);
    }
  };

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

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: -100,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  if (!isOpen || !character) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="character-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleBackdropClick}
      >
        <motion.div
          className={`character-modal ${variant}`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
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
              <motion.button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            {loading ? (
              <CyberpunkLoader 
                text="Loading Profile..." 
                size="medium" 
                variant="minimal" 
              />
            ) : error ? (
              <div className="error-content">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{error}</p>
                <button 
                  className="retry-btn"
                  onClick={loadCharacterProfile}
                >
                  Retry
                </button>
              </div>
            ) : (
              <motion.div
                className="content-container"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {activeTab === 'overview' && (
                  <motion.div className="overview-content" variants={itemVariants}>
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
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div className="profile-content" variants={itemVariants}>
                    {profileData ? (
                      <>
                        <div className="profile-section">
                          <h3>Location</h3>
                          <p>{profileData.location || character.location}</p>
                        </div>
                        
                        <div className="profile-section">
                          <h3>Physical Description</h3>
                          <p>{profileData.physicalDescription || character.physicalDescription}</p>
                        </div>
                        
                        <div className="profile-section">
                          <h3>Mystic Experience</h3>
                          <p>{profileData.mysticExperience || character.mysticExperience}</p>
                        </div>
                      </>
                    ) : (
                      <div className="default-profile">
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
                  </motion.div>
                )}

                {activeTab === 'powers' && (
                  <motion.div className="powers-content" variants={itemVariants}>
                    <h3>Special Powers</h3>
                    <div className="powers-grid">
                      {(profileData?.specialPowers || character.specialPowers || []).map((power, index) => (
                        <div key={index} className="power-item">
                          <div className="power-icon">⚡</div>
                          <div className="power-text">{power}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'spiritual' && (
                  <motion.div className="spiritual-content" variants={itemVariants}>
                    <h3>Spiritual Attributes</h3>
                    <div className="spiritual-grid">
                      {(profileData?.spiritualAttributes || character.spiritualAttributes || []).map((attr, index) => (
                        <div key={index} className="spiritual-item">
                          <div className="spiritual-icon">🧘</div>
                          <div className="spiritual-text">{attr}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <motion.button
              className="action-btn primary"
              onClick={() => handleActionClick(onViewDetails)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Full Profile
            </motion.button>
            
            {character.available && (
              <motion.button
                className="action-btn secondary"
                onClick={() => handleActionClick(onViewInAR)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Experience in AR
              </motion.button>
            )}
            
            <motion.button
              className="action-btn tertiary"
              onClick={() => handleActionClick(onShare)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share Character
            </motion.button>
          </div>

          {/* Holographic Effects */}
          <div className="modal-holo-effects">
            <div className="holo-line holo-line-1" />
            <div className="holo-line holo-line-2" />
            <div className="holo-particle-system">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`holo-particle holo-particle-${i + 1}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CharacterModal;