import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import LazyLoad from 'react-lazyload';
import './CharacterCard.css';

const CharacterCard = ({ 
  character, 
  onClick, 
  onViewInAR, 
  onViewDetails,
  onShare, 
  onFavorite,
  isFavorite,
  index = 0,
  viewMode = 'grid',
  variant = 'cyberpunk'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(character);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.2 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`character-card ${variant} ${viewMode} ${character.available ? 'available' : 'unavailable'}`}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d"
      }}
    >
      <motion.div 
        className="card-container"
        ref={cardRef}
      >
        {/* Card Background */}
        <div className="card-background" />
        
        {/* Holographic Border */}
        <div className="holo-border-effect" />
        
        {/* Character Image */}
        <div className="character-image-container">
          <LazyLoad height={200} offset={100}>
            <motion.img
              src={character.imageUrl || `/images/placeholder-${character.id}.jpg`}
              alt={character.name}
              className="character-image"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/images/placeholder-character.jpg';
                setImageLoaded(true);
              }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: imageLoaded ? 1 : 0,
                scale: imageLoaded ? 1 : 1.1 
              }}
              transition={{ duration: 0.5 }}
            />
          </LazyLoad>
          
          {/* Loading Placeholder */}
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="placeholder-icon">🧘</div>
              <div className="placeholder-text">Loading...</div>
            </div>
          )}
          
          {/* Favorite Button */}
          <motion.button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => handleActionClick(e, onFavorite)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isFavorite ? '💛' : '🤍'}
          </motion.button>
          
          {/* Status Badge */}
          <div className={`status-badge ${character.available ? 'available' : 'unavailable'}`}>
            {character.available ? '✓' : '🔒'}
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="character-header">
            <h3 className="character-name">{character.name}</h3>
            <span className="character-type">{character.type}</span>
            <span className="character-chapter">Chapter {character.chapter}</span>
          </div>

          <p className="character-description">
            {character.description}
          </p>

          {/* Character Tags */}
          <div className="character-tags">
            {character.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="character-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Character Stats */}
          <div className="character-stats">
            <div className="stat-item">
              <span className="stat-label">Powers</span>
              <span className="stat-value">{character.specialPowers?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Attributes</span>
              <span className="stat-value">{character.spiritualAttributes?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="card-actions"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.button
                className="action-btn primary"
                onClick={(e) => handleActionClick(e, onViewDetails)}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
              </motion.button>
              
              {character.available && (
                <motion.button
                  className="action-btn secondary"
                  onClick={(e) => handleActionClick(e, onViewInAR)}
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  AR View
                </motion.button>
              )}
              
              <motion.button
                className="action-btn tertiary"
                onClick={(e) => handleActionClick(e, onShare)}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Line Effect */}
        <div className="scan-line" />
        
        {/* Holographic Particles */}
        <div className="holo-particles">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`holo-particle holo-particle-${i + 1}`} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CharacterCard;