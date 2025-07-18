import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCharacters } from '../../contexts/CharacterContext';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import StatsDisplay from '../../components/StatsDisplay/StatsDisplay';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import { toast } from 'sonner';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const { 
    filteredCharacters, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    selectedFilter, 
    setSelectedFilter,
    getStats,
    favorites,
    toggleFavorite
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('chapter');
  const [showStats, setShowStats] = useState(true);

  const stats = getStats();

  // Sort characters
  const sortedCharacters = useMemo(() => {
    return [...filteredCharacters].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'chapter':
          return a.chapter - b.chapter;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [filteredCharacters, sortBy]);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleViewInAR = (character) => {
    navigate(`/ar?model=${character.chapter}`);
  };

  const handleViewDetails = (character) => {
    navigate(`/character/${character.id}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleShare = async (character) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${character.name} - Stem Array Sutra`,
          text: character.description,
          url: `${window.location.origin}/character/${character.id}`
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/character/${character.id}`
        );
        toast.success('🔗 Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('❌ Failed to share character');
    }
  };

  const handleFavorite = (character) => {
    toggleFavorite(character.id);
    const isFavorited = favorites.includes(character.id);
    toast.success(
      isFavorited ? 
      `💙 ${character.name} removed from favorites` : 
      `💛 ${character.name} added to favorites`
    );
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="cyber-loading-spinner"></div>
        <p className="cyber-loading-text">Loading Sacred Profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <div className="cyber-error">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">System Error</h2>
          <p className="error-message">{error}</p>
          <button
            className="cyber-button"
            onClick={() => window.location.reload()}
          >
            Reinitialize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="cyber-title">Stem Array Sutra</span>
            <span className="cyber-subtitle">Sacred Character Gallery</span>
          </h1>
          
          <p className="hero-description">
            Explore the profound wisdom of the Avatamsaka Sutra through 56 interactive 
            3D character profiles, each representing a unique aspect of Buddhist enlightenment.
          </p>
          
          <StatsDisplay stats={stats} />
        </div>
        
        <div className="hero-decoration">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="gallery-controls">
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showStats={showStats}
          onStatsToggle={setShowStats}
        />
      </section>

      {/* Character Grid */}
      <section className="gallery-content">
        {sortedCharacters.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No Sacred Characters Found</h3>
            <p className="no-results-message">
              Try adjusting your search terms or filters
            </p>
            <button
              className="cyber-button"
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`character-grid ${viewMode}`}>
            {sortedCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character)}
                onViewInAR={() => handleViewInAR(character)}
                onViewDetails={() => handleViewDetails(character)}
                onShare={() => handleShare(character)}
                onFavorite={() => handleFavorite(character)}
                isFavorite={favorites.includes(character.id)}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Character Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onViewInAR={() => handleViewInAR(selectedCharacter)}
          onViewDetails={() => handleViewDetails(selectedCharacter)}
          onShare={() => handleShare(selectedCharacter)}
          onFavorite={() => handleFavorite(selectedCharacter)}
          isFavorite={favorites.includes(selectedCharacter.id)}
        />
      )}
    </div>
  );
};

export default Gallery;