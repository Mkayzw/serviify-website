import '../styles/Hero.css';

interface HeroProps {
  setShowSignup: (show: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({ setShowSignup }) => {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-heading">
              All your services <span className="highlight">in one app.</span>
            </h1>
            <h2 className="hero-subheading">
              Convenient, reliable, <span className="underline">and affordable!</span>
            </h2>
            
            <div className="hero-cta">
              <button className="start-now-btn" onClick={() => setShowSignup(true)}>Start now - It's free</button>
              <div className="advisor-dropdown">
                <button className="meet-advisor-btn">Contact Us ▾</button>
              </div>
            </div>
            
            <div className="pricing-note">
              <div className="price-tag">
                <span className="free-label">Completely <span className="emphasis">FREE!</span></span>
                <span className="price-detail">for all services</span>
                <div className="pointing-arrow"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="services-grid-container">
          <div className="row services-grid">
            <a href="/services/cleaning" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-house-door"></i>
                </div>
                <figcaption className="text-truncate small">Cleaning</figcaption>
              </figure>
            </a>
            
            <a href="/services/repair" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-tools"></i>
                </div>
                <figcaption className="text-truncate small">Repair</figcaption>
              </figure>
            </a>
            
            <a href="/services/painting" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-brush"></i>
                </div>
                <figcaption className="text-truncate small">Painting</figcaption>
              </figure>
            </a>
            
            <a href="/services/gardening" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-tree"></i>
                </div>
                <figcaption className="text-truncate small">Gardening</figcaption>
              </figure>
            </a>
            
            <a href="/services/electrical" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-lightning"></i>
                </div>
                <figcaption className="text-truncate small">Electrical</figcaption>
              </figure>
            </a>
            
            <a href="/services/plumbing" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-droplet"></i>
                </div>
                <figcaption className="text-truncate small">Plumbing</figcaption>
              </figure>
            </a>
            
            <a href="/services/hairdressing" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-scissors"></i>
                </div>
                <figcaption className="text-truncate small">Hairdressing</figcaption>
              </figure>
            </a>
            
            <a href="/services/it-support" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-laptop"></i>
                </div>
                <figcaption className="text-truncate small">IT Support</figcaption>
              </figure>
            </a>
            
            <a href="/services/childcare" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-person-plus"></i>
                </div>
                <figcaption className="text-truncate small">Childcare</figcaption>
              </figure>
            </a>
            
            <a href="/services/security" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <figcaption className="text-truncate small">Security</figcaption>
              </figure>
            </a>
            
            <a href="/services/photography" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-camera"></i>
                </div>
                <figcaption className="text-truncate small">Photography</figcaption>
              </figure>
            </a>
            
            <a href="/services/web-design" className="service-item col-4 col-sm-3 col-lg-2 text-center mb-4">
              <figure>
                <div className="img-thumbnail service-icon-wrapper mb-3">
                  <i className="bi bi-code-slash"></i>
                </div>
                <figcaption className="text-truncate small">WebDesign</figcaption>
              </figure>
            </a>
          </div>
          
          <div className="row mt-4">
            <div className="col-12 text-center text-md-end">
              <a href="/services" className="view-all-link">
                View all Services
                <i className="bi bi-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Serviify Core Function Highlights */}
      <div className="core-function-container">
        <div className="container">
          <div className="row py-5">
            <div className="col-12 text-center mb-4">
              <h2 className="core-function-title">Imagine all your services in one place</h2>
              <p className="core-function-subtitle">No complexity, no cost, just a one-click connection</p>
            </div>
          </div>
          
          <div className="row g-4 core-features">
            <div className="col-md-4">
              <div className="core-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-person-check"></i>
                </div>
                <h3>Find vetted providers</h3>
                <p>Each service provider is thoroughly verified to ensure the highest quality of work and reliability.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="core-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h3>Book instantly</h3>
                <p>Schedule appointments in seconds with our intuitive booking system - no phone calls or waiting required.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="core-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-stars"></i>
                </div>
                <h3>Review and track</h3>
                <p>Share your experience and help others find the perfect service provider for their needs.</p>
              </div>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-12 text-center">
              <p className="core-function-impact">
                Each service simplifies a process and empowers more people.<br />
                Imagine the impact when everyone gets the right service for the job, with perfect integration.
              </p>
              <button className="start-exploring-btn" onClick={() => setShowSignup(true)}>
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave shape at the bottom */}
      <div className="wave-shape"></div>
    </div>
  );
};

export default Hero; 