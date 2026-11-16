import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import type { PricingConfig } from '../../types/avenix';

interface AdminPricingPanelProps {
  pricing: PricingConfig | null;
  onRefresh: () => Promise<void>;
}

export function AdminPricingPanel({ pricing, onRefresh }: AdminPricingPanelProps) {
  const [draft, setDraft] = useState<PricingConfig | null>(pricing);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(pricing);
  }, [pricing]);

  if (!draft) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Loading pricing configuration...
      </div>
    );
  }

  function updatePackageField(
    index: number,
    field: 'price' | 'targetAudience' | 'name',
    value: string | number,
  ) {
    setDraft((prev) => {
      if (!prev) return prev;
      const packages = prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg,
      );
      return { ...prev, packages };
    });
  }

  function updatePackageFeatures(index: number, rawText: string) {
    const features = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    setDraft((prev) => {
      if (!prev) return prev;
      const packages = prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, features } : pkg,
      );
      return { ...prev, packages };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setSavedNotice(false);
    setError(null);
    try {
      await api.updatePricing(draft);
      await onRefresh();
      setSavedNotice(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pricing.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1730]">Pricing Management</h2>
          <p className="text-sm text-slate-600">
            Update Basic, Standard, and Premium package prices, included features, and App
            Development starting rates.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving Pricing...' : 'Save Pricing Changes'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          Pricing updated and published to the live website.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {draft.packages.map((pkg, idx) => (
          <div
            key={pkg.id}
            className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-display text-base font-bold text-[#0B1730]">{pkg.name}</span>
              {pkg.featured && (
                <span className="text-xs font-semibold text-[#2563EB]">Featured Tier</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Package Title
              </label>
              <input
                type="text"
                required
                value={pkg.name}
                onChange={(e) => updatePackageField(idx, 'name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Starting Price ({pkg.currency})
              </label>
              <input
                type="number"
                min={0}
                required
                value={pkg.price}
                onChange={(e) => updatePackageField(idx, 'price', Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={pkg.targetAudience}
                onChange={(e) => updatePackageField(idx, 'targetAudience', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Package Features (one per line)
              </label>
              <textarea
                rows={7}
                defaultValue={pkg.features.join('\n')}
                onChange={(e) => updatePackageFeatures(idx, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* App Development Pricing + Disclaimer */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
            App Development Starting Price ({draft.appDevelopment.currency})
          </label>
          <input
            type="number"
            min={0}
            required
            value={draft.appDevelopment.startingPrice}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      appDevelopment: {
                        ...prev.appDevelopment,
                        startingPrice: Number(e.target.value),
                      },
                    }
                  : prev,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 font-mono-tabular text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
            App Development Pricing Note
          </label>
          <input
            type="text"
            value={draft.appDevelopment.note}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      appDevelopment: {
                        ...prev.appDevelopment,
                        note: e.target.value,
                      },
                    }
                  : prev,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
            Starting Price &amp; Third-Party Services Disclaimer
          </label>
          <textarea
            rows={2}
            value={draft.disclaimer}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, disclaimer: e.target.value } : prev))
            }
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
