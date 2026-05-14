"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const isConsumingRef = useRef(false);
  
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
      const storedToken = localStorage.getItem('ps_access_token');
      const isStaff = localStorage.getItem('ps_is_staff') === 'true';

      if (!storedToken && !isStaff) {
        window.location.href = '/';
        return;
      }

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

      initGis(async (token) => {
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
            setAuthError("Failed to retrieve user profile. Please login again.");
            localStorage.removeItem('ps_access_token');
            setTimeout(() => window.location.href = '/', 2000);
          }
        } catch (e) {
          setAuthError("Authentication error. Please try again.");
          localStorage.removeItem('ps_access_token');
          setTimeout(() => window.location.href = '/', 2000);
        }
      }).catch((err) => {
        setAuthError(`Auth Service Error: ${err.message}`);
        setTimeout(() => window.location.href = '/', 3000);
      });
      
      // Marvin Core Fix: UI recovery timeout must be > Service latency (10s + 5s = 15s)
      // Setting to 18s for safety buffer
      const recoveryTimer = setTimeout(() => {
        if (!isAuthReady) {
          setAuthError("Authentication is taking longer than expected. Retrying...");
          setTimeout(() => { if (!isAuthReady) window.location.href = '/'; }, 3000);
        }
      }, 18000);

      return () => clearTimeout(recoveryTimer);
    };

    handleInit();

    const channel = new BroadcastChannel('imagesnap-share-target');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_SHARE_DATA') {
        handleShareTarget();
      }
    };

    return () => channel.close();
  }, []);

  // Separate effect for share target
  useEffect(() => {
    if (isAuthReady) {
      handleShareTarget();
    }
  }, [isAuthReady]);

  const handleShareTarget = async () => {
    if (isConsumingRef.current) return;
    isConsumingRef.current = true;

    try {
      // Mutating Read: Get and Delete in one go (conceptually atomic via IDB transaction)
      const data = await consumeSharedDataFromDB();
      
      if (data) {
        const images: string[] = [];
        if (data.image) {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(data.image);
          });
          images.push(dataUrl);
        }

        if (images.length > 0) setImportedImages(images);
        if (data.url || data.text) setImportedUrl(data.url || data.text);
        if (data.title) setImportedMetadata({ t: data.title });
        
        // Ensure we are on the capture tab
        setActiveTab('capture');
      }
    } catch (e) {
      console.error("Failed to consume shared data", e);
    } finally {
      isConsumingRef.current = false;
    }
  };

  const consumeSharedDataFromDB = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ImageSnapSharing', 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sharedContent')) {
          resolve(null);
          return;
        }
        
        const transaction = db.transaction('sharedContent', 'readwrite');
        const store = transaction.objectStore('sharedContent');
        const getReq = store.get('latest');
        
        getReq.onsuccess = () => {
          const result = getReq.result;
          if (result) {
            // Atomic delete immediately after successful read
            store.delete('latest');
            transaction.oncomplete = () => resolve(result);
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => reject(getReq.error);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
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
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="space-y-2">
            <div className="text-xs font-black tracking-widest uppercase opacity-60">
              {authError || "Authenticating ImageSnap..."}
            </div>
            <p className="text-[10px] text-muted max-w-[200px]">
              {authError ? "Redirecting..." : "If this takes too long, please try refreshing or logging in again."}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-white/10 transition-colors"
          >
            Back to Home / Login
          </button>
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
    <div className="min-h-screen pb-20 w-full max-w-2xl mx-auto relative bg-bg text-white">
      <Header 
        activeTab={activeTab}
        user={user}
        subStatus={subStatus}
        isSyncing={isSyncing}
        version="v1.5.1"
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
