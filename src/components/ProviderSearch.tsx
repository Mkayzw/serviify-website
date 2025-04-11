"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logo from '../assets/logo.png'
import { Provider, ProvidersService, DiscoverServicesParams } from "../services/providers.service"

export default function ProviderSearch() {
  const [fullName, setFullName] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [searchResults, setSearchResults] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize the providers service
  const providersService = ProvidersService.getInstance()
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // First try searching by name if provided
      if (fullName.trim()) {
        try {
          console.log("Searching by name:", fullName)
          const providers = await providersService.searchUsers(fullName.trim())
          console.log("Name search results:", providers)
          
          if (providers && providers.length > 0) {
            setSearchResults(providers)
            setIsLoading(false)
            return
          } else {
            console.log("No results from name search, will try discover services")
          }
        } catch (err) {
          console.log("Name search failed with error:", err)
          console.log("Falling back to discover services")
          // Continue to discover method if name search fails
        }
      }
      
      // Fall back to discover services method
      const params: DiscoverServicesParams = {
        query: fullName.trim() || undefined,
        serviceType: serviceType || undefined,
        sortBy: 'rating'
      }
      
      console.log("Discovering services with params:", params)
      
      try {
        const response = await providersService.discoverServices(params)
        console.log("Discover services response:", response)
        
        if (response && response.providers) {
          setSearchResults(response.providers)
          console.log("Search results set to:", response.providers)
          
          // If no results found
          if (response.providers.length === 0) {
            console.log("No providers found in discover services")
            setError("No service providers match your search. Try broadening your search criteria or check for typos.")
          }
        } else {
          console.log("Invalid response format:", response)
          setError("We couldn't process the search results. Please try again in a moment.")
        }
      } catch (err) {
        console.error("Error discovering services:", err)
        setError("We're having trouble finding service providers right now. Please try again in a few minutes.")
        setSearchResults([])
      }
    } catch (err) {
      console.error("Error searching for providers:", err)
      setError("Something went wrong with your search. Please try again or check your internet connection.")
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load nearby services using geolocation
  const handleLoadNearbyServices = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      setError(null)
      console.log("Getting user location...")
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            console.log("Got user location:", latitude, longitude)
            
            try {
              console.log("Fetching nearby services...")
              const providers = await providersService.getNearbyServices(latitude, longitude, 25)
              console.log("Nearby services response:", providers)
              
              if (providers && Array.isArray(providers)) {
                setSearchResults(providers)
                console.log("Set search results to nearby providers:", providers.length, "results")
                
                if (providers.length === 0) {
                  console.log("No nearby providers found")
                  setError("We couldn't find any service providers in your area. Try searching by name or service type instead.")
                }
              } else {
                console.log("Invalid providers response:", providers)
                setError("We couldn't load the list of nearby services. Please try again in a moment.")
              }
            } catch (err) {
              console.error("Error loading nearby services:", err)
              setError("We couldn't find services near you right now. Try searching by name or service type instead.")
              setSearchResults([])
            }
          } catch (err) {
            console.error("Error processing geolocation data:", err)
            setError("We couldn't determine your exact location. Try refreshing the page or search by name instead.")
            setSearchResults([])
          } finally {
            setIsLoading(false)
          }
        },
        (err) => {
          console.error("Geolocation error:", err, "Code:", err.code)
          let errorMessage = "Unable to access your location."
          
          // More helpful error message based on error code
          switch(err.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access was denied. Please allow location access in your browser settings to find nearby services."
              break
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "We couldn't determine your current location. Try searching by name or service type instead."
              break
            case 3: // TIMEOUT
              errorMessage = "Finding your location is taking too long. Please try again or search by name instead."
              break
          }
          
          setError(errorMessage)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      console.log("Geolocation not supported by browser")
      setError("Your browser doesn't support location services. Try searching by name or service type instead.")
    }
  }
  
  return (
    <div className="min-vh-100 bg-white">
      
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
                {/* Full Name */}
                <input
                  type="text"
                  className="form-control border-end-0"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
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
            <Link to="/auth" className="btn rounded-pill ms-3 px-4" style={{ backgroundColor: "#293040", color: "white" }}>Sign in</Link>
          </div>
        </div>
      </header>
      
      {/* Results Area */}
      <div className="container mt-4">
        {/* Call to action for nearby services */}
        {searchResults.length === 0 && !error && !isLoading && (
          <div className="text-center my-5">
            <div className="illustration-container mb-4">
              <img 
                src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
                alt="People illustration" 
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "300px" }}
              />
            </div>
            <h2 className="mb-4">Looking for service providers?</h2>
            <p className="mb-4 text-muted">Search by full name or browse service providers near you.</p>
            <button 
              onClick={handleLoadNearbyServices} 
              className="btn rounded-pill px-4"
              style={{ backgroundColor: "#293040", color: "white" }}
              disabled={isLoading}
            >
              Find Nearby Services
            </button>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="alert mt-4" style={{ 
            backgroundColor: "rgba(41, 48, 64, 0.1)", 
            color: "#293040", 
            border: "1px solid #293040",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-exclamation-circle me-2" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              {error}
            </div>
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
                        <Link 
                          to={`/provider/${provider.id}`} 
                          className="btn btn-sm ms-2" 
                          style={{ borderColor: "#293040", color: "#293040" }}
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Searching for providers...</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="container-fluid border-top mt-5 py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img 
                src={logo} 
                alt="Serviify Logo" 
                style={{ height: "24px" }}
                className="me-2"
              />
              <span className="text-muted small">© {new Date().getFullYear()}</span>
            </div>
            
            <div>
              <ul className="nav m-0">
                <li className="nav-item"><Link to="/about" className="nav-link px-2 text-muted small">About</Link></li>
                <li className="nav-item"><Link to="/terms-of-service" className="nav-link px-2 text-muted small">Terms</Link></li>
                <li className="nav-item"><Link to="/privacy-policy" className="nav-link px-2 text-muted small">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 