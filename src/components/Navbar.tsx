import { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';

interface NavbarProps {
  setShowSignup: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowSignup }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const prevScrollPosRef = useRef(0);
  
  useEffect(() => {
    prevScrollPosRef.current = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPosRef.current > currentScrollPos || currentScrollPos < 300;
      
      // Only update state if visibility changed to avoid unnecessary renders
      if (visible !== isVisible && !menuOpen) {
        setVisible(isVisible);
      }
      
      prevScrollPosRef.current = currentScrollPos;
    };
    
    // Set a small timeout to avoid scroll calculations during the actual scroll event
    const throttledScroll = () => {
      let timeout: number | undefined;
      return () => {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(() => {
          handleScroll();
        });
      };
    };
    
    const optimizedScroll = throttledScroll();
    window.addEventListener('scroll', optimizedScroll);
    
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [menuOpen]); // Add menuOpen to dependency array to rerun effect when menu state changes

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };
  
  return (
    <nav className={`navbar ${visible ? 'navbar-visible' : 'navbar-hidden'} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="https://ngratesc.sirv.com/i-claim/serviify/logo.png" alt="Serviify Logo" />
          <span className="logo-text">Serviify</span>
        </div>
        
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a href="#services" onClick={handleNavLinkClick}>Services</a>
          <a href="#Providers" onClick={handleNavLinkClick}>Providers</a>
          <a href="#About us" onClick={handleNavLinkClick}>About us</a>
          <a href="#support" onClick={handleNavLinkClick}>Support</a>
          <a href="#Help" onClick={handleNavLinkClick}>Help</a>
        </div>
        
        <div className="navbar-buttons">
          <button className="sign-in-btn" onClick={() => {
            setShowSignup(true);
            setMenuOpen(false);
          }}>Sign in</button>
          <button className="try-free-btn" onClick={() => {
            setShowSignup(true);
            setMenuOpen(false);
          }}>Find a provider</button>
        </div>
        
        <div className="mobile-menu-btn" onClick={handleMenuToggle}>
          <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 