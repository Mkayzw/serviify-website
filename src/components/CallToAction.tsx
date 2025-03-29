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

          <h2 className="cta-title">
            <span className="x_wd_display_fireworks_01">Unleash</span>
            <br />
            your <span className="highlight">growth potential</span>
          </h2>

          <button
            className="cta-button"
            onClick={() => setShowSignup(true)}
          >
            Start now - It's free
          </button>

          <img src="/src/assets/arrow_up.svg" className="d-block mx-auto mb-2" alt="" loading="lazy" />

          <p className="cta-info">No credit card required</p>
          <p className="cta-info">Instant access</p>
        </div>
      </section>
    </div>
  );
};

export default CallToAction;
