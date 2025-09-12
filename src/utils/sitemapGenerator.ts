import { ProvidersService } from '../services/providers.service';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private static readonly BASE_URL = 'https://serviify.co.zw';
  private static readonly providersService = ProvidersService.getInstance();

  /**
   * Generate static URLs for the sitemap
   */
  private static getStaticUrls(): SitemapUrl[] {
    return [
      {
        loc: `${this.BASE_URL}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        loc: `${this.BASE_URL}/services`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: `${this.BASE_URL}/provider-search`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: `${this.BASE_URL}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: `${this.BASE_URL}/support`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${this.BASE_URL}/help-centre`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${this.BASE_URL}/auth`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        loc: `${this.BASE_URL}/privacy-policy`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        loc: `${this.BASE_URL}/terms-of-service`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.3
      }
    ];
  }

  /**
   * Generate provider URLs for the sitemap
   */
  private static async getProviderUrls(): Promise<SitemapUrl[]> {
    try {
      const allProviders = [];
      let page = 1;
      const limit = 100; // Fetch in batches
      let hasMore = true;

      while (hasMore) {
        const response = await this.providersService.discoverServices({
          limit,
          page,
        });

        if (response.providers && response.providers.length > 0) {
          allProviders.push(...response.providers);
          page++;
          hasMore = allProviders.length < (response.total || 0);
        } else {
          hasMore = false;
        }
      }

      return allProviders.map(provider => {
        const providerName = provider.name || `${provider.first_name} ${provider.last_name}`;
        const slug = slugify(providerName, { lower: true, strict: true });
        return {
          loc: `${this.BASE_URL}/provider/${slug}-${provider.id}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'weekly' as const,
          priority: 0.7
        };
      });
    } catch (error) {
      console.error('Error fetching providers for sitemap:', error);
      return [];
    }
  }

  /**
   * Generate complete sitemap XML
   */
  public static async generateSitemap(): Promise<string> {
    const staticUrls = this.getStaticUrls();
    const providerUrls = await this.getProviderUrls();
    const allUrls = [...staticUrls, ...providerUrls];

    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    const urlElements = allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    return `${xmlHeader}\n${urlsetOpen}${urlElements}\n${urlsetClose}`;
  }

  /**
   * Generate sitemap and save to public directory
   */
  public static async updateSitemapFile(): Promise<void> {
    try {
      const sitemapXml = await this.generateSitemap();
      
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemapXml);
      
      console.log(`Sitemap successfully generated and saved to ${sitemapPath}`);
      
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  }

  /**
   * Get provider count for sitemap planning
   */
  public static async getProviderCount(): Promise<number> {
    try {
      const response = await this.providersService.discoverServices({
        limit: 1,
        page: 1
      });
      return response.total || 0;
    } catch (error) {
      console.error('Error getting provider count:', error);
      return 0;
    }
  }
}