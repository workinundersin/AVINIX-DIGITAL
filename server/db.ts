import fs from 'node:fs';
import path from 'node:path';
import type {
  Inquiry,
  PortfolioProject,
  PricingConfig,
  SiteContent,
} from '../src/types/avenix.ts';

export interface AdminRecord {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  admin: AdminRecord | null;
  inquiries: Inquiry[];
  projects: PortfolioProject[];
  pricing: PricingConfig;
  content: SiteContent;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'avenix-db.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function createDefaultDatabase(): DatabaseSchema {
  const now = new Date().toISOString();

  return {
    admin: null,
    inquiries: [],
    projects: [
      {
        id: 'demo-aurora-bistro',
        title: 'Aurora Bistro — Dining & Reservation Platform',
        category: 'Restaurant Website',
        description:
          'A responsive hospitality website crafted for modern restaurants featuring digital seasonal menus, chef highlights, instant table reservation inquiry flow, and direct WhatsApp ordering support.',
        highlights: [
          'Interactive digital food & beverage menu',
          'Table booking inquiry & Google Maps integration',
          'Mobile-first layout for quick customer browsing',
        ],
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'SEO Schema'],
        imageUrl: '/src/assets/images/portfolio_restaurant_web_1794811330519.jpg',
        isDemo: true,
        published: true,
        livePreviewSummary:
          'Demonstration project showcasing hospitality UI/UX, menu presentation, and direct reservation capture.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'demo-axiom-advisory',
        title: 'Axiom Advisory — Corporate Consulting Website',
        category: 'Business Website',
        description:
          'An authoritative multi-page company website designed for B2B service firms and local enterprises to clearly present capabilities, structured service tiers, and consultation booking forms.',
        highlights: [
          'Clear multi-page service architecture',
          'Lead capture contact workflow with validation',
          'Fast loading & search-engine-friendly markup',
        ],
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Express API'],
        imageUrl: '/src/assets/images/portfolio_business_web_1794811330498.jpg',
        isDemo: true,
        published: true,
        livePreviewSummary:
          'Demonstration project illustrating a structured B2B consulting presence and client inquiry funnel.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'demo-artisan-storefront',
        title: 'Artisan & Co. — Direct-to-Consumer Storefront',
        category: 'E-commerce Website',
        description:
          'A clean retail storefront experience engineered for emerging brands and local shops, featuring curated product collections, variant selection, cart drawer, and WhatsApp order assistance.',
        highlights: [
          'Clean product catalog & category filtering',
          'Streamlined cart & checkout summary flow',
          'Responsive storefront across mobile & desktop',
        ],
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
        imageUrl: '/src/assets/images/portfolio_ecommerce_web_1794811330734.jpg',
        isDemo: true,
        published: true,
        livePreviewSummary:
          'Demonstration project highlighting e-commerce merchandising, responsive product grids, and checkout clarity.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'demo-studio-aeterna',
        title: 'Studio Aeterna — Architectural Portfolio',
        category: 'Portfolio Website',
        description:
          'An editorial showcase website built for creative studios, architects, and independent professionals to display visual case studies with disciplined typography and fast image delivery.',
        highlights: [
          'Editorial grid layout with project detail modal',
          'Optimized visual presentation & clean typography',
          'Direct client commission & inquiry form',
        ],
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
        imageUrl: '/src/assets/images/portfolio_creative_web_1794811330791.jpg',
        isDemo: true,
        published: true,
        livePreviewSummary:
          'Demonstration project showcasing editorial portfolio framing and structured visual storytelling.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'demo-trackflow-android',
        title: 'TrackFlow — Android Business & Order App',
        category: 'Android Application',
        description:
          'A native-feel Android business application concept enabling local retailers and service teams to manage customer orders, real-time status updates, and secure account workflows.',
        highlights: [
          'Structured mobile order tracking & status updates',
          'Secure backend synchronization & user accounts',
          'Thumb-friendly Android interface design',
        ],
        techStack: ['Android UI', 'REST Backend', 'Database Sync', 'Auth'],
        imageUrl: '/src/assets/images/portfolio_android_app_1794811332007.jpg',
        isDemo: true,
        published: true,
        livePreviewSummary:
          'Demonstration concept illustrating an Android business operations and customer order management application.',
        createdAt: now,
        updatedAt: now,
      },
    ],
    pricing: {
      packages: [
        {
          id: 'basic',
          name: 'Basic Website',
          targetAudience: 'For small shops, solo founders & local services',
          price: 2000,
          currency: '₹',
          featured: false,
          features: [
            'Up to 3–4 Pages',
            'Responsive Design',
            'Basic Business Information',
            'WhatsApp Button',
            'Contact Information',
            'Basic Website Design',
          ],
        },
        {
          id: 'standard',
          name: 'Standard Website',
          targetAudience: 'For growing businesses, restaurants & startups',
          price: 5000,
          currency: '₹',
          featured: true,
          features: [
            'Up to 6–8 Pages',
            'Premium UI/UX',
            'Responsive Design',
            'Contact Form',
            'WhatsApp Integration',
            'Google Maps Integration',
            'Basic SEO Setup',
          ],
        },
        {
          id: 'premium',
          name: 'Premium Website',
          targetAudience: 'For companies needing full dynamic management',
          price: 10000,
          currency: '₹',
          featured: false,
          features: [
            'Up to 10–12 Pages',
            'Custom Premium Design',
            'Advanced Animations',
            'Admin Dashboard',
            'Dynamic Content Management',
            'Inquiry Management',
            'SEO Setup',
          ],
        },
      ],
      appDevelopment: {
        startingPrice: 10000,
        currency: '₹',
        note: 'Custom pricing based on application features, complexity, and requirements.',
      },
      disclaimer:
        'These prices are starting package prices. Domain, hosting, paid APIs, and third-party services are extra unless specifically included.',
      updatedAt: now,
    },
    content: {
      companyName: 'AVENIX DIGITAL',
      tagline: 'Ideas Into Digital Reality',
      heroHeading: 'Build Your Digital Future With AVENIX DIGITAL',
      heroSubheading:
        'We create modern websites and innovative mobile applications that help businesses establish their digital presence and grow.',
      aboutWhoWeAre:
        'AVENIX DIGITAL is a digital development company focused on building modern websites and mobile applications. Our goal is to help businesses establish a strong digital presence through creative design and modern technology.',
      aboutMission:
        'To make reliable, modern websites and mobile applications accessible for startups, restaurants, entrepreneurs, and growing businesses through transparent pricing and clean engineering.',
      aboutVision:
        'To be a trusted technology partner for ambitious local and growing businesses turning practical ideas into dependable digital products.',
      aboutWhatWeDo:
        'We design, build, and maintain custom websites and mobile applications tailored to real business workflows—from customer-facing storefronts and restaurant platforms to full-stack portals with admin dashboards.',
      aboutValues: [
        {
          title: 'Clarity & Transparency',
          description:
            'Straightforward scope, clear starting prices, and honest timelines from the initial conversation through launch.',
        },
        {
          title: 'Crafted Engineering',
          description:
            'Responsive layouts, clean semantic markup, and secure backend architecture built to perform reliably across devices.',
        },
        {
          title: 'Customer-First Execution',
          description:
            'Every website and mobile application is structured around the specific goals of your business and your customers.',
        },
        {
          title: 'Long-Term Dependability',
          description:
            'Structured codebases and post-launch maintenance so your digital presence stays fast, accurate, and easy to manage.',
        },
      ],
      services: [
        {
          id: 'website-development',
          title: 'Website Development',
          subtitle: 'Custom Web Platforms & Business Storefronts',
          description:
            'We design and develop fast, mobile-responsive websites tailored to convert visitors into customers and present your brand with authority.',
          categories: [
            'Business Websites',
            'Restaurant Websites',
            'Portfolio Websites',
            'E-commerce Websites',
            'Landing Pages',
            'Custom Websites',
          ],
          features: [
            'Responsive Design',
            'Modern UI/UX',
            'Fast Performance',
            'Contact Forms',
            'WhatsApp Integration',
            'SEO-Friendly Structure',
            'Custom Design',
          ],
        },
        {
          id: 'app-development',
          title: 'App Development',
          subtitle: 'Android & Custom Mobile Applications',
          description:
            'We engineer intuitive mobile applications with secure backends and real-time database integration to streamline operations and engage customers on the go.',
          categories: [
            'Android Applications',
            'Business Applications',
            'E-commerce Applications',
            'Custom Mobile Applications',
          ],
          features: [
            'Modern UI',
            'User-Friendly Experience',
            'Responsive Layouts',
            'Secure Backend',
            'Database Integration',
            'Custom Functionality',
          ],
        },
      ],
      contact: {
        email: 'contact@avenixdigital.com',
        phone: '+91 9258915144',
        whatsappNumber: '919258915144',
        location: 'India · Remote & Global Delivery',
        businessHours: 'Mon – Sat · 10:00 AM – 7:00 PM IST',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
          twitter: 'https://x.com',
          github: 'https://github.com',
        },
      },
      updatedAt: now,
    },
  };
}

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

let cachedDb: DatabaseSchema | null = null;

export function readDb(): DatabaseSchema {
  if (cachedDb) {
    return cachedDb;
  }
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const initial = createDefaultDatabase();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    cachedDb = parsed;
    return parsed;
  } catch {
    const fallback = createDefaultDatabase();
    writeDb(fallback);
    return fallback;
  }
}

export function writeDb(data: DatabaseSchema): void {
  ensureDirectories();
  const tmpFile = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
  cachedDb = data;
}
