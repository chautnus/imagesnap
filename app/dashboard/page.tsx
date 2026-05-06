"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from '@web/components/Navigation';
import { CaptureTab, ProductMetadata } from '@web/components/CaptureTab';
import { DataTab } from '@web/components/DataTab';
import { SettingsTab } from '@web/components/SettingsTab';
import { HelpTab } from '@web/components/HelpTab';
import { Header } from '@web/components/Header';
import { initGis, getAccessToken, setAccessToken, getUserInfo, revokeToken, requestToken } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { useAppData } from '@shared/hooks/useAppData';
import { useI18n } from '@shared/lib/i18n';
import { SubscriptionStatus } from '@shared/lib/types';

const API_BASE_URL = ''; // Next.js API routes are relative

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  
  const { lang, t, toggleLang } = useI18n();
  const { 
    appData, 
    isSyncing, 
    refreshData, 
    handleSaveProduct, 
    handleDeleteProduct, 
    handleSaveCategory, 
    handleDeleteCategory 
  } = useAppData(spreadsheetId, user);

  useEffect(() => {
    const storedId = localStorage.getItem('ps_sheet_id');
    if (storedId) setSpreadsheetId(storedId);

    initGis(async (token) => {
      setAccessToken(token);
      try {
        const profile = await getUserInfo(token);
        if (profile) {
          setUser(profile);
          setIsAuthReady(true);
          fetchSubStatus(profile.email);
          if (storedId) {
            refreshData(storedId);
          } else {
            initializeWorkspace();
          }
        } else {
          setIsAuthReady(false);
          window.location.href = '/';
        }
      } catch (e) {
        setIsAuthReady(false);
        window.location.href = '/';
      }
    });
  }, []);

  const initializeWorkspace = async () => {
    try {
      const id = await findOrCreateWorkspace();
      setSpreadsheetId(id);
      localStorage.setItem('ps_sheet_id', id);
      await refreshData(id);
    } catch (err) {
      console.error("Workspace init error:", err);
    }
  };

  const fetchSubStatus = async (email: string) => {
    const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
    try {
      const res = await fetch(`/api/user-status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSubStatus({ ...data, isAdmin: data.isAdmin || isAdmin });
    } catch (e) { 
      setSubStatus(prev => ({ ...prev, isAdmin }));
    }
  };

  const handleUpgrade = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      alert("Failed to initiate checkout.");
    }
  };

  if (!user || !isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const accessibleCategories = appData.categories.filter(cat => {
    if (subStatus.isAdmin) return true;
    if (!subStatus.accessibleCategories) return true;
    return subStatus.accessibleCategories.includes(cat.id);
  });

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-bg text-white">
      <Header 
        activeTab={activeTab}
        user={user}
        subStatus={subStatus}
        isSyncing={isSyncing}
        version="v1.3.5"
      />
 
      <main className="min-h-[calc(100vh-240px)] overflow-y-auto">
        {activeTab === 'capture' && (
          <CaptureTab 
            categories={accessibleCategories} 
            productNames={appData.productNames}
            onSave={async (product, imgs) => {
              if (!subStatus.isPro && subStatus.usage >= subStatus.limit) {
                alert(t('limitReached'));
                handleUpgrade();
                return;
              }
              await handleSaveProduct(product, imgs);
              if (user?.email) fetchSubStatus(user.email);
            }} 
            t={t} 
            lang={lang}
            subStatus={subStatus}
            onUpgrade={handleUpgrade}
            initialImages={[]} // Handle imports later if needed
            importedUrl={""}
            importedMetadata={{}}
            onClearInitialImages={() => {}}
            onClearImportedUrl={() => {}}
            onClearImportedMetadata={() => {}}
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
            onUpgrade={handleUpgrade}
            onLogout={() => {
              revokeToken();
              window.location.href = '/';
            }}
          />
        )}
        {activeTab === 'help' && (
          <HelpTab t={t} />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
    </div>
  );
}
