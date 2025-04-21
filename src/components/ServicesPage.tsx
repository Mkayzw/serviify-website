import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiException } from "@/lib/api/apiException";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Provider as ProviderData, ProvidersService, ServicesApiResponse } from "@/services/providers.service";
import { User } from 'iconsax-react';


// Service color mapping
const serviceColors: { [key: string]: string } = {
  'Accounting & Bookkeeping Services': 'rgba(155, 79, 83, 1)',
  'Agricultural & Consultation Services': 'rgba(233, 131, 77, 1)',
  'Appliance Repair & Installation': 'rgba(84, 189, 212, 1)',
  'App Development & Mobile Optimization': 'rgba(64, 55, 80, 1)',
  'Auto Repair & Maintenance': 'rgba(111, 74, 48, 1)',
  'Blacksmith & Welding Services': 'rgba(196, 132, 76, 1)',
  'Building Repair & Maintenance Services': 'rgba(76, 140, 196, 1)',
  'Carpentry & Handyman Services': 'rgba(48, 85, 111, 1)',
  'Catering & Food Services': 'rgba(168, 163, 157, 1)',
  'Childcare & Babysitting': 'rgba(50, 39, 64, 1)',
  'Cleaning Services': 'rgba(195, 161, 67, 1)',
  'Cloud Computing & IT Consulting': 'rgba(101, 114, 190, 1)',
  'Clothing Rentals & Sewing': 'rgba(93, 82, 51, 1)',
  'Computer Repair & Troubleshooting': 'rgba(140, 71, 71, 1)',
  'Construction & Home Improvement Services': 'rgba(133, 99, 164, 1)',
  'Consulting & Advisory Services': 'rgba(208, 197, 218, 1)',
  'Content Creation & Copy-writing': 'rgba(235, 193, 83, 1)',
  'Data Analysis & Business Intelligence': 'rgba(230, 150, 52, 1)',
  'Dog Training & Behavioral Modification': 'rgba(22, 28, 51, 1)',
  'Driving School and Provisional Lessons': 'rgba(141, 93, 3, 1)',
  'Dry Cleaning & Laundry Delivery': 'rgba(13, 125, 109, 1)',
  'E-commerce & Online Shopping Platforms': 'rgba(173, 61, 126, 1)',
  'Educational & Training Services': 'rgba(37, 136, 151, 1)',
  'Electrical Services & Repairs': 'rgba(81, 59, 109, 1)',
  'Entertainment & Recreation Services': 'rgba(255, 104, 151, 1)',
  'Errand & Concierge Services': 'rgba(255, 156, 187, 1)',
  'Event Planning & Management': 'rgba(130, 167, 118, 1)',
  'Farming & Livestock Management': 'rgba(46, 179, 177, 1)',
  'Financial Planning & Wealth Management': 'rgba(110, 160, 255, 1)',
  'Furniture Assembly & Moving': 'rgba(129, 158, 162, 1)',
  'Gift Wrapping & Delivery Services': 'rgba(135, 58, 57, 1)',
  'Graphic Design & Branding': 'rgba(128, 76, 72, 1)',
  'Grocery Delivery & Meal Preparation': 'rgba(195, 165, 159, 1)',
  'Hair-styling & Barbering': 'rgba(199, 186, 206, 1)',
  'Hatchery & Incubation Services': 'rgba(177, 155, 104, 1)',
  'Home Office Organization & Decor': 'rgba(191, 144, 0, 1)',
  'Hotel & Accommodation Services': 'rgba(167, 64, 64, 1)',
  'Housekeeping Services': 'rgba(95, 137, 76, 1)',
  'Insurance Brokerage & Risk Management': 'rgba(45, 100, 151, 1)',
  'Interior Design & Home Furniture Rental': 'rgba(138, 181, 140, 1)',
  'Legal Services & Consultations': 'rgba(135, 206, 235, 1)',
  'Life Coaching & Career Counseling': 'rgba(200, 162, 200, 1)',
  'Massage & Spa Treatment': 'rgba(107, 63, 63, 1)',
  'Medical & Healthcare Services': 'rgba(16, 44, 84, 1)',
  'Moving & Packing Services': 'rgba(19, 69, 176, 1)',
  'Music, Art & Dance Lessons': 'rgba(72, 120, 156, 1)',
  'Network & Hardware Support': 'rgba(82, 139, 139, 1)',
  'Online Customer Support & Chatbots': 'rgba(47, 79, 79, 1)',
  'Online Marketing & Advertising Services': 'rgba(124, 205, 124, 1)',
  'Painting & Home Improvement': 'rgba(95, 94, 4, 1)',
  'Panel Beating & Spray Painting': 'rgba(163, 109, 45, 1)',
  'Personal Chef & Catering Services': 'rgba(212, 176, 128, 1)',
  'Personal Fitness Training': 'rgba(255, 120, 69, 1)',
  'Personal Shopping & Styling': 'rgba(0, 113, 181, 1)',
  'Pest Control & Lawn Care': 'rgba(255, 98, 101, 1)',
  'Pet Grooming & Pet Sitting': 'rgba(229, 184, 11, 1)',
  'Photography & Videography': 'rgba(200, 63, 73, 1)',
  'Plumbing & Drain Cleaning': 'rgba(11, 53, 94, 1)',
  'Podcast Production & Editing': 'rgba(133, 117, 77, 1)',
  'Printing & Photocopy Services': 'rgba(159, 208, 199, 1)',
  'Property Security & Alarm Services': 'rgba(234, 166, 244, 1)',
  'Real Estate Services & Property Management': 'rgba(107, 85, 139, 1)',
  'Search Engine Optimization (SEO)': 'rgba(0, 110, 81, 1)',
  'Social Media Management & Marketing': 'rgba(173, 93, 93, 1)',
  'Software Installation & Configuration': 'rgba(175, 148, 131, 1)',
  'Translation & Interpretation': 'rgba(0, 44, 32, 1)',
  'Tutoring & Educational Resources': 'rgba(127, 63, 112, 1)',
  'Vehicle & Auto Rental Services': 'rgba(187, 162, 145, 1)',
  'Virtual Assistant & Remote Workers': 'rgba(194, 68, 88, 1)',
  'Website Design & Development': 'rgba(158, 71, 67, 1)',
  'Yard Maintenance & Landscaping': 'rgba(183, 146, 53, 1)',
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
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [showAllServices, setShowAllServices] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);

  // Function to handle help centre
  const setShowHelpCentre = () => {
    // Implementation can be added later if needed
  };

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
      <Navbar 
        title="Services"
        setShowSignup={setShowSignup}
        setShowHelpCentre={setShowHelpCentre}
      />
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
                {(showAllServices ? popularServices : popularServices.slice(0, 24)).map((service, index) => {
                  const bgColor = serviceColors[service] || 'rgba(209, 213, 219, 1)'; // fallback to gray-200
                  
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleServiceSelect(service)}
                      disabled={loadingSearch}
                      style={{
                        backgroundColor: bgColor,
                        borderColor: 'transparent',
                      }}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
               {!showAllServices && popularServices.length > 24 && (
                  <button 
                     onClick={() => setShowAllServices(true)}
                     className="mt-4 text-sm text-[#293040] hover:underline"
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