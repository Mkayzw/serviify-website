import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiException } from "@/lib/api/apiException";
import Footer from "./Footer";
import { Provider as ProviderData, ProvidersService, ServicesApiResponse } from "@/services/providers.service";
import logo from '@/assets/logo.png';
import { User } from 'iconsax-react';

// Color categories for services
const serviceCategories: Record<string, string> = {
  'Technology': '#1A237E',
  'Home': '#311B92', 
  'Health': '#1B5E20', 
  'Business': '#E65100', 
  'Education': '#01579B', 
  'Personal': '#880E4F',
  'Automotive': '#3E2723',
  'Creative': '#F57F17', 
  'Professional': '#004D40', 
};

// Map services to categories
const getServiceCategory = (service: string): string => {
  if (service.match(/computer|software|website|app|network|it|seo|online/i)) return 'Technology';
  if (service.match(/home|cleaning|plumbing|electrical|furniture|yard|pest|painting/i)) return 'Home';
  if (service.match(/medical|health|dental|massage|fitness|spa/i)) return 'Health';
  if (service.match(/accounting|consulting|financial|legal|business|marketing/i)) return 'Business';
  if (service.match(/education|tutoring|training|teaching|coaching/i)) return 'Education';
  if (service.match(/personal|shopping|styling|chef|catering/i)) return 'Personal';
  if (service.match(/auto|car|vehicle|driving/i)) return 'Automotive';
  if (service.match(/design|photo|video|art|music|content|creative/i)) return 'Creative';
  return 'Professional';
};

// Get background color for a service
const getServiceColor = (service: string): string => {
  const category = getServiceCategory(service);
  return serviceCategories[category] || '#F5F5F5';
};


const popularServices = [
  'Accounting & Bookkeeping Services',
  'Agricultural & Consultation Services',
  'Appliance Repair & Installation',
  'App Development & Mobile Optimization',
  'Auto Repair & Maintenance',
  'Blacksmith & Welding Services',
  'Carpentry & Handyman Services',
  'Catering & Food Services',
  'Childcare & Babysitting',
  'Cleaning Services',
  'Cloud Computing & IT Consulting',
  'Clothing Rentals & Sewing',
  'Computer Repair & Troubleshooting',
  'Construction & Home Improvement Services',
  'Consulting & Advisory Services',
  'Content Creation & Copy-writing',
  'Data Analysis & Business Intelligence',
  'Dental Services',
  'Dog Training & Behavioral Modification',
  'Driving School & Provisional Lessons',
  'Dry Cleaning & Laundry Delivery',
  'E-commerce & Online Shopping Platforms',
  'Educational & Training Services',
  'Electrical Services & Repairs',
  'Entertainment & Recreation Services',
  'Errand & Concierge Services',
  'Event Planning & Management',
  'Equipment Rentals',
  'Farming & Livestock Management',
  'Financial Planning & Wealth Management',
  'Furniture Assembly & Moving',
  'Gift Wrapping & Delivery Services',
  'Graphic Design & Branding',
  'Grocery Delivery & Meal Prep',
  'Hair-styling & Barbering',
  'Hatchery & Incubation Services',
  'Home Improvement Services',
  'Home Office Organization & Decor',
  'Hotel & Accommodation Services',
  'Housekeeping Services',
  'Insurance Brokerage & Risk Management',
  'Interior Design & Home Furniture Rental',
  'Legal Services & Consultations',
  'Life Coaching & Career Counseling',
  'Massage & Spa Treatments',
  'Medical & Healthcare Services',
  'Moving & Packing Services',
  'Music, Art & Dance Lessons',
  'Network & Hardware Support',
  'Office & Home Security Alarm Services',
  'Online Customer Support & Chatbots',
  'Online Marketing & Advertising Services',
  'Painting & Home Improvement',
  'Panel Beating and Spray Painting',
  'Personal Chef & Catering Services',
  'Personal Fitness Training',
  'Personal Shopping & Styling',
  'Pest Control & Lawn Care',
  'Pet Grooming & Pet Sitting',
  'Photography & Videography',
  'Plumbing & Drain Cleaning',
  'Podcast Production & Editing',
  'Printing & Photocopy Services',
  'Property & Home Rental Services',
  'Real Estate & Property Management',
  'Repair & Maintenance Services',
  'Search Engine Optimization (SEO)',
  'Social Media Management & Marketing',
  'Software Installation & Configuration',
  'Translation & Interpretation',
  'Tutoring & Educational Resources',
  'Vehicle & Auto Rental Services',
  'Virtual Assistant & Remote Workers',
  'Website Design & Development',
  'Yard Maintenance & Landscaping',
];

