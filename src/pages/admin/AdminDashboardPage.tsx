import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  X,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { api } from '../../lib/api';
import type { DashboardOverview, Inquiry, PortfolioProject } from '../../types/avenix';
import { BrandLogo } from '../../components/BrandLogo';
import { PageMeta } from '../../components/PageMeta';
import { AdminAuthScreen } from './AdminAuthScreen';
import { AdminContentPanel } from './AdminContentPanel';
import { AdminInquiriesPanel } from './AdminInquiriesPanel';
import { AdminPricingPanel } from './AdminPricingPanel';
import { AdminProfilePanel } from './AdminProfilePanel';
import { AdminProjectsPanel } from './AdminProjectsPanel';

type AdminTab = 'overview' | 'inquiries' | 'projects' | 'pricing' | 'content' | 'profile';

const NAV_TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Inquiries', icon: Inbox },
  { id: 'projects', label: 'Portfolio Projects', icon: Briefcase },
  { id: 'pricing', label: 'Pricing Packages', icon: DollarSign },
  { id: 'content', label: 'Website Content', icon: FileText },
  { id: 'profile', label: 'Profile & Security', icon: UserCog },
];

export function AdminDashboardPage() {
  const { authStatus, content, pricing, refreshAuthStatus, refreshPublicData } = useSiteData();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [adminProjects, setAdminProjects] = useState<PortfolioProject[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const loadProtectedData = useCallback(async () => {
    if (!authStatus.authenticated) return;
    setLoadingAdminData(true);
    setAdminError(null);
    try {
      const [overviewRes, inquiriesRes, projectsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminInquiries(),
        api.getAdminProjects(),
      ]);
      setOverview(overviewRes);
      setInquiries(inquiriesRes);
      setAdminProjects(projectsRes);
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : 'Unable to load admin data.');
    } finally {
      setLoadingAdminData(false);
    }
  }, [authStatus.authenticated]);

  useEffect(() => {
    if (authStatus.authenticated) {
      loadProtectedData();
    }
  }, [authStatus.authenticated, loadProtectedData]);

  async function handleRefreshAll() {
    await Promise.all([loadProtectedData(), refreshPublicData()]);
  }

  async function handleLogout() {
    await api.logoutAdmin();
    setOverview(null);
    setInquiries([]);
    setAdminProjects([]);
    await refreshAuthStatus();
  }

  if (!authStatus.authenticated) {
    return (
      <>
        <PageMeta
          title="Admin Sign In | AVENIX DIGITAL"
          description="Protected administrator portal for AVENIX DIGITAL."
        />
        <AdminAuthScreen
          initialized={authStatus.initialized}
          onAuthenticated={async () => {
            await refreshAuthStatus();
          }}
        />
      </>
    );
  }

  const currentTabMeta = NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];

  return (
    <>
      <PageMeta
        title="Admin Dashboard | AVENIX DIGITAL"
        description="Manage inquiries, portfolio projects, pricing packages, and website content."
      />

      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#071426] text-slate-300 border-r border-slate-800">
          <div className="flex h-16 items-center px-6 border-b border-slate-800">
            <Link to="/" aria-label="AVENIX DIGITAL Home">
              <BrandLogo variant="dark" size="sm" />
            </Link>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Admin Navigation">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-300 hover:bg-[#0B1730] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4 space-y-2">
            <Link
              to="/"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-[#0B1730] hover:text-white"
            >
              <span>View Public Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-950/50 hover:text-red-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#071426]/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="h-full w-64 bg-[#071426] text-slate-300 flex flex-col justify-between p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <BrandLogo variant="dark" size="sm" />
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800"
                    aria-label="Close admin sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {NAV_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'text-slate-300 hover:bg-[#0B1730] hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <Link
                  to="/"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-[#0B1730]"
                >
                  <span>View Public Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-950/50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#0B1730] lg:hidden"
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm truncate">
                <span className="font-semibold text-slate-400">Admin</span>
                <span className="text-slate-300">/</span>
                <span className="font-display font-bold text-[#0B1730] truncate">
                  {currentTabMeta.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline text-xs text-slate-500">{authStatus.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1730] hover:bg-slate-50 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {adminError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {adminError}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-display text-2xl font-bold text-[#0B1730]">
                    Dashboard Overview
                  </h1>
                  <p className="text-sm text-slate-600">
                    Real-time summary of incoming inquiries, project pipeline status, and
                    published portfolio items.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-medium text-slate-500">Total Inquiries</p>
                    <p className="mt-2 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#0B1730]">
                      {loadingAdminData ? '—' : (overview?.totalInquiries ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-medium text-[#2563EB]">New Inquiries</p>
                    <p className="mt-2 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#2563EB]">
                      {loadingAdminData ? '—' : (overview?.newInquiries ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-medium text-slate-500">In Progress Projects</p>
                    <p className="mt-2 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#0B1730]">
                      {loadingAdminData ? '—' : (overview?.inProgressProjects ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-medium text-emerald-700">Completed Projects</p>
                    <p className="mt-2 font-mono-tabular text-2xl sm:text-3xl font-bold text-emerald-700">
                      {loadingAdminData ? '—' : (overview?.completedProjects ?? 0)}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-medium text-slate-500">Total Portfolio Projects</p>
                    <p className="mt-2 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#0B1730]">
                      {loadingAdminData ? '—' : (overview?.totalPortfolioProjects ?? 0)}
                    </p>
                  </div>
                </div>

                {/* Recent Inquiries Snapshot */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-4">
                    <h2 className="font-display text-base font-bold text-[#0B1730]">
                      Latest Inquiries
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
                    >
                      Manage All Inquiries
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No inquiries received yet. Submissions from the Contact Us page will appear
                      here automatically.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Customer</th>
                            <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Service</th>
                            <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Budget</th>
                            <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Status</th>
                            <th className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inquiries.slice(0, 5).map((inq) => (
                            <tr key={inq.id} className="hover:bg-slate-50/70">
                              <td className="px-4 sm:px-6 py-3.5">
                                <p className="font-semibold text-[#0B1730]">{inq.fullName}</p>
                                <p className="text-xs text-slate-500 break-all sm:break-normal">{inq.email}</p>
                              </td>
                              <td className="px-4 sm:px-6 py-3.5 text-slate-700 whitespace-nowrap">{inq.serviceRequired}</td>
                              <td className="px-4 sm:px-6 py-3.5 font-mono-tabular text-slate-700 whitespace-nowrap">
                                {inq.budget}
                              </td>
                              <td className="px-4 sm:px-6 py-3.5 font-medium text-[#2563EB] whitespace-nowrap">
                                {inq.status}
                              </td>
                              <td className="px-4 sm:px-6 py-3.5 text-right font-mono-tabular text-xs text-slate-500 whitespace-nowrap">
                                {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <AdminInquiriesPanel inquiries={inquiries} onRefresh={handleRefreshAll} />
            )}

            {activeTab === 'projects' && (
              <AdminProjectsPanel projects={adminProjects} onRefresh={handleRefreshAll} />
            )}

            {activeTab === 'pricing' && (
              <AdminPricingPanel pricing={pricing} onRefresh={handleRefreshAll} />
            )}

            {activeTab === 'content' && (
              <AdminContentPanel content={content} onRefresh={handleRefreshAll} />
            )}

            {activeTab === 'profile' && (
              <AdminProfilePanel email={authStatus.email} onLogout={handleLogout} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
