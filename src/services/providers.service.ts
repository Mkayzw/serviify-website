import { ApiConstants } from '../lib/api/apiConstants';

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
  avatar?: string;
  profile_image_url?: string;
  provider_bio?: string | null;
  is_service_provider?: boolean;
  reviews?: Review[];
  gallery?: GalleryItem[];
  follows_count?: number;
  following_count?: number;
  posts_count?: number;
  posts?: Post[];
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
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
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

// Backend response format
interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
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
}

interface BackendService {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  providerName?: string;
  firstName?: string;
  lastName?: string;
  serviceType?: string;
  service?: string;
  location?: string;
  rating?: number;
  average_rating?: number;
  avatar?: string;
  profileImage?: string;
  headline?: string;
}

export class ProvidersService {
  private static instance: ProvidersService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = ApiConstants.baseUrl;
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
      
      const endpoint = ApiConstants.users.search.replace(/^\/api/, '');
  
      const response = await fetch(`${this.baseUrl}${endpoint}/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      
      const responseText = await response.text();
      console.log('Raw search response:', responseText);
      
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed search response:', result);
      
      
      const userData = result.data || [];
      console.log('User data extracted:', userData);
      
      // Filter the users to include only service providers
      const serviceProviders = userData.filter((user: BackendUser) => user.is_service_provider === true);
      console.log('Filtered service providers:', serviceProviders);
      
      const mappedProviders = this.mapUsersToProviders(serviceProviders);
      console.log('Mapped providers:', mappedProviders);
      
      return mappedProviders;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Discover services with filters
  public async discoverServices(params: DiscoverServicesParams): Promise<DiscoverServicesResponse> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.set('query', params.query);
      if (params.location) queryParams.set('location', params.location);
      if (params.sortBy) queryParams.set('sort_by', params.sortBy);
      
  
      queryParams.set('page', (params.page || 1).toString());
      queryParams.set('limit', (params.limit || 10).toString());
      
      
      const endpoint = ApiConstants.discover.services.replace(/^\/api/, '');
      const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
      console.log('Discover services URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Discover services failed with status: ${response.status}`);
      }
      
      
      const responseText = await response.text();
      console.log('Raw discover services response:', responseText);
      
      // Parse the JSON response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed discover services response:', result);
      
      
      const servicesData = result.data?.services || result.data || [];
      console.log('Services data extracted:', servicesData);
      
      const mappedProviders = this.mapServicesToProviders(servicesData);
      console.log('Mapped service providers:', mappedProviders);
      
      return {
        providers: mappedProviders,
        total: result.data?.total || servicesData.length || 0,
        page: parseInt(params.page?.toString() || '1', 10),
        limit: parseInt(params.limit?.toString() || '10', 10)
      };
    } catch (error) {
      console.error('Error discovering services:', error);
      throw error;
    }
  }

  // Get nearby services based on location
  public async getNearbyServices(latitude: number, longitude: number, radius = 25): Promise<Provider[]> {
    try {
    
      const endpoint = ApiConstants.locations.nearbyServices.replace(/^\/api/, '');
      const response = await fetch(
        `${this.baseUrl}${endpoint}?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error(`Nearby services failed with status: ${response.status}`);
      }
      
      
      const responseText = await response.text();
      console.log('Raw nearby services response:', responseText);
      
      // Parse the JSON response
      let result: ApiResponse<{services: BackendService[]}>;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed nearby services response:', result);
      
      // Updated response handling
      const servicesData = result.data?.services || [];
      console.log('Nearby services data extracted:', servicesData);
      
      return this.mapServicesToProviders(servicesData);
    } catch (error) {
      console.error('Error getting nearby services:', error);
      throw error;
    }
  }

  // Get provider by ID
  public async getProviderById(id: string): Promise<Provider | null> {
    try {
      const endpoint = ApiConstants.users.getDetails.replace(/^\/api/, '');
      const url = `${this.baseUrl}${endpoint}/${encodeURIComponent(id)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to get provider details with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw provider details response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed provider details response:', result);
      
      const userData = result.data || null;
      if (!userData || !userData.is_service_provider) {
        return null;
      }
      
      // Fetch additional data - reviews
      let reviews = [];
      try {
        const reviewsEndpoint = ApiConstants.reviews.get.replace(/^\/api/, '');
        const reviewsUrl = `${this.baseUrl}${reviewsEndpoint}/${encodeURIComponent(id)}`;
        const reviewsResponse = await fetch(reviewsUrl);
        
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json();
          reviews = reviewsResult.data || [];
          console.log('Provider reviews:', reviews);
        }
      } catch (error) {
        console.error('Error getting provider reviews:', error);
        // Continue execution even if reviews fetch fails
      }
      
      // Fetch portfolio/gallery
      let gallery = [];
      try {
        const galleryEndpoint = `${ApiConstants.users.getDetails.replace(/^\/api/, '')}/${encodeURIComponent(id)}/gallery`;
        const galleryUrl = `${this.baseUrl}${galleryEndpoint}`;
        const galleryResponse = await fetch(galleryUrl);
        
        if (galleryResponse.ok) {
          const galleryResult = await galleryResponse.json();
          gallery = galleryResult.data || [];
          console.log('Provider gallery:', gallery);
        }
      } catch (error) {
        console.error('Error getting provider gallery:', error);
        // Continue execution even if gallery fetch fails
      }
      
      // Map the provider data
      const mappedProvider = this.mapUsersToProviders([userData])[0];
      
      // Add additional data to the provider object
      return {
        ...mappedProvider,
        reviews: reviews,
        gallery: gallery,
        follows_count: userData.follows_count || 0,
        following_count: userData.following_count || 0,
        posts_count: userData.posts_count || 0
      };
    } catch (error) {
      console.error('Error getting provider details:', error);
      throw error;
    }
  }

  private mapUsersToProviders(users: BackendUser[]): Provider[] {
    console.log('Raw users data for rating debug:', users);
    
    return users.map(user => {
      
      console.log('User rating debug:', {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        is_provider: user.is_service_provider,
        service_type: user.service_type,
        service_rating: user.service_rating,
        average_rating: user.average_rating,
        headline: user.headline,
        allKeys: Object.keys(user)
      });
      
      // Determine appropriate service type
      let serviceType = 'Service Provider';
      if (user.service_type) {
        serviceType = user.service_type;
      }
      
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        headline: user.headline || undefined,
        serviceType: serviceType,
        service_type: user.service_type || serviceType,
        location: user.provider_location || 'Location not specified',
        provider_location: user.provider_location || 'Location not specified',
        rating: user.average_rating || user.service_rating || 0,
        service_rating: user.service_rating || user.average_rating || 0,
        avatar: user.profile_image_url,
        profile_image_url: user.profile_image_url,
        provider_bio: user.provider_bio,
        is_service_provider: user.is_service_provider
      };
    });
  }

  // Helper method to map backend service data to our Provider interface
  private mapServicesToProviders(services: BackendService[]): Provider[] {
    console.log('Raw services data for rating debug:', services);
    
    return services.map(service => {
      // Debug log for each service's rating
      console.log('Service rating debug:', {
        id: service.id || service._id,
        name: service.name || service.providerName || `${service.firstName || ''} ${service.lastName || ''}`.trim(), 
        rating: service.rating,
        average_rating: service.average_rating,
        ratingType: typeof service.average_rating,
        hasRating: 'average_rating' in service,
        headline: service.headline,
        allKeys: Object.keys(service)
      });
      
      return {
        id: service.id || service._id || service.userId || '',
        name: service.name || service.providerName || `${service.firstName || ''} ${service.lastName || ''}`.trim(),
        first_name: service.firstName || '',
        last_name: service.lastName || '',
        headline: service.headline,
        serviceType: service.serviceType || service.service || 'Unknown service',
        service_type: service.serviceType || service.service || 'Unknown service',
        location: service.location || 'Unknown location',
        provider_location: service.location || 'Unknown location',
        rating: service.average_rating || service.rating || 0,
        service_rating: service.rating || service.average_rating || 0,
        avatar: service.avatar || service.profileImage,
        profile_image_url: service.profileImage || service.avatar
      };
    });
  }
} 