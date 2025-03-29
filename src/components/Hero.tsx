import "../styles/Hero.css";
import { FeaturesShowcase } from "./features-showcase";
import Footer from "./Footer";
import CallToAction from "./CallToAction";

interface HeroProps {
  setShowSignup: (show: boolean) => void;
}

const TechShowcaseCurve = () => (
  <div className="custom-shape-divider-top-tech-showcase">
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
        className="shape-fill"
      ></path>
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
              All your services in{" "}
              <span className="x_wd_secondary_highlight_bold_05">one platform.</span>
            </h1>
            <h2 className="hero-subheading">
              Simple, reliable, yet <span className="x_wd_blue_highlight_01">affordable!</span>
              <em className="x_wd_doodle position-absolute d-none d-lg-inline rotate-350 me-n10 arrow-doodle">
                <span data-oe-type="monetary" data-oe-expression="pricing.get('yearly_standard_discounted', 25)">US$&nbsp;<span className="oe_currency_value">0&nbsp;</span></span>
                / month
                <br />
                Completely free
              </em>
            </h2>
            <div className="hero-cta">
              <button
                className="start-now-btn"
                onClick={() => setShowSignup(true)}
                style={{
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 6px rgba(15, 23, 43, 0.2)",
                }}
              >
                Start now - It's free
              </button>
              <div className="advisor-dropdown">
                <button className="meet-advisor-btn">Contact Us ▾</button>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-showcase-container position-relative">
          <TechShowcaseCurve />
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="tech-showcase-title">
                  All your <span className="x_wd_yellow_highlight_03">providers</span> in one fantastic app
                </h2>
              </div>
            </div>

            <div className="row justify-content-center g-4">
              <div className="col-6 col-md-4 col-lg-3 text-center">
                <div className="platform-item">
                  <div className="platform-image-container">
                    <div className="platform-image service-platform-electrician"></div>
                    <div className="platform-overlay">
                      <div className="platform-label">
                        Professional Electricians
                      </div>
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
                      <div className="platform-label">
                        Automotive Specialists
                      </div>
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
                      <div className="platform-label">
                        Professional Cleaners
                      </div>
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
                      <div className="platform-label">
                        Real Estate Professionals
                      </div>
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
                      <div className="platform-label">
                        Event Planning Specialists
                      </div>
                    </div>
                  </div>
                  <h3>Event Planning</h3>
                </div>
              </div>
            </div>

            <div className="row mt-4 mb-3">
              <div className="col-12 text-center">
                <a
                  href="/services"
                  className="view-all-link mt-4 d-inline-block"
                >
                  Explore all service options
                  <i className="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>

            {/* App Benefits Text - integrated within tech showcase */}
            <div className="row mt-5">
              <div className="col-12 text-center">
                <p className="app-benefits-heading">
                  Imagine a vast collection of service providers at your
                  fingertips.
                </p>
                <p className="app-benefits-text">
                  Need a service completed? There's a professional for that on
                  Serviify.
                </p>
                <p className="app-benefits-text">
                  No complexity, no cost, just a one-click connection.
                </p>
                <p className="app-benefits-text mt-4">
                  Each service simplifies a process and empowers more people.
                  <br />
                  Imagine the impact when everyone gets the right service
                  provider for the job, with perfect integration.
                </p>
              </div>
            </div>

            {/* FeaturesShowcase within the tech showcase container */}
            <div className="row mt-5">
              <div className="col-12">
                <FeaturesShowcase />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Serviify Core Function Highlights */}
      <div className="core-function-container">
        <div className="container">
          <div className="row py-5">

          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <CallToAction setShowSignup={setShowSignup} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Hero;
