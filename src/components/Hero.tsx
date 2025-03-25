import '../styles/Hero.css';

interface HeroProps {
  setShowSignup: (show: boolean) => void;
}

const TechShowcaseCurve = () => (
  <div className="custom-shape-divider-top-tech-showcase">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className="shape-fill"></path>
    </svg>
  </div>
);

const Hero: React.FC<HeroProps> = ({ setShowSignup }) => {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-heading">
              All your services <span className="highlight">in one platform.</span>
            </h1>
            <h2 className="hero-subheading">
              Convenient, reliable, <span className="underline">and affordable!</span>
            </h2>
            
            <div className="curved-arrow-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M10 80 Q50 40, 90 80" fill="none" stroke="#0F172B" stroke-width="4" marker-end="url(#arrowhead)"/>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#0F172A"/>
                  </marker>
                </defs>
              </svg>
            </div>
            
            <div className="hero-cta">
              <button className="start-now-btn" onClick={() => setShowSignup(true)}>Start now - It's free</button>
              <div className="advisor-dropdown">
                <button className="meet-advisor-btn">Contact Us ▾</button>
              </div>
            </div>
            
            <div className="pricing-note">
              <div className="price-tag">
                <span className="free-label">Completely <span className="emphasis">FREE!</span></span>
                <span className="price-detail">for services</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-showcase-container position-relative">
        <TechShowcaseCurve />
        <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="tech-showcase-title">Ta-da! All your services in one fantastic app</h2>
              </div>
            </div>
            
            <div className="row justify-content-center g-4">
              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-electrician"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Professional Electricians</div>
                    </div>
                  </div>
                  <h3>Electrical Services</h3>
                </div>
              </div>
              
              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-mechanic"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Automotive Specialists</div>
                    </div>
                  </div>
                  <h3>Auto Mechanics</h3>
                </div>
              </div>
              
              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-carpentry"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Expert Carpenters</div>
                    </div>
                  </div>
                  <h3>Carpentry Services</h3>
                </div>
              </div>
              
              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-agriculture"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Agricultural Experts</div>
                    </div>
                  </div>
                  <h3>Agricultural Services</h3>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-cleaning"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Professional Cleaners</div>
                    </div>
                  </div>
                  <h3>Cleaning Services</h3>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-realestate"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Real Estate Professionals</div>
                    </div>
                  </div>
                  <h3>Real Estate Services</h3>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-eventplanner"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">Event Planning Specialists</div>
                    </div>
                  </div>
                  <h3>Event Planning</h3>
                </div>
              </div>
            </div>
            
            <div className="row mt-4 mb-3">
              <div className="col-12 text-center">
                <a href="/services" className="view-all-link mt-4 d-inline-block">
                  Explore all service options
                  <i className="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>

            {/* App Benefits Text - integrated within tech showcase */}
            <div className="row mt-5">
              <div className="col-12 text-center">
                <h2 className="app-benefits-heading">Imagine a vast collection of service providers at your fingertips.</h2>
                <p className="app-benefits-text">Need a service completed? There's a professional for that on Serviify.</p>
                <p className="app-benefits-text">No complexity, no cost, just a one-click connection.</p>
                <p className="app-benefits-text mt-4">
                  Each service simplifies a process and empowers more people.<br />
                  Imagine the impact when everyone gets the right service provider for the job, with perfect integration.
                </p>
              </div>
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