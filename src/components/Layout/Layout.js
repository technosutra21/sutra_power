import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { useCharacters } from '../../contexts/CharacterContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { loading } = useCharacters();
  const [showNavigation, setShowNavigation] = useState(false);

  const isARPage = location.pathname.startsWith('/ar');

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="layout">
      {!isARPage && (
        <Header 
          onMenuToggle={() => setShowNavigation(!showNavigation)}
          showNavigation={showNavigation}
        />
      )}
      
      <Navigation 
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        isARPage={isARPage}
      />
      
      <main className={`main-content ${isARPage ? 'ar-mode' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;