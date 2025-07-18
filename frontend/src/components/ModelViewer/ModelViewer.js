import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './ModelViewer.css';

const ModelViewer = forwardRef(({ 
  modelId, 
  character, 
  onLoad, 
  onError, 
  isARSupported, 
  isARActive, 
  onARStatusChange 
}, ref) => {
  const modelViewerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useImperativeHandle(ref, () => ({
    activateAR: () => {
      if (modelViewerRef.current && isARSupported) {
        try {
          const arButton = modelViewerRef.current.querySelector('[slot="ar-button"]');
          if (arButton) {
            arButton.click();
          }
        } catch (error) {
          console.error('AR activation failed:', error);
        }
      }
    },
    exitAR: () => {
      if (modelViewerRef.current) {
        modelViewerRef.current.setAttribute('ar-status', 'not-presenting');
      }
    },
    toBlob: async () => {
      if (modelViewerRef.current) {
        return await modelViewerRef.current.toBlob();
      }
      return null;
    }
  }));

  // Start camera for background
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Camera access failed:', error);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle model viewer events
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      onLoad?.();
    };

    const handleError = (event) => {
      onError?.(`Failed to load model: ${event.detail?.message || 'Unknown error'}`);
    };

    const handleARStatusChange = (event) => {
      const status = event.detail?.status;
      if (status === 'session-started') {
        onARStatusChange?.(true);
      } else if (status === 'not-presenting') {
        onARStatusChange?.(false);
      }
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('ar-status', handleARStatusChange);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('ar-status', handleARStatusChange);
    };
  }, [onLoad, onError, onARStatusChange]);

  // Use character's modelUrl if available, otherwise construct from modelId
  const modelSrc = character?.modelUrl || `/modelo${modelId}.glb`;
  const modelAlt = character ? `3D model of ${character.name}` : `3D model ${modelId}`;

  return (
    <div className="model-viewer-container">
      {/* Camera Background */}
      <video
        ref={videoRef}
        className="camera-background"
        autoPlay
        playsInline
        muted
      />

      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelSrc}
        alt={modelAlt}
        camera-controls
        touch-action="pan-y"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        ar-placement="floor"
        auto-rotate
        rotation-per-second="30deg"
        loading="eager"
        reveal="auto"
        skybox-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.jpg"
        skybox-height="2m"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent'
        }}
      >
        {/* AR Button */}
        <button 
          slot="ar-button" 
          className="ar-button"
          disabled={!isARSupported}
        >
          <span className="ar-button-icon">📱</span>
          <span className="ar-button-text">
            {isARSupported ? 'View in AR' : 'AR Not Supported'}
          </span>
        </button>

        {/* Progress Bar */}
        <div slot="progress-bar" className="progress-bar">
          <div className="progress-fill"></div>
        </div>

        {/* AR Prompt */}
        <div slot="ar-prompt" className="ar-prompt">
          <div className="ar-prompt-content">
            <div className="ar-prompt-icon">📱</div>
            <div className="ar-prompt-text">
              Move your device to find a surface
            </div>
          </div>
        </div>
      </model-viewer>
    </div>
  );
});

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer;