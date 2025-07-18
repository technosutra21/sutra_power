import React from 'react';
import { motion } from 'framer-motion';
import './CyberpunkLoader.css';

const CyberpunkLoader = ({ 
  text = "Loading...", 
  size = "medium", 
  variant = "default" 
}) => {
  const sizeClasses = {
    small: 'cyber-loader-small',
    medium: 'cyber-loader-medium',
    large: 'cyber-loader-large'
  };

  const variantClasses = {
    default: 'cyber-loader-default',
    minimal: 'cyber-loader-minimal',
    holographic: 'cyber-loader-holographic'
  };

  return (
    <div className={`cyber-loader ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {variant === 'holographic' ? (
        <motion.div 
          className="cyber-loader-holo"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="cyber-loader-ring cyber-loader-ring-1" />
          <div className="cyber-loader-ring cyber-loader-ring-2" />
          <div className="cyber-loader-ring cyber-loader-ring-3" />
        </motion.div>
      ) : (
        <motion.div 
          className="cyber-loader-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      <motion.div 
        className="cyber-loader-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.div>
      
      {variant === 'default' && (
        <div className="cyber-loader-progress">
          <motion.div 
            className="cyber-loader-progress-bar"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
};

export default CyberpunkLoader;