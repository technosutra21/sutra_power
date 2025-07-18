import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCharacters } from '../data/mockCharacters';

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

  // Load characters data
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call
        setCharacters(mockCharacters);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('stem-array-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('stem-array-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter characters based on search and filter
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'favorites' && favorites.includes(character.id)) ||
                         (selectedFilter === 'available' && character.available) ||
                         (selectedFilter === 'bodhisattvas' && character.type === 'Bodhisattva');

    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = (characterId) => {
    setFavorites(prev => 
      prev.includes(characterId) 
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const getCharacterById = (id) => {
    return characters.find(char => char.id === id);
  };

  const getStats = () => {
    const totalCharacters = characters.length;
    const availableCharacters = characters.filter(char => char.available).length;
    const bodhisattvas = characters.filter(char => char.type === 'Bodhisattva').length;
    const completionRate = totalCharacters > 0 ? Math.round((availableCharacters / totalCharacters) * 100) : 0;

    return {
      total: totalCharacters,
      available: availableCharacters,
      bodhisattvas,
      completionRate,
      favorites: favorites.length
    };
  };

  const value = {
    characters,
    filteredCharacters,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    favorites,
    toggleFavorite,
    getCharacterById,
    getStats
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}