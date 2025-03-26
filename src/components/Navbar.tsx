import { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';

interface NavbarProps {
  setShowSignup: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowSignup }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show navbar when at the top
          if (currentScrollY < 50) {
            setVisible(true);
          } 
          // Hide when scrolling down, show when scrolling up
          else {
            if (currentScrollY > lastScrollY.current) {
              setVisible(false); // Scrolling DOWN
            } else {
              setVisible(true);  // Scrolling UP
            }
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    setVisible(true);
  };
  
  const handleNavLinkClick = () => {
    setMenuOpen(false);
    setVisible(true);
  };
  
  return (
    <nav className={`navbar ${visible ? '' : 'navbar-hidden'}`}>
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