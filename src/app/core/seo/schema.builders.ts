import { SITE_CONFIG } from '../config/site.config';
import { Article, CoachingPackage, CoachingService, SiteContent, TrainingProgram } from '../models';

/**
 * Schema.org builders. Only factual, on-page information is emitted:
 * no ratings, reviews or credentials that are not verified and visible on the page.
 */
type Abs = (path: string) => string;

export function organizationSchema(abs: Abs): Record<string, unknown> {
  const sameAs = SITE_CONFIG.social.map((s) => s.url).filter(Boolean);
  const base = {
    '@id': abs('/#organization'),
    name: SITE_CONFIG.legalName,
    url: abs('/'),
    logo: abs('/icons/icon-512.png'),
    description: SITE_CONFIG.defaultDescription,
    email: SITE_CONFIG.contact.email,
    ...(SITE_CONFIG.contact.phone ? { telephone: SITE_CONFIG.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
  if (SITE_CONFIG.address) {
    return {
      '@type': ['Organization', 'LocalBusiness', 'HealthAndBeautyBusiness'],
      ...base,
      address: { '@type': 'PostalAddress', ...SITE_CONFIG.address },
    };
  }
  return { '@type': 'Organization', ...base };
}

export function websiteSchema(abs: Abs): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    name: `${SITE_CONFIG.brandName} ${SITE_CONFIG.brandSuffix}`,
    url: abs('/'),
    publisher: { '@id': abs('/#organization') },
  };
}

export function personSchema(abs: Abs, content: SiteContent): Record<string, unknown> {
  const credentials = content.qualifications.filter((q) => q.verified);
  return {
    '@type': 'Person',
    '@id': abs('/about#coach'),
    name: content.trainerName,
    jobTitle: content.trainerRole,
    description: content.trainerShortBio,
    url: abs('/about'),
    worksFor: { '@id': abs('/#organization') },
    ...(content.trainerPhotoUrl ? { image: abs(content.trainerPhotoUrl) } : {}),
    ...(credentials.length
      ? {
          hasCredential: credentials.map((c) => ({
            '@type': 'EducationalOccupationalCredential',
            name: c.title,
          })),
        }
      : {}),
  };
}

export function serviceSchema(abs: Abs, service: CoachingService): Record<string, unknown> {
  return {
    '@type': 'Service',
    name: service.name,
    serviceType: 'Personal training and bodybuilding coaching',
    description: service.shortDescription,
    url: abs(`/services/${service.slug}`),
    provider: { '@id': abs('/#organization') },
    areaServed: service.delivery === 'in-person' ? SITE_CONFIG.contact.serviceArea : 'Worldwide',
  };
}

export function offerCatalogSchema(
  abs: Abs,
  packages: readonly CoachingPackage[],
): Record<string, unknown> {
  return {
    '@type': 'Service',
    name: 'Bodybuilding coaching packages',
    provider: { '@id': abs('/#organization') },
    url: abs('/pricing'),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Coaching packages',
      itemListElement: packages.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        description: p.tagline,
        price: p.price,
        priceCurrency: p.currency,
        url: abs('/pricing'),
      })),
    },
  };
}

export function programSchema(abs: Abs, program: TrainingProgram): Record<string, unknown> {
  return {
    '@type': 'Course',
    name: program.name,
    description: program.description,
    url: abs(`/programs/${program.slug}`),
    provider: { '@id': abs('/#organization') },
    educationalLevel: program.level,
    timeRequired: `P${program.durationWeeks}W`,
    ...(program.price
      ? {
          offers: {
            '@type': 'Offer',
            price: program.price,
            priceCurrency: SITE_CONFIG.currency,
            category: 'Paid',
          },
        }
      : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: `PT${program.daysPerWeek * 60}M`,
    },
  };
}

export function articleSchema(abs: Abs, article: Article): Record<string, unknown> {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.author, url: abs('/about') },
    publisher: { '@id': abs('/#organization') },
    mainEntityOfPage: abs(`/blog/${article.slug}`),
    articleSection: article.category,
    keywords: article.tags.join(', '),
    image: abs(article.featuredImageUrl ?? SITE_CONFIG.defaultOgImage),
  };
}

export function breadcrumbSchema(
  abs: Abs,
  items: readonly { readonly label: string; readonly url: string }[],
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: abs(item.url),
    })),
  };
}