const ServicesPage: React.FC = () => {
  // State for selected service
  const [selectedService, setSelectedService] = useState<string>("");
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); // Track if a search has been run
  const [showAllServices, setShowAllServices] = useState<boolean>(false); // Toggle for showing all services

  // API Service Instance
  const providersService = ProvidersService.getInstance();

  // Handle Service Selection
  const handleServiceSelect = async (serviceName: string) => {
    if (!serviceName) {
      setErrorSearch("Please select a service type.");
      setProviders([]);
      setSearchPerformed(true);
      return;
    }

    setLoadingSearch(true);
    setErrorSearch(null);
    setProviders([]); // Clear previous results immediately
    setSearchPerformed(true); // Mark search as performed
    setSelectedService(serviceName);

    try {
      // Use ProvidersService to handle the search
      const response: ServicesApiResponse = await providersService.discoverServices({
        query: serviceName,
        limit: 20,
        page: 1
      });
      
      if (response && response.providers) {
         setProviders(response.providers);
         if(response.providers.length === 0) {
            setErrorSearch(`No providers found for "${serviceName}". Try a different service.`);
         }
      } else {
         console.error("Invalid response structure:", response);
         setErrorSearch("Received an unexpected response from the server.");
         setProviders([]); // Ensure providers is empty on error
      }

    } catch (err) {
      console.error(`Failed to fetch providers for "${serviceName}":`, err);
      if (err instanceof ApiException) {
        if (err.status === 404) {
           setErrorSearch(`Service "${serviceName}" not found or no providers available.`);
        } else {
           setErrorSearch(`Error: ${err.message}`);
        }
      } else {
        setErrorSearch("An error occurred while fetching providers.");
      }
      setProviders([]); // Ensure providers is empty on error
    } finally {
      setLoadingSearch(false);
    }
  };

  // Add reset search function
  const handleSearchAgain = () => {
    setSearchPerformed(false);
    setSelectedService("");
    setProviders([]);
    setErrorSearch(null);
    setShowAllServices(false);
  };

  // Helper component for rendering provider avatar with fallback
  const ProviderAvatar = ({ provider }: { provider: ProviderData }) => {
    const [imgError, setImgError] = useState(false);
    const photoUrl = provider.profile_image_url || provider.avatar;
    const providerName = provider.name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Provider';

    const handleImageError = () => {
      setImgError(true);
    };

    return (
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 overflow-hidden">
        {photoUrl && !imgError ? (
          <img
            src={photoUrl}
            alt={`${providerName} avatar`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          // Fallback icon or initials
          <User size="32" color="#6b7280" /> // Using User icon as fallback
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="py-3 border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center no-underline"
            >
              <img src={logo} alt="Serviify Logo" className="h-8" />
              <span
                className="text-2xl font-bold text-[#293040] ml-2"
              >
                Services
              </span>
            </Link>

            <Link to="/auth?mode=login" className="px-4 py-2 rounded-md bg-[#293040] text-white no-underline hover:bg-opacity-90 whitespace-nowrap">Sign in</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-4 px-4 flex-grow">

        {!searchPerformed && !loadingSearch && (
          <div className="text-center my-8 md:my-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">Find Local Service Providers</h2>
            <p className="mb-6 text-gray-600 max-w-xl mx-auto">
              Choose from the popular services below to find providers near you.
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Popular Services</h3>
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                {(showAllServices ? popularServices : popularServices.slice(0, 12)).map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleServiceSelect(service)}
                    disabled={loadingSearch}
                    style={{ backgroundColor: getServiceColor(service) }}
                    className="px-6 py-3 rounded-full text-sm font-medium border-none text-white transition-all hover:shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {service}
                  </button>
                ))}
              </div>
              {!showAllServices && popularServices.length > 12 && (
                <button 
                  onClick={() => setShowAllServices(true)}
                  className="mt-6 text-sm text-[#293040] hover:underline"
                >
                  View all services...
                </button>
              )}
            </div>
          </div>
        )}

        {searchPerformed && (
           <div id="provider-results" className="py-4">
              {loadingSearch && (
                <div className="text-center py-10">
                   <div className="spinner-border text-[#293040]" role="status" style={{width: '3rem', height: '3rem'}}>
                     <span className="visually-hidden">Loading...</span>
                   </div>
                   <p className="mt-3 text-gray-600">Searching for providers...</p>
                </div>
              )}

              {errorSearch && !loadingSearch && (
                 <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
                    <div className="flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-circle-fill mr-2 flex-shrink-0" viewBox="0 0 16 16">
                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                       </svg>
                       <span>{errorSearch}</span>
                    </div>
                    <button
                      onClick={handleSearchAgain}
                      className="mt-4 px-4 py-2 bg-white text-[#293040] border border-[#293040] rounded-md hover:bg-gray-50"
                    >
                      Search Again
                    </button>
                 </div>
              )}

              {!loadingSearch && providers.length > 0 && (
                <div className="my-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Results for "{selectedService}"</h2>
                      <span className="text-sm text-gray-500 block">{providers.length} provider{providers.length !== 1 ? 's' : ''} found</span>
                    </div>
                    <button
                      onClick={handleSearchAgain}
                      className="px-4 py-2 bg-white text-[#293040] border border-[#293040] rounded-md hover:bg-gray-50"
                    >
                      Search Again
                    </button>
                  </div>
                  <div className="space-y-4">
                    {providers.map(provider => (
                       <div key={provider.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                         <div className="flex">
                           <div className="flex-shrink-0">
                             <ProviderAvatar provider={provider} />
                           </div>
                           
                           <div className="ml-4 flex-grow min-w-0">
                             <div className="flex justify-between items-center mb-1">
                               <h3 className="font-semibold text-gray-800 truncate">
                                 {provider.name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Unnamed Provider'}
                               </h3>
                               
                               <div className="flex items-center">
                                 <div className="text-blue-999 mr-1">
                                   {Array.from({ length: 5 }, (_, i) => {
                                     const starValue = i + 1;
                                     const rating = provider.service_rating || provider.rating || 0;
                                     const decimal = rating % 1;
                                     
                                     if (starValue <= Math.floor(rating)) {
                                       return <span key={i}>★</span>; 
                                     } else if (starValue === Math.floor(rating) + 1 && decimal > 0) {
                                       return (
                                         <span key={i} className="relative inline-block">
                                           <span className="text-gray-300">☆</span>
                                           <span className="absolute left-0 top-0 overflow-hidden text-blue-999" 
                                                 style={{ width: `${decimal * 100}%` }}>
                                             ★
                                           </span>
                                         </span>
                                       ); 
                                     } else {
                                       return <span key={i} className="text-gray-300">☆</span>;
                                     }
                                   })}
                                 </div>
                                 <span className="text-sm text-gray-500">
                                   {((provider.service_rating || provider.rating || 0)).toFixed(1)}
                                 </span>
                               </div>
                             </div>
 
                            {provider.headline && (
                               <p className="text-sm text-gray-500 mb-1 truncate">{provider.headline}</p>
                            )}
 
                            {(provider.service_type || provider.serviceType) && (
                               <div className="mb-2">
                                 <span className="text-sm font-medium text-gray-700">
                                   {provider.service_type || provider.serviceType}
                                 </span>
                               </div>
                            )}
 
                             <div className="flex mt-2 justify-between items-center">
                               <div>
                                 <Link 
                                   to={`/provider/${provider.id}`}
                                   className="px-4 py-2 rounded-md bg-[#293040] text-white no-underline hover:bg-opacity-90 text-sm"
                                 >
                                   View Profile
                                 </Link>
                               </div>
                               <span className="text-sm text-gray-500">
                                 {(provider.provider_location || provider.location)
                                   ? (function() {
                                       const loc = provider.provider_location || provider.location || '';
                                       return loc.includes(',') 
                                         ? loc.split(',')[loc.split(',').length - 1].trim()
                                         : loc;
                                     })()
                                   : 'Location unknown'}
                               </span>
                              </div>
                            </div>
                         </div>
                       </div>
                    ))}
                  </div>
                </div>
              )}

              {!loadingSearch && !errorSearch && providers.length === 0 && (
                 <div className="text-center py-10 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No providers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                       We couldn't find any providers offering "{selectedService}". Try searching for a different service type.
                    </p>
                    <button
                      onClick={handleSearchAgain}
                      className="mt-4 px-4 py-2 bg-white text-[#293040] border border-[#293040] rounded-md hover:bg-gray-50"
                    >
                      Search Again
                    </button>
                 </div>
              )}
           </div>
        )}

        
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage; 