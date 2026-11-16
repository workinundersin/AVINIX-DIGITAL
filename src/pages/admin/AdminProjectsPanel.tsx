import React, { useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { PortfolioProject, ProjectCategory } from '../../types/avenix';
import { ResilientImage } from '../../components/ResilientImage';

interface AdminProjectsPanelProps {
  projects: PortfolioProject[];
  onRefresh: () => Promise<void>;
}

const CATEGORIES: ProjectCategory[] = [
  'Restaurant Website',
  'Business Website',
  'E-commerce Website',
  'Portfolio Website',
  'Android Application',
  'Custom Software',
];

interface ProjectFormState {
  title: string;
  category: ProjectCategory;
  description: string;
  imageUrl: string;
  highlightsText: string;
  techStackText: string;
  livePreviewSummary: string;
  isDemo: boolean;
  published: boolean;
}

const EMPTY_FORM: ProjectFormState = {
  title: '',
  category: 'Business Website',
  description: '',
  imageUrl: '/src/assets/images/portfolio_business_web_1794811330498.jpg',
  highlightsText: '',
  techStackText: '',
  livePreviewSummary: '',
  isDemo: false,
  published: true,
};

export function AdminProjectsPanel({ projects, onRefresh }: AdminProjectsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function openNewForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEditForm(project: PortfolioProject) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      imageUrl: project.imageUrl,
      highlightsText: project.highlights.join('\n'),
      techStackText: project.techStack.join(', '),
      livePreviewSummary: project.livePreviewSummary || '',
      isDemo: project.isDemo,
      published: project.published,
    });
    setError(null);
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Uploaded image must be 5 MB or smaller.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });
      const res = await api.uploadProjectImage(dataUrl, file.name);
      setForm((prev) => ({ ...prev, imageUrl: res.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      highlights: form.highlightsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      techStack: form.techStackText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      livePreviewSummary: form.livePreviewSummary.trim() || form.description.trim(),
      isDemo: form.isDemo,
      published: form.published,
    };

    try {
      if (editingId) {
        await api.updateProject(editingId, payload);
      } else {
        await api.createProject(payload);
      }
      setShowForm(false);
      setEditingId(null);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(project: PortfolioProject) {
    setError(null);
    try {
      await api.toggleProjectPublish(project.id, !project.published);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status.');
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await api.deleteProject(id);
      setConfirmDeleteId(null);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1730]">Portfolio Management</h2>
          <p className="text-sm text-slate-600">
            Add projects, upload screenshots, update categories, or publish and unpublish entries.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-display text-lg font-bold text-[#0B1730]">
              {editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close project form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Spice Garden Restaurant Website"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
                Project Category *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as ProjectCategory }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
              Project Description *
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the project goals, layout, and implemented functionality..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
                Project Image (Upload or URL)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="/uploads/... or image URL"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
                />
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-[#0B1730] hover:bg-slate-100">
                  <Upload className="h-4 w-4 text-[#2563EB]" />
                  {uploading ? 'Uploading Image...' : 'Upload Image File (PNG/JPG/WEBP)'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="aspect-[16/9] max-h-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <ResilientImage
                src={form.imageUrl}
                alt="Project preview"
                fallbackTitle={form.title || 'Preview'}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
                Key Features (one per line)
              </label>
              <textarea
                rows={3}
                value={form.highlightsText}
                onChange={(e) => setForm((p) => ({ ...p, highlightsText: e.target.value }))}
                placeholder={'Responsive menu layout\nWhatsApp ordering button'}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1730] mb-1.5">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={form.techStackText}
                onChange={(e) => setForm((p) => ({ ...p, techStackText: e.target.value }))}
                placeholder="React, TypeScript, Tailwind CSS"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none mb-3"
              />

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-[#0B1730]">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB]"
                  />
                  Published on Website
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-[#0B1730]">
                  <input
                    type="checkbox"
                    checked={form.isDemo}
                    onChange={(e) => setForm((p) => ({ ...p, isDemo: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB]"
                  />
                  Label as Demonstration Project
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-44 shrink-0 aspect-[4/3] sm:aspect-auto bg-slate-100">
                <ResilientImage
                  src={project.imageUrl}
                  alt={project.title}
                  fallbackTitle={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-[#2563EB]">{project.category}</span>
                  <span>·</span>
                  <span
                    className={
                      project.published
                        ? 'font-semibold text-emerald-700'
                        : 'font-semibold text-amber-700'
                    }
                  >
                    {project.published ? 'Published' : 'Unpublished'}
                  </span>
                  {project.isDemo && (
                    <>
                      <span>·</span>
                      <span>Demo</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-base font-bold text-[#0B1730] truncate">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 bg-slate-50/70">
              <button
                type="button"
                onClick={() => handleTogglePublish(project)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0B1730] hover:bg-slate-100"
              >
                {project.published ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                    Publish
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(project)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0B1730] hover:bg-slate-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                {confirmDeleteId === project.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(project.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
