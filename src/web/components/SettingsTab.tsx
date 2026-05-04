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
  return (
    <div className="pb-24 p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl tracking-tighter">{t('settings')}</h1>
      </div>

      {/* Subscription Status */}
      <div className="flex flex-col gap-4">
        <h2 className="label-meta tracking-[0.3em]">PLAN_STATUS</h2>
        <div className={`card p-6 flex flex-col gap-6 border-2 transition-all ${subStatus.isPro ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-accent/20'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${subStatus.isPro ? 'bg-yellow-500 text-bg shadow-[4px_4px_0_rgba(0,0,0,0.5)]' : 'bg-accent/10 text-accent'}`}>
                {subStatus.isPro ? <Crown size={28} /> : <CreditCard size={28} />}
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter uppercase leading-none mb-1">
                  {subStatus.isPro ? 'PRO_LIFETIME' : 'FREE_TIER'}
                </span>
                <span className="text-[12px] font-mono font-black text-accent">{user?.email || 'OFFLINE_USER'}</span>
                {subStatus.appId && (
                  <span className="text-[9px] font-mono opacity-30 mt-0.5">APP_ID: {subStatus.appId}</span>
                )}
              </div>
            </div>
            {!subStatus.isPro && (
              <button onClick={onUpgrade} className="btn btn-primary text-[12px] py-2 px-4 font-black shadow-[4px_4px_0_#000] tracking-widest">
                UPGRADE
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-line/10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="label-meta text-accent opacity-60">CURRENT_USAGE</span>
                <span className="text-3xl font-black font-mono tracking-tighter">
                  {subStatus.isPro ? '∞' : subStatus.usage}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="label-meta opacity-60 text-right">PLAN_LIMIT</span>
                <span className="text-xl font-bold font-mono text-muted">
                  {subStatus.isPro ? 'UNLIMITED' : `/ ${subStatus.limit} SNAPS`}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border-2 border-white/5">
              <div
                className={`h-full transition-all duration-1000 ${subStatus.isPro ? 'w-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(212,255,0,0.5)]'}`}
                style={{ width: subStatus.isPro ? '100%' : `${Math.min(100, (subStatus.usage / subStatus.limit) * 100)}%` }}
              />
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
                className="w-full py-3 bg-accent text-bg font-black uppercase tracking-widest text-[10px] rounded shadow-[4px_4px_0_#000] hover:scale-[0.98] transition-transform"
              >
                PUBLISH AS MASTER WORKSPACE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="card p-6 flex items-center justify-between border-2 border-accent/20">
        <div className="flex items-center gap-4">
          <Globe size={24} className="text-accent" />
          <div className="flex flex-col">
            <span className="text-lg font-display font-black">LOCALIZATION</span>
            <span className="label-meta">Current: {lang === 'en' ? 'EN_US' : 'VI_VN'}</span>
          </div>
        </div>
        <button onClick={toggleLang} className="btn btn-primary text-[12px] font-black tracking-widest">
          SWITCH_LANG
        </button>
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
        className="btn btn-secondary mt-12 border-red-900/30 text-red-500 flex items-center justify-center gap-3 grayscale hover:grayscale-0 bg-red-500/5"
      >
        <LogOut size={18} />
        TERMINATE_SESSION
      </button>
    </div>
  );
};
