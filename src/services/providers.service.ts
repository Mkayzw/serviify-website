import { ApiConstants } from '../lib/api/apiConstants';
import { ApiService } from '../lib/api/apiService';

// Types
export interface Provider {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  serviceType?: string;
  service_type?: string;
  location?: string;
  provider_location?: string;
  service_rating?: number;
  rating?: number;
  avatar?: string;
  profile_image_url?: string;
  provider_bio?: string | null;
  provider_skills?: string[];
  provider_availability?: string;
  is_service_provider?: boolean;
  reviews?: Review[];
  gallery?: GalleryItem[];
  follows_count?: number;
  following_count?: number;
  posts_count?: number;
  posts?: Post[];
  refers_count?: number;
  bookmarks_count?: number;
  total_clients?: number;
  total_bookmarks?: number;
  total_referrals?: number;
  slug?: string; // SEO-friendly slug
}

// Analytics data interface
export interface AnalyticsData {
  rating: number;
  refers_count: number;
  bookmarks_count: number;
}

// Review interface
export interface Review {
  id: string;
  user_id: string;
  provider_id: string;
  reviewer_name: string;
  reviewer_image: string;
  rating: number;
  comment: string;
  created_at: string;
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
  };
}


// Gallery item interface
export interface GalleryItem {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  profile_id: string;
  caption: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  post_type: 'General' | 'Service Request';
  status: 'Open' | 'Closed';
  refer_ids: string[];
  comment_ids: string[];
  like_ids: string[];
  accepted_ids: string[];
  service_type?: string;
  location?: string;
  location_coordinates?: string;
}

export interface DiscoverServicesParams {
  query?: string;
  location?: string;
  sortBy?: 'rating' | 'distance' | 'recent';
  limit?: number;
  page?: number;
}

export interface DiscoverServicesResponse {
  providers: Provider[];
  total: number;
  page: number;
  limit: number;
}

interface BackendUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  is_service_provider: boolean;
  service_type: string | null;
  service_rating: number | null;
  average_rating: number | null;
  provider_bio: string | null;
  provider_location: string | null;
  headline?: string | null;
  followers_count?: number;
  following_count?: number;
  refers_count?: number;
  bookmarks_count?: number;
  total_clients?: number;
  total_bookmarks?: number;
  total_referrals?: number;
  service_provider?: {
    provider_id: string;
    service_type: string;
    headline: string;
    bio: string;
    location: string;
    city: string;
    skills: string[];
    availability: string;
    portfolio_images: string[];
    average_rating: number;
    total_clients?: number;
    total_bookmarks?: number;
    total_referrals?: number;
    created_at?: string;
  };
  created_at?: string;
  following_ids?: string[];
}

interface BackendService {
  id?: string;
  _id?: string;
  userId?: string;
  auth_id?: string;
  name?: string;
  providerName?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  serviceType?: string;
  service?: string;
  location?: string;
  location_coordinates?: string;
  rating?: number;
  average_rating?: number;
  avatar?: string;
  profileImage?: string;
  profile_image_url?: string;
  headline?: string;
  phone_number?: string;
  email?: string;
  interests?: string[];
  followers_count?: number;
  following_count?: number;
  service_provider?: {
    provider_id: string;
    service_type: string;
    headline?: string;
    bio?: string;
    location?: string;
    city?: string;
    skills?: string[];
    availability?: string;
    portfolio_images?: string[];
    average_rating?: number;
    total_clients?: number;
    total_bookmarks?: number;
    total_referrals?: number;
    created_at?: string;
  };
  created_at?: string;
}

// Define interfaces for API responses
interface UserResponse {
  data: BackendUser;
  message: string;
  status: string;
  error: string | null;
  meta?: Record<string, unknown>;
}

interface ReviewsResponse {
  data: Review[];
  message: string;
  status: string;
  error: string | null;
}

interface GalleryResponse {
  data: GalleryItem[];
  message: string;
  status: string;
  error: string | null;
}

interface PostsResponse {
  data: {
    posts: Post[];
    hasMore?: boolean;
    total?: number;
  };
  message: string;
  status: string;
  error: string | null;
}

// For search users response
interface SearchUsersResponse {
  data: BackendUser[];
  message: string;
  status: string;
  error: string | null;
  meta?: Record<string, unknown>;
}

// Define the services API response for provider search
export interface ServicesApiResponse {
  providers: Provider[];
  total?: number;
  page?: number;
}

