import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CharacterProvider } from './contexts/CharacterContext';
import Layout from './components/Layout/Layout';
import Gallery from './pages/Gallery/Gallery';
import ARViewer from './pages/ARViewer/ARViewer';
import CharacterDetail from './pages/CharacterDetail/CharacterDetail';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <CharacterProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<Gallery />} />
                <Route path="/ar" element={<ARViewer />} />
                <Route path="/character/:id" element={<CharacterDetail />} />
              </Routes>
            </Layout>
            <Toaster />
          </div>
        </Router>
      </CharacterProvider>
    </ThemeProvider>
  );
}

export default App;