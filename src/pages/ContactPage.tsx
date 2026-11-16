import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { api } from '../lib/api';
import type { BudgetOption, ServiceRequiredOption } from '../types/avenix';
import { PageMeta } from '../components/PageMeta';

const SERVICE_OPTIONS: ServiceRequiredOption[] = [
  'Website Development',
  'App Development',
  'Both',
];

const BUDGET_OPTIONS: BudgetOption[] = [
  '₹2,000–₹5,000',
  '₹5,000–₹10,000',
  '₹10,000+',
  'Custom Budget',
];

export function ContactPage() {
  const { content } = useSiteData();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [serviceRequired, setServiceRequired] = useState<ServiceRequiredOption>(
    'Website Development',
  );
  const [budget, setBudget] = useState<BudgetOption>('₹5,000–₹10,000');
  const [projectDescription, setProjectDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const budgetParam = searchParams.get('budget');
    const pkgParam = searchParams.get('package');

    if (serviceParam && SERVICE_OPTIONS.includes(serviceParam as ServiceRequiredOption)) {
      setServiceRequired(serviceParam as ServiceRequiredOption);
    }
    if (budgetParam && BUDGET_OPTIONS.includes(budgetParam as BudgetOption)) {
      setBudget(budgetParam as BudgetOption);
    }
    if (pkgParam) {
      setProjectDescription((prev) =>
        prev.trim()
          ? prev
          : `Interested in the ${pkgParam} package. Here are my business details and requirements: `,
      );
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (projectDescription.trim().length < 10) {
      setErrorMsg('Please provide at least a short description of your project.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        serviceRequired,
        budget,
        projectDescription: projectDescription.trim(),
      });
      setSuccessId(res.id);
      setFullName('');
      setEmail('');
      setPhone('');
      setBusinessName('');
      setProjectDescription('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  const contact = content?.contact;
  const whatsappNumber = contact?.whatsappNumber || '919258915144';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello AVENIX DIGITAL, I would like to request a quote for a digital project.',
  )}`;

  return (
    <>
      <PageMeta
        title="Contact Us | AVENIX DIGITAL – Get a Project Quote"
        description="Contact AVENIX DIGITAL for website development or mobile app development inquiries. Submit your requirements or connect via WhatsApp and email."
      />

      <section className="bg-[#071426] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#60A5FA] mb-3">Contact Us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
            Tell Us About Your Website or App Project
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Share your goals, preferred service, and budget range below. Every inquiry is stored
            securely and reviewed directly by our team.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-[#0B1730] mb-2">
                  Request a Project Quote
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Fields marked with * are required so we can respond accurately.
                </p>

                {successId ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-display text-lg font-bold text-emerald-950">
                          Inquiry Received Successfully
                        </h3>
                        <p className="mt-1 text-sm text-emerald-900 leading-relaxed">
                          Thank you for reaching out to AVENIX DIGITAL. Your inquiry reference ID is{' '}
                          <span className="font-mono-tabular font-semibold">{successId}</span>. We
                          will review your requirements and respond shortly.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSuccessId(null)}
                      className="rounded-lg bg-[#0B1730] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16274C]"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {errorMsg && (
                      <div
                        className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        role="alert"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9258915144"
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="businessName"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Business Name
                        </label>
                        <input
                          id="businessName"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Your company or restaurant name"
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="serviceRequired"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Service Required *
                        </label>
                        <select
                          id="serviceRequired"
                          value={serviceRequired}
                          onChange={(e) =>
                            setServiceRequired(e.target.value as ServiceRequiredOption)
                          }
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        >
                          {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="budget"
                          className="block text-sm font-medium text-[#0B1730] mb-1.5"
                        >
                          Budget Range *
                        </label>
                        <select
                          id="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value as BudgetOption)}
                          className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        >
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="projectDescription"
                        className="block text-sm font-medium text-[#0B1730] mb-1.5"
                      >
                        Project Description *
                      </label>
                      <textarea
                        id="projectDescription"
                        rows={5}
                        required
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Tell us about your business, key pages or app features you need, and your target launch timeframe..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      {submitting ? 'Submitting Inquiry...' : 'Submit Project Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0B1730] mb-2">
                    Direct Contact Channels
                  </h2>
                  <p className="text-sm text-slate-600">
                    Prefer a quick conversation? Connect directly via WhatsApp, phone, or email.
                  </p>
                </div>

                <div className="space-y-4 border-t border-slate-200 pt-5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#2563EB]/30 bg-white p-4 transition-colors hover:border-[#2563EB]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0B1730]">WhatsApp Contact</p>
                        <p className="font-mono-tabular text-xs text-slate-600">
                          +{whatsappNumber}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#2563EB]">Chat Now</span>
                  </a>

                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <Mail className="h-5 w-5 text-[#2563EB] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Email Address</p>
                      <a
                        href={`mailto:${contact?.email || 'contact@avenixdigital.com'}`}
                        className="text-sm font-semibold text-[#0B1730] hover:text-[#2563EB]"
                      >
                        {contact?.email || 'contact@avenixdigital.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <Phone className="h-5 w-5 text-[#2563EB] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Phone Number</p>
                      <a
                        href={`tel:${(contact?.phone || '+91 9258915144').replace(/\s+/g, '')}`}
                        className="font-mono-tabular text-sm font-semibold text-[#0B1730] hover:text-[#2563EB]"
                      >
                        {contact?.phone || '+91 9258915144'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <MapPin className="h-5 w-5 text-[#2563EB] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Service Region</p>
                      <p className="text-sm font-medium text-[#0B1730]">
                        {contact?.location || 'India · Remote & Global Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <Clock className="h-5 w-5 text-[#2563EB] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Business Hours</p>
                      <p className="text-sm font-medium text-[#0B1730]">
                        {contact?.businessHours || 'Mon – Sat · 10:00 AM – 7:00 PM IST'}
                      </p>
                    </div>
                  </div>
                </div>

                {contact?.socialLinks && (
                  <div className="border-t border-slate-200 pt-5">
                    <p className="text-xs font-semibold text-[#0B1730] mb-3">Social Media</p>
                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                      {contact.socialLinks.linkedin && (
                        <a
                          href={contact.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          LinkedIn
                        </a>
                      )}
                      {contact.socialLinks.instagram && (
                        <a
                          href={contact.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          Instagram
                        </a>
                      )}
                      {contact.socialLinks.twitter && (
                        <a
                          href={contact.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          X / Twitter
                        </a>
                      )}
                      {contact.socialLinks.github && (
                        <a
                          href={contact.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
