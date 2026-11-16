const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Requirement Discussion',
    description:
      'We listen to your business goals, target customers, required pages or app features, and timeline to align on scope.',
  },
  {
    step: '02',
    title: 'Planning and Design',
    description:
      'We map out the site architecture, user flows, and modern UI/UX layouts tailored to your brand identity.',
  },
  {
    step: '03',
    title: 'Development',
    description:
      'We build responsive interfaces, interactive components, backend APIs, and database integrations cleanly.',
  },
  {
    step: '04',
    title: 'Testing',
    description:
      'Every form, navigation route, database operation, and mobile breakpoint is verified across screen sizes.',
  },
  {
    step: '05',
    title: 'Delivery',
    description:
      'We deploy your website or application cleanly and walk you through managing your content and inquiries.',
  },
  {
    step: '06',
    title: 'Support and Maintenance',
    description:
      'Ongoing technical guidance, content updates, and reliability improvements as your business grows.',
  },
];

export function ProcessTimeline() {
  return (
    <section className="py-20 bg-[#071426] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-[#60A5FA] mb-2">Our Development Process</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Six Clear Steps From Idea to Launch
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            A structured workflow designed to keep projects transparent, predictable, and aligned
            with your business objectives.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-xl border border-slate-800 bg-[#0B1730]/75 p-6 transition-colors duration-150 hover:border-[#60A5FA]/50"
            >
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono-tabular text-sm font-semibold text-[#60A5FA]">
                  Step {item.step}
                </span>
                <span className="h-1.5 w-8 rounded-full bg-[#2563EB]/60" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
