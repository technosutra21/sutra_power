import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { mockCharacters } from '../data/mockCharacters';
import { textLoader } from '../utils/textLoader';

const CharacterContext = createContext();

export function useCharacters() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
}

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [preloadedProfiles, setPreloadedProfiles] = useState(new Set());

  // Load characters data with enhanced features
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay for realistic loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Enhanced character data with additional fields
        const enhancedCharacters = mockCharacters.map(char => ({
          ...char,
          // Add computed fields for better performance
          searchableText: `${char.name} ${char.type} ${char.tags.join(' ')} ${char.description}`.toLowerCase(),
          lastViewed: null,
          viewCount: 0,
          // Add performance metadata
          isPreloaded: false,
          profileLoaded: false
        }));
        
        setCharacters(enhancedCharacters);
        setError(null);
        
        // Preload popular character profiles
        preloadPopularProfiles(enhancedCharacters);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // Preload popular character profiles for better performance
  const preloadPopularProfiles = useCallback(async (chars) => {
    const popularCharacters = chars
      .filter(char => char.available)
      .slice(0, 10); // Preload first 10 characters

    try {
      const preloadPromises = popularCharacters.map(async (char) => {
        try {
          const filename = `${char.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Perfil.txt`;
          await textLoader.loadText(filename);
          return char.id;
        } catch (error) {
          console.warn(`Failed to preload profile for ${char.name}:`, error);
          return null;
        }
      });

      const preloadedIds = await Promise.allSettled(preloadPromises);
      const successfulIds = preloadedIds
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);

      setPreloadedProfiles(new Set(successfulIds));
    } catch (error) {
      console.warn('Error preloading profiles:', error);
    }
  }, []);

  // Load favorites from localStorage with error handling
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('stem-array-favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('stem-array-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // Memoized filtered characters with performance optimizations
  const filteredCharacters = useMemo(() => {
    if (!characters.length) return [];

    let filtered = characters;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(character => 
        character.searchableText.includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(character => {
        switch (selectedFilter) {
          case 'favorites':
            return favorites.includes(character.id);
          case 'available':
            return character.available;
          case 'bodhisattvas':
            return character.type === 'Bodhisattva';
          case 'recently-viewed':
            return character.lastViewed !== null;
          case 'popular':
            return character.viewCount > 0;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [characters, searchTerm, selectedFilter, favorites]);

  // Performance-optimized toggle favorite
  const toggleFavorite = useCallback((characterId) => {
    setFavorites(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  }, []);

  // Get character by ID with performance tracking
  const getCharacterById = useCallback((id) => {
    const character = characters.find(char => char.id === id);
    
    if (character) {
      // Update view tracking
      setCharacters(prev => 
        prev.map(char => 
          char.id === id 
            ? { 
                ...char, 
                lastViewed: new Date().toISOString(),
                viewCount: char.viewCount + 1 
              }
            : char
        )
      );
    }
    
    return character;
  }, [characters]);

  // Enhanced stats with additional metrics
  const getStats = useCallback(() => {
    const totalCharacters = characters.length;
    const availableCharacters = characters.filter(char => char.available).length;
    const bodhisattvas = characters.filter(char => char.type === 'Bodhisattva').length;
    const recentlyViewed = characters.filter(char => char.lastViewed !== null).length;
    const completionRate = totalCharacters > 0 ? Math.round((availableCharacters / totalCharacters) * 100) : 0;
    const preloadedCount = preloadedProfiles.size;

    return {
      total: totalCharacters,
      available: availableCharacters,
      bodhisattvas,
      recentlyViewed,
      completionRate,
      favorites: favorites.length,
      preloaded: preloadedCount,
      cacheSize: textLoader.getCacheSize()
    };
  }, [characters, favorites, preloadedProfiles]);

  // Search suggestions for enhanced UX
  const getSearchSuggestions = useCallback((query) => {
    if (!query.trim() || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const suggestions = new Set();
    
    characters.forEach(char => {
      // Add character names
      if (char.name.toLowerCase().includes(queryLower)) {
        suggestions.add(char.name);
      }
      
      // Add character types
      if (char.type.toLowerCase().includes(queryLower)) {
        suggestions.add(char.type);
      }
      
      // Add tags
      char.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 10);
  }, [characters]);

  // Performance optimization: clear cache when needed
  const clearCache = useCallback(() => {
    textLoader.clearCache();
    setPreloadedProfiles(new Set());
  }, []);

  // Get trending characters based on view count
  const getTrendingCharacters = useCallback(() => {
    return characters
      .filter(char => char.viewCount > 0)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);
  }, [characters]);

  // Get recommended characters based on favorites
  const getRecommendedCharacters = useCallback(() => {
    if (favorites.length === 0) return [];
    
    const favoriteChars = characters.filter(char => favorites.includes(char.id));
    const favoriteTags = favoriteChars.flatMap(char => char.tags);
    const favoriteTypes = favoriteChars.map(char => char.type);
    
    return characters
      .filter(char => !favorites.includes(char.id))
      .filter(char => {
        const hasCommonTags = char.tags.some(tag => favoriteTags.includes(tag));
        const hasCommonType = favoriteTypes.includes(char.type);
        return hasCommonTags || hasCommonType;
      })
      .slice(0, 10);
  }, [characters, favorites]);

  // Memoized context value for performance
  const contextValue = useMemo(() => ({
    // Core data
    characters,
    filteredCharacters,
    loading,
    error,
    
    // Search and filtering
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    
    // Favorites
    favorites,
    toggleFavorite,
    
    // Utilities
    getCharacterById,
    getStats,
    getSearchSuggestions,
    getTrendingCharacters,
    getRecommendedCharacters,
    
    // Performance
    clearCache,
    preloadedProfiles,
    
    // Additional features
    recentlyViewed: characters.filter(char => char.lastViewed !== null)
  }), [
    characters,
    filteredCharacters,
    loading,
    error,
    searchTerm,
    selectedFilter,
    favorites,
    toggleFavorite,
    getCharacterById,
    getStats,
    getSearchSuggestions,
    getTrendingCharacters,
    getRecommendedCharacters,
    clearCache,
    preloadedProfiles
  ]);

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
}

export default CharacterProvider;