import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchFilters.css';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  showStats,
  onStatsToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, onSearchChange]);

  const filterOptions = [
    { value: 'all', label: 'All Characters', icon: '🌟' },
    { value: 'available', label: 'Available', icon: '✅' },
    { value: 'favorites', label: 'Favorites', icon: '💛' },
    { value: 'bodhisattvas', label: 'Bodhisattvas', icon: '🧘' },
  ];

  const viewModeOptions = [
    { value: 'grid', label: 'Grid', icon: '▦' },
    { value: 'list', label: 'List', icon: '☰' },
    { value: 'compact', label: 'Compact', icon: '⚏' },
  ];

  const sortOptions = [
    { value: 'chapter', label: 'Chapter' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' },
  ];

  return (
    <motion.div 
      className="search-filters cyberpunk"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Search Bar */}
      <div className="search-container">
        <motion.div 
          className={`search-input-container ${searchFocused ? 'focused' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search characters by name, type, or attributes..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="search-input"
          />
          {debouncedSearch && (
            <motion.button
              className="search-clear"
              onClick={() => setDebouncedSearch('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ❌
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Category Filters */}
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          <div className="filter-options">
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="filter-icon">{option.icon}</span>
                <span className="filter-text">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* View Mode */}
        <div className="filter-group">
          <span className="filter-label">View:</span>
          <div className="view-mode-options">
            {viewModeOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`view-mode-btn ${viewMode === option.value ? 'active' : ''}`}
                onClick={() => onViewModeChange(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={option.label}
              >
                <span className="view-mode-icon">{option.icon}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <span className="filter-label">Sort:</span>
          <motion.select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            whileHover={{ scale: 1.02 }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
        </div>

        {/* Advanced Filters Toggle */}
        <motion.button
          className="advanced-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="advanced-icon">⚙️</span>
          <span className="advanced-text">
            {isExpanded ? 'Less' : 'More'}
          </span>
        </motion.button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="advanced-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="advanced-controls">
              <div className="advanced-group">
                <span className="advanced-label">Show Stats:</span>
                <motion.button
                  className={`toggle-btn ${showStats ? 'active' : ''}`}
                  onClick={() => onStatsToggle(!showStats)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="toggle-icon">
                    {showStats ? '👁️' : '🙈'}
                  </span>
                  <span className="toggle-text">
                    {showStats ? 'Hide' : 'Show'}
                  </span>
                </motion.button>
              </div>
              
              <div className="advanced-group">
                <span className="advanced-label">Performance:</span>
                <motion.button
                  className="performance-btn"
                  onClick={() => {
                    // Clear cache or optimize performance
                    if (window.caches) {
                      caches.keys().then(names => {
                        names.forEach(name => {
                          if (name.includes('character-images')) {
                            caches.delete(name);
                          }
                        });
                      });
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="performance-icon">🚀</span>
                  <span className="performance-text">Clear Cache</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Results Summary */}
      {(searchTerm || selectedFilter !== 'all') && (
        <motion.div 
          className="filter-summary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="summary-content">
            <span className="summary-text">
              {searchTerm && (
                <span className="search-term">
                  Searching for "{searchTerm}"
                </span>
              )}
              {selectedFilter !== 'all' && (
                <span className="filter-term">
                  in {filterOptions.find(f => f.value === selectedFilter)?.label}
                </span>
              )}
            </span>
            <motion.button
              className="clear-all-btn"
              onClick={() => {
                setDebouncedSearch('');
                onFilterChange('all');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchFilters;