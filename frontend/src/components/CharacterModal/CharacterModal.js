import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCharacters } from '../../contexts/CharacterContext';
import './CharacterModal.css';

const CharacterModal = ({ 
  character, 
  isOpen, 
  onClose, 
  onViewInAR, 
  onShare 
}) => {
  const { favorites, toggleFavorite } = useCharacters();
  const [activeTab, setActiveTab] = useState('overview');
  const [isClosing, setIsClosing] = useState(false);

  const isFavorite = favorites.includes(character.id);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(character.id);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`character-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`character-modal ${isClosing ? 'closing' : ''}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{character.name}</h2>
            <div className="modal-meta">
              <span className="modal-type">{character.type}</span>
              <span className="modal-chapter">Chapter {character.chapter}</span>
              <span className={`modal-status ${character.available ? 'available' : 'unavailable'}`}>
                {character.available ? 'Available' : 'Coming Soon'}
              </span>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className={`modal-favorite ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button 
              className="modal-share"
              onClick={onShare}
              aria-label="Share character"
            >
              📤
            </button>
            <button 
              className="modal-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* 3D Model */}
          <div className="modal-model-section">
            <div className="modal-model-container">
              {character.available ? (
                <model-viewer
                  src={character.modelUrl}
                  alt={`3D model of ${character.name}`}
                  auto-rotate
                  camera-controls
                  loading="lazy"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div className="modal-model-placeholder">
                  <div className="placeholder-icon">🔮</div>
                  <p>3D Model Coming Soon</p>
                </div>
              )}
            </div>
            <div className="modal-model-actions">
              <button 
                className="modal-ar-button"
                onClick={onViewInAR}
                disabled={!character.available}
              >
                <span className="ar-icon">📱</span>
                View in AR
              </button>
            </div>
          </div>

          {/* Character Info */}
          <div className="modal-info-section">
            {/* Tabs */}
            <div className="modal-tabs">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'spiritual' ? 'active' : ''}`}
                onClick={() => setActiveTab('spiritual')}
              >
                Spiritual
              </button>
              <button 
                className={`tab-button ${activeTab === 'physical' ? 'active' : ''}`}
                onClick={() => setActiveTab('physical')}
              >
                Physical
              </button>
            </div>

            {/* Tab Content */}
            <div className="modal-tab-content">
              {activeTab === 'overview' && (
                <div className="tab-content-overview">
                  <div className="info-section">
                    <h3>Description</h3>
                    <p>{character.description}</p>
                  </div>
                  
                  <div className="info-section">
                    <h3>Location</h3>
                    <p>{character.location}</p>
                  </div>
                  
                  <div className="info-section">
                    <h3>Attributes</h3>
                    <div className="tags-container">
                      {character.tags.map((tag, index) => (
                        <span key={index} className="info-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'spiritual' && (
                <div className="tab-content-spiritual">
                  <div className="info-section">
                    <h3>Spiritual Attributes</h3>
                    <ul className="attribute-list">
                      {character.spiritualAttributes.map((attr, index) => (
                        <li key={index}>{attr}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="info-section">
                    <h3>Special Powers</h3>
                    <ul className="attribute-list">
                      {character.specialPowers.map((power, index) => (
                        <li key={index}>{power}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="info-section">
                    <h3>Mystic Experience</h3>
                    <p>{character.mysticExperience}</p>
                  </div>
                </div>
              )}

              {activeTab === 'physical' && (
                <div className="tab-content-physical">
                  <div className="info-section">
                    <h3>Physical Description</h3>
                    <p>{character.physicalDescription}</p>
                  </div>
                  
                  <div className="info-section">
                    <h3>Appearance Features</h3>
                    <ul className="attribute-list">
                      <li>Traditional Buddhist iconography</li>
                      <li>Symbolic colors and ornaments</li>
                      <li>Meditation posture variations</li>
                      <li>Sacred gestures (mudras)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CharacterModal;