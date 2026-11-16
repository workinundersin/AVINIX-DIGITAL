import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, LogOut } from 'lucide-react';
import { api } from '../../lib/api';

interface AdminProfilePanelProps {
  email: string | null;
  onLogout: () => Promise<void>;
}

export function AdminProfilePanel({ email, onLogout }: AdminProfilePanelProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to change password.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0B1730]">
          Administrator Profile &amp; Security
        </h2>
        <p className="text-sm text-slate-600">
          Manage your active administrator session and update your password.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Signed-in Administrator</p>
          <p className="font-display text-base font-bold text-[#0B1730] mt-0.5">
            {email || 'Administrator'}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#0B1730] hover:bg-slate-50 w-fit"
        >
          <LogOut className="h-4 w-4 text-slate-600" />
          Sign Out
        </button>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="h-5 w-5 text-[#2563EB]" />
          <h3 className="font-display text-base font-bold text-[#0B1730]">Change Password</h3>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>Administrator password updated successfully.</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#0B1730] mb-1">
            Current Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1730] mb-1">New Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1730] mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {saving ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
