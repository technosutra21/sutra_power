import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../../contexts/CharacterContext';
import { toast } from 'sonner';
import './CharacterDetail.css';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, toggleFavorite, favorites } = useCharacters();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const foundCharacter = getCharacterById(id);
    if (foundCharacter) {
      setCharacter(foundCharacter);
    } else {
      toast.error('Character not found');
      navigate('/');
    }
    setLoading(false);
  }, [id, getCharacterById, navigate]);

  const handleViewInAR = () => {
    if (character) {
      navigate(`/ar?model=${character.chapter}`);
    }
  };

  const handleToggleFavorite = () => {
    if (character) {
      toggleFavorite(character.id);
      toast.success(
        favorites.includes(character.id) 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${character.name} - Stem Array Sutra`,
          text: character.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      toast.error('Failed to share');
    }
  };

  if (loading) {
    return (
      <div className="character-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading character details...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="character-detail-error">
        <div className="error-icon">⚠️</div>
        <h2>Character Not Found</h2>
        <p>The requested character could not be found.</p>
        <button onClick={() => navigate('/')}>
          Return to Gallery
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(character.id);

  return (
    <div className="character-detail">
      {/* Header */}
      <div className="character-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Gallery
        </button>
        
        <div className="character-title-section">
          <h1 className="character-title">{character.name}</h1>
          <div className="character-meta">
            <span className="character-type">{character.type}</span>
            <span className="character-chapter">Chapter {character.chapter}</span>
            <span className={`character-status ${character.available ? 'available' : 'unavailable'}`}>
              {character.available ? 'Available' : 'Coming Soon'}
            </span>
          </div>
        </div>

        <div className="character-actions">
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button 
            className="share-button"
            onClick={handleShare}
          >
            📤
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="character-content">
        {/* Model Viewer */}
        <div className="character-model-section">
          <div className="model-container">
            <model-viewer
              src={character.modelUrl}
              alt={`3D model of ${character.name}`}
              auto-rotate
              camera-controls
              loading="lazy"
              style={{ width: '100%', height: '400px' }}
            />
          </div>
          <div className="model-actions">
            <button 
              className="ar-button"
              onClick={handleViewInAR}
              disabled={!character.available}
            >
              📱 View in AR
            </button>
          </div>
        </div>

        {/* Character Info */}
        <div className="character-info-section">
          {/* Navigation Tabs */}
          <div className="info-tabs">
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
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{character.description}</p>
                </div>
                
                <div className="location-section">
                  <h3>Location</h3>
                  <p>{character.location}</p>
                </div>
                
                <div className="tags-section">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {character.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spiritual' && (
              <div className="spiritual-content">
                <div className="attributes-section">
                  <h3>Spiritual Attributes</h3>
                  <ul>
                    {character.spiritualAttributes.map((attr, index) => (
                      <li key={index}>{attr}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="powers-section">
                  <h3>Special Powers</h3>
                  <ul>
                    {character.specialPowers.map((power, index) => (
                      <li key={index}>{power}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="experience-section">
                  <h3>Mystic Experience</h3>
                  <p>{character.mysticExperience}</p>
                </div>
              </div>
            )}

            {activeTab === 'physical' && (
              <div className="physical-content">
                <div className="description-section">
                  <h3>Physical Description</h3>
                  <p>{character.physicalDescription}</p>
                </div>
                
                <div className="appearance-section">
                  <h3>Key Features</h3>
                  <ul>
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
  );
};

export default CharacterDetail;