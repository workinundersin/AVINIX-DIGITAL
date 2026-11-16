import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminAuthScreenProps {
  initialized: boolean;
  onAuthenticated: () => Promise<void>;
}

export function AdminAuthScreen({ initialized, onAuthenticated }: AdminAuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSetupMode = !initialized;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid administrator email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (isSetupMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSetupMode) {
        await api.setupAdmin(email.trim(), password);
      } else {
        await api.loginAdmin(email.trim(), password);
      }
      await onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#071426] flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" aria-label="Return to AVENIX DIGITAL website">
            <BrandLogo variant="dark" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Public Site
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white p-7 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1730] text-[#60A5FA]">
              {isSetupMode ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <h1 className="font-display text-2xl font-bold text-[#0B1730]">
              {isSetupMode ? 'Initial Administrator Setup' : 'Administrator Sign In'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              {isSetupMode
                ? 'Configure the primary administrator credentials for AVENIX DIGITAL. This one-time setup locks once created.'
                : 'Sign in to manage customer inquiries, portfolio projects, pricing, and website content.'}
            </p>
          </div>

          {error && (
            <div
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-[#0B1730] mb-1.5"
              >
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@avenixdigital.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-[#0B1730] mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete={isSetupMode ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSetupMode ? 'Minimum 8 characters' : 'Enter your password'}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            {isSetupMode && (
              <div>
                <label
                  htmlFor="admin-confirm-password"
                  className="block text-sm font-medium text-[#0B1730] mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="admin-confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-60"
            >
              {submitting
                ? isSetupMode
                  ? 'Creating Administrator...'
                  : 'Signing In...'
                : isSetupMode
                  ? 'Create Administrator Account'
                  : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
