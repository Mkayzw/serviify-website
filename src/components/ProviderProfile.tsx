"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import SEOHead, { generateProviderStructuredData } from './SEOHead';
import { 
  ArrowLeft2, 
  Star1, 
  User, 
  Whatsapp,
  ToggleOn, 
  Call, 
  TickCircle,
  Gallery,
  DocumentText,
  Profile2User,
  Location,
  Bookmark,
  InfoCircle,
  CloseCircle,
  Star,
  TagUser,

  Messages2,
  Like1,
} from 'iconsax-react';
import type { Provider, GalleryItem, Post } from "../services/providers.service"
import { ProvidersService } from "../services/providers.service"
import logo from "../assets/logo.png"
import placeholderPost from "../assets/posts/post.png"
import placeholderGallery from "../assets/gallery/gallary.png"
import placeholderReview from "../assets/providers/provider_4.png"

export default function ProviderProfile() {
  const { slug } = useParams<{ slug: string }>()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'gallery' | 'reviews'>('posts')
  const [viewMode, setViewMode] = useState<'activity' | 'introduction' | 'contact'>('activity')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const location = useLocation();
  const from = new URLSearchParams(location.search).get('from');
  const backLink = from === 'services' ? '/services' : '/provider-search';

  useEffect(() => {
    
    const fetchProviderData = async () => {
      if (!slug) {
        setError("Provider slug is missing")
        setIsLoading(false)
        return
      }

      const id = slug.split('-').pop()

      if (!id) {
        setError("Could not extract provider ID from slug")
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const providerService = ProvidersService.getInstance()
        
        const providerData = await providerService.getProviderById(id)
      
        if (!providerData) {
          console.error("Provider not found for ID:", id);
          setError("Provider not found")
        } else {
          setProvider(providerData)
          
          setIsFollowing(false)
        }
      } catch (err) {
        
        setError("Failed to load provider data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviderData()
  }, [slug])

  const handleFollowToggle = async () => {
    if (!slug || !provider) return
    
    // Open modal instead of redirecting
    setIsModalOpen(true)
  }

 
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleReferClick = (post: Post) => {
    setSelectedPost(post);
    setIsReferModalOpen(true);
  };

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
            <InfoCircle size="20" color="#293040" className="me-2" />
            {error}
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to={backLink} className="start-now-btn">
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
        <Link to={backLink} className="start-now-btn mt-3">
          Back to Search
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={`${provider.name || `${provider.first_name} ${provider.last_name}`} - Service Provider`}
        description={`Find and book ${provider.name || `${provider.first_name} ${provider.last_name}`}, a trusted service provider on Serviify. View their profile, services, and reviews in ${provider.location || 'Zimbabwe'}.`}
        canonical={`/provider/${slug}`}
        ogType="profile"
        ogImage={provider.profile_image_url || provider.avatar}
        keywords={`${provider.name || `${provider.first_name} ${provider.last_name}`}, ${provider.serviceType || provider.service_type || 'service provider'}, ${provider.location || provider.provider_location || 'Zimbabwe'}, Serviify`}
        structuredData={generateProviderStructuredData(provider)}
      />
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f8f9fa",
      position: isModalOpen || isReferModalOpen ? "relative" : "static"
    }}>
      {/* Sign Up Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ 
               backgroundColor: "rgba(0,0,0,0.5)", 
               zIndex: 1050,
             }}>
          <div className="bg-white p-4 rounded-3 shadow" style={{ maxWidth: "400px", width: "90%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">Create an Account</h5>
              <button 
                className="btn btn-sm" 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}
                style={{ color: "#293040" }}
              >
                <CloseCircle size="24" />
              </button>
            </div>
            <p>Join Serviify to connect with service providers, leave reviews, and more!</p>
            <div className="d-flex flex-column gap-2 mt-4">
              <Link 
                to="/auth?mode=signup" 
                className="start-now-btn" 
                style={{ 
                  textAlign: "center",
                  padding: "10px 0"
                }}
              >
                Create Account
              </Link>
              <Link 
                to="/auth?mode=login" 
                className="btn" 
                style={{ 
                  borderColor: "#293040",
                  color: "#293040",
                  textAlign: "center" 
                }}
              >
                Log In
              </Link>
              <button 
                className="btn btn-link text-muted" 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refer Modal */}
      {isReferModalOpen && selectedPost && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ 
               backgroundColor: "rgba(0,0,0,0.5)", 
               zIndex: 1050,
             }}>
          <div className="bg-white p-4 rounded-3 shadow" style={{ maxWidth: "400px", width: "90%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">Refer Service Request</h5>
              <button 
                className="btn btn-sm" 
                onClick={() => setIsReferModalOpen(false)}
                style={{ color: "#293040" }}
              >
                <CloseCircle size="24" />
              </button>
            </div>
            <p>Sign up to refer this service request to other providers in your network!</p>
            <div className="d-flex flex-column gap-2 mt-4">
              <Link 
                to="/auth?mode=signup" 
                className="start-now-btn" 
                style={{ 
                  textAlign: "center",
                  padding: "10px 0"
                }}
              >
                Create Account
              </Link>
              <Link 
                to="/auth?mode=login" 
                className="btn" 
                style={{ 
                  borderColor: "#293040",
                  color: "#293040",
                  textAlign: "center" 
                }}
              >
                Log In
              </Link>
              <button 
                className="btn btn-link text-muted" 
                onClick={() => setIsReferModalOpen(false)}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="py-3 border-bottom bg-white shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <div className="me-2">
                <img src={logo} alt="Serviify Logo" width="40" height="40" className="rounded" />
              </div>
              <span className="logo-text">Serviify</span>
            </Link>
            
            <div className="header-nav">
              <Link to={backLink} className="header-btn header-btn-secondary">
                <ArrowLeft2 size="16" className="header-btn-icon" />
                <span className="header-btn-text">Search</span>
              </Link>
              <Link to="/auth?mode=login" className="header-btn header-btn-primary">
                <User size="16" className="header-btn-icon" />
                <span className="header-btn-text">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-4" style={{ flex: "1 0 auto" }}>
        <div className="row">
          {/* Left Sidebar - Vertical Profile Section */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
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
                <div className="d-flex justify-content-center align-items-center mb-4 border-top border-bottom py-3">
                  <div className="text-center px-2 mx-1">
                    <div className="fw-bold fs-5">{provider.posts_count || 0}</div>
                    <div className="text-muted small">Posts</div>
                  </div>
                  <div className="text-center px-2 mx-1">
                    <div className="fw-bold fs-5">{provider.follows_count || 0}</div>
                    <div className="text-muted small">Followers</div>
                  </div>
                  <div className="text-center px-2 mx-1">
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

                  {/* Skills Section*/}
                  {provider.provider_skills && provider.provider_skills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="card-title border-bottom pb-2 mb-3">Skills</h5>
                      <div>
                        {provider.provider_skills.map((skill: string) => (
                          <span key={skill} className="skill-tag me-1 mb-1">{skill}</span>
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
                    
                  </div>

                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}>
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2 mb-3">Analytics</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <Star size="20" color="#293040" />
                  </div>
                  <div>
                    <div className="fw-bold">{(provider.service_rating || 0).toFixed(1)}</div>
                    <div className="text-muted small">Rating</div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <TagUser size="20" color="#293040" />
                  </div>
                  <div>
                    <div className="fw-bold">{provider.total_referrals || 0}</div>
                    <div className="text-muted small">Refers</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}>
                    <Bookmark size="20" color="#293040" />
                  </div>
                  <div>
                    <div className="fw-bold">{provider.total_bookmarks || 0}</div>
                    <div className="text-muted small">Bookmarks</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 rounded-3 shadow-sm mb-4" style={{ 
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
                      <ToggleOn size="16" color="#293040" />
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">See activity</div>
                      <small className="text-muted">View {provider.first_name}'s recent posts</small>
                    </div>
                    {viewMode === 'activity' && (
                      <TickCircle size="16" color="#293040" variant="Bold" />
                    )}
                  </div>
                  <div 
                    className={`d-flex align-items-center mb-3 p-2 rounded cursor-pointer ${viewMode === 'introduction' ? 'bg-light' : ''}`}
                    onClick={() => setViewMode('introduction')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                      <DocumentText size="16" color="#293040" />
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">Introduction</div>
                      <small className="text-muted">About, skills, and more</small>
                    </div>
                    {viewMode === 'introduction' && (
                      <TickCircle size="16" color="#293040" variant="Bold" />
                    )}
                  </div>
                  <div 
                    className={`d-flex align-items-center p-2 rounded cursor-pointer ${viewMode === 'contact' ? 'bg-light' : ''}`}
                    onClick={() => setViewMode('contact')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                      <Call size="16" color="#293040" />
                    </div>
                    <div className="w-100">
                      <div className="fw-medium">Contact Info</div>
                      <small className="text-muted">Get in touch with {provider.first_name}</small>
                    </div>
                    {viewMode === 'contact' && (
                      <TickCircle size="16" color="#293040" variant="Bold" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs and Content */}
          <div className="col-md-8">
            {/* Profile Header Card */}
            <div className="card border-0 rounded-3 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start">
                  <div>
                    <h3 className="mb-1" style={{ color: "#293040" }}>
                      {provider.first_name} {provider.last_name}
                    </h3>
                    <p className="text-muted mb-2">{provider.headline}</p>
                    <div className="d-flex align-items-center text-muted small mb-3">
                      <span className="me-3">
                        <Location size="16" className="me-1" />
                        {provider.provider_location || 'Location not specified'}
                      </span>
                      <span>
                        <Profile2User size="16" className="me-1" />
                        {provider.total_clients || 0} clients
                      </span>
                    </div>
                  </div>
                  <div className="d-flex mt-2 mt-sm-0">
                    <button 
                      className={`btn d-flex align-items-center me-2 ${isFollowing ? 'btn-outline-secondary' : 'start-now-btn'}`}
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                    >
                      {isFollowLoading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <>
                          {isFollowing ? 'Following' : 'Follow'}
                        </>
                      )}
                    </button>
                    <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleButtonClick}>
                      <Messages2 size="16" className="me-1" /> Message
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 border-top pt-3">
                  {renderRating(provider.service_rating || 0)}
                </div>
              </div>
            </div>

            {/* View Mode Content */}
            {viewMode === 'activity' && (
              <>
                {/* Tabs for Posts, Gallery, Reviews */}
                <div className="card border-0 rounded-3 shadow-sm mb-4">
                  <div className="card-header bg-white border-0 pt-3">
                    <ul className="nav nav-tabs card-header-tabs">
                      <li className="nav-item">
                        <a 
                          className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`} 
                          href="#posts"
                          onClick={(e) => { e.preventDefault(); setActiveTab('posts'); }}
                        >
                          <DocumentText size="16" className="me-1" /> Posts
                        </a>
                      </li>
                      <li className="nav-item">
                        <a 
                          className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`} 
                          href="#gallery"
                          onClick={(e) => { e.preventDefault(); setActiveTab('gallery'); }}
                        >
                          <Gallery size="16" className="me-1" /> Gallery
                        </a>
                      </li>
                      <li className="nav-item">
                        <a 
                          className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} 
                          href="#reviews"
                          onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}
                        >
                          <Star1 size="16" className="me-1" /> Reviews
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                      <div>
                        {provider.posts && provider.posts.length > 0 ? (
                          provider.posts.map((post: Post) => (
                            <div key={post.id} className="card mb-3 shadow-sm">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <img 
                                    src={provider.profile_image_url || logo} 
                                    alt="provider" 
                                    className="rounded-circle me-3" 
                                    width="40" 
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <div>
                                    <h6 className="mb-0">{provider.first_name} {provider.last_name}</h6>
                                    <small className="text-muted">{formatDate(post.created_at)}</small>
                                  </div>
                                </div>
                                <p>{post.caption}</p>
                                {post.image_url && (
                                  <img 
                                    src={post.image_url || placeholderPost} 
                                    alt="Post" 
                                    className="img-fluid rounded mb-3"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = placeholderPost;
                                    }}
                                  />
                                )}
                                {post.post_type === 'Service Request' && (
                                  <div className="alert alert-info small">
                                    <strong>Service Request:</strong> {post.service_type} in {post.location}
                                  </div>
                                )}
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex">
                                    <button className="btn btn-sm btn-light me-2 d-flex align-items-center" onClick={handleButtonClick}>
                                      <Like1 size="16" className="me-1" /> {post.likes_count}
                                    </button>
                                    <button className="btn btn-sm btn-light d-flex align-items-center" onClick={handleButtonClick}>
                                      <Messages2 size="16" className="me-1" /> {post.comments_count}
                                    </button>
                                  </div>
                                  {post.post_type === 'Service Request' && (
                                    <button className="btn btn-sm start-now-btn" onClick={() => handleReferClick(post)}>
                                      Refer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted p-4">
                            <DocumentText size="48" className="mb-3" />
                            <h5>No Posts Yet</h5>
                            <p>{provider.first_name} hasn't shared any posts.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gallery Tab */}
                    {activeTab === 'gallery' && (
                      <div className="row">
                        {provider.gallery && provider.gallery.length > 0 ? (
                          provider.gallery.map((item: GalleryItem) => (
                            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                              <div className="card h-100 shadow-sm">
                                <img 
                                  src={item.image_url || placeholderGallery} 
                                  alt={item.caption || 'Gallery image'} 
                                  className="card-img-top" 
                                  style={{ height: '200px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = placeholderGallery;
                                  }}
                                />
                                {item.caption && <div className="card-body small">{item.caption}</div>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center text-muted p-4">
                            <Gallery size="48" className="mb-3" />
                            <h5>Gallery is Empty</h5>
                            <p>This provider hasn't added any images to their gallery yet.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                      <div>
                        {provider.reviews && provider.reviews.length > 0 ? (
                          provider.reviews.map(review => (
                            <div key={review.id} className="card mb-3 shadow-sm">
                              <div className="card-body">
                                <div className="d-flex align-items-start mb-2">
                                  <img 
                                    src={review.client?.profile_image_url || placeholderReview} 
                                    alt={review.reviewer_name} 
                                    className="rounded-circle me-3" 
                                    width="40" 
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = placeholderReview;
                                    }}
                                  />
                                  <div className="w-100">
                                    <div className="d-flex justify-content-between">
                                      <h6 className="mb-0">{review.reviewer_name}</h6>
                                      <small className="text-muted">{formatDate(review.created_at)}</small>
                                    </div>
                                    {renderRating(review.rating)}
                                  </div>
                                </div>
                                <p className="mb-0">{review.comment}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted p-4">
                            <Star1 size="48" className="mb-3" />
                            <h5>No Reviews Yet</h5>
                            <p>Be the first to leave a review for {provider.first_name}.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Introduction View */}
            {viewMode === 'introduction' && (
              <div className="card border-0 rounded-3 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title border-bottom pb-2 mb-3">Introduction</h4>
                  {provider.provider_bio ? (
                    <p>{provider.provider_bio}</p>
                  ) : (
                    <p className="text-muted">No introduction provided.</p>
                  )}

                  {provider.provider_skills && provider.provider_skills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="card-title border-bottom pb-2 mb-3">Skills</h5>
                      <div>
                        {provider.provider_skills.map(skill => (
                          <span key={skill} className="skill-tag me-1 mb-1">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info View */}
            {viewMode === 'contact' && (
              <div className="card border-0 rounded-3 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title border-bottom pb-2 mb-3">Contact Information</h4>
                  <p>To view contact details, please sign in or create an account.</p>
                  <div className="d-flex gap-2">
                    <button className="btn start-now-btn" onClick={handleButtonClick}>
                      <User size="16" className="me-1" /> Sign In
                    </button>
                    <button className="btn btn-outline-secondary" onClick={handleButtonClick}>
                      <Whatsapp size="16" className="me-1" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}