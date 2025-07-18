import React, { createContext, useContext, useState, useEffect } from 'react';
import { characterDataLoader } from '../data/characterData';

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
        setError(null);
        
        const charactersData = await characterDataLoader.loadCharacters();
        setCharacters(charactersData);
      } catch (err) {
        console.error('Failed to load characters:', err);
        setError('Failed to load character data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('universal-wisdom-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('universal-wisdom-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter characters based on search and filter
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'favorites' && favorites.includes(character.id)) ||
                         (selectedFilter === 'available' && character.available) ||
                         (selectedFilter === 'characters' && character.type === 'Character') ||
                         character.tags.some(tag => tag.toLowerCase() === selectedFilter.toLowerCase());

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

  const getCharacterByChapter = (chapter) => {
    return characters.find(char => char.chapter === chapter);
  };

  const getStats = () => {
    const totalCharacters = characters.length;
    const availableCharacters = characters.filter(char => char.available).length;
    const uniqueTypes = [...new Set(characters.map(char => char.type))].length;
    const uniqueTags = [...new Set(characters.flatMap(char => char.tags))].length;
    const completionRate = totalCharacters > 0 ? Math.round((availableCharacters / totalCharacters) * 100) : 0;

    return {
      total: totalCharacters,
      available: availableCharacters,
      types: uniqueTypes,
      tags: uniqueTags,
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
    getCharacterByChapter,
    getStats
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}