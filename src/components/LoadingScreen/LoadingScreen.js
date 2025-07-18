import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Stem Array...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    const textInterval = setInterval(() => {
      const texts = [
        'Initializing Stem Array...',
        'Loading Character Profiles...',
        'Preparing 3D Models...',
        'Connecting to Wisdom Matrix...',
        'Calibrating Spiritual Sensors...',
        'Synchronizing with Cosmic Data...',
        'Activating Enlightenment Protocol...',
        'Ready for Transcendence...'
      ];
      
      setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="loading-screen">
      {/* Animated background */}
      <div className="loading-bg">
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
      </div>

      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo">
          <div className="logo-symbol">🧘</div>
          <div className="logo-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="loading-title">
          <span className="gradient-text">Stem Array</span>
          <span className="loading-subtitle">Sutra Experience</span>
        </h1>

        {/* Progress */}
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="progress-percentage">{Math.floor(progress)}%</span>
            <span className="progress-label">{loadingText}</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="loading-ornaments">
          <div className="ornament ornament-1">✨</div>
          <div className="ornament ornament-2">🌟</div>
          <div className="ornament ornament-3">💫</div>
          <div className="ornament ornament-4">⭐</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;