// Define the discover services response
interface DiscoverServicesApiResponse {
  providers: BackendService[];
  total: number;
  page: number;
  pages: number;
  from_cache?: boolean;
}

// Define the nearby services response
interface NearbyServicesResponse {
  data: {
    services: BackendService[];
  };
  message: string;
  status: string;
  error: string | null;
}

export class ProvidersService {
  private static instance: ProvidersService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): ProvidersService {
    if (!ProvidersService.instance) {
      ProvidersService.instance = new ProvidersService();
    }
    return ProvidersService.instance;
  }

  private generateSlug(first?: string, last?: string, id?: string): string | undefined {
    if (!first && !last) return undefined;
    const base = `${first || ''}-${last || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!base) return undefined;
    if (id) {
      const short = id.replace(/-/g, '').slice(0, 8);
      return `${base}-${short}`;
    }
    return base;
  }

  private extractIdFromHybridSlug(possible: string): string {
    // If looks like UUID already, return as-is
    if (/^[0-9a-fA-F-]{32,}$/.test(possible) || /[0-9a-fA-F]{8}-[0-9a-fA-F-]{4}/.test(possible)) return possible;
    // Expect pattern name-name-xxxxxxxx (last segment 6-10 hex from id slice)
    const parts = possible.split('-');
    const tail = parts[parts.length - 1];
    if (/^[0-9a-fA-F]{6,10}$/.test(tail)) {
      // Cannot fully reconstruct UUID; require backend support later.
      // For now return original so backend fails predictably.
      return possible;
    }
    return possible;
  }

  // Search for users by name
  public async searchUsers(query: string): Promise<Provider[]> {
    try {
      const endpoint = `${ApiConstants.users.search}/${encodeURIComponent(query)}`;
      
      const result = await this.apiService.get<SearchUsersResponse>(endpoint);
      
      const userData = result.data || [];
      
      // Filter the users to include only service providers
      const serviceProviders = userData.filter((user: BackendUser) => user.is_service_provider === true);
      
      const mappedProviders = this.mapUsersToProviders(serviceProviders);
      
      return mappedProviders;
    } catch (error) {
      console.error('Error searching users');
      throw error;
    }
  }

  // Discover services with filters
  public async discoverServices(params: DiscoverServicesParams): Promise<DiscoverServicesResponse> {
    try {
      const queryParams: Record<string, string> = {};
      if (params.location) queryParams.location = params.location;
      if (params.sortBy) queryParams.sort_by = params.sortBy;
      queryParams.page = (params.page || 1).toString();
      queryParams.limit = (params.limit || 10).toString();
      
      // Construct the endpoint with the service type as a path parameter
      const endpoint = `${ApiConstants.discover.services}/${encodeURIComponent(params.query || '')}`;
      
      const result = await this.apiService.get<DiscoverServicesApiResponse>(endpoint, {
        params: queryParams
      });
      
      const servicesData = result.providers || [];
      
      const mappedProviders = this.mapServicesToProviders(servicesData);
      
      return {
        providers: mappedProviders,
        total: result.total || servicesData.length || 0,
        page: result.page || parseInt(params.page?.toString() || '1', 10),
        limit: parseInt(params.limit?.toString() || '10', 10)
      };
    } catch (error) {
      console.error('Error discovering services');
      throw error;
    }
  }

  // Get featured providers
  public async getFeaturedProviders(limit = 3): Promise<Provider[]> { // Default limit to 3 as in original static data
    try {
      const result = await this.apiService.get<DiscoverServicesApiResponse>(ApiConstants.discover.featured, {
        params: { limit: limit.toString() } // Assuming API supports a limit parameter
      });
      
      const servicesData = result.providers || [];
      
      return this.mapServicesToProviders(servicesData);
    } catch (error) {
      console.error('Error getting featured providers');
      throw error;
    }
  }

  // Get nearby services based on location
  public async getNearbyServices(latitude: number, longitude: number, radius = 25): Promise<Provider[]> {
    try {
      const result = await this.apiService.get<NearbyServicesResponse>(ApiConstants.locations.nearbyServices, {
        params: {
          lat: latitude.toString(),
          lng: longitude.toString(),
          radius: radius.toString()
        }
      });
      
      // Updated response handling
      const servicesData = result.data?.services || [];
      
      return this.mapServicesToProviders(servicesData);
    } catch (error) {
      console.error('Error getting nearby services');
      throw error;
    }
  }

  // Get provider by ID
  public async getProviderById(idOrSlug: string): Promise<Provider | null> {
    // Resolve hybrid slug to id if necessary (future: call a slug-lookup endpoint)
    const candidate = this.extractIdFromHybridSlug(idOrSlug);
    try {
      const endpoint = `${ApiConstants.users.getDetails}/${encodeURIComponent(candidate)}`;
      
      const result = await this.apiService.get<UserResponse>(endpoint);
      
      const userData = result.data || null;
      if (!userData) {
        console.error("No user data returned");
        return null;
      }
      
      // Set is_service_provider flag based on service_provider object presence
      userData.is_service_provider = userData.service_provider !== undefined;
      
      if (!userData.is_service_provider) {
        console.error("User is not a service provider");
        return null;
      }
      
      // Fetch additional data - reviews
      let reviews: Review[] = [];
      try {
        const reviewsEndpoint = `${ApiConstants.reviews.get}/${encodeURIComponent(candidate)}`;
        const reviewsResult = await this.apiService.get<ReviewsResponse>(reviewsEndpoint);
        reviews = reviewsResult.data || [];
      } catch (error) {
        console.error('Error getting provider reviews');
        // Continue execution even if reviews fetch fails
      }
      
      // Fetch portfolio/gallery
      let gallery: GalleryItem[] = [];
      try {
        // If we already have portfolio_images in the service_provider, use those
        if (userData.service_provider && userData.service_provider.portfolio_images) {
          gallery = userData.service_provider.portfolio_images.map((url: string, index: number) => ({
            id: index.toString(),
            user_id: candidate,
            image_url: url,
            caption: null,
            created_at: new Date().toISOString()
          }));
        } else {
          // Otherwise fetch from gallery endpoint
          const galleryEndpoint = `${ApiConstants.users.getDetails}/${encodeURIComponent(candidate)}/gallery`;
          const galleryResult = await this.apiService.get<GalleryResponse>(galleryEndpoint);
          gallery = galleryResult.data || [];
        }
      } catch (error) {
        console.error('Error getting provider gallery');
        // Continue execution even if gallery fetch fails
      }
      
      // Fetch posts
      let posts: Post[] = [];
      try {
        const postsEndpoint = `${ApiConstants.posts.getUserPosts}/${encodeURIComponent(candidate)}`;
        const postsResult = await this.apiService.get<PostsResponse>(postsEndpoint);
        // Extract the nested posts array, defaulting to an empty array if not found
        posts = postsResult.data?.posts || []; 
      } catch (error) {
        console.error('Error getting provider posts');
        // Continue execution even if posts fetch fails
      }
      
      // Map the provider data initially (might be slightly incomplete before adding reviews/posts)
      const mappedProvider = this.mapUsersToProviders([userData])[0];

      // Ensure the final object correctly uses data, especially from service_provider
      const finalProvider: Provider = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        profile_image_url: userData.profile_image_url,
        avatar: userData.profile_image_url,
        headline: userData.service_provider?.headline || userData.headline || undefined,
        service_type: userData.service_provider?.service_type || userData.service_type || undefined,
        serviceType: userData.service_provider?.service_type || userData.service_type || undefined,
        provider_location: this.extractCityFromLocation(userData.service_provider?.location || userData.provider_location || null),
        location: this.extractCityFromLocation(userData.service_provider?.location || userData.provider_location || null),
        service_rating: userData.service_provider?.average_rating || userData.average_rating || userData.service_rating || 0,
        provider_bio: userData.service_provider?.bio || userData.provider_bio || undefined,
        provider_skills: userData.service_provider?.skills,
        provider_availability: userData.service_provider?.availability,
        is_service_provider: !!userData.service_provider,
        reviews: reviews,
        gallery: gallery.length > 0 ? gallery : mappedProvider.gallery || [],
        posts: posts,
        follows_count: userData.followers_count || 0,
        following_count: userData.following_count || 0,
        posts_count: posts.length,
        total_clients: userData.service_provider?.total_clients || 0,
        total_bookmarks: userData.service_provider?.total_bookmarks || 0,
        total_referrals: userData.service_provider?.total_referrals || 0,
        refers_count: userData.service_provider?.total_referrals || 0, 
        bookmarks_count: userData.service_provider?.total_bookmarks || 0,
        slug: this.generateSlug(userData.first_name, userData.last_name, userData.id)
      };

      return finalProvider;
    } catch (error) {
      console.error('Error getting provider details');
      throw error;
    }
  }

  private extractCityFromLocation(location: string | null): string {
    if (!location) return 'Location not specified';
    
    const parts = location.split(',').map(part => part.trim()).filter(part => part);
    
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    } else if (parts.length === 1) {
      return parts[0];
    }
    
    return location;
  }

  private mapUsersToProviders(users: BackendUser[]): Provider[] {
    return users.map(user => {
      const sp = user.service_provider; // Alias for easier access
      
      // Determine appropriate service type, prioritizing service_provider
      const serviceType = sp?.service_type || user.service_type || 'Service Provider';
      
      // Check if user is a service provider based on the object
      const isServiceProvider = !!sp;
      
      // Extract provider location, prioritizing service_provider
      const cityOnly = this.extractCityFromLocation(sp?.location || user.provider_location || null);
      
      // Extract provider bio, prioritizing service_provider
      const providerBio = sp?.bio || user.provider_bio || undefined; // Ensure undefined if null
      
      // Extract rating, prioritizing service_provider
      const rating = sp?.average_rating || user.average_rating || user.service_rating || 0;
      
      // Extract follower counts                
      const followsCount = user.followers_count || 0;
      const followingCount = user.following_count || 0;
      
      // Extract analytics data from service_provider object
      const totalClients = sp?.total_clients || 0;
      const totalBookmarks = sp?.total_bookmarks || 0;
      const totalReferrals = sp?.total_referrals || 0;
      
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        headline: sp?.headline || user.headline || undefined,
        serviceType: serviceType,
        service_type: serviceType,
        location: cityOnly,
        provider_location: cityOnly,
        rating: rating,
        service_rating: rating,
        avatar: user.profile_image_url,
        profile_image_url: user.profile_image_url,
        provider_bio: providerBio,
        provider_skills: sp?.skills,
        provider_availability: sp?.availability,
        is_service_provider: isServiceProvider,
        follows_count: followsCount,
        following_count: followingCount,
        posts_count: 0, // Will be populated later in getProviderById
        refers_count: totalReferrals,
        bookmarks_count: totalBookmarks,
        total_clients: totalClients,
        total_bookmarks: totalBookmarks,
        total_referrals: totalReferrals,
        gallery: sp?.portfolio_images ? 
          sp.portfolio_images.map((url, index) => ({
            id: index.toString(),
            user_id: user.id,
            image_url: url,
            caption: null,
            created_at: new Date().toISOString()
          })) : [],
        slug: this.generateSlug(user.first_name, user.last_name, user.id)
      };
    });
  }

  // Helper method to map backend service data to our Provider interface
  private mapServicesToProviders(services: BackendService[]): Provider[] {
    return services.map(service => {
      // Extract only the city from the location
      const location = this.extractCityFromLocation(service.location || service.location_coordinates || null);
      
      // Get service provider details if available
      const serviceProviderDetails: Required<NonNullable<BackendService['service_provider']>> = {
        provider_id: '',
        service_type: 'Unknown service',
        headline: '',
        bio: '',
        location: '',
        city: '',
        skills: [],
        availability: '',
        portfolio_images: [],
        average_rating: 0,
        total_clients: 0,
        total_bookmarks: 0,
        total_referrals: 0,
        created_at: '',
        ...service.service_provider
      };
      
      return {
        id: service.id || service._id || service.userId || '',
        name: service.name || service.providerName || `${service.first_name || service.firstName || ''} ${service.last_name || service.lastName || ''}`.trim(),
        first_name: service.first_name || service.firstName || '',
        last_name: service.last_name || service.lastName || '',
        headline: service.headline || serviceProviderDetails.headline,
        serviceType: serviceProviderDetails.service_type || service.serviceType || service.service || 'Unknown service',
        service_type: serviceProviderDetails.service_type || service.serviceType || service.service || 'Unknown service',
        location: location,
        provider_location: location,
        rating: serviceProviderDetails.average_rating || service.average_rating || service.rating || 0,
        service_rating: serviceProviderDetails.average_rating || service.rating || service.average_rating || 0,
        avatar: service.avatar || service.profileImage || service.profile_image_url,
        profile_image_url: service.profile_image_url || service.profileImage || service.avatar,
        provider_bio: serviceProviderDetails.bio,
        provider_skills: serviceProviderDetails.skills,
        provider_availability: serviceProviderDetails.availability,
        is_service_provider: true,
        follows_count: service.followers_count || 0,
        following_count: service.following_count || 0,
        slug: this.generateSlug(
          service.first_name || service.firstName,
          service.last_name || service.lastName,
          service.id || service._id || service.userId
        )
      };
    });
  }
}