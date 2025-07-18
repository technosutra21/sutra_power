import React, { useState } from 'react';
import './SearchFilters.css';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Characters', icon: '🌟' },
    { value: 'available', label: 'Available', icon: '✅' },
    { value: 'unavailable', label: 'Coming Soon', icon: '⏳' },
    { value: 'bodhisattvas', label: 'Bodhisattvas', icon: '🧘' },
    { value: 'favorites', label: 'Favorites', icon: '❤️' }
  ];

  const viewModeOptions = [
    { value: 'grid', label: 'Grid', icon: '⊞' },
    { value: 'list', label: 'List', icon: '≡' },
    { value: 'compact', label: 'Compact', icon: '⊟' }
  ];

  const sortOptions = [
    { value: 'chapter', label: 'Chapter' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' }
  ];

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (filterValue) => {
    onFilterChange(filterValue);
  };

  const handleViewModeChange = (mode) => {
    onViewModeChange(mode);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="search-filters">
      <div className="search-filters-container">
        {/* Search Input */}
        <div className="search-section">
          <div className="search-input-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              placeholder="Search characters by name, type, or attributes..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          <span className="toggle-icon">⚙️</span>
          Filters
        </button>

        {/* Filters Container */}
        <div className={`filters-container ${isExpanded ? 'expanded' : ''}`}>
          {/* Filter Buttons */}
          <div className="filter-section">
            <h3 className="filter-section-title">Categories</h3>
            <div className="filter-buttons">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterChange(option.value)}
                >
                  <span className="filter-icon">{option.icon}</span>
                  <span className="filter-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="view-mode-section">
            <h3 className="filter-section-title">View</h3>
            <div className="view-mode-buttons">
              {viewModeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`view-mode-btn ${viewMode === option.value ? 'active' : ''}`}
                  onClick={() => handleViewModeChange(option.value)}
                  title={option.label}
                >
                  <span className="view-mode-icon">{option.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="sort-section">
            <h3 className="filter-section-title">Sort</h3>
            <select
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;