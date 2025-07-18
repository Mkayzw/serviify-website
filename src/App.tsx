import {ToastContainer} from "react-toastify";
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrivacyPolicy from './components/PrivacyPolicy';
import HelpCentre from './components/HelpCentre';
import TermsOfService from './components/TermsOfService';
import About from './components/About';
import Auth from './components/Auth';
import ScrollToTop from './components/ScrollToTop';
import Support from './components/Support';
import ProviderSearch from './components/ProviderSearch';
import ProviderProfile from './components/ProviderProfile';
import ServicesPage from './components/ServicesPage';
// Import font loader for optimization
import './lib/fontLoader';


function App() {
  const navigate = useNavigate();

  // Functions to navigate to pages
  const goToHelpCentre = () => {
    navigate('/help-centre');
  };
  
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <>
            <Navbar 
              setShowHelpCentre={goToHelpCentre}
            />
            <Hero />
          </>
        } />
        
        <Route path="/privacy-policy" element={
          <PrivacyPolicy />
        } />
        
        <Route path="/terms-of-service" element={
          <TermsOfService />
        } />
        
        <Route path="/help-centre" element={
          <HelpCentre />
        } />
        
        <Route path="/about" element={
          <About />
        } />
        
        <Route path="/auth" element={
          <Auth />
        } />
        
        <Route path="/forgot-password" element={
          <Auth />
        } />
        
        <Route path="/support" element={
          <Support />
        } />
        
        <Route path="/provider-search" element={
          <ProviderSearch />
        } />
        
        <Route path="/provider/:id" element={
          <ProviderProfile />
        } />
        
        <Route path="/services" element={
          <ServicesPage />
        } />
        
      
      </Routes>
      
      <ToastContainer />
    </div>
  )
}

export default App
