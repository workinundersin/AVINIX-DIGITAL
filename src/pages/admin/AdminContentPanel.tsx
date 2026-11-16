import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import type { SiteContent } from '../../types/avenix';

interface AdminContentPanelProps {
  content: SiteContent | null;
  onRefresh: () => Promise<void>;
}

export function AdminContentPanel({ content, onRefresh }: AdminContentPanelProps) {
  const [draft, setDraft] = useState<SiteContent | null>(content);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  if (!draft) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Loading website content...
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setSavedNotice(false);
    setError(null);
    try {
      await api.updateContent(draft);
      await onRefresh();
      setSavedNotice(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update website content.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1730]">
            Website Content Management
          </h2>
          <p className="text-sm text-slate-600">
            Update homepage hero text, company details, About Us sections, services, and contact
            channels.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving Content...' : 'Publish Content Updates'}
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
          Website content saved and synced across public pages.
        </div>
      )}

      {/* Company & Homepage */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-[#0B1730] border-b border-slate-100 pb-3">
          Company Identity &amp; Homepage Hero
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
            <input
              type="text"
              value={draft.companyName}
              onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tagline</label>
            <input
              type="text"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Homepage Heading
          </label>
          <input
            type="text"
            value={draft.heroHeading}
            onChange={(e) => setDraft({ ...draft, heroHeading: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Homepage Description
          </label>
          <textarea
            rows={2}
            value={draft.heroSubheading}
            onChange={(e) => setDraft({ ...draft, heroSubheading: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* About Us */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-[#0B1730] border-b border-slate-100 pb-3">
          About Us Content
        </h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Who We Are</label>
          <textarea
            rows={3}
            value={draft.aboutWhoWeAre}
            onChange={(e) => setDraft({ ...draft, aboutWhoWeAre: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Our Mission</label>
            <textarea
              rows={3}
              value={draft.aboutMission}
              onChange={(e) => setDraft({ ...draft, aboutMission: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Our Vision</label>
            <textarea
              rows={3}
              value={draft.aboutVision}
              onChange={(e) => setDraft({ ...draft, aboutVision: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">What We Do</label>
          <textarea
            rows={2}
            value={draft.aboutWhatWeDo}
            onChange={(e) => setDraft({ ...draft, aboutWhatWeDo: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Services Management */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <h3 className="font-display text-base font-bold text-[#0B1730] border-b border-slate-100 pb-3">
          Services Management
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {draft.services.map((service, idx) => (
            <div key={service.id} className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => {
                    const updated = [...draft.services];
                    updated[idx] = { ...service, title: e.target.value };
                    setDraft({ ...draft, services: updated });
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => {
                    const updated = [...draft.services];
                    updated[idx] = { ...service, description: e.target.value };
                    setDraft({ ...draft, services: updated });
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Solutions Built (one per line)
                </label>
                <textarea
                  rows={4}
                  defaultValue={service.categories.join('\n')}
                  onChange={(e) => {
                    const updated = [...draft.services];
                    updated[idx] = {
                      ...service,
                      categories: e.target.value
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean),
                    };
                    setDraft({ ...draft, services: updated });
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Features Included (one per line)
                </label>
                <textarea
                  rows={4}
                  defaultValue={service.features.join('\n')}
                  onChange={(e) => {
                    const updated = [...draft.services];
                    updated[idx] = {
                      ...service,
                      features: e.target.value
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean),
                    };
                    setDraft({ ...draft, services: updated });
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Social Media */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-[#0B1730] border-b border-slate-100 pb-3">
          Contact Information &amp; Social Media Links
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              value={draft.contact.email}
              onChange={(e) =>
                setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              value={draft.contact.phone}
              onChange={(e) =>
                setDraft({ ...draft, contact: { ...draft.contact, phone: e.target.value } })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              WhatsApp Number (digits with country code)
            </label>
            <input
              type="text"
              value={draft.contact.whatsappNumber}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: { ...draft.contact, whatsappNumber: e.target.value },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={draft.contact.location}
              onChange={(e) =>
                setDraft({ ...draft, contact: { ...draft.contact, location: e.target.value } })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Business Hours</label>
            <input
              type="text"
              value={draft.contact.businessHours}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: { ...draft.contact, businessHours: e.target.value },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={draft.contact.socialLinks.linkedin}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialLinks: { ...draft.contact.socialLinks, linkedin: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Instagram URL</label>
            <input
              type="url"
              value={draft.contact.socialLinks.instagram}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialLinks: { ...draft.contact.socialLinks, instagram: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              X / Twitter URL
            </label>
            <input
              type="url"
              value={draft.contact.socialLinks.twitter}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialLinks: { ...draft.contact.socialLinks, twitter: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">GitHub URL</label>
            <input
              type="url"
              value={draft.contact.socialLinks.github}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialLinks: { ...draft.contact.socialLinks, github: e.target.value },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
