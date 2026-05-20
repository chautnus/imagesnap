import React from 'react';
import { Navigation } from './Navigation';
import { CaptureTab } from './CaptureTab';
import { DataTab } from './DataTab';
import { SettingsTab } from './SettingsTab';
import { HelpTab } from './HelpTab';
import { Header } from './Header';
import { SEO } from './SEO';
import { setAccessToken, revokeToken } from '@shared/lib/google-auth';
import { SubscriptionStatus } from '@shared/lib/types';
import { fetchSubStatus, handleUpgrade } from '../hooks/useAuthFlow';

interface AppDashboardProps {
  activeTab: 'capture' | 'data' | 'settings' | 'help';
  setActiveTab: (tab: 'capture' | 'data' | 'settings' | 'help') => void;
  user: any;
  subStatus: SubscriptionStatus;
  setSubStatus: (s: SubscriptionStatus) => void;
  isSyncing: boolean;
  version: string;
  appData: any;
  spreadsheetId: string | null;
  shareTargetNonce: number;
  lang: string;
  t: any;
  toggleLang: () => void;
  handleSaveProduct: (product: any, imgs: any) => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
  handleSaveCategory: (cat: any) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  onLogout: () => void;
}

export const AppDashboard: React.FC<AppDashboardProps> = ({
  activeTab, setActiveTab, user, subStatus, setSubStatus,
  isSyncing, version, appData, spreadsheetId, shareTargetNonce,
  lang, t, toggleLang,
  handleSaveProduct, handleDeleteProduct, handleSaveCategory, handleDeleteCategory,
  onLogout,
}) => {
  const accessibleCategories = appData.categories.filter((cat: any) => {
    if (subStatus.isAdmin) return true;
    if (!subStatus.accessibleCategories) return true;
    return subStatus.accessibleCategories.includes(cat.id);
  });

  const combined = [
    ...appData.productNames,
    ...appData.products.map((p: any) => ({ categoryId: p.categoryId, name: p.name })),
  ];
  const seen = new Set<string>();
  const uniqueProductNames: { categoryId: string; name: string }[] = [];
  for (const item of combined) {
    if (item.name) {
      const nameStr = String(item.name).trim();
      const key = `${item.categoryId}-${nameStr.toLowerCase()}`;
      if (!seen.has(key)) { seen.add(key); uniqueProductNames.push({ categoryId: item.categoryId, name: nameStr }); }
    }
  }

  return (
    <div className="min-h-screen pb-20 w-full max-w-2xl mx-auto relative bg-bg">
      <SEO title="ImageSnap Dashboard" description="Capture and organize your images." />
      <Header
        activeTab={activeTab}
        user={user}
        subStatus={subStatus}
        isSyncing={isSyncing}
        version={version}
      />
      <main className="min-h-[calc(100vh-240px)] overflow-y-auto">
        {activeTab === 'capture' && (
          <CaptureTab
            categories={accessibleCategories}
            productNames={uniqueProductNames}
            onSave={async (product: any, imgs: any) => {
              if (!subStatus.isPro && subStatus.usage >= subStatus.limit) {
                alert(t('limitReached'));
                handleUpgrade(user.email);
                return;
              }
              await handleSaveProduct(product, imgs);
              if (user?.email) fetchSubStatus(user.email, setSubStatus);
            }}
            t={t}
            lang={lang}
            subStatus={subStatus}
            onUpgrade={() => handleUpgrade(user.email)}
            shareTargetNonce={shareTargetNonce}
            onSaveCategory={handleSaveCategory}
            onSwitchToHelp={() => setActiveTab('help')}
          />
        )}
        {activeTab === 'data' && (
          <DataTab
            categories={accessibleCategories}
            products={appData.products}
            onDelete={handleDeleteProduct}
            t={t}
            lang={lang}
            subStatus={subStatus}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            categories={appData.categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            toggleLang={toggleLang}
            lang={lang}
            spreadsheetId={spreadsheetId}
            t={t}
            user={user}
            subStatus={subStatus}
            onUpgrade={() => handleUpgrade(user.email)}
            onLogout={onLogout}
          />
        )}
        {activeTab === 'help' && <HelpTab t={t} />}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
    </div>
  );
};
