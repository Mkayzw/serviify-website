import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  structuredData?: object;
  keywords?: string;
  author?: string;
  noindex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = 'https://serviify.co.zw/logo.png',
  ogType = 'website',
  structuredData,
  keywords,
  author,
  noindex = false
}: SEOProps) {
  const fullTitle = title.includes('Serviify') ? title : `${title} | Serviify`;
  const baseUrl = 'https://serviify.co.zw';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Serviify" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}

// Helper function to generate structured data for service providers
export const generateProviderStructuredData = (provider: {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  serviceType?: string;
  service_type?: string;
  location?: string;
  provider_location?: string;
  rating?: number;
  service_rating?: number;
  profile_image_url?: string;
  avatar?: string;
  provider_bio?: string | null;
  slug?: string;
}) => {
  const name = provider.name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim();
  const serviceType = provider.serviceType || provider.service_type;
  const location = provider.location || provider.provider_location;
  const rating = provider.rating || provider.service_rating;
  const image = provider.profile_image_url || provider.avatar;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": `https://serviify.co.zw/provider/${provider.slug || provider.id}`,
    "image": image,
    "description": provider.provider_bio || `${name} is a professional ${serviceType} service provider on Serviify.`,
    "jobTitle": serviceType,
    "address": location ? {
      "@type": "PostalAddress",
      "addressLocality": location
    } : undefined,
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "memberOf": {
      "@type": "Organization",
      "name": "Serviify",
      "url": "https://serviify.co.zw"
    }
  };
};

// Helper function to generate structured data for the main website
export const generateWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Serviify",
    "url": "https://serviify.co.zw",
    "description": "Find and book trusted service providers in Zimbabwe. Connect with professionals for all your service needs.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://serviify.co.zw/provider-search?query={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Serviify",
      "url": "https://serviify.co.zw"
    }
  };
};