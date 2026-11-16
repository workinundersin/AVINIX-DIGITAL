import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import type { PortfolioProject } from '../types/avenix';
import { ResilientImage } from './ResilientImage';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071426]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-[#0B1730] shadow-sm border border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          aria-label="Close project details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <ResilientImage
            src={project.imageUrl}
            alt={project.title}
            fallbackTitle={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
              <span className="text-[#2563EB] font-semibold">{project.category}</span>
              {project.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Demonstration Project</span>
                </>
              )}
            </div>
            <h2
              id="project-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-[#0B1730]"
            >
              {project.title}
            </h2>
          </div>

          <p className="text-base text-slate-600 leading-relaxed">{project.description}</p>

          {project.livePreviewSummary && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {project.livePreviewSummary}
            </div>
          )}

          {project.highlights.length > 0 && (
            <div>
              <h3 className="font-display text-sm font-semibold text-[#0B1730] mb-3">
                Key Implemented Capabilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-[#2563EB] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.techStack.length > 0 && (
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="font-semibold text-[#0B1730] mr-2">Architecture:</span>
              {project.techStack.join(' · ')}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close Preview
            </button>
            <Link
              to={`/contact?service=${encodeURIComponent(
                project.category === 'Android Application'
                  ? 'App Development'
                  : 'Website Development',
              )}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Request Similar Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
