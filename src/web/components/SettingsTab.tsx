"use client";

import React from 'react';
import { LogOut, Globe, Crown, CreditCard } from 'lucide-react';
import { Category, SubscriptionStatus } from '@shared/lib/types';
import { getAccessToken } from '@shared/lib/google-auth';
import { UserDirectory } from './UserDirectory';
import { CategoryEditor } from './CategoryEditor';

const API_BASE_URL = (typeof window !== 'undefined' && (window.location.protocol === 'extension:' || window.location.protocol === 'chrome-extension:' || window.location.protocol === 'ms-browser-extension:'))
  ? 'https://www.imagesnap.cloud'
  : '';

interface SettingsTabProps {
  categories: Category[];
  onSaveCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  toggleLang: () => void;
  lang: string;
  spreadsheetId: string | null;
  t: (key: string) => string;
  user: any;
  subStatus: SubscriptionStatus;
  onUpgrade: () => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  categories, onSaveCategory, onDeleteCategory,
  toggleLang, lang, spreadsheetId, t, user, subStatus, onUpgrade, onLogout
}) => {
  const usagePct = Math.min(100, (subStatus.usage / subStatus.limit) * 100);

  return (
    <div className="pb-24 p-5 flex flex-col gap-6">

      {/* Plan Status */}
      <div className="flex flex-col gap-3">
        <h2 className="label-meta">Plan Status</h2>
        <div className={`card p-5 flex flex-col gap-5 border-2 ${subStatus.isPro ? 'border-accent/40 bg-accent/[0.03]' : 'border-line'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${subStatus.isPro ? 'bg-accent text-white' : 'bg-accent/10 text-accent'}`}>
                {subStatus.isPro ? <Crown size={24} /> : <CreditCard size={24} />}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-lg text-ink">
                  {subStatus.isPro ? 'Pro Lifetime' : 'Free Tier'}
                </span>
                <span className="text-sm text-muted">{user?.email || 'Offline'}</span>
                {subStatus.appId && (
                  <span className="text-[9px] font-mono text-muted/50">ID: {subStatus.appId}</span>
                )}
              </div>
            </div>
            {!subStatus.isPro && (
              <button onClick={onUpgrade} className="btn btn-primary text-sm py-2 px-4">
                Upgrade
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-line">
            <div className="flex justify-between items-baseline">
              <span className="label-meta">Usage</span>
              <span className="text-sm font-semibold text-ink">
                {subStatus.isPro ? '∞ Unlimited' : `${subStatus.usage} / ${subStatus.limit} snaps`}
              </span>
            </div>
            <div className="w-full h-2 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: subStatus.isPro ? '100%' : `${usagePct}%` }}
              />
            </div>
          </div>

          {subStatus.isAdmin && (
            <button
              onClick={async () => {
                const token = getAccessToken();
                if (!token || !spreadsheetId) return;
                await fetch(`${API_BASE_URL}/api/admin/set-master-workspace`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ adminEmail: user.email, spreadsheetId, accessToken: token })
                });
                alert("Workspace Published! Staff can now save to your Drive.");
              }}
              className="btn btn-primary w-full text-sm font-semibold"
            >
              Publish as Master Workspace
            </button>
          )}
        </div>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-3">
        <h2 className="label-meta">Language</h2>
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-accent" />
            <div>
              <span className="font-semibold text-ink text-sm">Localization</span>
              <p className="text-xs text-muted">Current: {lang === 'en' ? 'English' : 'Tiếng Việt'}</p>
            </div>
          </div>
          <button onClick={toggleLang} className="btn btn-secondary text-sm py-2 px-4">
            Switch
          </button>
        </div>
      </div>

      {/* User Directory (Admin only) */}
      <UserDirectory user={user} subStatus={subStatus} categories={categories} lang={lang} />

      {/* Category Editor */}
      <CategoryEditor
        categories={categories}
        spreadsheetId={spreadsheetId}
        onSaveCategory={onSaveCategory}
        onDeleteCategory={onDeleteCategory}
        lang={lang}
        t={t}
      />

      {/* Logout */}
      <button
        onClick={onLogout}
        className="btn btn-secondary mt-8 border-red-200 text-red-500 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
};
