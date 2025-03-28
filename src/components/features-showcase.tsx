import { useState, useEffect } from "react";
import "../styles/FeaturesShowcase.css";

// Import all feature images from assets
const featuresContext = import.meta.glob("../assets/features/*.{jpeg,jpg,png,webp}", { eager: true });

export const FeaturesShowcase: React.FC = () => {
  const [features, setFeatures] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [bottomImage, setBottomImage] = useState<{name: string; path: string} | null>(null);

  useEffect(() => {
    // Process all feature images
    const featuresList = Object.entries(featuresContext).map(([path, module], index) => {
      // Extract the filename from the path and convert to a readable name
      const fileName = path.split("/").pop()?.split(".")[0] || "";
      const name = fileName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace(/(\d+)$/, "");
      
      // Return file info
      return {
        id: `feature-${index}`,
        name,
        path: (module as { default: string }).default,
      };
    });
    
    // If there's a fresh image, set it as the bottom image and remove it from the grid
    const freshImageIndex = featuresList.findIndex(f => 
      f.name.toLowerCase().includes("fresh") || 
      f.name.toLowerCase().includes("new") ||
      featuresList.length - 1 === featuresList.indexOf(f) // Or just use the last image
    );
    
    if (freshImageIndex !== -1) {
      const freshImage = featuresList[freshImageIndex];
      setBottomImage({
        name: freshImage.name,
        path: freshImage.path
      });
      
      // Remove from main grid
      featuresList.splice(freshImageIndex, 1);
    }
    
    setFeatures(featuresList);
  }, []);

  const handleImageClick = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenImage(path);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <h2 className="standalone-features-title">
        Powerful <span className="highlight">Features</span> for Users & Providers
      </h2>
      
      {features.map((feature, index) => (
        <div key={feature.id} className="feature-item" style={{ animationDelay: `${index * 0.1}s` }}>
          <img
            src={feature.path}
            alt={feature.name}
            className="feature-image"
            onClick={(e) => handleImageClick(feature.path, e)}
          />
          <div className="feature-name">{feature.name}</div>
        </div>
      ))}
      
      {bottomImage && (
        <img 
          src={bottomImage.path}
          alt={bottomImage.name}
          className="standalone-bottom-image"
        />
      )}
      
      <div className="performance-highlight">
        <h3>Experience true <span className="highlight">speed</span></h3>
        <p>Streamlined service booking, smart matching, and a responsive UI. All operations are done in less than 90ms - faster than a blink.</p>
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div className="fullscreen-container">
            <img 
              src={fullscreenImage} 
              alt="Feature fullscreen view" 
              className="fullscreen-image"
            />
            <button className="fullscreen-close" onClick={closeFullscreen}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 