"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logo from '../assets/logo.png'
import { Provider, ProvidersService, DiscoverServicesParams } from "../services/providersService"

export default function ProviderSearch() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [location] = useState("")
  const [searchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const providersService = ProvidersService.getInstance()
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Build a query string from first and last name if provided
      let query = searchQuery;
      if (!query && (firstName || lastName)) {
        query = `${firstName} ${lastName}`.trim();
      }
      
      let providers: Provider[] = [];
      
      // Try direct user search first if we have a query
      if (query) {
        try {
          console.log("Attempting direct user search with:", query);
          providers = await providersService.searchUsers(query);
          
          if (providers.length > 0) {
            setSearchResults(providers);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.log("Direct search failed, falling back to discover method");
          // Continue to discover method
        }
      }
      
      // Fall back to discover services method
      const params: DiscoverServicesParams = {
        query,
        serviceType: serviceType || undefined,
        location: location || undefined,
        sortBy: 'rating'
      }
      
      console.log("Discovering services:", params)
      
      const response = await providersService.discoverServices(params)
      setSearchResults(response.providers)
      
      // If the API call worked but returned no results
      if (response.providers.length === 0) {
        setError("No providers found matching your criteria. Please try a different search.")
      }
    } catch (err) {
      console.error("Error discovering services:", err)
      setError("An error occurred while searching for providers. Please try again.")
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load nearby services when location is available (could be extended to use browser geolocation)
  const handleLoadNearbyServices = async () => {
    if (navigator.geolocation) {
      try {
        setIsLoading(true)
        setError(null)
        
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const providers = await providersService.getNearbyServices(latitude, longitude, 25)
            setSearchResults(providers)
            if (providers.length === 0) {
              setError("No service providers found near your location.")
            }
          } catch (err) {
            console.error("Error loading nearby services:", err)
            setError("Failed to load nearby service providers.")
            setSearchResults([])
          } finally {
            setIsLoading(false)
          }
        }, (err) => {
          console.error("Geolocation error:", err)
          setError("Unable to access your location. Please enter a location manually.")
          setIsLoading(false)
        })
      } catch (err) {
        console.error("Geolocation error:", err)
        setError("Unable to access your location. Please enter a location manually.")
        setIsLoading(false)
      }
    } else {
      setError("Geolocation is not supported by your browser. Please enter a location manually.")
    }
  }
  
  return (
    <div className="min-vh-100 bg-white">
      {/* Header with Search Bar */}
      <header className="py-3 border-bottom bg-white">
        <div className="container">
          <div className="d-flex align-items-center">
            {/* Logo */}
            <Link to="/" className="me-4">
              <img src={logo} alt="Serviify Logo" style={{ height: "32px" }} />
            </Link>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="d-flex flex-grow-1 align-items-center">
              <div className="input-group">
                {/* First Name */}
                <input
                  type="text"
                  className="form-control border-end-0"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                />
                
                {/* Last Name */}
                <input
                  type="text"
                  className="form-control border-start-0 border-end-0"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ borderRadius: 0 }}
                />
                
                {/* Service Type */}
                <select
                  className="form-select border-start-0"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: "auto", minWidth: "180px" }}
                >
                  <option value="">All Services</option>
                  <option value="electrical">Electrical Services</option>
                  <option value="auto">Auto Mechanics</option>
                  <option value="carpentry">Carpentry Services</option>
                  <option value="agriculture">Agricultural Services</option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="realestate">Real Estate Services</option>
                  <option value="eventplanning">Event Planning</option>
                </select>
                
                <button 
                  type="submit" 
                  className="btn ms-2"
                  style={{ backgroundColor: "#293040", color: "white" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
            
            {/* Sign In Button */}
            <Link to="/auth" className="btn rounded-pill ms-3 px-4" style={{ borderColor: "#293040", color: "#293040" }}>Sign in</Link>
          </div>
        </div>
      </header>
      
      {/* Results Area */}
      <div className="container mt-4">
        {/* Error Message */}
        {error && (
          <div className="alert alert-warning mt-4">
            {error}
          </div>
        )}
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <div className="d-flex justify-content-between mb-3">
              <h3 style={{ color: "#293040" }}>Results</h3>
              <span>{searchResults.length} providers found</span>
            </div>
            
            <div className="provider-results">
              {searchResults.map(provider => (
                <div key={provider.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        {provider.avatar ? (
                          <img 
                            src={provider.avatar} 
                            alt={provider.name} 
                            className="rounded-circle" 
                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ 
                                 width: "70px", 
                                 height: "70px", 
                                 backgroundColor: "rgba(41, 48, 64, 0.1)" 
                               }}>
                            <span style={{ color: "#293040" }} className="fw-bold fs-4">{provider.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h5 className="card-title mb-1" style={{ color: "#293040" }}>{provider.name}</h5>
                        <p className="card-text text-muted mb-1">{provider.serviceType} · {provider.location}</p>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-1" style={{ color: "#293040" }}>
                            {'★'.repeat(Math.floor(provider.rating))}
                            {provider.rating % 1 > 0 ? '☆' : ''}
                            {'☆'.repeat(5 - Math.ceil(provider.rating))}
                          </div>
                          <span className="small text-muted">{provider.rating.toFixed(1)}</span>
                        </div>
                        <button className="btn btn-sm" style={{ backgroundColor: "#293040", color: "white" }}>Contact</button>
                        <button className="btn btn-sm ms-2" style={{ borderColor: "#293040", color: "#293040" }}>View Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {searchResults.length === 0 && !isLoading && !error && (
          <div className="text-center my-5 py-5">
            <div className="mb-4">
              <img src="https://ngratesc.sirv.com/i-claim/serviify/search-illustration.png" 
                alt="Search for providers" 
                style={{ maxWidth: "200px", opacity: 0.6 }} />
            </div>
            <h3 style={{ color: "#293040" }}>Search for service providers</h3>
            <p className="text-muted">
              Enter a name or choose a service type to find qualified professionals
            </p>
            <button 
              onClick={handleLoadNearbyServices}
              className="btn mt-2"
              style={{ borderColor: "#293040", color: "#293040" }}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Find Nearby Services"}
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-5 py-4 border-top">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <img src={logo} alt="Serviify Logo" style={{ height: "24px" }} />
              <span className="ms-2 text-muted small">© 2023 Serviify</span>
            </div>
            <div className="d-flex gap-3 small">
              <Link to="/terms-of-service" className="text-decoration-none" style={{ color: "#293040" }}>Terms of Service</Link>
              <Link to="/privacy-policy" className="text-decoration-none" style={{ color: "#293040" }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 