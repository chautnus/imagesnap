"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from '@web/components/Navigation';
import { CaptureTab, ProductMetadata } from '@web/components/CaptureTab';
import { DataTab } from '@web/components/DataTab';
import { SettingsTab } from '@web/components/SettingsTab';
import { HelpTab } from '@web/components/HelpTab';
import { Header } from '@web/components/Header';
import { initGis, getAccessToken, setAccessToken, getUserInfo, revokeToken } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { useAppData } from '@shared/hooks/useAppData';
import { useI18n } from '@shared/lib/i18n';
import { SubscriptionStatus } from '@shared/lib/types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  
  const [importedImages, setImportedImages] = useState<string[]>([]);
  const [importedUrl, setImportedUrl] = useState<string>('');
  const [importedMetadata, setImportedMetadata] = useState<ProductMetadata>({});

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
    const handleInit = async () => {
      // Check for staff session first
      const isStaff = localStorage.getItem('ps_is_staff') === 'true';
      if (isStaff) {
        const staffEmail = localStorage.getItem('ps_staff_email');
        const storedId = localStorage.getItem('ps_sheet_id');
        if (staffEmail && storedId) {
          setUser({ email: staffEmail, role: 'staff' });
          setSpreadsheetId(storedId);
          setIsAuthReady(true);
          setSubStatus({ isPro: true, limit: 999999, usage: 0, role: 'staff' });
          refreshData(storedId);
          return;
        }
      }

      // Google Auth Initialization
      initGis(async (token) => {
        console.log("Auth token ready, fetching user profile...");
        setAccessToken(token);
        try {
          const profile = await getUserInfo(token);
          if (profile) {
            setUser(profile);
            setIsAuthReady(true);
            fetchSubStatus(profile.email);
            
            const storedId = localStorage.getItem('ps_sheet_id');
            if (storedId) {
              setSpreadsheetId(storedId);
              refreshData(storedId);
            } else {
              initializeWorkspace();
            }
          } else {
            console.error("No profile found for token");
            setIsAuthReady(false);
            window.location.href = '/';
          }
        } catch (e) {
          console.error("Dashboard auth error:", e);
          setIsAuthReady(false);
          window.location.href = '/';
        }
      });
    };

    handleInit();
    handleShareTarget();
  }, []);

  const handleShareTarget = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('share-target') === 'true') {
      try {
        const cache = await caches.open('shared-data');
        const metaRes = await cache.match('/shared-metadata');
        
        if (metaRes) {
          const metadata = await metaRes.json();
          const images: string[] = [];
          
          for (let i = 0; i < metadata.imageCount; i++) {
            const imgRes = await cache.match(`/shared-image-${i}`);
            if (imgRes) {
              const blob = await imgRes.blob();
              const reader = new FileReader();
              const dataUrl = await new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
              images.push(dataUrl);
            }
          }

          if (images.length > 0) setImportedImages(images);
          if (metadata.url || metadata.text) setImportedUrl(metadata.url || metadata.text);
          if (metadata.title) setImportedMetadata({ t: metadata.title });

          await caches.delete('shared-data');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error("Failed to load shared data", e);
      }
    }
  };

  const initializeWorkspace = async () => {
    try {
      console.log("Initializing new workspace...");
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-black tracking-widest uppercase opacity-60">Authenticating ImageSnap...</div>
        </div>
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
        version="v1.4.0"
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
              if (user?.email && !localStorage.getItem('ps_is_staff')) fetchSubStatus(user.email);
            }} 
            t={t} 
            lang={lang}
            subStatus={subStatus}
            onUpgrade={handleUpgrade}
            initialImages={importedImages}
            importedUrl={importedUrl}
            importedMetadata={importedMetadata}
            onClearInitialImages={() => setImportedImages([])}
            onClearImportedUrl={() => setImportedUrl('')}
            onClearImportedMetadata={() => setImportedMetadata({})}
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
              localStorage.clear();
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
