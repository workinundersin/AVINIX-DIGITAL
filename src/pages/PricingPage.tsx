import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { PageMeta } from '../components/PageMeta';
import { PricingCards } from '../components/PricingCards';

export function PricingPage() {
  const { pricing } = useSiteData();

  return (
    <>
      <PageMeta
        title="Pricing | AVENIX DIGITAL – Website & App Development Packages"
        description="Transparent website development starting packages from ₹2,000 and custom mobile app development pricing from ₹10,000 by AVENIX DIGITAL."
      />

      <section className="bg-[#071426] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#60A5FA] mb-3">Pricing &amp; Packages</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
            Transparent Starting Packages Built for Growing Businesses
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Compare our starting website packages and custom app development pricing. Every package
            includes clear deliverables with no hidden lock-in.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingCards pricing={pricing} />

          {/* Important Pricing Clarification */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-center gap-2.5 text-[#0B1730] font-display font-bold text-base mb-3">
                <CheckCircle2 className="h-5 w-5 text-[#2563EB]" />
                <span>What Starting Packages Cover</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Listed prices represent starting package rates for standard design and development
                deliverables. Final pricing adjusts transparently only when you request additional
                custom workflows, extra pages, or third-party integrations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-center gap-2.5 text-[#0B1730] font-display font-bold text-base mb-3">
                <Info className="h-5 w-5 text-[#2563EB]" />
                <span>Third-Party Services &amp; Infrastructure</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Domain registration, cloud/web hosting renewals, paid external APIs, SMS gateways,
                and third-party software subscriptions are billed separately unless explicitly
                bundled into a custom written proposal.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600 mb-4">
              Unsure which package fits your goals? Tell us what you need and we will recommend the
              right scope.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B1730] px-6 py-3 text-sm font-semibold text-white hover:bg-[#16274C] transition-colors"
            >
              Discuss Your Requirements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
