import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    getStats
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('chapter');

  const stats = getStats();

  // Sort characters
  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
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

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleViewInAR = (character) => {
    navigate(`/ar?model=${character.chapter}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleShare = async (character) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${character.name} - Universal Wisdom`,
          text: character.description,
          url: `${window.location.origin}/character/${character.id}`
        });
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/character/${character.id}`
        );
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to share character');
    }
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading character profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Characters</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Universal Wisdom</span>
            <span className="hero-subtitle">Sacred Character Gallery</span>
          </h1>
          <p className="hero-description">
            Explore profound wisdom through 56 interactive 3D character profiles, 
            each representing unique aspects of enlightenment and spiritual transformation.
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
        />
      </section>

      {/* Character Grid */}
      <section className="gallery-content">
        {sortedCharacters.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No characters found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className={`character-grid ${viewMode}`}>
            {sortedCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character)}
                onViewInAR={() => handleViewInAR(character)}
                onShare={() => handleShare(character)}
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
          onShare={() => handleShare(selectedCharacter)}
        />
      )}
    </div>
  );
};

export default Gallery;