import { ServiceType } from '@spider/shared/types/common';

export interface ServiceContent {
  slug: string;
  title: string;
  serviceType: ServiceType;
  summary: string;
  description: string;
  heroStat: string;
  highlights: string[];
  featuredCities: string[];
}

export interface ContractorPreview {
  id: string;
  name: string;
  serviceSlugs: string[];
  city: string;
  rating: number;
  reviews: number;
  verified: boolean;
  responseTimeHours: number;
}

export interface ProductContent {
  slug: string;
  category: 'solar' | 'ev-charger' | 'smart-device';
  name: string;
  summary: string;
  priceRange: string;
  features: string[];
  specifications: Record<string, string>;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Market' | 'Tips' | 'Product' | 'Company';
  publishedAt: string;
  content: string[];
}

export interface AboutContent {
  mission: string;
  story: string;
  values: string[];
  stats: Array<{ label: string; value: string }>;
}

export interface ContactContent {
  email: string;
  phone: string;
  line: string;
  officeHours: string;
  officeAddress: string;
}

export interface PublicContentBundle {
  services: ServiceContent[];
  contractors: ContractorPreview[];
  products: ProductContent[];
  news: NewsArticle[];
  about: AboutContent;
  contact: ContactContent;
}

const fallbackContent: PublicContentBundle = {
  services: [
    {
      slug: 'construction',
      title: 'New Construction',
      serviceType: ServiceType.CONSTRUCTION,
      summary: 'From planning to handover with verified site teams.',
      description:
        'Build residential and commercial spaces with contractors that are screened for quality, schedule reliability, and project transparency.',
      heroStat: '1,200+ successful construction projects',
      highlights: [
        'Site survey and material planning within 72 hours',
        'Weekly progress tracking with milestone payments',
        'Dedicated coordinator for contractor matching',
      ],
      featuredCities: ['Bangkok', 'Nonthaburi', 'Pathum Thani'],
    },
    {
      slug: 'renovation',
      title: 'Renovation & Remodeling',
      serviceType: ServiceType.RENOVATION,
      summary:
        'Upgrade homes, offices, and retail spaces without downtime surprises.',
      description:
        'Find specialists for kitchen, bathroom, retail, and office renovations with clear quotations and phased milestone releases.',
      heroStat: '89% of projects delivered on planned timeline',
      highlights: [
        'Transparent quote comparisons from top matches',
        'Contractor portfolio previews before booking',
        'Flexible budget ranges from starter to premium',
      ],
      featuredCities: ['Bangkok', 'Samut Prakan', 'Chonburi'],
    },
    {
      slug: 'smart-home',
      title: 'Smart Home Installation',
      serviceType: ServiceType.SMART_HOME,
      summary:
        'Connected living with certified installers and product guidance.',
      description:
        'Install smart security, automation, solar, and EV charging systems with local pros trained on modern home technology stacks.',
      heroStat: '3,500+ connected devices installed safely',
      highlights: [
        'Compatibility planning for existing electrical systems',
        'Product plus installation bundles for faster go-live',
        'After-install support and optimization check-ins',
      ],
      featuredCities: ['Bangkok', 'Chiang Mai', 'Phuket'],
    },
  ],
  contractors: [
    {
      id: 'ctr-1',
      name: 'MetroBuild Partners',
      serviceSlugs: ['construction', 'renovation'],
      city: 'Bangkok',
      rating: 4.9,
      reviews: 124,
      verified: true,
      responseTimeHours: 2,
    },
    {
      id: 'ctr-2',
      name: 'Northline Interior Co.',
      serviceSlugs: ['renovation'],
      city: 'Chiang Mai',
      rating: 4.7,
      reviews: 82,
      verified: true,
      responseTimeHours: 4,
    },
    {
      id: 'ctr-3',
      name: 'SmartGrid Home Tech',
      serviceSlugs: ['smart-home'],
      city: 'Bangkok',
      rating: 4.8,
      reviews: 146,
      verified: true,
      responseTimeHours: 3,
    },
    {
      id: 'ctr-4',
      name: 'East Bay Energy Works',
      serviceSlugs: ['smart-home', 'construction'],
      city: 'Chonburi',
      rating: 4.6,
      reviews: 64,
      verified: true,
      responseTimeHours: 6,
    },
  ],
  products: [
    {
      slug: 'solaron-5kw-kit',
      category: 'solar',
      name: 'SolarON 5kW Home Kit',
      summary: 'Residential solar package for medium-size homes.',
      priceRange: 'THB 185,000 - 240,000',
      features: [
        '5kW high-efficiency panel set',
        'Smart inverter with app monitoring',
        'Installation and permit support included',
      ],
      specifications: {
        Capacity: '5kW',
        Warranty: '12 years equipment / 25 years output',
        Monitoring: 'Mobile + web dashboard',
      },
    },
    {
      slug: 'voltway-ev-fastbox',
      category: 'ev-charger',
      name: 'VoltWay FastBox 22kW',
      summary: 'Fast home and office EV charger with load balancing.',
      priceRange: 'THB 52,000 - 79,000',
      features: [
        'Dynamic load balancing',
        'RFID access and schedule charging',
        'Weatherproof for indoor/outdoor use',
      ],
      specifications: {
        Power: '22kW',
        Connector: 'Type 2',
        Protection: 'IP65',
      },
    },
    {
      slug: 'nestlink-secure-pack',
      category: 'smart-device',
      name: 'NestLink Secure Pack',
      summary: 'Starter smart security kit for condos and townhomes.',
      priceRange: 'THB 18,000 - 36,000',
      features: [
        'Door sensors, smart lock, and 2 cameras',
        'Mobile notifications and automation routines',
        'Optional 24/7 monitoring integration',
      ],
      specifications: {
        Devices: '6-piece starter kit',
        Connectivity: 'Wi-Fi + Zigbee',
        Storage: 'Cloud or local NAS',
      },
    },
  ],
  news: [
    {
      slug: 'spider-expands-certified-smart-home-network',
      title: 'SPIDER expands its certified smart home installer network',
      excerpt:
        'New training cohorts increase coverage for smart device and solar installations in major provinces.',
      category: 'Company',
      publishedAt: '2026-01-22',
      content: [
        'SPIDER has expanded its partner program to onboard additional certified installers across Bangkok, Chiang Mai, and Chonburi.',
        'The initiative focuses on smart home safety standards, installation speed, and post-install support quality.',
      ],
    },
    {
      slug: 'renovation-budget-guide-2026',
      title: 'Renovation budget guide 2026: how to avoid hidden costs',
      excerpt:
        'A practical checklist for evaluating quotations, materials, and milestone plans before signing a contract.',
      category: 'Tips',
      publishedAt: '2026-01-10',
      content: [
        'Successful renovation projects begin with a written scope and milestone-based payment schedule.',
        'Customers can compare contractor proposals more effectively when specifications are standardized early.',
      ],
    },
    {
      slug: 'ev-charging-at-home-what-to-check-first',
      title: 'Installing an EV charger at home: what to check first',
      excerpt:
        'Understand power load, parking layout, and installation permits before selecting a charger model.',
      category: 'Product',
      publishedAt: '2025-12-27',
      content: [
        'Before selecting a charger, homeowners should verify panel capacity and preferred charging time windows.',
        'SPIDER contractors provide site surveys and recommend devices that fit both budget and daily usage patterns.',
      ],
    },
  ],
  about: {
    mission:
      'Make trusted contractor hiring simple, transparent, and measurable for every homeowner and business.',
    story:
      'SPIDER started as a response to fragmented contractor discovery. We built a marketplace with verification, structured quoting, and milestone tracking so customers can move from idea to handover with confidence.',
    values: [
      'Transparency in pricing and scope',
      'Verified quality through review and moderation',
      'Practical innovation for Thai homes and businesses',
    ],
    stats: [
      { label: 'Verified contractors', value: '2,300+' },
      { label: 'Projects completed', value: '8,900+' },
      { label: 'Average rating', value: '4.8/5' },
    ],
  },
  contact: {
    email: 'hello@spider-marketplace.com',
    phone: '+66 2 123 8899',
    line: '@spidermarketplace',
    officeHours: 'Mon - Sat, 09:00 - 18:00 ICT',
    officeAddress:
      'SPIDER HQ, 21 Sukhumvit 55 Road, Khlong Tan Nuea, Watthana, Bangkok',
  },
};

async function fetchCmsContent(): Promise<PublicContentBundle | null> {
  const cmsBaseUrl =
    process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL;

  if (!cmsBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${cmsBaseUrl}/public-content`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PublicContentBundle;
  } catch {
    return null;
  }
}

export async function getPublicContent(): Promise<PublicContentBundle> {
  return (await fetchCmsContent()) ?? fallbackContent;
}

export function formatServiceLabel(slug: string): string {
  return slug
    .split('-')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}
