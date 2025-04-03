import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import Footer from './Footer';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <div className="simple-header">
        <div className="simple-header-content">
          <Link to="/" className="logo-link">
            <img src="https://ngratesc.sirv.com/i-claim/serviify/logo.png" alt="Serviify Logo" />
            <span>About Serviify</span>
          </Link>
          <Link to="/" className="back-link">
            <i className="bi bi-arrow-left"></i> Back to Homepage
          </Link>
        </div>
      </div>

      <div className="about-container">
        <div className="about-content">
          
          <section className="about-section">
            <h2>Who are we?</h2>
            <p className="about-intro">
              Serviify began as a vision to simplify how people find and access professional services. 
              We're building a platform that will connect service providers with clients,
              making professional services accessible to everyone.
            </p>
            <p>
              Founded with a mission to transform service discovery, Serviify is being developed as the platform of choice 
              for both service providers and clients. Our team combines expertise in technology, 
              customer service, and industry knowledge to create an exceptional experience.
           

              We're working to build a platform that connects skilled service providers with clients who need their 
              expertise, creating economic opportunity for both.
            </p>
          </section>

          <section className="about-section">
            <h2>Vision</h2>
            <p>
              Create economic opportunity for every service provider and client by making professional 
              services as simple as a single click, empowering both providers and clients to achieve their goals.
            </p>
          </section>

          <section className="about-section">
            <h2>Mission</h2>
            <p>
              The mission of Serviify is simple: connect people with the right service providers 
              through a reliable and affordable platform to make them more productive and successful.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Team</h2>
            <p>
              Serviify is being developed by a dedicated team of professionals with experience in technology, 
              customer service, and marketplace solutions.
            </p>
            
            <div className="team-members">
              <div className="team-member">
                <div className="member-photo">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h3>Samuel Nyamatore</h3>
                <p className="member-title">Founder & CEO</p>
                <p className="member-bio">
                  With a passion for connecting service providers with clients, 
                  Samuel leads Serviify's strategic vision and development.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-photo">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h3>Grace Mwangi</h3>
                <p className="member-title">Technical Lead</p>
                <p className="member-bio">
                  Grace oversees Serviify's technological development, 
                  bringing valuable experience in software engineering and platform architecture.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-photo">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h3>David Moyo</h3>
                <p className="member-title">Operations Lead</p>
                <p className="member-bio">
                  David manages operational planning and service provider strategies, 
                  working to ensure Serviify will deliver exceptional experiences for all users.
                </p>
              </div>
            </div>
          </section>

          <div className="impact-stats">
            <div className="stat-card">
              <h3>100k+</h3>
              <p>Target Users</p>
            </div>
            <div className="stat-card">
              <h3>50K+</h3>
              <p>Provider Goal</p>
            </div>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Planned Categories</p>
            </div>
            <div className="stat-card">
              <h3>95%</h3>
              <p>Satisfaction Target</p>
            </div>
          </div>
        </div>
      </div>

      <div className="more-info-section">
        <div className="more-info-content">
          <h2 className="more-info-title">For more information about our company</h2>
          
          <div className="info-links">
            <div className="info-link-item">
              <i className="bi bi-grid-3x3-gap-fill" style={{fontSize: "2.5rem", color: "#293040"}}></i>
              <h3>Products and services</h3>
              <p>Grow your business with our unique mix of products.</p>
              <Link to="/services" className="learn-more-link">Learn more</Link>
            </div>
            
            <div className="info-link-item">
              <i className="bi bi-people-fill" style={{fontSize: "2.5rem", color: "#293040"}}></i>
              <h3>Company Page</h3>
              <p>Connect with our network of service professionals.</p>
              <Link to="/about" className="learn-more-link">Learn more</Link>
            </div>
            
            <div className="info-link-item">
              <i className="bi bi-newspaper" style={{fontSize: "2.5rem", color: "#293040"}}></i>
              <h3>Pressroom</h3>
              <p>Explore the latest Serviify news, updates, and reports.</p>
              <Link to="/help-centre" className="learn-more-link">Learn more</Link>
            </div>
            
            <div className="info-link-item">
              <i className="bi bi-brush-fill" style={{fontSize: "2.5rem", color: "#293040"}}></i>
              <h3>Branding policies</h3>
              <p>Find up-to-date guidelines on Serviify brand usage.</p>
              <Link to="/terms-of-service" className="learn-more-link">Learn more</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About; 