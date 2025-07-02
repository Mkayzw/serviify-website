import React, { useState, useEffect } from 'react';
import { fontLoader } from '../lib/fontLoader';

interface FontLoadingIndicatorProps {
  children: React.ReactNode;
  showFallback?: boolean;
}

const FontLoadingIndicator: React.FC<FontLoadingIndicatorProps> = ({ 
  children, 
  showFallback = true 
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Check if font is already loaded
    if (fontLoader.isCaveatLoaded()) {
      setFontLoaded(true);
      return;
    }

    // Wait for font to load
    fontLoader.preloadCaveatFont()
      .then(() => {
        setFontLoaded(true);
      })
      .catch(() => {
        // Font failed to load, still render content
        setFontLoaded(true);
      });
  }, []);

  // If font loading and we want to show fallback, render with fallback class
  if (!fontLoaded && showFallback) {
    return (
      <div className="font-loading">
        {children}
      </div>
    );
  }

  return (
    <div className={fontLoaded ? "font-loaded" : "font-loading"}>
      {children}
    </div>
  );
};

export default FontLoadingIndicator;
