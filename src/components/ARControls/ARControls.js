import React, { useState } from 'react';
import './ARControls.css';

const ARControls = ({
  currentModelId,
  onModelChange,
  onARToggle,
  onShare,
  onScreenshot,
  isARSupported,
  isARActive,
  modelLoaded,
  character
}) => {
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleModelPrev = () => {
    const newId = currentModelId > 1 ? currentModelId - 1 : 56;
    onModelChange(newId);
  };

  const handleModelNext = () => {
    const newId = currentModelId < 56 ? currentModelId + 1 : 1;
    onModelChange(newId);
  };

  const quickModelIds = [1, 2, 3, 30, 54]; // Popular models

  return (
    <div className="ar-controls">
      {/* Main Controls */}
      <div className="controls-main">
        {/* Model Navigation */}
        <div className="model-navigation">
          <button 
            className="nav-button"
            onClick={handleModelPrev}
            aria-label="Previous model"
          >
            ⬅️
          </button>
          
          <div className="model-info">
            <span className="model-number">#{currentModelId}</span>
            {character && (
              <span className="model-name">{character.name}</span>
            )}
          </div>
          
          <button 
            className="nav-button"
            onClick={handleModelNext}
            aria-label="Next model"
          >
            ➡️
          </button>
        </div>

        {/* AR Toggle */}
        <button 
          className={`ar-toggle ${isARActive ? 'active' : ''}`}
          onClick={onARToggle}
          disabled={!isARSupported || !modelLoaded}
        >
          <span className="ar-toggle-icon">
            {isARActive ? '🔲' : '📱'}
          </span>
          <span className="ar-toggle-text">
            {isARActive ? 'Exit AR' : 'Start AR'}
          </span>
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="controls-secondary">
        <button 
          className="control-button"
          onClick={() => setShowModelPicker(!showModelPicker)}
          aria-label="Model picker"
        >
          🎯
        </button>
        
        <button 
          className="control-button"
          onClick={onShare}
          aria-label="Share"
        >
          📤
        </button>
        
        <button 
          className="control-button"
          onClick={onScreenshot}
          disabled={!modelLoaded}
          aria-label="Screenshot"
        >
          📸
        </button>
        
        <button 
          className="control-button expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="More options"
        >
          {isExpanded ? '✕' : '⚙️'}
        </button>
      </div>

      {/* Model Picker */}
      {showModelPicker && (
        <div className="model-picker">
          <div className="model-picker-header">
            <h3>Quick Select</h3>
            <button 
              className="close-button"
              onClick={() => setShowModelPicker(false)}
            >
              ✕
            </button>
          </div>
          <div className="model-picker-grid">
            {quickModelIds.map(id => (
              <button
                key={id}
                className={`model-picker-item ${currentModelId === id ? 'active' : ''}`}
                onClick={() => {
                  onModelChange(id);
                  setShowModelPicker(false);
                }}
              >
                <span className="model-picker-number">#{id}</span>
                <span className="model-picker-name">
                  {id === 1 ? 'Buddha' : 
                   id === 2 ? 'Samantabhadra' :
                   id === 3 ? 'Manjushri' :
                   id === 30 ? 'Avalokiteshvara' :
                   id === 54 ? 'Maitreya' : `Model ${id}`}
                </span>
              </button>
            ))}
          </div>
          <div className="model-picker-input">
            <input
              type="number"
              min="1"
              max="56"
              value={currentModelId}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 56) {
                  onModelChange(value);
                }
              }}
              placeholder="Model ID (1-56)"
            />
          </div>
        </div>
      )}

      {/* Extended Controls */}
      {isExpanded && (
        <div className="controls-extended">
          <div className="control-group">
            <label>Model Scale</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              defaultValue="1.6"
              className="scale-slider"
              onChange={(e) => {
                // Update model scale
                const modelViewer = document.querySelector('model-viewer');
                if (modelViewer) {
                  modelViewer.style.setProperty('--ar-scale', e.target.value);
                }
              }}
            />
          </div>
          
          <div className="control-group">
            <label>Environment</label>
            <select className="environment-select">
              <option value="default">Default</option>
              <option value="studio">Studio</option>
              <option value="outdoor">Outdoor</option>
              <option value="night">Night</option>
            </select>
          </div>
          
          <div className="control-group">
            <button className="control-button">
              🔄 Reset Camera
            </button>
            <button className="control-button">
              ⏸️ Pause Rotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARControls;