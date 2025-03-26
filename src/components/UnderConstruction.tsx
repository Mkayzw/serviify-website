import { useEffect, useState } from 'react';
import '../styles/UnderConstruction.css';

// Import service images
import autoMech from '../assets/service_images/auto-mech.webp';
import electrician from '../assets/service_images/electrician.webp';
import cleaning from '../assets/service_images/cleaning.webp';
import realEstate from '../assets/service_images/real estate.webp';
import agriculture from '../assets/service_images/agriculture.webp';
import carpentry from '../assets/service_images/carpentry.webp';
import eventPlanner from '../assets/service_images/eventplanner.webp';

interface UnderConstructionProps {
  setShowSignup: (show: boolean) => void;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ setShowSignup }) => {
  const [loaded, setLoaded] = useState(false);
  const [animatingText, setAnimatingText] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const fullText = 'All your services in one platform.';

  useEffect(() => {
    // Animation for page load
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animatingText) {
      if (displayText.length < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setAnimatingText(false);
      }
    }
  }, [displayText, animatingText, fullText]);

  return (
    <div className={`construction-container ${loaded ? 'loaded' : ''}`}>
      <div className="construction-content">
        <div className="logo-container">
          <div className="logo-animation">
            <span className="logo-letter">S</span>
            <span className="logo-letter">e</span>
            <span className="logo-letter">r</span>
            <span className="logo-letter">v</span>
            <span className="logo-letter">i</span>
            <span className="logo-letter">i</span>
            <span className="logo-letter">f</span>
            <span className="logo-letter">y</span>
          </div>
        </div>
        
        <h1 className="construction-heading">
          <span className="typing-text">{displayText}</span>
          <span className={`cursor ${!animatingText ? 'blink' : ''}`}>|</span>
        </h1>
        
        <div className="construction-message">
          <div className="emoji-container">
            <span className="emoji">🚧</span>
            <span className="emoji-shadow"></span>
          </div>
          <h2>Website Under Construction</h2>
          <p>We're working hard to bring you an amazing experience. Coming soon!</p>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-text">Progress: 75%</div>
        </div>
        
        <div className="subscribe-container">
          <p>Be the first to know when we launch!</p>
          <button className="subscribe-btn" onClick={() => setShowSignup(true)}>
            Get Early Access
          </button>
        </div>
        
        {/* Service Showcase */}
        <div className="service-showcase">
          <h3 className="service-showcase-title">Services Coming Soon</h3>
          <div className="service-grid">
            <div className="service-item">
              <div className="service-image-container">
                <img src={electrician} alt="Electrical Services" className="service-image" />
                <div className="service-overlay">
                  <div className="service-name">Electrical Services</div>
                </div>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-image-container">
                <img src={autoMech} alt="Auto Mechanics" className="service-image" />
                <div className="service-overlay">
                  <div className="service-name">Auto Mechanics</div>
                </div>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-image-container">
                <img src={carpentry} alt="Carpentry Services" className="service-image" />
                <div className="service-overlay">
                  <div className="service-name">Carpentry Services</div>
                </div>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-image-container">
                <img src={cleaning} alt="Cleaning Services" className="service-image" />
                <div className="service-overlay">
                  <div className="service-name">Cleaning Services</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="construction-features">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="bi bi-person-check"></i>
            </div>
            <h3>Vetted Providers</h3>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h3>Instant Booking</h3>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <i className="bi bi-stars"></i>
            </div>
            <h3>Review & Track</h3>
          </div>
        </div>
        
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction; 