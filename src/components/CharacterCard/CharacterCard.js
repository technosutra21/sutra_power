import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CharacterCard.css';

const CharacterCard = ({ 
  character, 
  onClick, 
  onViewInAR, 
  onViewDetails,
  onShare, 
  onFavorite,
  isFavorite,
  index = 0,
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(character);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      className={`character-card cyberpunk ${viewMode} ${character.available ? 'available' : 'unavailable'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="card-container">
        {/* Card Background */}
        <div className="card-background" />
        
        {/* Holographic Border */}
        <div className="holo-border-effect" />
        
        {/* Character Image */}
        <div className="character-image-container">
          <img
            src={character.imageUrl || `/images/placeholder-${character.id}.jpg`}
            alt={character.name}
            className="character-image"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/images/placeholder-character.jpg';
              setImageLoaded(true);
            }}
          />
          
          {/* Loading Placeholder */}
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="placeholder-icon">🧘</div>
              <div className="placeholder-text">Loading...</div>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => handleActionClick(e, onFavorite)}
          >
            {isFavorite ? '💛' : '🤍'}
          </button>
          
          {/* Status Badge */}
          <div className={`status-badge ${character.available ? 'available' : 'unavailable'}`}>
            {character.available ? '✓' : '🔒'}
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="character-header">
            <h3 className="character-name">{character.name}</h3>
            <span className="character-type">{character.type}</span>
            <span className="character-chapter">Chapter {character.chapter}</span>
          </div>

          <p className="character-description">
            {character.description}
          </p>

          {/* Character Tags */}
          <div className="character-tags">
            {character.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="character-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Character Stats */}
          <div className="character-stats">
            <div className="stat-item">
              <span className="stat-label">Powers</span>
              <span className="stat-value">{character.specialPowers?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Attributes</span>
              <span className="stat-value">{character.spiritualAttributes?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isHovered && (
          <div className="card-actions">
            <button
              className="action-btn primary"
              onClick={(e) => handleActionClick(e, onViewDetails)}
            >
              View Details
            </button>
            
            {character.available && (
              <button
                className="action-btn secondary"
                onClick={(e) => handleActionClick(e, onViewInAR)}
              >
                AR View
              </button>
            )}
            
            <button
              className="action-btn tertiary"
              onClick={(e) => handleActionClick(e, onShare)}
            >
              Share
            </button>
          </div>
        )}

        {/* Scan Line Effect */}
        <div className="scan-line" />
      </div>
    </motion.div>
  );
};

export default CharacterCard;