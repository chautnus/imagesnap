"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const syncLogs = () => {
      setLogs([...((window as any)._debugLogs || [])]);
    };

    window.addEventListener('SYS_DEBUG_UPDATE', syncLogs);
    syncLogs(); // Initial sync
    
    return () => window.removeEventListener('SYS_DEBUG_UPDATE', syncLogs);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-[90vw] max-h-[200px] overflow-y-auto bg-black/90 border border-white/10 rounded-lg p-3 shadow-2xl backdrop-blur-xl">
      <div className="flex justify-between items-center mb-2 border-bottom border-white/5 pb-1">
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Diagnostic Telemetry</span>
        <button onClick={() => setIsVisible(false)} className="text-[10px] text-white/40 hover:text-white uppercase font-bold">Hide</button>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-[9px] font-mono leading-tight break-all">
            <span className={log.includes('FATAL') ? 'text-red-400' : (log.includes('STAGE') ? 'text-accent' : 'text-white/60')}>
              {log}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-[9px] text-white/20 italic">Waiting for logs...</div>}
      </div>
    </div>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);
  const isConsumingRef = useRef(false);
  const searchParams = useSearchParams();
  
  const [importedImages, setImportedImages] = useState<string[]>([]);
  const [importedUrl, setImportedUrl] = useState<string>('');
  const [importedMetadata, setImportedMetadata] = useState<ProductMetadata>({});
  const [initStage, setInitStage] = useState<'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED'>('IDLE');
  const objectUrlRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

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
    const runInitialization = async () => {
      startTimeRef.current = Date.now();
      if ((window as any)._pushDebug) (window as any)._pushDebug('[BOOT] Starting v1.7.0 Sequential Init');

      // Phase 1: Data-First Retrieval ($O(1)$ Architecture)
      setInitStage('DATA_READ');
      await handleShareTarget();
      
      // Phase 2: Sequential Authentication
      setInitStage('AUTH_PROCESS');
      await handleInit();
      
      setInitStage('COMPLETED');
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[BOOT] Init Completed in ${Date.now() - startTimeRef.current}ms`);
    };

    const handleInit = async () => {
      if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_C] Verifying Google Identity Session...');
      const storedToken = localStorage.getItem('ps_access_token');
      const isStaff = localStorage.getItem('ps_is_staff') === 'true';

      if (!storedToken && !isStaff) {
        // Static Halt instead of auto-redirect for better UX control
        setAuthError("Session Required - Please login from the home page.");
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
            setAuthError("Session Expired - Verification failed on new infrastructure.");
            localStorage.removeItem('ps_access_token');
          }
        } catch (e) {
          setAuthError("Session Expired - Identity service error.");
          localStorage.removeItem('ps_access_token');
        }
      }).catch((err) => {
        setAuthError(`Auth Service Error: ${err.message}`);
        localStorage.removeItem('ps_access_token');
      });
      
      const recoveryTimer = setTimeout(() => {
        if (!isAuthReady) {
          setAuthError("Authentication Timed Out - Check your connection.");
          localStorage.removeItem('ps_access_token');
        }
      }, 18000);

      return () => clearTimeout(recoveryTimer);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    runInitialization();

    // Background Migration Cleanup (Idle Phase)
    if (typeof window !== 'undefined' && (window as any).requestIdleCallback) {
      (window as any).requestIdleCallback(() => {
        if ('serviceWorker' in navigator && !localStorage.getItem('migration_v1_6_1')) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            for(let r of regs) r.unregister();
            localStorage.setItem('migration_v1_6_1', 'true');
          });
        }
      });
    }

    const channel = new BroadcastChannel('imagesnap-share-target');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_SHARE_DATA') {
        handleShareTarget();
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      channel.close();
    };
  }, []);

  // Removed redundant dependency effect to maintain sequential flow
  const handleShareTarget = async () => {
    if (isConsumingRef.current) return;
    isConsumingRef.current = true;

    if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_A] Checking IndexedDB for shared data...');

    try {
      const { openDB } = await import('idb');
      const db = await openDB('imagesnap-pwa-db', 1);
      const data = await db.get('share-target', 'latest');

      if (data) {
        if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_B] Data found! Latency check starting...');
        const bStart = Date.now();

        if (data.file) {
          // O(1) Memory Pointer Implementation
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          const pointer = URL.createObjectURL(data.file);
          objectUrlRef.current = pointer;
          setImportedImages([pointer]);
          if ((window as any)._pushDebug) (window as any)._pushDebug(`[STAGE_B] Memory Latch Successful: ${Date.now() - bStart}ms`);
        }
        
        if (data.url) setImportedUrl(data.url);
        if (data.title) setImportedMetadata(prev => ({ ...prev, title: data.title }));
        
        // Clean up IDB immediately (Idempotency)
        await db.delete('share-target', 'latest');
      } else {
        if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_A] No shared data found in IDB');
      }
    } catch (error: any) {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[FATAL_ERROR] IDB Failure: ${error.message}`);
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
    const isTooLarge = searchParams.get('error') === 'file_too_large';
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          {!isTooLarge ? (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-2xl text-accent">⚠️</span>
            </div>
          )}
          
            <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">
                {isTooLarge ? "File Too Large" : (authError ? "Critical Error" : "System Diagnostics")}
              </div>
              
              {!isTooLarge && !authError && (
                <div className="flex flex-col gap-1 text-[9px] text-muted uppercase tracking-tighter opacity-40">
                  <span className={initStage === 'DATA_READ' ? 'text-accent font-bold' : ''}>
                    {initStage === 'DATA_READ' ? '●' : '○'} A. Memory Latching (O1)
                  </span>
                  <span className={initStage === 'AUTH_PROCESS' ? 'text-accent font-bold' : ''}>
                    {initStage === 'AUTH_PROCESS' ? '●' : '○'} B. Google GSI Handshake
                  </span>
                  <span className={isAuthReady ? 'text-accent font-bold' : ''}>
                    {isAuthReady ? '●' : '○'} C. Encrypted Session Established
                  </span>
                </div>
              )}

              {(authError || isTooLarge) && (
                <p className="text-[10px] text-accent mt-2 max-w-[220px] mx-auto leading-relaxed">
                  {isTooLarge 
                    ? "The shared image exceeds the 20MB limit. Please try a smaller file for smooth performance."
                    : authError}
                </p>
              )}
            </div>
            
            <div className="pt-4 animate-pulse">
              <div className="text-[9px] uppercase tracking-[0.2em] text-accent/50 font-bold">
                Build v1.7.0
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              Back to Home
            </button>
            <button 
              onClick={async () => {
                if ('serviceWorker' in navigator) {
                  try {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    for(let reg of regs) await reg.unregister();
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      for(let key of keys) await caches.delete(key);
                    }
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }
              }}
              className="text-[9px] text-muted underline decoration-accent/30 underline-offset-4 hover:text-white transition-colors"
            >
              Hard Reset & Update
            </button>
          </div>
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
      {isOffline && (
        <div className="bg-accent text-black text-[10px] font-black uppercase tracking-widest py-1 px-4 text-center sticky top-0 z-[100] animate-in slide-in-from-top duration-300">
          ⚠️ You are currently offline. Some features may be limited.
        </div>
      )}
      <Header 
        activeTab={activeTab}
        user={user}
        subStatus={subStatus}
        isSyncing={isSyncing}
        version="v1.7.0"
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

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-accent/50 font-bold animate-pulse">
            System Initializing...
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
      <DebugOverlay />
    </Suspense>
  );
}
