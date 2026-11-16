import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { AdminAuthStatus, PortfolioProject, PricingConfig, SiteContent } from '../types/avenix';

interface SiteDataContextValue {
  content: SiteContent | null;
  pricing: PricingConfig | null;
  projects: PortfolioProject[];
  authStatus: AdminAuthStatus;
  loading: boolean;
  error: string | null;
  refreshPublicData: () => Promise<void>;
  refreshAuthStatus: () => Promise<AdminAuthStatus>;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus>({
    initialized: true,
    authenticated: false,
    email: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPublicData = useCallback(async () => {
    try {
      const [contentRes, pricingRes, projectsRes] = await Promise.all([
        api.getContent(),
        api.getPricing(),
        api.getPublishedProjects(),
      ]);
      setContent(contentRes);
      setPricing(pricingRes);
      setProjects(projectsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load website data.');
    }
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
      setLoading(true);
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
