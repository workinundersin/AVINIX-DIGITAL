import type {
  AdminAuthStatus,
  DashboardOverview,
  Inquiry,
  InquiryStatus,
  PortfolioProject,
  PricingConfig,
  SiteContent,
} from '../types/avenix';

const SESSION_TOKEN_KEY = 'avenix_session_token';

function getStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  let parsed: unknown = {};
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response from ${url} (received ${contentType || 'non-JSON'}).`);
      }
      parsed = { error: text };
    }
  }

  if (!response.ok) {
    const errMsg =
      typeof parsed === 'object' && parsed !== null && 'error' in parsed
        ? String((parsed as { error: string }).error)
        : `Request failed with status ${response.status}`;
    throw new Error(errMsg);
  }

  return parsed as T;
}

export const api = {
  // Public endpoints
  getContent: () => request<SiteContent>('/api/content'),
  getPricing: () => request<PricingConfig>('/api/pricing'),
  getPublishedProjects: () => request<PortfolioProject[]>('/api/projects'),
  submitInquiry: (payload: {
    fullName: string;
    email: string;
    phone: string;
    businessName: string;
    serviceRequired: string;
    budget: string;
    projectDescription: string;
  }) =>
    request<{ ok: boolean; id: string }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auth endpoints
  getAuthStatus: () => request<AdminAuthStatus>('/api/auth/status'),
  setupAdmin: async (email: string, password: string) => {
    const res = await request<{ authenticated: boolean; email: string; token?: string }>(
      '/api/auth/setup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    );
    if (res.token) setStoredToken(res.token);
    return res;
  },
  loginAdmin: async (email: string, password: string) => {
    const res = await request<{ authenticated: boolean; email: string; token?: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    );
    if (res.token) setStoredToken(res.token);
    return res;
  },
  logoutAdmin: async () => {
    try {
      await request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
    } finally {
      setStoredToken(null);
    }
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await request<{ ok: boolean; token?: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  // Protected Admin endpoints
  getAdminOverview: () => request<DashboardOverview>('/api/admin/overview'),
  getAdminInquiries: () => request<Inquiry[]>('/api/admin/inquiries'),
  updateInquiryStatus: (id: string, status: InquiryStatus) =>
    request<Inquiry>(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  getAdminProjects: () => request<PortfolioProject[]>('/api/admin/projects'),
  createProject: (payload: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<PortfolioProject>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProject: (
    id: string,
    payload: Partial<Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>>,
  ) =>
    request<PortfolioProject>(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  toggleProjectPublish: (id: string, published: boolean) =>
    request<PortfolioProject>(`/api/admin/projects/${encodeURIComponent(id)}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
    }),
  deleteProject: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  uploadProjectImage: (dataUrl: string, filename: string) =>
    request<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename }),
    }),

  updatePricing: (payload: PricingConfig) =>
    request<PricingConfig>('/api/admin/pricing', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  updateContent: (payload: SiteContent) =>
    request<SiteContent>('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
