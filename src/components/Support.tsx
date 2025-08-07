import React from 'react';
import "../styles/Support.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

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

const Support: React.FC = () => {

  const dummySetShowHelpCentre = () => { };

  return (
    <div className="support-section">
      <Navbar
      
        setShowHelpCentre={dummySetShowHelpCentre}
      />

    

      <div className="tech-showcase-container position-relative mt-5">
        <TechShowcaseCurve />
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-md-12">
              <h2 className="contact-title">
                <span className="x_wd_yellow_highlight_03">Contact</span> us
              </h2>
            </div>
          </div>

          <div className="row justify-content-center g-4 mb-4">
            <div className="col-md-6">
              <div className="card contact-card h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h3 className="card-title">Find a provider <i className="bi bi-chevron-down"></i></h3>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card contact-card h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h3 className="card-title">Request developments</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4 mb-5">
            <div className="col-md-6">
              <div className="card contact-card h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h3 className="card-title">Become a partner</h3>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card contact-card h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h3 className="card-title">Report a bug</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="x_wd col-xxl-10">
              <h2 className="display-3 mb-4">Serviify <span className="x_wd_yellow_highlight_03">Offices</span></h2>
              <h3 className="fs-4 mb-5">Eastern and Southern Africa</h3>
            </div>


            <div className="col-lg-6">
              <div className="card call-us-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <span className="country-flag me-2">🇿🇼</span>
                    <h4 className="mb-0">Zimbabwe<span className="country-tag"> - ZW</span></h4>
                  </div>
                  <div className="office-address mb-3">
                    <p className="mb-1">258 Smuts Rd Waterfalls</p>
                    <p className="mb-0">Harare, Zimbabwe</p>
                  </div>
                  <div className="phone-item d-flex align-items-center mb-3">
                    <span className="region">Phone:</span>
                    <span className="phone-number"><a href="tel:+263780116891" className="phone-link">+263 78 011 6891</a></span>
                  </div>
                  <div className="office-email">
                    <p className="mb-0">
                      <a href="mailto:support@serviify.co.zw" className="email-link">support@serviify.co.zw</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card expansion-card">
                <div className="card-body">
                  <div className="expansion-content">
                    <div className="mb-3">
                      <span className="global-icon me-2">🌍</span>
                      <h4 className="d-inline">Coming Soon</h4>
                    </div>
                    <p>We're excited to announce our upcoming expansion to other countries! Our mission is to connect service providers with customers worldwide.</p>
                    <div className="country-list">
                      <span className="badge bg-primary me-2 mb-2">South Africa</span>
                      <span className="badge bg-primary me-2 mb-2">Zambia</span>
                      <span className="badge bg-primary me-2 mb-2">Botswana</span>
                      <span className="badge bg-primary me-2 mb-2">Malawi</span>
                      <span className="badge bg-info me-2 mb-2">Rwanda</span>
                      <span className="badge bg-info me-2 mb-2">Ethopia</span>
                      <span className="badge bg-success me-2 mb-2">And more coming soon!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;