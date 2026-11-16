import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import type { PortfolioProject } from '../types/avenix';
import { PageMeta } from '../components/PageMeta';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { ResilientImage } from '../components/ResilientImage';

export function PortfolioPage() {
  const { projects, loading } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <>
      <PageMeta
        title="Portfolio | AVENIX DIGITAL – Web & Mobile Application Showcase"
        description="Explore demonstration websites and Android app concepts built by AVENIX DIGITAL for restaurants, businesses, e-commerce brands, and creative studios."
      />

      <section className="bg-[#071426] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#60A5FA] mb-3">Portfolio</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
            Selected Work &amp; Demonstration Projects
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Explore our industry demonstrations across hospitality, corporate websites, e-commerce
            storefronts, creative portfolios, and Android applications. Projects marked as
            demonstration concepts illustrate build quality until client engagements are published.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Interactive Category Filter Buttons */}
          <div className="mb-10 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0B1730] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="font-display text-lg font-semibold text-[#0B1730]">
                No projects published in this category yet.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Show All Projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
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
                      <h2 className="font-display text-xl font-bold text-[#0B1730] mb-2.5">
                        {project.title}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1730] hover:text-[#2563EB] transition-colors"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <Link
                      to={`/contact?service=${encodeURIComponent(
                        project.category === 'Android Application'
                          ? 'App Development'
                          : 'Website Development',
                      )}`}
                      className="text-xs font-medium text-slate-500 hover:text-[#2563EB]"
                    >
                      Inquire
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectDetailModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
