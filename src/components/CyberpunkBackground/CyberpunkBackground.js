import React from 'react';
import { motion } from 'framer-motion';
import './CyberpunkBackground.css';

const CyberpunkBackground = ({ children, variant = 'default' }) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className={`cyberpunk-background ${variant}`}>
      {/* Animated Grid */}
      <div className="cyber-grid" />
      
      {/* Floating Particles */}
      <div className="cyber-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="cyber-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Holographic Overlays */}
      <div className="holo-overlay holo-overlay-1" />
      <div className="holo-overlay holo-overlay-2" />
      <div className="holo-overlay holo-overlay-3" />

      {/* Scanning Lines */}
      <div className="scan-lines">
        <div className="scan-line scan-line-1" />
        <div className="scan-line scan-line-2" />
        <div className="scan-line scan-line-3" />
      </div>

      {/* Content */}
      <div className="cyber-content">
        {children}
      </div>
    </div>
  );
};

export default CyberpunkBackground;