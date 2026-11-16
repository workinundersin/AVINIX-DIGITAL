import {
  Code2,
  Cpu,
  IndianRupee,
  LayoutGrid,
  MessageSquare,
  MonitorSmartphone,
  Target,
} from 'lucide-react';

const REASONS = [
  {
    title: 'Modern Design',
    description:
      'Clean visual hierarchy, thoughtful typography, and contemporary interfaces tailored to establish credibility immediately.',
    icon: LayoutGrid,
  },
  {
    title: 'Affordable Pricing',
    description:
      'Clear starting packages for websites and transparent custom quoting for mobile apps without hidden agency overhead.',
    icon: IndianRupee,
  },
  {
    title: 'Responsive Websites',
    description:
      'Layouts engineered for crisp readability and fast touch interaction on Android phones, iPhones, tablets, and desktops.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Custom Development',
    description:
      'Built around your business workflows—from restaurant menus and booking forms to dynamic admin content management.',
    icon: Code2,
  },
  {
    title: 'Modern Technology',
    description:
      'Production-grade web and mobile engineering using reliable frameworks, clean APIs, and structured database storage.',
    icon: Cpu,
  },
  {
    title: 'Professional Communication',
    description:
      'Direct, responsive updates throughout every stage of discussion, design review, build, and launch.',
    icon: MessageSquare,
  },
  {
    title: 'Customer-Focused Solutions',
    description:
      'Every feature is prioritized around helping your customers find information, inquire quickly, and trust your brand.',
    icon: Target,
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#2563EB] mb-2">Why Choose Us</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1730] text-balance">
            Built for Practical Business Growth
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            We combine clear communication, disciplined design, and dependable engineering so
            small businesses and startups can launch with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, idx) => {
            const Icon = reason.icon;
            const spanClass = idx === 0 ? 'lg:col-span-2' : '';
            return (
              <div
                key={reason.title}
                className={`group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-150 hover:border-[#2563EB]/40 hover:shadow-sm ${spanClass}`}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1730]/5 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#0B1730] mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
