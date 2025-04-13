"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { Provider, GalleryItem, Post } from "../services/providers.service"
import logo from "../assets/logo.png"

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'gallery'>('posts')
  const [viewMode, setViewMode] = useState<'activity' | 'introduction' | 'contact'>('activity')

  useEffect(() => {
    const loadPlaceholderData = () => {
      // Simulate loading delay
      setTimeout(() => {
        if (!id) {
          setError("Provider ID is missing")
          setIsLoading(false)
          return
        }
        
        // Placeholder data for the provider
        const placeholderProvider: Provider = {
          id: id,
          first_name: "John",
          last_name: "Doe",
          profile_image_url: "https://randomuser.me/api/portraits/men/1.jpg",
          headline: "Professional Plumber & Home Repair Specialist",
          provider_location: "New York, NY",
          service_type: "Home Services",
          service_rating: 4.7,
          posts_count: 24,
          follows_count: 156,
          following_count: 89,
          provider_bio: "With over 15 years of experience in plumbing and home repairs, I specialize in quick, reliable fixes for all your household needs. Licensed and insured professional ready to help with emergencies 24/7.",
          posts: [
            {
              id: "1",
              user_id: id,
              content: "Just completed a major pipe replacement project for a client in downtown. #PlumbingWorks #HomeRepair",
              image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c",
              likes_count: 28,
              comments_count: 5,
              created_at: "2023-08-10T13:25:00Z"
            },
            {
              id: "2",
              user_id: id,
              content: "Tips for preventing frozen pipes this winter: 1) Keep your heat on 2) Let faucets drip 3) Keep interior doors open 4) Seal up cracks and holes. Call me for emergency services!",
              image_url: null,
              likes_count: 42,
              comments_count: 7,
              created_at: "2023-07-25T09:15:00Z"
            },
            {
              id: "3",
              user_id: id,
              content: "Finished installing a new kitchen sink and faucet today. The modern design really transformed the space! #KitchenUpgrade",
              image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
              likes_count: 36,
              comments_count: 4,
              created_at: "2023-07-18T16:40:00Z"
            }
          ],
          gallery: [
            {
              id: "1",
              user_id: id,
              image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
              caption: "Fixing a kitchen sink",
              created_at: "2023-05-15T10:30:00Z"
            },
            {
              id: "2",
              user_id: id,
              image_url: "https://images.unsplash.com/photo-1615529328331-f8917597711f",
              caption: "Bathroom renovation completed",
              created_at: "2023-06-22T14:45:00Z"
            },
            {
              id: "3",
              user_id: id,
              image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c",
              caption: "Emergency pipe repair",
              created_at: "2023-07-10T08:15:00Z"
            }
          ],
          reviews: [
            {
              id: "101",
              user_id: "user123",
              provider_id: id,
              reviewer_name: "Sarah Johnson",
              reviewer_image: "https://randomuser.me/api/portraits/women/42.jpg",
              rating: 5,
              comment: "John came in and fixed our leaking sink in less than an hour. Very professional and reasonably priced. Would definitely recommend!",
              created_at: "2023-04-18T16:30:00Z"
            },
            {
              id: "102",
              user_id: "user456",
              provider_id: id,
              reviewer_name: "Michael Brown",
              reviewer_image: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 4.5,
              comment: "Great service. Came on time and fixed our bathroom issues. Only taking off half a star because the initial quote was a bit lower than the final price.",
              created_at: "2023-03-05T11:20:00Z"
            },
            {
              id: "103",
              user_id: "user789",
              provider_id: id,
              reviewer_name: "Emma Wilson",
              reviewer_image: "https://randomuser.me/api/portraits/women/24.jpg",
              rating: 5,
              comment: "John is our go-to plumber now. He's fixed multiple issues in our old house and always does quality work. Very reliable!",
              created_at: "2023-02-12T09:45:00Z"
            }
          ]
        };
        
        setProvider(placeholderProvider);
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    loadPlaceholderData();
  }, [id]);

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
      <header className="py-3 border-bottom bg-white">
        <div className="container">
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center text-decoration-none me-auto">
              <div className="me-2">
                <img src={logo} alt="Serviify Logo" width="36" height="36" />
              </div>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#293040" }}>
                Serviify
              </span>
            </Link>
            <Link to="/provider-search" className="btn me-2" style={{ borderColor: "#293040", color: "#293040" }}>
              Back to Search
            </Link>
            <Link to="/auth?mode=login" className="start-now-btn">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="container mt-4" style={{ flex: "1 0 auto" }}>
        <div className="row">
          {/* Left Sidebar - Vertical Profile Section */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  marginBottom: "1.25rem" 
                }}>
                  {provider.profile_image_url ? (
                    <img
                      src={provider.profile_image_url}
                      alt={`${provider.first_name} ${provider.last_name}`}
                      className="rounded-circle"
                      style={{ 
                        width: "140px", 
                        height: "140px", 
                        objectFit: "cover", 
                        border: "4px solid white",
                        display: "block",
                        margin: "0 auto"
                      }}
                    />
                  ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "140px",
                        height: "140px",
                        backgroundColor: "#f0f2f5",
                        border: "4px solid white",
                        margin: "0 auto"
                      }}>
                      <span style={{ color: "#293040" }} className="fw-bold fs-1">
                        {provider.first_name ? provider.first_name.charAt(0) : ''}
                      </span>
                    </div>
                  )}
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
                <div className="mb-4 text-start">
                  <h5 className="card-title border-bottom pb-2 mb-3">About</h5>
                  {provider.provider_bio ? (
                    <p className="card-text">{provider.provider_bio}</p>
                  ) : (
                    <p className="card-text text-muted">No bio information available.</p>
                  )}
                </div>
                
                {/* Analytics Section */}
                <div className="text-start">
                  <h5 className="card-title border-bottom pb-2 mb-3">Analytics</h5>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fw-bold">0</div>
                      <div className="text-muted small">Profile views</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#293040" className="bi bi-graph-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fw-bold">0</div>
                      <div className="text-muted small">Post reach</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Join to View Panel - Moved from right column to left column */}
            <div className="card shadow-sm mb-4">
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
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
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
                  <button className="start-now-btn w-100">
                    Join the Network
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
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
                      {renderRating(provider.service_rating || 0)}
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="start-now-btn me-2" style={{ minWidth: "120px", padding: "8px 16px" }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                          </svg>
                          <span>Follow</span>
                        </div>
                      </button>
                      <button className="btn" style={{ borderColor: "#293040", color: "#293040", minWidth: "120px", padding: "8px 16px" }}>Contact</button>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    <div className="d-flex align-items-center justify-content-end">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      </svg>
                      <span>{provider.provider_location || "Location not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts/Gallery Card */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('posts')}
                    >
                      Posts
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                      onClick={() => setActiveTab('gallery')}
                    >
                      Gallery
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'posts' ? (
                  <div>
                    {provider.posts && provider.posts.length > 0 ? (
                      <div className="posts-container">
                        {provider.posts.map((post: Post) => (
                          <div key={post.id} className="card mb-3 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-center mb-3">
                                <img 
                                  src={provider.profile_image_url} 
                                  alt={`${provider.first_name} ${provider.last_name}`}
                                  className="rounded-circle me-2"
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                <div>
                                  <div className="fw-bold">{provider.first_name} {provider.last_name}</div>
                                  <div className="text-muted small">{formatDate(post.created_at)}</div>
                                </div>
                              </div>
                              <p className="card-text">{post.content}</p>
                              {post.image_url && (
                                <img 
                                  src={post.image_url} 
                                  alt="Post" 
                                  className="img-fluid rounded mb-3"
                                  style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }}
                                />
                              )}
                              <div className="d-flex align-items-center">
                                <button className="btn btn-sm text-muted me-3 d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up me-1" viewBox="0 0 16 16">
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                  </svg>
                                  <span>{post.likes_count}</span>
                                </button>
                                <button className="btn btn-sm text-muted d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat me-1" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                  </svg>
                                  <span>{post.comments_count}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ccc" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                          </svg>
                        </div>
                        <p className="text-muted">No posts available yet</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {provider.gallery && provider.gallery.length > 0 ? (
                      <div className="row row-cols-1 row-cols-md-3 g-3">
                        {provider.gallery.map((item: GalleryItem) => (
                          <div className="col" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm">
                              <img 
                                src={item.image_url} 
                                className="card-img-top" 
                                alt={item.caption || "Gallery image"}
                                style={{ height: "160px", objectFit: "cover" }}
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
                    ) : (
                      <div className="text-center py-4">
                        <div className="mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ccc" className="bi bi-images" viewBox="0 0 16 16">
                            <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                            <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                          </svg>
                        </div>
                        <p className="text-muted">No gallery items available yet</p>
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
        padding: "1rem 0",
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