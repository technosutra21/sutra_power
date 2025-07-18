import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../../contexts/CharacterContext';
import ARControls from '../../components/ARControls/ARControls';
import ModelViewer from '../../components/ModelViewer/ModelViewer';
import { toast } from 'sonner';
import './ARViewer.css';

const ARViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCharacterByChapter } = useCharacters();
  const modelViewerRef = useRef(null);
  
  const [currentModelId, setCurrentModelId] = useState(
    parseInt(searchParams.get('model')) || 1
  );
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const currentCharacter = getCharacterByChapter(currentModelId);

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
        } else {
          // Check for iOS/Android AR support
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);
          setIsARSupported(isIOS || isAndroid);
        }
      } catch (err) {
        console.error('AR support check failed:', err);
        setIsARSupported(false);
      }
    };

    checkARSupport();
  }, []);

  // Check camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setCameraPermission(false);
      }
    };

    checkCameraPermission();
  }, []);

  // Handle model changes
  useEffect(() => {
    const modelParam = parseInt(searchParams.get('model'));
    if (modelParam && modelParam !== currentModelId) {
      setCurrentModelId(Math.max(1, Math.min(56, modelParam)));
    }
  }, [searchParams, currentModelId]);

  const handleModelChange = (newModelId) => {
    setCurrentModelId(newModelId);
    navigate(`/ar?model=${newModelId}`, { replace: true });
    setModelLoaded(false);
  };

  const handleARToggle = () => {
    if (!isARSupported) {
      toast.error('AR is not supported on this device');
      return;
    }

    if (!cameraPermission) {
      toast.error('Camera permission is required for AR');
      return;
    }

    if (modelViewerRef.current) {
      try {
        if (isARActive) {
          // Exit AR
          modelViewerRef.current.setAttribute('ar-status', 'not-presenting');
          setIsARActive(false);
        } else {
          // Enter AR
          modelViewerRef.current.activateAR();
          setIsARActive(true);
        }
      } catch (err) {
        console.error('AR toggle failed:', err);
        toast.error('Failed to toggle AR mode');
      }
    }
  };

  const handleModelLoad = () => {
    setModelLoaded(true);
    setIsLoading(false);
    setError(null);
  };

  const handleModelError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setModelLoaded(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: currentCharacter ? `${currentCharacter.name} - AR View` : 'Stem Array Sutra AR',
      text: currentCharacter ? currentCharacter.description : 'Experience Buddhist wisdom in AR',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      toast.error('Failed to share');
    }
  };

  const handleScreenshot = async () => {
    if (modelViewerRef.current) {
      try {
        const canvas = await modelViewerRef.current.toBlob();
        const link = document.createElement('a');
        link.download = `${currentCharacter?.name || 'character'}-ar-view.png`;
        link.href = URL.createObjectURL(canvas);
        link.click();
        toast.success('Screenshot saved!');
      } catch (err) {
        console.error('Screenshot failed:', err);
        toast.error('Failed to capture screenshot');
      }
    }
  };

  return (
    <div className="ar-viewer">
      {/* Loading overlay */}
      {isLoading && (
        <div className="ar-loading-overlay">
          <div className="ar-loading-content">
            <div className="ar-loading-spinner"></div>
            <p>Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="ar-error-overlay">
          <div className="ar-error-content">
            <div className="ar-error-icon">⚠️</div>
            <h3>Model Loading Error</h3>
            <p>{error}</p>
            <button 
              className="ar-error-button"
              onClick={() => handleModelChange(1)}
            >
              Load Default Model
            </button>
          </div>
        </div>
      )}

      {/* Camera permission request */}
      {cameraPermission === false && (
        <div className="ar-permission-overlay">
          <div className="ar-permission-content">
            <div className="ar-permission-icon">📷</div>
            <h3>Camera Access Required</h3>
            <p>To use AR features, please allow camera access in your browser.</p>
            <button 
              className="ar-permission-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* Model Viewer */}
      <ModelViewer
        ref={modelViewerRef}
        modelId={currentModelId}
        character={currentCharacter}
        onLoad={handleModelLoad}
        onError={handleModelError}
        isARSupported={isARSupported}
        isARActive={isARActive}
        onARStatusChange={setIsARActive}
      />

      {/* AR Controls */}
      <ARControls
        currentModelId={currentModelId}
        onModelChange={handleModelChange}
        onARToggle={handleARToggle}
        onShare={handleShare}
        onScreenshot={handleScreenshot}
        isARSupported={isARSupported}
        isARActive={isARActive}
        modelLoaded={modelLoaded}
        character={currentCharacter}
      />

      {/* Character Info Overlay */}
      {currentCharacter && modelLoaded && (
        <div className="ar-character-info">
          <div className="character-info-content">
            <h2 className="character-name">{currentCharacter.name}</h2>
            <p className="character-type">{currentCharacter.type}</p>
            <p className="character-chapter">Chapter {currentCharacter.chapter}</p>
          </div>
        </div>
      )}

      {/* AR Status */}
      {isARActive && (
        <div className="ar-status">
          <div className="ar-status-content">
            <div className="ar-status-icon">📱</div>
            <p>AR Mode Active</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARViewer;