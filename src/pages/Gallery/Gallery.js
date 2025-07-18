import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCharacters } from '../../contexts/CharacterContext';
import CyberpunkBackground from '../../components/CyberpunkBackground/CyberpunkBackground';
import CyberpunkLoader from '../../components/CyberpunkLoader/CyberpunkLoader';
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

  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const stats = getStats();

  // Sort characters with memoization for performance
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
    navigate(`/ar?model=${character.chapter}`, { 
      state: { character } 
    });
  };

  const handleViewDetails = (character) => {
    navigate(`/character/${character.id}`, { 
      state: { character } 
    });
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  if (loading) {
    return (
      <CyberpunkBackground variant="gallery">
        <div className="gallery-loading">
          <CyberpunkLoader 
            text="Loading Sacred Profiles..." 
            size="large" 
            variant="holographic" 
          />
        </div>
      </CyberpunkBackground>
    );
  }

  if (error) {
    return (
      <CyberpunkBackground variant="gallery">
        <div className="gallery-error">
          <motion.div 
            className="error-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">System Error</h2>
            <p className="error-message">{error}</p>
            <motion.button
              className="cyber-button"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reinitialize
            </motion.button>
          </motion.div>
        </div>
      </CyberpunkBackground>
    );
  }

  return (
    <CyberpunkBackground variant="gallery">
      <div className="gallery">
        {/* Hero Section */}
        <motion.section 
          className="gallery-hero"
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="cyber-title">Stem Array Sutra</span>
              <span className="cyber-subtitle">Sacred Character Gallery</span>
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Explore the profound wisdom of the Avatamsaka Sutra through 56 interactive 
              3D character profiles, each representing a unique aspect of Buddhist enlightenment.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <StatsDisplay stats={stats} />
            </motion.div>
          </div>
          
          <div className="hero-decoration">
            <motion.div 
              className="hero-orb hero-orb-1"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div 
              className="hero-orb hero-orb-2"
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div 
              className="hero-orb hero-orb-3"
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1] 
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>
        </motion.section>

        {/* Search and Filters */}
        <motion.section 
          className="gallery-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
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
        </motion.section>

        {/* Character Grid */}
        <motion.section 
          className="gallery-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {sortedCharacters.length === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">No Sacred Characters Found</h3>
                <p className="no-results-message">
                  Try adjusting your search terms or filters
                </p>
                <motion.button
                  className="cyber-button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className={`character-grid ${viewMode}`}
                layout
              >
                {sortedCharacters.map((character, index) => (
                  <motion.div
                    key={character.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CharacterCard
                      character={character}
                      onClick={() => handleCharacterClick(character)}
                      onViewInAR={() => handleViewInAR(character)}
                      onViewDetails={() => handleViewDetails(character)}
                      onShare={() => handleShare(character)}
                      onFavorite={() => handleFavorite(character)}
                      isFavorite={favorites.includes(character.id)}
                      index={index}
                      viewMode={viewMode}
                      variant="cyberpunk"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Character Modal */}
        <AnimatePresence>
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
              variant="cyberpunk"
            />
          )}
        </AnimatePresence>
      </div>
    </CyberpunkBackground>
  );
};

export default Gallery;