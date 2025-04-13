"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { Provider, GalleryItem } from "../services/providers.service"

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
                    <div className="d-flex align-items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      </svg>
                      <span>{provider.provider_location || "Location not specified"}</span>
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-2 p-2">
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
                    <div className="text-muted small mb-2">Member since</div>
                    <div>Jan 2023</div>
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
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ccc" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                      </svg>
                    </div>
                    <p className="text-muted">No posts available yet</p>
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

            {/* Join to View Panel */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">View Full Profile</h5>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="viewMode" 
                        id="activityRadio"
                        checked={viewMode === 'activity'}
                        onChange={() => setViewMode('activity')}
                      />
                      <label className="form-check-label" htmlFor="activityRadio">
                        See activity
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="viewMode" 
                        id="introductionRadio"
                        checked={viewMode === 'introduction'} 
                        onChange={() => setViewMode('introduction')}
                      />
                      <label className="form-check-label" htmlFor="introductionRadio">
                        Get introduction
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="viewMode" 
                        id="contactRadio"
                        checked={viewMode === 'contact'} 
                        onChange={() => setViewMode('contact')}
                      />
                      <label className="form-check-label" htmlFor="contactRadio">
                        Contact details
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8">
                    {viewMode === 'activity' && (
                      <div className="p-3 bg-light rounded">
                        <p className="mb-0">See {provider.first_name}'s recent activity and posts.</p>
                      </div>
                    )}
                    {viewMode === 'introduction' && (
                      <div className="p-3 bg-light rounded">
                        <p className="mb-0">Request an introduction to {provider.first_name} through mutual connections.</p>
                      </div>
                    )}
                    {viewMode === 'contact' && (
                      <div className="p-3 bg-light rounded">
                        <p className="mb-0">Get access to {provider.first_name}'s contact information.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <button className="start-now-btn">
                    Join the Network
                  </button>
                </div>
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