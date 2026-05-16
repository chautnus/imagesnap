"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@web/components/Navigation';
import { CaptureTab } from './components/Capture/CaptureTab';
import { ProductMetadata } from '@web/components/CaptureTab';
import { DataTab } from '@web/components/DataTab';
import { SettingsTab } from '@web/components/SettingsTab';
import { HelpTab } from '@web/components/HelpTab';
import { Header } from '@web/components/Header';
import { revokeToken } from '@shared/lib/google-auth';
import { useAppData } from '@shared/hooks/useAppData';
import { useI18n } from '@shared/lib/i18n';
import { useDashboardInit } from './hooks/useDashboardInit';
import { DashboardGuardScreen } from './components/LoadingScreens';
import { DebugOverlay } from './components/DebugOverlay';
import { APP_VERSION } from '@shared/lib/version';

interface ErrorBoundaryState { hasError: boolean; }

class DashboardErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleFixAndReload = async () => {
    try {
      localStorage.clear();
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) await caches.delete(key);
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) await reg.unregister();
      }
    } finally {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-white">
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">💥</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">Unexpected Error</div>
              <p className="text-[10px] text-white/50 max-w-[220px] mx-auto leading-relaxed">
                Something went wrong. Use Fix & Reload to clear state and recover.
              </p>
            </div>
            <button
              onClick={this.handleFixAndReload}
              className="px-8 py-2.5 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-all active:scale-95"
            >
              Fix & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');

  const { lang, t, toggleLang } = useI18n();

  const {
    initStage,
    isAuthReady,
    authError,
    user,
    spreadsheetId,
    setSpreadsheetId,
    subStatus,
    setSubStatus,
    dataStatus,
    isOffline,
    shareTargetNonce,
    handleShareTarget,
    fetchSubStatus,
  } = useDashboardInit(async (id: string) => {
    await refreshData(id);
  });

  const {
    appData,
    isSyncing,
    refreshData,
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveCategory,
    handleDeleteCategory
  } = useAppData(spreadsheetId, user);

  // AUTH_PROCESS watchdog: soft reload if stuck > 10s
  useEffect(() => {
    if (initStage !== 'AUTH_PROCESS') return;
    const timer = setTimeout(() => {
      if ((window as any)._pushDebug) (window as any)._pushDebug('[WATCHDOG] AUTH_PROCESS stuck > 10s — soft reload');
      window.location.reload();
    }, 10000);
    return () => clearTimeout(timer);
  }, [initStage]);

  // Reactive Share Signal
  useEffect(() => {
    const sid = searchParams.get('share_id');
    if (sid && isAuthReady) {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[STAGE_D] Reactive Signal Received: ${sid}`);
      handleShareTarget(sid);
    }
  }, [searchParams, isAuthReady, handleShareTarget]);

  // IDB Sync Side Effect: Once sid is pulled from IDB, pass it to CaptureTab
  // No need for confirmation signal, logic is now SID-based.

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
      <DashboardGuardScreen
        authError={authError}
        initStage={initStage}
        isAuthReady={isAuthReady}
      />
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
        version={APP_VERSION}
        dataStatus={dataStatus}
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
            shareTargetSid={shareTargetSid}
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
      <DashboardErrorBoundary>
        <DashboardContent />
      </DashboardErrorBoundary>
      <DebugOverlay />
    </Suspense>
  );
}
