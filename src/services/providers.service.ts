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

  // Search for users by name
  public async searchUsers(query: string): Promise<Provider[]> {
    try {
      const response = await this.apiService.get<SearchUsersResponse>(
        `${ApiConstants.users.search}/${encodeURIComponent(query)}`
      );

      

      if (response && response.data) {
        
        const providers = this.mapUsersToProviders(response.data);
        
        return providers;
      } else {
        console.error("Invalid search response:", response);
        return [];
      }
    } catch (error) {
      console.error('Error searching users:', error);
      return []; // Return empty array on error
    }
  }

  // Discover services with filters
  public async discoverServices(params: DiscoverServicesParams): Promise<DiscoverServicesResponse> {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `${ApiConstants.discover.services}${params.query ? `/${encodeURIComponent(params.query)}` : ''}?${queryParams.toString()}`;

    try {
      const response = await this.apiService.get<DiscoverServicesApiResponse>(endpoint);
      
      
      if (response && Array.isArray(response.providers)) {
        
        
        
        const mappedProviders = this.mapServicesToProviders(response.providers);
        
        return {
          providers: mappedProviders,
          total: response.total,
          page: response.page,
          limit: params.limit || 20, // Ensure limit is returned
        };
      } else {
        console.error('Invalid discover services response:', response);
        return { providers: [], total: 0, page: 1, limit: params.limit || 20 };
      }
    } catch (error) {
      console.error('Error discovering services:', error);
      return { providers: [], total: 0, page: 1, limit: params.limit || 20 };
    }
  }

  // Get featured providers
  public async getFeaturedProviders(limit = 3): Promise<Provider[]> { // Default limit to 3 as in original static data
    try {
      // Assuming discoverServices with a limit is how featured providers are fetched
      // Modify parameters as needed if there's a specific "featured" flag or endpoint
      const response = await this.discoverServices({ sortBy: 'rating', limit: limit, page: 1 });
      return response.providers;
    } catch (error) {
      console.error('Error fetching featured providers:', error);
      return [];
    }
  }

  // Get nearby services based on location
  public async getNearbyServices(latitude: number, longitude: number, radius = 25): Promise<Provider[]> {
    try {
      const response = await this.apiService.get<NearbyServicesResponse>(
        `${ApiConstants.locations.nearbyServices}?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      );
      if (response && response.data && Array.isArray(response.data.services)) {
        return this.mapServicesToProviders(response.data.services);
      } else {
        console.error('Invalid nearby services response:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching nearby services:', error);
      return [];
    }
  }

  // Get provider by ID
  public async getProviderById(id: string): Promise<Provider | null> {
    try {
      
      const [userResponse, reviewsResponse, galleryResponse, postsResponse, analyticsResponse] = await Promise.all([
        this.apiService.get<UserResponse>(`${ApiConstants.users.getDetails}/${id}`),
        this.apiService.get<ReviewsResponse>(`${ApiConstants.reviews.get}/${id}`),
        this.apiService.get<GalleryResponse>(`${ApiConstants.users.getDetails}/${id}/gallery`),
        this.apiService.get<PostsResponse>(`${ApiConstants.posts.getUserPosts}/${id}`),
        this.apiService.get<AnalyticsData>(`${ApiConstants.users.getDetails}/${id}/analytics`)
      ]);

      

      if (userResponse && userResponse.data) {
        const userData = userResponse.data;
        const reviews = reviewsResponse?.data || [];
        const gallery = galleryResponse?.data || [];
        const posts = postsResponse?.data?.posts || [];
        const analytics = analyticsResponse || { rating: 0, refers_count: 0, bookmarks_count: 0 }; // Default analytics

        

        const mappedProvider = this.mapUserToProvider(userData, reviews, gallery, posts, analytics); // Pass analytics data
        
        return mappedProvider;
      } else {
        console.error('Invalid provider response:', userResponse);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching provider by id ${id}:`, error);
      return null;
    }
  }

  public async getProviderReviews(id: string): Promise<Review[]> {
    try {
      const response = await this.apiService.get<ReviewsResponse>(`${ApiConstants.reviews.get}/${id}`);
      if (response && response.data) {
        return response.data;
      } else {
        console.error('Invalid reviews response:', response);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching reviews for provider ${id}:`, error);
      return [];
    }
  }

  public async getProviderGallery(id: string): Promise<GalleryItem[]> {
    try {
      const response = await this.apiService.get<GalleryResponse>(`${ApiConstants.users.getDetails}/${id}/gallery`);
      if (response && response.data) {
        return response.data;
      } else {
        console.error('Invalid gallery response:', response);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching gallery for provider ${id}:`, error);
      return [];
    }
  }

  public async getProviderPosts(id: string, page = 1, limit = 10): Promise<{ posts: Post[], hasMore: boolean }> {
     try {
        const response = await this.apiService.get<PostsResponse>(
           `${ApiConstants.posts.getUserPosts}/${id}?page=${page}&limit=${limit}`
        );
        if (response && response.data) {
           return {
              posts: response.data.posts || [],
              hasMore: response.data.hasMore ?? false,
           };
        } else {
           console.error('Invalid posts response:', response);
           return { posts: [], hasMore: false };
        }
     } catch (error) {
        console.error(`Error fetching posts for provider ${id}:`, error);
        return { posts: [], hasMore: false };
     }
  }

  // --- Helper Methods for Mapping Data ---

  private extractCityFromLocation(location: string | null): string {
    if (!location) return 'Unknown';
    const parts = location.split(',');
    // Assuming city is the second to last part if available, otherwise the last part
    if (parts.length > 1) {
      return parts[parts.length - 2].trim(); // City
    } else if (parts.length === 1) {
      return parts[0].trim(); // Fallback to the only part
    }
    return 'Unknown';
  }

  private mapUsersToProviders(users: BackendUser[]): Provider[] {
    
    const mapped = users
    // Filter first to ensure we only process service providers if necessary
    .filter(user => user.is_service_provider)
    .map(user => this.mapUserToProvider(user)); // Map only necessary fields for list view

    
    return mapped;
  }

  private mapServicesToProviders(services: BackendService[]): Provider[] {
    
    const mapped = services.map(service => {
        // Debugging service rating
        const rating = service.average_rating ?? service.rating ?? 0; // Consolidate rating sources
        

        return {
            id: service.userId ?? service.auth_id ?? service._id ?? service.id ?? 'unknown-id', // Robust ID handling
            first_name: service.firstName ?? service.first_name ?? '',
            last_name: service.lastName ?? service.last_name ?? '',
            headline: service.headline ?? service.service_provider?.headline ?? '',
            service_type: service.serviceType ?? service.service ?? service.service_provider?.service_type ?? 'Unknown Service',
            provider_location: service.location ?? service.service_provider?.location ?? 'Unknown Location',
            service_rating: rating,
            profile_image_url: service.profileImage ?? service.profile_image_url ?? service.avatar ?? '',
            // Optional fields based on available data
            provider_bio: service.service_provider?.bio ?? null,
            provider_skills: service.service_provider?.skills ?? [],
            provider_availability: service.service_provider?.availability ?? 'Not specified',
            is_service_provider: true, // Assuming all services are from providers
             // Include analytics if available (though typically not in discover results)
            refers_count: service.service_provider?.total_referrals ?? 0,
            bookmarks_count: service.service_provider?.total_bookmarks ?? 0,
            total_clients: service.service_provider?.total_clients ?? 0,
             // Add counts from the top-level service object if available
             follows_count: service.followers_count ?? 0,
             following_count: service.following_count ?? 0,

        };
    });

    
    return mapped;
}

  // Centralized mapper for a single provider, including optional details
  private mapUserToProvider(
    user: BackendUser, 
    reviews: Review[] = [], 
    gallery: GalleryItem[] = [], 
    posts: Post[] = [],
    analytics?: AnalyticsData // Added analytics data parameter
): Provider {
    // Determine the source of provider-specific info
    const sp = user.service_provider; // Shortcut for service_provider object

    // Consolidate rating information
    const rating = analytics?.rating ?? sp?.average_rating ?? user.service_rating ?? user.average_rating ?? 0;


    const provider: Provider = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image_url: user.profile_image_url,
        is_service_provider: user.is_service_provider,
        service_type: sp?.service_type ?? user.service_type ?? 'N/A',
        headline: sp?.headline ?? user.headline ?? '',
        provider_location: sp?.location ?? user.provider_location ?? 'Unknown Location',
        service_rating: rating,
        provider_bio: sp?.bio ?? user.provider_bio ?? null,
        provider_skills: sp?.skills ?? [],
        provider_availability: sp?.availability ?? 'Not specified',
        reviews: reviews,
        gallery: gallery,
        posts: posts, // Add posts to the provider object
        // Use analytics data if available, otherwise fallback or default to 0
        refers_count: analytics?.refers_count ?? user.refers_count ?? 0,
        bookmarks_count: analytics?.bookmarks_count ?? user.bookmarks_count ?? 0,
        total_clients: sp?.total_clients ?? user.total_clients ?? 0,
        // Map counts from the user object
        follows_count: user.followers_count ?? 0,
        following_count: user.following_count ?? 0,
        posts_count: posts.length, // Calculate posts count based on fetched posts
    };

    
    return provider;
}

} 