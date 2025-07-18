import React from 'react';
import { motion } from 'framer-motion';
import './StatsDisplay.css';

const StatsDisplay = ({ stats }) => {
  const statItems = [
    {
      key: 'total',
      label: 'Total Characters',
      value: stats.total,
      icon: '🌟',
      color: 'cyan'
    },
    {
      key: 'available',
      label: 'Available',
      value: stats.available,
      icon: '✅',
      color: 'green'
    },
    {
      key: 'bodhisattvas',
      label: 'Bodhisattvas',
      value: stats.bodhisattvas,
      icon: '🧘',
      color: 'pink'
    },
    {
      key: 'completionRate',
      label: 'Completion',
      value: `${stats.completionRate}%`,
      icon: '📊',
      color: 'blue'
    },
    {
      key: 'favorites',
      label: 'Favorites',
      value: stats.favorites,
      icon: '💛',
      color: 'yellow'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="stats-display cyberpunk"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="stats-container">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.key}
            className={`stat-item ${stat.color}`}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <div className="stat-background" />
            <div className="stat-content">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-details">
                <motion.div 
                  className="stat-value"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
            <div className="stat-glow" />
            <div className="stat-scan-line" />
          </motion.div>
        ))}
      </div>
      
      {/* Holographic Effect */}
      <div className="stats-holo-effect" />
    </motion.div>
  );
};

export default StatsDisplay;