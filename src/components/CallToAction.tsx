import React from 'react';
import '../styles/CallToAction.css';

interface CallToActionProps {
  setShowSignup: (show: boolean) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ setShowSignup }) => {
  return (
    <div className="cta-wrapper">
      <section className="cta-section">
        <div className="cta-container">
          <span className="cta-sparkle">✨</span>
          <span className="cta-sparkle">✨</span>
          <span className="cta-sparkle">✨</span>
          <span className="cta-sparkle">✨</span>
          
          <h2 className="cta-title">
            Unleash <br />
            your <span className="highlight">growth potential</span>
          </h2>
          
          <button 
            className="cta-button"
            onClick={() => setShowSignup(true)}
          >
            Start now - It's free
          </button>
          
          <div className="cta-arrow">
            <i className="bi bi-arrow-down"></i>
          </div>
          
          <p className="cta-info">No credit card required</p>
          <p className="cta-info">Instant access</p>
        </div>
      </section>
    </div>
  );
};

export default CallToAction;
