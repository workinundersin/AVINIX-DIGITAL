import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Eye, Layers, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { PageMeta } from '../components/PageMeta';
import { ResilientImage } from '../components/ResilientImage';
import { WhyChooseSection } from '../components/WhyChooseSection';

export function AboutPage() {
  const { content } = useSiteData();

  const whoWeAre =
    content?.aboutWhoWeAre ||
    'AVENIX DIGITAL is a digital development company focused on building modern websites and mobile applications. Our goal is to help businesses establish a strong digital presence through creative design and modern technology.';

  return (
    <>
      <PageMeta
        title="About Us | AVENIX DIGITAL"
        description="Learn about AVENIX DIGITAL—our mission, vision, values, and focus on building modern websites and mobile applications for growing businesses."
      />

      {/* Page Header */}
      <section className="bg-[#071426] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#60A5FA] mb-3">About AVENIX DIGITAL</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
            Ideas Into Digital Reality Through Thoughtful Design &amp; Engineering
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {whoWeAre}
          </p>
        </div>
      </section>

      {/* Who We Are & Workspace */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#2563EB] mb-2">Who We Are</p>
                <h2 className="font-display text-3xl font-bold text-[#0B1730] mb-4">
                  A Focused Digital Development Partner
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">{whoWeAre}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm font-semibold text-[#2563EB] mb-2">What We Do</p>
                <p className="text-base text-slate-600 leading-relaxed">
                  {content?.aboutWhatWeDo ||
                    'We design, build, and maintain custom websites and mobile applications tailored to real business workflows—from customer-facing storefronts and restaurant platforms to full-stack portals with admin dashboards.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#0B1730] hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <ResilientImage
                  src="/src/assets/images/about_engineering_team_1794811329298.jpg"
                  alt="AVENIX DIGITAL product design and development workspace"
                  fallbackTitle="AVENIX DIGITAL Engineering Studio"
                  className="h-80 w-full object-cover lg:h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1730] text-[#60A5FA]">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0B1730] mb-3">Our Mission</h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {content?.aboutMission ||
                  'To make reliable, modern websites and mobile applications accessible for startups, restaurants, entrepreneurs, and growing businesses through transparent pricing and clean engineering.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0B1730] mb-3">Our Vision</h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {content?.aboutVision ||
                  'To be a trusted technology partner for ambitious local and growing businesses turning practical ideas into dependable digital products.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-[#2563EB] mb-2">Our Values</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1730]">
              Principles Behind Every Build
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(content?.aboutValues || []).map((val, idx) => (
              <div
                key={val.title}
                className="rounded-xl border border-slate-200 bg-white p-6 flex items-start gap-4"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  {idx % 2 === 0 ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Layers className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1730] mb-1.5">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseSection />
    </>
  );
}
