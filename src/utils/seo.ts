// src/utils/seo.ts
// SEO utilities for meta tags, Open Graph, and Twitter Cards

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  defaultImage: string;
  twitterHandle?: string;
  locale: string;
}

export const defaultSiteConfig: SiteConfig = {
  siteUrl: 'https://kadydennis.com',
  siteName: 'Kady Dennis Consulting',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: undefined, // Add if Twitter account exists
  locale: 'en_US'
};

// Generate the full title with site name
export function getFullTitle(title: string, siteName: string = defaultSiteConfig.siteName): string {
  // If title already includes the brand, don't duplicate
  if (title.toLowerCase().includes('kady dennis')) {
    return title;
  }
  return `${title} | ${siteName}`;
}

// Truncate description to optimal length
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

// Generate canonical URL
export function getCanonicalUrl(path: string, siteUrl: string = defaultSiteConfig.siteUrl): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure trailing slash for directories
  const finalPath = normalizedPath.endsWith('/') || normalizedPath.includes('.') 
    ? normalizedPath 
    : `${normalizedPath}/`;
  
  return `${siteUrl}${finalPath}`;
}

// Generate absolute image URL
export function getAbsoluteImageUrl(imagePath: string, siteUrl: string = defaultSiteConfig.siteUrl): string {
  if (imagePath.startsWith('http')) return imagePath;
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${siteUrl}${normalizedPath}`;
}

// Generate all meta tags for a page
export function generateMetaTags(props: SEOProps, config: SiteConfig = defaultSiteConfig) {
  const {
    title,
    description,
    canonical,
    noindex = false,
    nofollow = false,
    ogType = 'website',
    ogImage,
    ogImageAlt,
    twitterCard = 'summary_large_image',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags
  } = props;

  const fullTitle = getFullTitle(title, config.siteName);
  const truncatedDescription = truncateDescription(description);
  const canonicalUrl = canonical || getCanonicalUrl('/', config.siteUrl);
  const imageUrl = getAbsoluteImageUrl(ogImage || config.defaultImage, config.siteUrl);

  // Build robots directive
  const robotsDirectives: string[] = [];
  if (noindex) robotsDirectives.push('noindex');
  if (nofollow) robotsDirectives.push('nofollow');
  const robots = robotsDirectives.length > 0 ? robotsDirectives.join(', ') : 'index, follow';

  return {
    // Basic meta
    title: fullTitle,
    description: truncatedDescription,
    canonical: canonicalUrl,
    robots,

    // Open Graph
    ogTitle: title, // OG title without site name suffix
    ogDescription: truncatedDescription,
    ogType,
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    ogImageAlt: ogImageAlt || title,
    ogSiteName: config.siteName,
    ogLocale: config.locale,

    // Twitter Card
    twitterCard,
    twitterTitle: title,
    twitterDescription: truncatedDescription,
    twitterImage: imageUrl,
    twitterImageAlt: ogImageAlt || title,
    ...(config.twitterHandle && { twitterSite: config.twitterHandle }),

    // Article-specific (when ogType is 'article')
    ...(ogType === 'article' && {
      articlePublishedTime: publishedTime,
      articleModifiedTime: modifiedTime,
      articleAuthor: author,
      articleSection: section,
      articleTags: tags
    })
  };
}

// Generate breadcrumb items from URL path
export function generateBreadcrumbs(
  pathname: string, 
  siteUrl: string = defaultSiteConfig.siteUrl
): Array<{ name: string; url: string }> {
  // Remove leading/trailing slashes and split
  const segments = pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  
  if (segments.length === 0) return [];

  const breadcrumbs = [{ name: 'Home', url: siteUrl }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    // Convert slug to title case
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name,
      url: `${siteUrl}${currentPath}/`
    });
  }

  return breadcrumbs;
}

// Page-specific SEO configurations
export const pagesSEO: Record<string, Partial<SEOProps>> = {
  home: {
    title: 'Kady Dennis | AI Operations Consultant for Travel Advisors | Done-For-You & DIY Solutions',
    description: 'AI operations consultant helping travel advisors and small teams automate their business. Choose from done-for-you systems, VIP strategy days, workflow audits, or DIY templates.',
    ogType: 'website'
  },
  about: {
    title: 'About Kady Dennis | AI Operations Consultant',
    description: 'From travel coordinator to operations consultant. I build systems so travel agents and small businesses don\'t have to think about them.',
    ogType: 'website'
  },
  services: {
    title: 'Services | AI Operations Consulting for Travel Agents',
    description: 'Done-for-you systems, VIP strategy days, and workflow audits for travel advisors and small businesses. Choose how you want to work together.',
    ogType: 'website'
  },
  'done-for-you-systems': {
    title: 'Done-For-You Systems | Full Operations Build for Travel Agencies',
    description: 'Complete operations infrastructure built for you. ClickUp setup, automated workflows, commission tracking—delivered turnkey in 4-6 weeks.',
    ogType: 'website'
  },
  'vip-strategy-day': {
    title: 'VIP Strategy Day | One Day Operations Intensive',
    description: 'One intensive day to get complete clarity on your operations. Workflow mapping, bottleneck identification, and a 90-day action plan—delivered in a single focused session.',
    ogType: 'website'
  },
  'workflow-audit': {
    title: 'Workflow Audit | Operations Review & Recommendations',
    description: 'A focused review of your current systems with specific recommendations. Written audit report, priority action list, and a 30-minute walkthrough call—all for $500.',
    ogType: 'website'
  },
  shop: {
    title: 'Resources & Templates | Travel Agent Workflow Tools',
    description: 'ClickUp templates, workflow guides, and AI prompt packs for travel agents. Grab what you need and start using it today.',
    ogType: 'website'
  },
  community: {
    title: 'Travel Agent Workflows Community | Free Facebook Group',
    description: 'Join 218+ travel agents learning workflows, automation, and AI tools. Free Facebook group with weekly tips, Q&As, and first access to new resources.',
    ogType: 'website'
  },
  contact: {
    title: 'Contact | Work with Kady Dennis',
    description: 'Ready to fix your operations? Book a free discovery call or send a message. I respond within 24 hours.',
    ogType: 'website'
  },
  resources: {
    title: 'Free Resources | Travel Agent Workflow Guides',
    description: 'Free guides and resources for travel agents looking to automate their operations and use AI effectively.',
    ogType: 'website'
  }
};
