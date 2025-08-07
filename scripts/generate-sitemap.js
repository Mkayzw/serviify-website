import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data for demonstration - in a real scenario, you'd fetch from your API
const generateSitemap = () => {
  const baseUrl = 'https://serviify.co.zw';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.9', changefreq: 'weekly' },
    { url: '/provider-search', priority: '0.8', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/support', priority: '0.6', changefreq: 'monthly' },
    { url: '/help-centre', priority: '0.6', changefreq: 'monthly' },
    { url: '/auth', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
  ];

  // Example provider IDs - replace with actual provider data from your API
  const providerIds = [
    'provider-1', 'provider-2', 'provider-3', 'provider-4', 'provider-5',
    'provider-6', 'provider-7', 'provider-8', 'provider-9', 'provider-10'
    // Add more provider IDs as needed
  ];

  const providerPages = providerIds.map(id => ({
    url: `/provider/${id}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  const allPages = [...staticPages, ...providerPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate and save sitemap
const sitemapContent = generateSitemap();
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('✅ Sitemap generated successfully at:', sitemapPath);
console.log('📊 Total URLs in sitemap:', sitemapContent.split('<url>').length - 1);