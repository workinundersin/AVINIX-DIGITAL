import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { DEFAULT_PRICING } from '../data/defaults';
import type { PricingConfig } from '../types/avenix';

interface PricingCardsProps {
  pricing: PricingConfig;
}

function mapPackageToBudgetParam(price: number): string {
  if (price <= 5000) return '₹2,000–₹5,000';
  if (price <= 10000) return '₹5,000–₹10,000';
  return '₹10,000+';
}

export function PricingCards({ pricing }: PricingCardsProps) {
  const packages =
    Array.isArray(pricing?.packages) && pricing.packages.length > 0
      ? pricing.packages
      : DEFAULT_PRICING.packages;
  const appDevelopment =
    pricing?.appDevelopment && typeof pricing.appDevelopment.startingPrice === 'number'
      ? pricing.appDevelopment
      : DEFAULT_PRICING.appDevelopment;
  const disclaimer = pricing?.disclaimer || DEFAULT_PRICING.disclaimer;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        {packages.map((pkg) => {
          const isFeatured = Boolean(pkg.featured);
          const budgetParam = mapPackageToBudgetParam(pkg.price);
          const features = Array.isArray(pkg.features) ? pkg.features : [];

          return (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-150 ${
                isFeatured
                  ? 'bg-[#0B1730] text-white border-2 border-[#2563EB] shadow-xl lg:-my-2'
                  : 'bg-white text-[#1E293B] border border-slate-200 hover:border-[#2563EB]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3
                    className={`font-display text-xl font-bold ${
                      isFeatured ? 'text-white' : 'text-[#0B1730]'
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  {isFeatured && (
                    <span className="text-xs font-semibold text-[#60A5FA] whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm mb-6 ${
                    isFeatured ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {pkg.targetAudience}
                </p>

                <div
                  className={`border-y py-5 mb-6 ${
                    isFeatured ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isFeatured ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Starting Package Price
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`font-mono-tabular text-4xl font-bold tracking-tight ${
                        isFeatured ? 'text-white' : 'text-[#0B1730]'
                      }`}
                    >
                      {pkg.currency || '₹'}
                      {Number(pkg.price).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-xs ${
                        isFeatured ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      onwards
                    </span>
                  </div>
                </div>

                <p
                  className={`text-xs font-semibold mb-3 ${
                    isFeatured ? 'text-[#60A5FA]' : 'text-[#2563EB]'
                  }`}
                >
                  Included in this package:
                </p>
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          isFeatured ? 'text-[#60A5FA]' : 'text-[#2563EB]'
                        }`}
                      />
                      <span className={isFeatured ? 'text-slate-200' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/contact?service=${encodeURIComponent(
                  'Website Development',
                )}&budget=${encodeURIComponent(budgetParam)}&package=${encodeURIComponent(
                  pkg.name,
                )}`}
                className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                  isFeatured
                    ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                    : 'bg-[#0B1730] text-white hover:bg-[#16274C]'
                }`}
              >
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* App Development Pricing Highlight */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#2563EB]">Mobile Engineering</p>
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="font-display text-2xl font-bold text-[#0B1730]">
              App Development
            </h3>
            <span className="text-sm text-slate-500">·</span>
            <span className="font-mono-tabular text-xl font-bold text-[#2563EB]">
              Starting at {appDevelopment.currency || '₹'}
              {Number(appDevelopment.startingPrice).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {appDevelopment.note}
          </p>
        </div>
        <Link
          to={`/contact?service=${encodeURIComponent(
            'App Development',
          )}&budget=${encodeURIComponent('₹10,000+')}&package=${encodeURIComponent(
            'App Development',
          )}`}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
        >
          Request a Custom Quote
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
        Note: {disclaimer}
      </p>
    </div>
  );
}
