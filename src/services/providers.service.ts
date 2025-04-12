import { ApiConstants } from '../lib/api/apiConstants';

// Types
export interface Provider {
  id: string;
  name: string;
  serviceType: string;
  location: string;
  rating: number;
  avatar?: string;
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

// Backend data interfaces for type safety
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
        serviceType: serviceType,
        location: user.provider_location || 'Location not specified',
        rating: user.average_rating || user.service_rating || 0,
        avatar: user.profile_image_url
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
        allKeys: Object.keys(service)
      });
      
      return {
        id: service.id || service._id || service.userId || '',
        name: service.name || service.providerName || `${service.firstName || ''} ${service.lastName || ''}`.trim(),
        serviceType: service.serviceType || service.service || 'Unknown service',
        location: service.location || 'Unknown location',
        rating: service.average_rating || service.rating || 0,
        avatar: service.avatar || service.profileImage
      };
    });
  }
} 