import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_CONTENT, DEFAULT_PRICING, DEFAULT_PROJECTS } from '../data/defaults';
import { api } from '../lib/api';
import type { AdminAuthStatus, PortfolioProject, PricingConfig, SiteContent } from '../types/avenix';

interface SiteDataContextValue {
  content: SiteContent;
  pricing: PricingConfig;
  projects: PortfolioProject[];
  authStatus: AdminAuthStatus;
  loading: boolean;
  error: string | null;
  refreshPublicData: () => Promise<void>;
  refreshAuthStatus: () => Promise<AdminAuthStatus>;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined);

function isValidPricing(data: unknown): data is PricingConfig {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Partial<PricingConfig>;
  return (
    Array.isArray(candidate.packages) &&
    candidate.packages.length > 0 &&
    candidate.packages.every(
      (pkg) =>
        typeof pkg?.name === 'string' &&
        typeof pkg?.price === 'number' &&
        Array.isArray(pkg?.features),
    ) &&
    typeof candidate.appDevelopment?.startingPrice === 'number'
  );
}

function isValidContent(data: unknown): data is SiteContent {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Partial<SiteContent>;
  return (
    typeof candidate.companyName === 'string' &&
    typeof candidate.heroHeading === 'string' &&
    Array.isArray(candidate.services)
  );
}

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [projects, setProjects] = useState<PortfolioProject[]>(DEFAULT_PROJECTS);
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus>({
    initialized: true,
    authenticated: false,
    email: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPublicData = useCallback(async () => {
    const [contentResult, pricingResult, projectsResult] = await Promise.allSettled([
      api.getContent(),
      api.getPricing(),
      api.getPublishedProjects(),
    ]);

    if (contentResult.status === 'fulfilled' && isValidContent(contentResult.value)) {
      setContent(contentResult.value);
    }
    if (pricingResult.status === 'fulfilled' && isValidPricing(pricingResult.value)) {
      setPricing(pricingResult.value);
    }
    if (projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value)) {
      setProjects(projectsResult.value);
    }
    setError(null);
  }, []);

  const refreshAuthStatus = useCallback(async () => {
    try {
      const status = await api.getAuthStatus();
      setAuthStatus(status);
      return status;
    } catch {
      const fallback: AdminAuthStatus = { initialized: true, authenticated: false, email: null };
      setAuthStatus(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await Promise.all([refreshPublicData(), refreshAuthStatus()]);
      if (active) {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshPublicData, refreshAuthStatus]);

  return (
    <SiteDataContext.Provider
      value={{
        content,
        pricing,
        projects,
        authStatus,
        loading,
        error,
        refreshPublicData,
        refreshAuthStatus,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used inside SiteDataProvider');
  }
  return ctx;
}
