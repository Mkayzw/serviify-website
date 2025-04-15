"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { Provider, GalleryItem, Post } from "../services/providers.service"
import { ProvidersService } from "../services/providers.service"
import { ApiConstants } from "../lib/api/apiConstants"
import logo from "../assets/logo.png"
import emptyPostsImage from "../assets/posts/post.png";
import emptyGalleryImage from "../assets/gallery/gallary.png"; 
import emptyReviewsImage from "../assets/providers/provider_4.png";

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'gallery' | 'reviews'>('posts')
  const [viewMode, setViewMode] = useState<'activity' | 'introduction' | 'contact'>('activity')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
 

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!id) {
        setError("Provider ID is missing")
        setIsLoading(false)
        return
      }

      console.log("Fetching provider with ID:", id);
      
      try {
        setIsLoading(true)
        const providerService = ProvidersService.getInstance()
        
        const providerData = await providerService.getProviderById(id)
        console.log("Provider data received:", providerData);
        
        // Log detailed provider data structure to inspect all available fields
        console.log("DETAILED PROVIDER DATA:");
        console.log(JSON.stringify(providerData, null, 2));
        
        if (!providerData) {
          console.error("Provider not found for ID:", id);
          setError("Provider not found")
        } else {
          console.log("Setting provider data:", {
            name: `${providerData.first_name} ${providerData.last_name}`,
            headline: providerData.headline,
            location: providerData.provider_location,
            rating: providerData.service_rating,
            gallery: providerData.gallery?.length,
            posts: providerData.posts?.length,
            bio: providerData.provider_bio?.substring(0, 50) + "..."
          });
          setProvider(providerData)
          
          setIsFollowing(false)
        }
      } catch (err) {
        console.error("Error fetching provider data:", err)
        setError("Failed to load provider data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviderData()
    
    // Check if user is signed in
    const checkUserSignedIn = () => {
      const token = localStorage.getItem('auth_token') || getCookie('auth_token');
      setIsUserSignedIn(!!token);
    }
    
    checkUserSignedIn();
  }, [id])

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  const handleFollowToggle = async () => {
    if (!id || !provider) return
    
    // Redirect to signup if user is not signed in
    if (!isUserSignedIn) {
      window.location.href = '/auth?mode=signup';
      return;
    }
    
    try {
      setIsFollowLoading(true)
      
      const endpoint = `/interactions/toggle-follow`
      const response = await fetch(`${ApiConstants.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          targetUserId: id 
        }),
        credentials: 'include' // Send cookies for authentication
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle follow status')
      }
      
      // Toggle following state after successful API call
      setIsFollowing((prev) => !prev)
      
      // Update follows count
      if (provider) {
        setProvider({
          ...provider,
          follows_count: isFollowing 
            ? (provider.follows_count || 0) - 1 
            : (provider.follows_count || 0) + 1
        })
      }
    } catch (error) {
      console.error('Error toggling follow status:', error)
      setError("Failed to toggle follow status. Please try again later.")
    } finally {
      setIsFollowLoading(false)
    }
  }

  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="d-flex align-items-center">
        <div className="me-1" style={{ color: "#293040" }}>
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
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
        <span className="small text-muted">{(rating || 0).toFixed(1)}</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading provider details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert" style={{
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
        <div className="text-center mt-4">
          <Link to="/provider-search" className="start-now-btn">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mt-5 text-center">
        <h3>Provider not found</h3>
        <p>The provider you're looking for doesn't exist or has been removed.</p>
        <Link to="/provider-search" className="start-now-btn mt-3">
          Back to Search
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f8f9fa"
    }}>
      <header className="py-3 border-bottom bg-white shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center text-decoration-none me-auto">
              <div className="me-2">
                <img src={logo} alt="Serviify Logo" width="40" height="40" className="rounded" />
              </div>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#293040", letterSpacing: "-0.5px" }}>
                Serviify
              </span>
            </Link>
            <Link to="/provider-search" className="btn me-3" style={{ 
              borderColor: "#293040", 
              color: "#293040", 
              borderRadius: "8px", 
              padding: "8px 16px",
              fontWeight: 500,
              transition: "all 0.2s ease"
            }}>
              <div className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                <span>Search</span>
              </div>
            </Link>
            <Link to="/auth?mode=login" className="start-now-btn" style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 500,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(41, 48, 64, 0.1)"
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="container mt-4" style={{ flex: "1 0 auto" }}>
        <div className="row">
          {/* Left Sidebar - Vertical Profile Section */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-body text-center">
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  marginBottom: "1.5rem" 
                }}>
                  <div className="position-relative">
                    <img
                      src={provider.profile_image_url || logo}
                      alt={`${provider.first_name} ${provider.last_name}`}
                      className="rounded-circle"
                      style={{ 
                        width: "160px", 
                        height: "160px", 
                        objectFit: "cover", 
                        border: "5px solid white",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s ease",
                        backgroundColor: !provider.profile_image_url ? '#eee' : 'transparent'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = logo;
                        target.style.objectFit = 'contain';
                        target.alt = 'Placeholder image';
                      }}
                    />
                  </div>
                </div>
                
                <h4 className="mb-4" style={{ color: "#293040" }}>
                  {provider.first_name} {provider.last_name}
                </h4>
                
                {/* Stats Row */}
                <div className="d-flex justify-content-around mb-4 border-top border-bottom py-3" style={{ margin: "0 -20px" }}>
                  <div className="text-center px-2">
                    <div className="fw-bold fs-5">{provider.posts_count || 0}</div>
                    <div className="text-muted small">Posts</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="fw-bold fs-5">{provider.follows_count || 0}</div>
                    <div className="text-muted small">Followers</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="fw-bold fs-5">{provider.following_count || 0}</div>
                    <div className="text-muted small">Following</div>
                  </div>
                </div>
                
                {/* About Section */}
                <div className="text-start">
                  <h5 className="card-title border-bottom pb-2 mb-3">Bio</h5>
                  {provider.provider_bio ? (
                    <p className="card-text">{provider.provider_bio}</p>
                  ) : (
                    <p className="card-text text-muted">No bio information available.</p>
                  )}

                  {/* Skills Section - ADDED */}
                  {provider.provider_skills && provider.provider_skills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="card-title border-bottom pb-2 mb-3">Skills</h5>
                      <div>
                        {provider.provider_skills.map((skill: string, index: number) => (
                          <span key={index} className="skill-tag me-1 mb-1">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability & Location Section */}
                  <div className="mt-4 d-flex justify-content-between">
                     {provider.provider_availability && (
                      <div>
                        <h5 className="card-title border-bottom pb-2 mb-3">Availability</h5>
                        <p className="card-text">
                           <span className="skill-tag me-1 mb-1">{provider.provider_availability}</span>
                        </p>
                      </div>
                     )}
                     {provider.provider_location && (
                       <div className="text-end">
                        <h5 className="card-title mb-2">Location</h5>
                        <p className="card-text">{provider.provider_location.split(',').map((part: string, i: number) => <span key={i} className="d-block">{part.trim()}</span>)}</p>
                      </div>
                     )}
                  </div>

                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2 mb-3">Analytics</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-star" viewBox="0 0 16 16">
                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="fw-bold">{(provider.service_rating || 0).toFixed(1)}</div>
                    <div className="text-muted small">Rating</div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-person" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c0-.001-.001-.044-.03-.089C13.538 10.023 12.236 9 8 9s-5.538 1.023-5.97 1.907c-.03.045-.03.088-.03.089V12h12v-.004Z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="fw-bold">{provider.total_referrals || 0}</div>
                    <div className="text-muted small">Refers</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="fw-bold">{provider.total_bookmarks || 0}</div>
                    <div className="text-muted small">Bookmarks</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-body">
                <h5 className="card-title mb-3">View Full Profile</h5>
                <div className="mb-3">
                  <div 
                    className={`d-flex align-items-center mb-3 p-2 rounded cursor-pointer ${viewMode === 'activity' ? 'bg-light' : ''}`}
                    onClick={() => setViewMode('activity')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                      </svg>
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">See activity</div>
                      <small className="text-muted">View {provider.first_name}'s recent posts</small>
                    </div>
                    {viewMode === 'activity' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg>
                    )}
                  </div>
                  
                  <div 
                    className={`d-flex align-items-center mb-3 p-2 rounded cursor-pointer ${viewMode === 'introduction' ? 'bg-light' : ''}`}
                    onClick={() => setViewMode('introduction')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                      </svg>
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">Get introduction</div>
                      <small className="text-muted">Connect through mutual contacts</small>
                    </div>
                    {viewMode === 'introduction' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg>
                    )}
                  </div>
                  
                  <div 
                    className={`d-flex align-items-center p-2 rounded cursor-pointer ${viewMode === 'contact' ? 'bg-light' : ''}`}
                    onClick={() => setViewMode('contact')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                      </svg>
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">Contact details</div>
                      <small className="text-muted">Get direct contact information</small>
                    </div>
                    {viewMode === 'contact' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#293040" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <Link to="/auth?mode=signup" className="start-now-btn w-100">
                    Join the Network
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="col-md-8">
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="mb-2" style={{ color: "#293040" }}>
                      {provider.first_name} {provider.last_name}
                    </h4>
                    {provider.headline && (
                      <p className="mb-2">{provider.headline}</p>
                    )}
                    <div className="mb-3">
                      <span className="me-2">
                        {provider.service_type || "Service Provider"}
                      </span>
                    
                    </div>
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn me-2" 
                        style={{ 
                          minWidth: "130px", 
                          padding: "10px 16px",
                          backgroundColor: "#293040",
                          color: "white",
                          fontWeight: "500",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 5px rgba(41, 48, 64, 0.2)",
                          transition: "all 0.2s ease"
                        }} 
                        onClick={handleFollowToggle}
                        disabled={isFollowLoading}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          {isFollowLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                              <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                          )}
                          <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                        </div>
                      </button>
                      <button className="btn" style={{ 
                        minWidth: "130px", 
                        padding: "10px 16px",
                        borderColor: "#293040",
                        color: "#293040",
                        fontWeight: "500",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 5px rgba(41, 48, 64, 0.1)" 
                      }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                          </svg>
                          <span>Contact</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    {/* REMOVED Location display from here */}
                    {/* <div className="d-flex align-items-center justify-content-end">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      </svg>
                      <span>{provider.provider_location || "Location not specified"}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts/Gallery/Reviews Card */}
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              overflow: "hidden", 
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-header bg-white border-bottom-0 pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('posts')}
                      style={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        padding: '12px 20px',
                        borderRadius: activeTab === 'posts' ? '0' : '8px 8px 0 0',
                        ...(activeTab !== 'posts' && { 
                          backgroundColor: 'transparent', 
                          borderColor: 'transparent', 
                          color: '#6c757d'
                        }),
                        ...(activeTab === 'posts' && {
                          borderBottom: '3px solid #293040',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                        })
                      }} 
                    >
                      <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 0 13V2.5zM1.5 2a.5.5 0 0 0-.5.5v10.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5h-11z"/>
                          <path d="M2 4.5A.5.5 0 0 1 2.5 4h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        Posts
                      </div>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                      onClick={() => setActiveTab('gallery')}
                      style={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        padding: '12px 20px',
                        borderRadius: activeTab === 'gallery' ? '0' : '8px 8px 0 0',
                        ...(activeTab !== 'gallery' && { 
                          backgroundColor: 'transparent', 
                          borderColor: 'transparent', 
                          color: '#6c757d'
                        }),
                        ...(activeTab === 'gallery' && {
                          borderBottom: '3px solid #293040',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                        })
                      }} 
                    >
                      <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                          <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4.002z"/>
                        </svg>
                        Gallery
                      </div>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                      style={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        padding: '12px 20px',
                        borderRadius: activeTab === 'reviews' ? '0' : '8px 8px 0 0',
                        ...(activeTab !== 'reviews' && { 
                          backgroundColor: 'transparent', 
                          borderColor: 'transparent', 
                          color: '#6c757d'
                        }),
                        ...(activeTab === 'reviews' && {
                          borderBottom: '3px solid #293040',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                        })
                      }} 
                    >
                      <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        Reviews
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'posts' ? (
                  <div>
                    {provider.posts && provider.posts.length > 0 ? (
                      <div className="posts-container">
                        {provider.posts.slice(0, 2).map((post: Post) => (
                          <div key={post.id} className="card mb-3 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-center mb-3">
                                <img 
                                  src={provider.profile_image_url || logo} 
                                  alt={`${provider.first_name} ${provider.last_name}`}
                                  className="rounded-circle me-2"
                                  style={{ 
                                    width: "40px", 
                                    height: "40px", 
                                    objectFit: "cover",
                                    backgroundColor: !provider.profile_image_url ? '#eee' : 'transparent'
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = logo;
                                    target.style.objectFit = 'contain';
                                    target.alt = 'Placeholder image';
                                  }}
                                />
                                <div>
                                  <div className="fw-bold">{provider.first_name} {provider.last_name}</div>
                                  <div className="text-muted small">{formatDate(post.created_at)}</div>
                                </div>
                              </div>
                              <p className="card-text">{post.caption}</p>
                              {post.image_url ? (
                                <img 
                                  src={post.image_url}
                                  alt="Post image" 
                                  className="img-fluid rounded mb-3"
                                  style={{ 
                                    maxHeight: "300px", 
                                    width: "100%", 
                                    objectFit: "cover",
                                    backgroundColor: '#eee'
                                  }}
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.src = logo; 
                                    target.style.objectFit = 'contain';
                                    target.alt = 'Placeholder image';
                                  }} 
                                />
                              ) : null}
                              <div className="d-flex align-items-center">
                                <button className="btn btn-sm text-muted me-3 d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up me-1" viewBox="0 0 16 16">
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                  </svg>
                                  <span>{post.likes_count}</span>
                                </button>
                                <button className="btn btn-sm text-muted d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat me-1" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7c0 4.314-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                  </svg>
                                  <span>{post.comments_count}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {provider.posts.length > 2 && (
                          <div className="text-center mt-3 mb-2">
                            <Link to="/auth?mode=signup" className="start-now-btn">
                              View More Posts ({provider.posts.length - 2} more)
                            </Link>
                            <div className="text-muted small mt-2">Sign up to see all posts from this provider</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 d-flex flex-column align-items-center">
                        <img 
                          src={emptyPostsImage} 
                          alt="No posts available" 
                          style={{ width: '150px', height: 'auto', marginBottom: '1rem' }} 
                        />
                        <p className="text-muted mb-0">No posts available yet</p>
                      </div>
                    )}
                  </div>
                ) : activeTab === 'gallery' ? (
                  <div>
                    {provider.gallery && provider.gallery.length > 0 ? (
                      <>
                        <div className="row row-cols-1 row-cols-md-3 g-3">
                          {provider.gallery.slice(0, 3).map((item: GalleryItem) => (
                            <div className="col" key={item.id}>
                              <div className="card h-100 border-0 shadow-sm">
                                <img 
                                  src={item.image_url || logo} 
                                  className="card-img-top" 
                                  alt={item.caption || "Gallery image"}
                                  style={{ 
                                    height: "160px", 
                                    objectFit: "cover",
                                    backgroundColor: !item.image_url ? '#eee' : 'transparent'
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = logo;
                                    target.style.objectFit = 'contain';
                                    target.alt = 'Placeholder image';
                                  }}
                                />
                                {item.caption && (
                                  <div className="card-body">
                                    <p className="card-text small">{item.caption}</p>
                                    <p className="card-text"><small className="text-muted">{formatDate(item.created_at)}</small></p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {provider.gallery.length > 3 && (
                          <div className="text-center mt-4">
                            <Link to="/auth?mode=signup" className="start-now-btn">
                              View More Photos ({provider.gallery.length - 3} more)
                            </Link>
                            <div className="text-muted small mt-2">Sign up to see the complete gallery</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 d-flex flex-column align-items-center">
                        <img 
                          src={emptyGalleryImage} 
                          alt="No gallery items available" 
                          style={{ width: '150px', height: 'auto', marginBottom: '1rem' }} 
                        />
                        <p className="text-muted mb-0">No gallery items available yet</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {provider.reviews && provider.reviews.length > 0 ? (
                      <div>
                        {provider.reviews.map((review, index) => (
                          <div key={review.id || index} className="card mb-3 shadow-sm border-0">
                            <div className="card-body">
                              <div className="d-flex justify-content-between mb-2">
                                <div className="fw-bold">
                                  {review.client?.first_name} {review.client?.last_name || review.reviewer_name}
                                </div>
                                <div>{renderRating(review.rating || 0)}</div>
                              </div>
                              <div className="text-muted small mb-2">
                                {review.created_at ? formatDate(review.created_at) : 'Date not available'}
                              </div>
                              <p className="card-text">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 d-flex flex-column align-items-center">
                        <img 
                          src={emptyReviewsImage} 
                          alt="No reviews available" 
                          style={{ width: '150px', height: 'auto', marginBottom: '1rem' }} 
                        />
                        <p className="text-muted mb-0">No Reviews Available</p>
                        <p className="text-muted small mt-1">Be the first to leave a review for this provider</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{
        backgroundColor: "white",
        borderTop: "1px solid #dee2e6",
        padding: "1.5rem 0",
        flex: "0 0 auto",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.03)"
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-3 mb-lg-0">
              <div className="d-flex align-items-center mb-3">
                <img src={logo} alt="Serviify Logo" width="32" height="32" className="me-2" />
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#293040" }}>Serviify</span>
              </div>
              <p className="text-muted small mb-0">Connecting professionals with those who need their services.</p>
              <p className="text-muted small">© {new Date().getFullYear()} Serviify. All rights reserved.</p>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-sm-4 mb-3 mb-sm-0">
                  <h6 className="mb-3 text-dark">Company</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><a href="/about" className="text-decoration-none small" style={{ color: "#566074" }}>About Us</a></li>
                    <li className="mb-2"><a href="/careers" className="text-decoration-none small" style={{ color: "#566074" }}>Careers</a></li>
                    <li><a href="/press" className="text-decoration-none small" style={{ color: "#566074" }}>Press</a></li>
                  </ul>
                </div>
                <div className="col-sm-4 mb-3 mb-sm-0">
                  <h6 className="mb-3 text-dark">Legal</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><a href="/privacy-policy" className="text-decoration-none small" style={{ color: "#566074" }}>Privacy Policy</a></li>
                    <li className="mb-2"><a href="/terms-of-service" className="text-decoration-none small" style={{ color: "#566074" }}>Terms of Service</a></li>
                    <li><a href="/cookie-policy" className="text-decoration-none small" style={{ color: "#566074" }}>Cookie Policy</a></li>
                  </ul>
                </div>
                <div className="col-sm-4">
                  <h6 className="mb-3 text-dark">Support</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><a href="/help-centre" className="text-decoration-none small" style={{ color: "#566074" }}>Help Centre</a></li>
                    <li className="mb-2"><a href="/support" className="text-decoration-none small" style={{ color: "#566074" }}>Contact Support</a></li>
                    <li><a href="/faq" className="text-decoration-none small" style={{ color: "#566074" }}>FAQ</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 

