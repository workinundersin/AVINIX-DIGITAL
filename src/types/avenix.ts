export type InquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed';

export type ServiceRequiredOption = 'Website Development' | 'App Development' | 'Both';

export type BudgetOption =
  | '₹2,000–₹5,000'
  | '₹5,000–₹10,000'
  | '₹10,000+'
  | 'Custom Budget';

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  serviceRequired: ServiceRequiredOption;
  budget: BudgetOption;
  projectDescription: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory =
  | 'Restaurant Website'
  | 'Business Website'
  | 'E-commerce Website'
  | 'Portfolio Website'
  | 'Android Application'
  | 'Custom Software';

export interface PortfolioProject {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  highlights: string[];
  techStack: string[];
  imageUrl: string;
  isDemo: boolean;
  published: boolean;
  livePreviewSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPackage {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  targetAudience: string;
  price: number;
  currency: string;
  featured: boolean;
  features: string[];
}

export interface AppPricingConfig {
  startingPrice: number;
  currency: string;
  note: string;
}

export interface PricingConfig {
  packages: PricingPackage[];
  appDevelopment: AppPricingConfig;
  disclaimer: string;
  updatedAt: string;
}

export interface ServiceOffering {
  id: 'website-development' | 'app-development';
  title: string;
  subtitle: string;
  description: string;
  categories: string[];
  features: string[];
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface SocialLinks {
  linkedin: string;
  instagram: string;
  twitter: string;
  github: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsappNumber: string;
  location: string;
  businessHours: string;
  socialLinks: SocialLinks;
}

export interface SiteContent {
  companyName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  aboutWhoWeAre: string;
  aboutMission: string;
  aboutVision: string;
  aboutWhatWeDo: string;
  aboutValues: ValueItem[];
  services: ServiceOffering[];
  contact: ContactInfo;
  updatedAt: string;
}

export interface AdminAuthStatus {
  initialized: boolean;
  authenticated: boolean;
  email: string | null;
}

export interface DashboardOverview {
  totalInquiries: number;
  newInquiries: number;
  inProgressProjects: number;
  completedProjects: number;
  totalPortfolioProjects: number;
  publishedPortfolioProjects: number;
}
