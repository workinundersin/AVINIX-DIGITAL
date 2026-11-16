import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe, Smartphone } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import type { PortfolioProject } from '../types/avenix';
import { PageMeta } from '../components/PageMeta';
import { PricingCards } from '../components/PricingCards';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { ResilientImage } from '../components/ResilientImage';
import { WhyChooseSection } from '../components/WhyChooseSection';

export function HomePage() {
  const { content, pricing, projects, loading } = useSiteData();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const heroHeading =
    content?.heroHeading || 'Build Your Digital Future With AVENIX DIGITAL';
  const heroSubheading =
    content?.heroSubheading ||
    'We create modern websites and innovative mobile applications that help businesses establish their digital presence and grow.';

  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <PageMeta
        title="AVENIX DIGITAL – Website & Mobile App Development Agency"
        description="Build your digital future with AVENIX DIGITAL. Modern website development and custom mobile application engineering for businesses, restaurants, and startups."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#071426] text-white">
        {/* Subtle animated architectural grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 avenix-grid-motion"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(96, 165, 250, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(96, 165, 250, 0.16) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#2563EB]/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="text-sm font-semibold text-[#60A5FA] mb-4">
                {content?.tagline || 'Ideas Into Digital Reality'}
              </p>
              <h1 className="font-display text-[2rem] leading-[1.12] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight lg:leading-[1.08] text-white text-balance max-w-2xl">
                {heroHeading}
              </h1>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                {heroSubheading}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link
                  to="/contact"
                  className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#0B1730]/80 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#60A5FA] hover:bg-[#0B1730] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] whitespace-nowrap"
                >
                  Explore Our Services
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-800/90 pt-6 sm:grid-cols-3 text-sm">
                <div>
                  <p className="font-semibold text-white">Website Development</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Business, restaurant &amp; e-commerce builds
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">App Development</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Android &amp; custom business mobile apps
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">Starting at ₹2,000</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Transparent packages for growing brands
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex">
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1730] shadow-2xl">
                <ResilientImage
                  src="/src/assets/images/hero_avenix_studio_1794811328456.jpg"
                  alt="AVENIX DIGITAL software engineering and design workspace"
                  fallbackTitle="AVENIX DIGITAL Studio"
                  className="h-72 w-full object-cover lg:h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071426]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                  <span>Web &amp; Mobile Engineering</span>
                  <span className="font-mono-tabular text-[#60A5FA]">Responsive · Full-Stack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#2563EB] mb-2">Core Services</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1730] text-balance">
                Focused Digital Engineering for Modern Businesses
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              View full service details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {(content?.services || []).map((service, index) => {
              const Icon = index === 0 ? Globe : Smartphone;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-150 hover:border-[#2563EB]/40 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1730] text-[#60A5FA]">
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                      <span className="font-mono-tabular text-xs font-medium text-slate-500">
                        0{index + 1}. Primary Service
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#0B1730] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium text-[#2563EB] mb-3">{service.subtitle}</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="border-t border-slate-100 pt-5 mb-6">
                      <p className="text-xs font-semibold text-[#0B1730] mb-3">
                        Solutions We Build
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.categories.map((cat) => (
                          <div key={cat} className="flex items-center gap-2 text-sm text-slate-700">
                            <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                            <span>{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                    <Link
                      to={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                    >
                      Get a Quote
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/services"
                      className="text-sm font-medium text-slate-600 hover:text-[#0B1730]"
                    >
                      Inspect Features
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseSection />

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#2563EB] mb-2">Portfolio Showcase</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1730] text-balance">
                Featured Demonstration Projects
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Realistic concept builds illustrating our design standards and engineering structure
                across industries.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Explore full portfolio
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-150 hover:border-[#2563EB]/40 hover:shadow-sm"
                >
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <ResilientImage
                        src={project.imageUrl}
                        alt={project.title}
                        fallbackTitle={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-[#2563EB]">{project.category}</span>
                        {project.isDemo && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Demonstration Project</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#0B1730] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1730] hover:text-[#2563EB] transition-colors"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Preview */}
      {pricing && (
        <section className="py-20 bg-slate-50/70 border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-[#2563EB] mb-2">Transparent Pricing</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1730] text-balance">
                  Clear Starting Packages for Every Stage
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  Start with an essential business site or scale up to a full dynamic platform with
                  an integrated admin dashboard.
                </p>
              </div>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
              >
                Compare all plans
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <PricingCards pricing={pricing} />
          </div>
        </section>
      )}

      {/* 6-Step Development Process */}
      <ProcessTimeline />

      {/* Customer Inquiry CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0B1730] px-6 py-12 sm:px-12 sm:py-16 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#60A5FA] mb-2">
                Start Your Project
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
                Ready to Turn Your Business Idea Into Digital Reality?
              </h2>
              <p className="mt-3 text-base text-slate-300 leading-relaxed">
                Share your goals and budget range with AVENIX DIGITAL. We will respond with a
                clear scope, timeline, and tailored recommendation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-semibold text-white hover:border-[#60A5FA] transition-colors whitespace-nowrap"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
