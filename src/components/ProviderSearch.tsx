"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logo from '../assets/logo.png'
import discoverImage from '../assets/discover/discover_1.png'
import { Provider, ProvidersService, DiscoverServicesParams } from "../services/providers.service"

export default function ProviderSearch() {
  const [fullName, setFullName] = useState("")
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
          switch (err.code) {
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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white"
    }}>

      <header className="py-3 border-bottom bg-white">
        <div className="container">
          <div className="d-flex align-items-center">
            {/* Logo */}
            {/* Logo with Providers text using inline CSS */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                marginRight: "16px"
              }}
            >
              <img src={logo} alt="Serviify Logo" style={{ height: "32px" }} />
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#293040",
                  marginLeft: "8px"
                }}
              >
                Providers
              </span>
            </Link>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="d-flex flex-grow-1 align-items-center">
              <div className="input-group">
                {/* Search input */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <button
                  type="submit"
                  className="start-now-btn ms-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Sign In Button */}
            <Link to="/auth?mode=login" className="sign-in-btn ms-4">Sign in</Link>
          </div>
        </div>
      </header>

      {/* Results Area */}
      <div className="container mt-4" style={{ flex: "1 0 auto" }}>
        {/* Call to action for nearby services */}
        {searchResults.length === 0 && !error && !isLoading && (
          <div className="text-center my-5">
            <div className="illustration-container mb-4">
              <img
                src={discoverImage}
                alt="People illustration"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "360px" }}
              />
            </div>
            <h2 className="mb-4">Looking for service providers?</h2>
            <p className="mb-4 text-muted">Enter a full name to search or browse service providers near you.</p>
            <button
              onClick={handleLoadNearbyServices}
              className="start-now-btn"
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
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <div className="d-flex justify-content-between mb-3">
              <h3 style={{ color: "#293040" }}>
                Results {fullName.trim() ? `for "${fullName}"` : ''}
              </h3>
              <span>{searchResults.length} providers found</span>
            </div>

            <div className="provider-results">
              {searchResults.map(provider => (
                <div key={provider.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        {provider.profile_image_url ? (
                          <img
                            src={provider.profile_image_url}
                            alt={`${provider.first_name} ${provider.last_name}`}
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
                            <span style={{ color: "#293040" }} className="fw-bold fs-4">{provider.first_name ? provider.first_name.charAt(0) : ''}</span>
                          </div>
                        )}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h5 className="card-title mb-0" style={{ color: "#293040" }}>
                            {provider.first_name} {provider.last_name}
                          </h5>
                          <div className="d-flex align-items-center">
                            <div className="me-1" style={{ color: "#293040" }}>
                              {Array.from({ length: 5 }, (_, i) => {
                                const starValue = i + 1;
                                const rating = provider.service_rating || 0;
                                const decimal = rating % 1;
                                
                                if (starValue <= Math.floor(rating)) {
                                  return <span key={i}>★</span>; 
                                } else if (starValue === Math.floor(rating) + 1 && decimal > 0) {
                                  return (
                                    <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                      <span style={{ color: "#293040" }}>☆</span>
                                      <span style={{ 
                                        position: 'absolute', 
                                        left: 0, 
                                        top: 0, 
                                        width: `${decimal * 100}%`, 
                                        overflow: 'hidden', 
                                        color: "#293040" 
                                      }}>★</span>
                                    </span>
                                  ); 
                                } else {
                                  return <span key={i}>☆</span>;
                                }
                              })}
                            </div>
                            <span className="small text-muted">{(provider.service_rating || 0).toFixed(1)}</span>
                          </div>
                        </div>

                        {provider.headline && (
                          <p className="card-text text-muted mb-1">{provider.headline}</p>
                        )}

                        <div className="mb-3">
                          <span>
                            {provider.service_type}
                          </span>
                        </div>

                        <div className="d-flex mt-2 justify-content-between align-items-center">
                          <div>
                            <button className="start-now-btn">Contact</button>
                            <Link
                              to={`/provider/${provider.id}`}
                              className="btn ms-2"
                              style={{ borderColor: "#293040", color: "#293040" }}
                            >
                              View Profile
                            </Link>
                          </div>
                          <span>
                            {provider.provider_location
                              ? (provider.provider_location.split(',').length > 1
                                ? provider.provider_location.split(',')[provider.provider_location.split(',').length - 1].trim()
                                : provider.provider_location)
                              : 'Location unknown'}
                          </span>
                        </div>
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
      <footer style={{
        height: "60px",
        backgroundColor: "white",
        borderTop: "1px solid #dee2e6",
        display: "flex",
        alignItems: "center",
        flex: "0 0 auto"
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">© {new Date().getFullYear()} Serviify. All rights reserved.</div>
            <div>
              <a href="/about" className="text-decoration-none small me-3" style={{ color: "#293040" }}>About Us</a>
              <a href="/privacy-policy" className="text-decoration-none small me-3" style={{ color: "#293040" }}>Privacy and Policy</a>
              <a href="/terms-of-service" className="text-decoration-none small me-3" style={{ color: "#293040" }}>Terms of Service</a>
              <a href="/support" className="text-decoration-none small me-3" style={{ color: "#293040" }}>Support</a>
              <a href="/help-centre" className="text-decoration-none small me-3" style={{ color: "#293040" }}>Help Centre</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 