import React, { useState } from 'react';
import { useCharacters } from '../../contexts/CharacterContext';
import './CharacterCard.css';

const CharacterCard = ({ 
  character, 
  onClick, 
  onViewInAR, 
  onShare, 
  index, 
  viewMode = 'grid' 
}) => {
  const { favorites, toggleFavorite } = useCharacters();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [modelError, setModelError] = useState(false);

  const isFavorite = favorites.includes(character.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(character.id);
  };

  const handleARClick = (e) => {
    e.stopPropagation();
    if (character.available) {
      onViewInAR();
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare();
  };

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  const handleModelError = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className={`character-card ${viewMode} ${!character.available ? 'unavailable' : ''}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="character-info">
          <h3 className="character-name">{character.name}</h3>
          <p className="character-type">{character.type}</p>
          <span className="character-chapter">Chapter {character.chapter}</span>
        </div>
        <div className="card-actions">
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            className="share-btn"
            onClick={handleShareClick}
            aria-label="Share character"
          >
            📤
          </button>
        </div>
      </div>

      {/* 3D Model Viewer */}
      <div className="model-container">
        {isLoading && (
          <div className="model-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {character.available ? (
          <model-viewer
            src={character.modelUrl}
            alt={`3D model of ${character.name}`}
            auto-rotate
            loading="lazy"
            onLoad={handleModelLoad}
            onError={handleModelError}
            style={{
              width: '100%',
              height: '200px',
              background: 'transparent'
            }}
          />
        ) : (
          <div className="model-placeholder">
            <div className="placeholder-icon">🔮</div>
            <p>Coming Soon</p>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="character-tags">
          {character.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        
        <p className="character-description">
          {character.description.length > 120 
            ? `${character.description.substring(0, 120)}...` 
            : character.description}
        </p>

        {character.location && (
          <div className="character-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{character.location}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <button 
          className="view-details-btn"
          onClick={onClick}
        >
          View Details
        </button>
        <button 
          className={`ar-btn ${!character.available ? 'disabled' : ''}`}
          onClick={handleARClick}
          disabled={!character.available}
        >
          <span className="ar-icon">📱</span>
          AR View
        </button>
      </div>

      {/* Availability Status */}
      <div className={`availability-status ${character.available ? 'available' : 'unavailable'}`}>
        {character.available ? '✅' : '⏳'}
      </div>

      {/* Hover Effects */}
      <div className="card-glow"></div>
    </div>
  );
};

export default CharacterCard;