// src/utils/schema.ts
// Schema markup generation utilities for JSON-LD structured data

export interface SchemaConfig {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  authorName: string;
  authorTitle: string;
  logoUrl: string;
  socialLinks: string[];
}

export const defaultConfig: SchemaConfig = {
  siteUrl: 'https://kadydennis.com',
  siteName: 'Kady Dennis Consulting',
  siteDescription: 'AI operations consulting for travel agencies and small businesses',
  authorName: 'Kady Dennis',
  authorTitle: 'AI Operations Consultant',
  logoUrl: 'https://kadydennis.com/images/logo.png',
  socialLinks: [
    'https://linkedin.com/in/kadydennis',
    'https://www.facebook.com/groups/traveladvisoropscommunity'
  ]
};

// Organization schema - referenced site-wide
export function getOrganizationSchema(config: SchemaConfig = defaultConfig) {
  return {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#organization`,
    name: config.siteName,
    url: config.siteUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${config.siteUrl}/#logo`,
      url: config.logoUrl,
      contentUrl: config.logoUrl,
      caption: config.siteName
    },
    description: config.siteDescription,
    founder: { '@id': `${config.siteUrl}/about/#person` },
    sameAs: config.socialLinks
  };
}

// Person schema - for about page, referenced by articles
export function getPersonSchema(config: SchemaConfig = defaultConfig) {
  return {
    '@type': 'Person',
    '@id': `${config.siteUrl}/about/#person`,
    name: config.authorName,
    jobTitle: config.authorTitle,
    url: `${config.siteUrl}/about/`,
    worksFor: { '@id': `${config.siteUrl}/#organization` },
    knowsAbout: [
      'AI automation',
      'ClickUp',
      'travel agency operations',
      'workflow design',
      'business process automation',
      'operations consulting'
    ],
    sameAs: config.socialLinks
  };
}

// WebSite schema - for homepage
export function getWebSiteSchema(config: SchemaConfig = defaultConfig) {
  return {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#website`,
    url: config.siteUrl,
    name: config.siteName,
    description: config.siteDescription,
    publisher: { '@id': `${config.siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// WebPage schema - for every page
export interface WebPageSchemaOptions {
  url: string;
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}

export function getWebPageSchema(
  options: WebPageSchemaOptions,
  config: SchemaConfig = defaultConfig
) {
  return {
    '@type': 'WebPage',
    '@id': `${options.url}#webpage`,
    url: options.url,
    name: options.title,
    description: options.description,
    isPartOf: { '@id': `${config.siteUrl}/#website` },
    about: { '@id': `${config.siteUrl}/#organization` },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.image && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: options.image
      }
    })
  };
}

// BreadcrumbList schema
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(
  items: BreadcrumbItem[],
  config: SchemaConfig = defaultConfig
) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url || config.siteUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Service schema
export interface ServiceSchemaOptions {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
  areaServed?: string;
  audienceType?: string;
}

export function getServiceSchema(
  options: ServiceSchemaOptions,
  config: SchemaConfig = defaultConfig
) {
  return {
    '@type': 'Service',
    '@id': `${options.url}#service`,
    name: options.name,
    description: options.description,
    url: options.url,
    serviceType: 'Operations Consulting',
    provider: { '@id': `${config.siteUrl}/#organization` },
    areaServed: options.areaServed || 'Worldwide',
    ...(options.priceRange && { priceRange: options.priceRange }),
    audience: {
      '@type': 'Audience',
      audienceType: options.audienceType || 'Travel Advisors, Small Business Owners'
    }
  };
}

// FAQPage schema
export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Article schema - for blog posts and resources
export interface ArticleSchemaOptions {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  wordCount?: number;
}

export function getArticleSchema(
  options: ArticleSchemaOptions,
  config: SchemaConfig = defaultConfig
) {
  return {
    '@type': 'Article',
    '@id': `${options.url}#article`,
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    author: { '@id': `${config.siteUrl}/about/#person` },
    publisher: { '@id': `${config.siteUrl}/#organization` },
    isPartOf: { '@id': `${config.siteUrl}/#website` },
    ...(options.image && {
      image: {
        '@type': 'ImageObject',
        url: options.image
      }
    }),
    ...(options.wordCount && { wordCount: options.wordCount })
  };
}

// Product schema - for shop items
export interface ProductSchemaOptions {
  name: string;
  description: string;
  url: string;
  price: number;
  priceCurrency?: string;
  image?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

export function getProductSchema(
  options: ProductSchemaOptions,
  config: SchemaConfig = defaultConfig
) {
  return {
    '@type': 'Product',
    name: options.name,
    description: options.description,
    url: options.url,
    brand: { '@id': `${config.siteUrl}/#organization` },
    ...(options.image && { image: options.image }),
    offers: {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: options.priceCurrency || 'USD',
      availability: `https://schema.org/${options.availability || 'InStock'}`,
      seller: { '@id': `${config.siteUrl}/#organization` }
    }
  };
}

// Combine multiple schemas into @graph format
export function createSchemaGraph(schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
}

// Helper to generate full page schema with common elements
export interface PageSchemaOptions {
  url: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
  image?: string;
  includeOrganization?: boolean;
  includeWebsite?: boolean;
  additionalSchemas?: object[];
}

export function generatePageSchema(
  options: PageSchemaOptions,
  config: SchemaConfig = defaultConfig
) {
  const schemas: object[] = [];

  // Always include WebPage
  schemas.push(getWebPageSchema({
    url: options.url,
    title: options.title,
    description: options.description,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    image: options.image
  }, config));

  // Include Organization if requested (usually on homepage)
  if (options.includeOrganization) {
    schemas.push(getOrganizationSchema(config));
  }

  // Include WebSite if requested (usually on homepage)
  if (options.includeWebsite) {
    schemas.push(getWebSiteSchema(config));
  }

  // Include breadcrumbs if provided
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schemas.push(getBreadcrumbSchema(options.breadcrumbs, config));
  }

  // Include any additional schemas
  if (options.additionalSchemas) {
    schemas.push(...options.additionalSchemas);
  }

  return createSchemaGraph(schemas);
}
