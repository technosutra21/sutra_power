import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="search-filters cyberpunk">
      {/* Search Bar */}
      <div className="search-container">
        <div className={`search-input-container ${searchFocused ? 'focused' : ''}`}>
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
            <button
              className="search-clear"
              onClick={() => setDebouncedSearch('')}
            >
              ❌
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Category Filters */}
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          <div className="filter-options">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange(option.value)}
              >
                <span className="filter-icon">{option.icon}</span>
                <span className="filter-text">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Mode */}
        <div className="filter-group">
          <span className="filter-label">View:</span>
          <div className="view-mode-options">
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                className={`view-mode-btn ${viewMode === option.value ? 'active' : ''}`}
                onClick={() => onViewModeChange(option.value)}
                title={option.label}
              >
                <span className="view-mode-icon">{option.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <span className="filter-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          className="advanced-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="advanced-icon">⚙️</span>
          <span className="advanced-text">
            {isExpanded ? 'Less' : 'More'}
          </span>
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="advanced-filters">
          <div className="advanced-controls">
            <div className="advanced-group">
              <span className="advanced-label">Show Stats:</span>
              <button
                className={`toggle-btn ${showStats ? 'active' : ''}`}
                onClick={() => onStatsToggle(!showStats)}
              >
                <span className="toggle-icon">
                  {showStats ? '👁️' : '🙈'}
                </span>
                <span className="toggle-text">
                  {showStats ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
            
            <div className="advanced-group">
              <span className="advanced-label">Performance:</span>
              <button
                className="performance-btn"
                onClick={() => {
                  // Clear cache
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
              >
                <span className="performance-icon">🚀</span>
                <span className="performance-text">Clear Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Results Summary */}
      {(searchTerm || selectedFilter !== 'all') && (
        <div className="filter-summary">
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
            <button
              className="clear-all-btn"
              onClick={() => {
                setDebouncedSearch('');
                onFilterChange('all');
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;