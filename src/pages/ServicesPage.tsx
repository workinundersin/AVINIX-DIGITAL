import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe, Smartphone } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { PageMeta } from '../components/PageMeta';
import { ProcessTimeline } from '../components/ProcessTimeline';

export function ServicesPage() {
  const { content } = useSiteData();
  const services = content?.services || [];

  return (
    <>
      <PageMeta
        title="Services | AVENIX DIGITAL – Website & App Development"
        description="Explore Website Development and Mobile App Development services by AVENIX DIGITAL for small businesses, startups, restaurants, and e-commerce brands."
      />

      <section className="bg-[#071426] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#60A5FA] mb-3">Our Services</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
            Website Development &amp; Mobile App Engineering
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Every engagement is structured around practical business needs: clean user experience,
            reliable backend architecture, and responsive design across all devices.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          {services.map((service, index) => {
            const isWeb = service.id === 'website-development';
            const Icon = isWeb ? Globe : Smartphone;

            return (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-5 bg-[#0B1730] text-white p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-mono-tabular text-xs text-[#60A5FA]">
                          Service 0{index + 1}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                        {service.title}
                      </h2>
                      <p className="text-sm font-medium text-[#60A5FA] mb-4">{service.subtitle}</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                      >
                        Get a Quote
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/pricing"
                        className="text-sm font-medium text-slate-300 hover:text-white"
                      >
                        View Starting Pricing
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#0B1730] mb-4 pb-2 border-b border-slate-100">
                        What We Build
                      </h3>
                      <ul className="space-y-3">
                        {service.categories.map((cat) => (
                          <li key={cat} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <Check className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                            <span>{cat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-[#0B1730] mb-4 pb-2 border-b border-slate-100">
                        Core Features Included
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <Check className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProcessTimeline />
    </>
  );
}
