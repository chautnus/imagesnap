import React, { useState, useEffect } from 'react';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { SEO } from './components/SEO';
import { AppDashboard } from './components/AppDashboard';
import { useLocation } from 'react-router-dom';
import { setAccessToken, revokeToken } from '@shared/lib/google-auth';
import { useAppData } from '@shared/hooks/useAppData';
import { useI18n } from '@shared/lib/i18n';
import { SubscriptionStatus } from '@shared/lib/types';
import { APP_VERSION } from '@shared/lib/version';
import { initAuthListener, handleStaffLogin } from './hooks/useAuthFlow';
import { PublicRoutes } from './routes/PublicRoutes';

export default function App() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState<'app' | 'landing' | 'privacy'>('landing');
  const [user, setUser] = useState<any>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(localStorage.getItem('ps_sheet_id'));
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const [shareTargetNonce, setShareTargetNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');

  const { lang, t, toggleLang } = useI18n();
  const { appData, isSyncing, refreshData, handleSaveProduct, handleDeleteProduct, handleSaveCategory, handleDeleteCategory } = useAppData(spreadsheetId, user);

  const [landingVariant, setLandingVariant] = useState<number>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const match = path.match(/\/([123])\/?$/);
    return match ? parseInt(match[1]) : 0;
  });

  // Auth initialization — GIS (web) + SYS_AUTH_SUCCESS event (extension)
  useEffect(() => {
    if (landingVariant !== 0) setView('landing');
    (window as any).switchToSettings = () => setActiveTab('settings');
    (window as any).switchToHelp = () => setActiveTab('help');

    const handlers = { onSetUser: setUser, onSetIsAuthReady: setIsAuthReady, onSetView: setView, onSetSpreadsheetId: setSpreadsheetId, onSetSubStatus: setSubStatus, onSetIsStaff: setIsStaff, refreshData };
    let cleanup: (() => void) | undefined;
    const runInit = () => { cleanup = initAuthListener(handlers); };
    if (document.readyState === 'complete') { runInit(); } else {
      window.addEventListener('load', runInit);
      return () => window.removeEventListener('load', runInit);
    }
    return () => cleanup?.();
  }, []);

  // PWA Share Target
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('sharing') !== '1') return;
    const dbRequest = indexedDB.open('imagesnap-pwa-db', 2);
    dbRequest.onupgradeneeded = (e: any) => { if (!e.target.result.objectStoreNames.contains('shares')) e.target.result.createObjectStore('shares'); };
    dbRequest.onsuccess = () => { setShareTargetNonce(p => p + 1); if (localStorage.getItem('ps_access_token')) setView('app'); };
  }, []);

  // Hash navigation + #import= handling (Extension → Web handoff)
  useEffect(() => {
    const checkImport = async () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#privacy') { setView('privacy'); return; }
      if (hash === '#staff') { setView('landing'); return; }
      if (!hash.startsWith('#import=')) return;

      const params = new URLSearchParams(hash.substring(1));
      let metadata: any = {};
      try { metadata = JSON.parse(decodeURIComponent(params.get('metadata') || '{}')); } catch (e) {}
      try {
        const req = indexedDB.open('imagesnap-pwa-db', 2);
        req.onupgradeneeded = (e: any) => { if (!e.target.result.objectStoreNames.contains('shares')) e.target.result.createObjectStore('shares'); };
        req.onsuccess = (e: any) => {
          const db = e.target.result;
          try {
            const sid = Date.now().toString();
            const tx = db.transaction('shares', 'readwrite');
            tx.objectStore('shares').put({ images: (params.get('import') || '').split(','), url: params.get('url') || '', title: metadata.t || metadata.title || '', text: metadata.d || metadata.description || '', timestamp: parseInt(sid) }, sid);
            tx.oncomplete = () => { setShareTargetNonce(p => p + 1); if (localStorage.getItem('ps_access_token')) setView('app'); };
          } catch (err: any) {
            db.close();
            if (err.name === 'NotFoundError') { const d = indexedDB.deleteDatabase('imagesnap-pwa-db'); d.onsuccess = () => window.location.reload(); }
          }
        };
      } catch (e) { console.error('Hash import failed', e); }
      window.history.replaceState({}, document.title, '/');
    };
    checkImport();
    window.addEventListener('hashchange', checkImport);
    return () => window.removeEventListener('hashchange', checkImport);
  }, []);

  const location = useLocation();

  if (view === 'privacy' || location.pathname === '/privacy') {
    return (<><SEO title="Privacy Policy — ImageSnap.cloud" description="Our privacy policy and data protection commitment." /><PrivacyPolicy onBack={() => { window.location.href = '/'; }} /></>);
  }

  if (user && isAuthReady) {
    return (
      <AppDashboard
        activeTab={activeTab} setActiveTab={setActiveTab}
        user={user} subStatus={subStatus} setSubStatus={setSubStatus}
        isSyncing={isSyncing} version={APP_VERSION}
        appData={appData} spreadsheetId={spreadsheetId}
        shareTargetNonce={shareTargetNonce} lang={lang} t={t} toggleLang={toggleLang}
        handleSaveProduct={handleSaveProduct} handleDeleteProduct={handleDeleteProduct}
        handleSaveCategory={handleSaveCategory} handleDeleteCategory={handleDeleteCategory}
        onLogout={() => { setUser(null); setSpreadsheetId(null); setAccessToken(null); setIsStaff(false); localStorage.clear(); revokeToken(); setView('landing'); window.location.href = '/'; }}
      />
    );
  }

  return (
    <PublicRoutes
      currentHash={currentHash} landingVariant={landingVariant} t={t}
      onStaffLogin={(data) => handleStaffLogin(data, { onSetUser: setUser, onSetIsAuthReady: setIsAuthReady, onSetView: setView, onSetSpreadsheetId: setSpreadsheetId, onSetIsStaff: setIsStaff, refreshData })}
    />
  );
}
