import { useMemo, useState } from 'react';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Inquiry, InquiryStatus } from '../../types/avenix';

interface AdminInquiriesPanelProps {
  inquiries: Inquiry[];
  onRefresh: () => Promise<void>;
}

const STATUS_OPTIONS: InquiryStatus[] = ['New', 'Contacted', 'In Progress', 'Completed'];

const STATUS_STYLES: Record<InquiryStatus, string> = {
  New: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/30',
  Contacted: 'text-amber-700 bg-amber-50 border-amber-200',
  'In Progress': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  Completed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

export function AdminInquiriesPanel({ inquiries, onRefresh }: AdminInquiriesPanelProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InquiryStatus>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.businessName.toLowerCase().includes(q) ||
        item.serviceRequired.toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter]);

  async function handleStatusChange(id: string, status: InquiryStatus) {
    setBusyId(id);
    setError(null);
    try {
      await api.updateInquiryStatus(id, status);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inquiry status.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await api.deleteInquiry(id);
      setConfirmDeleteId(null);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inquiry.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1730]">Customer Inquiries</h2>
          <p className="text-sm text-slate-600">
            Review incoming website and app requests, update workflow status, or remove closed
            leads.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, business..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1 w-full sm:w-fit">
        {(['All', ...STATUS_OPTIONS] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-white text-[#0B1730] shadow-sm'
                : 'text-slate-600 hover:text-[#0B1730]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-display text-base font-semibold text-[#0B1730]">
            No customer inquiries match this filter.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Inquiries submitted from the public Contact Us page appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-base font-bold text-[#0B1730]">
                        {item.fullName}
                      </h3>
                      {item.businessName && (
                        <span className="text-xs text-slate-500">· {item.businessName}</span>
                      )}
                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
                          STATUS_STYLES[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#2563EB] break-all sm:break-normal"
                      >
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {item.email}
                      </a>
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 font-mono-tabular hover:text-[#2563EB]"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {item.phone}
                      </a>
                      <span className="font-medium text-[#0B1730]">{item.serviceRequired}</span>
                      <span className="font-mono-tabular text-slate-700">{item.budget}</span>
                      <span className="font-mono-tabular text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <select
                      aria-label={`Change status for ${item.fullName}`}
                      value={item.status}
                      disabled={busyId === item.id}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as InquiryStatus)
                      }
                      className="min-h-[38px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[#0B1730] focus:border-[#2563EB] focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="min-h-[38px] rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {isExpanded ? 'Hide Details' : 'View Description'}
                    </button>

                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="min-h-[38px] rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[38px] rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete inquiry from ${item.fullName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Project Description</p>
                    <p className="whitespace-pre-wrap">{item.projectDescription}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
