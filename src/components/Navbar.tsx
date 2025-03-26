import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

interface NavbarProps {
  setShowSignup: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowSignup }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // Current scroll position
      const currentScrollPos = window.scrollY;
      
      // Set navbar visible if scrolling up, hide when scrolling down
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 70;
      
      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleNavLinkClick = () => {
    setMenuOpen(false);
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