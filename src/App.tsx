import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CaptureTab, ProductMetadata } from './components/CaptureTab';
import { DataTab } from './components/DataTab';
import { SettingsTab } from './components/SettingsTab';
import { Wizard } from './components/Wizard';
import { LandingPage } from './components/LandingPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { initGis, getAccessToken, setAccessToken, getUserInfo, requestToken } from './lib/google-auth';
import { 
  findOrCreateWorkspace, 
  appendRow, 
} from './lib/sheets';
import { useAppData } from './hooks/useAppData';
import { useI18n } from './lib/i18n';
import { ExternalLink, Crown } from 'lucide-react';
import { SubscriptionStatus } from './lib/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings'>('capture');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState<'app' | 'landing' | 'privacy'>('landing');
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(localStorage.getItem('ps_sheet_id'));
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
    const handleInit = () => {
      initGis(async (token) => {
        setAccessToken(token);
        try {
          const profile = await getUserInfo(token);
          if (profile) {
             setUser(profile);
             setIsAuthReady(true);
             setView('app');
             fetchSubStatus(profile.email);
             // Use existing sheet ID if possible to avoid "reconnecting"
             const storedId = localStorage.getItem('ps_sheet_id');
             if (storedId) {
               setSpreadsheetId(storedId);
               refreshData(storedId);
             } else {
               initializeWorkspace();
             }
          } else {
             localStorage.removeItem('ps_access_token');
             setIsAuthReady(false);
          }
        } catch (e) {
          localStorage.removeItem('ps_access_token');
          setIsAuthReady(false);
        }
      });
    };

    if ((window as any).google) {
      handleInit();
    } else {
      window.addEventListener('load', handleInit);
    }
    
    return () => window.removeEventListener('load', handleInit);
  }, []);

  const [importedImages, setImportedImages] = useState<string[]>([]);
  const [importedUrl, setImportedUrl] = useState<string>('');
  const [importedMetadata, setImportedMetadata] = useState<ProductMetadata>({});

  useEffect(() => {
    const checkImport = () => {
      let hash = window.location.hash;
      if (hash === '#privacy') {
        setView('privacy');
        return;
      }
      if (hash.startsWith('#import=')) {
        const params = new URLSearchParams(hash.substring(1));
        const imgs = params.get('import');
        const sourceUrl = params.get('url');
        const metaStr = params.get('metadata');
        
        if (imgs) {
          setImportedImages(imgs.split(','));
        }
        if (sourceUrl) {
          setImportedUrl(sourceUrl);
        }
        if (metaStr) {
          try {
            setImportedMetadata(JSON.parse(decodeURIComponent(metaStr)));
          } catch(e) {
            console.error("Failed to parse metadata", e);
          }
        }
        window.history.replaceState({}, document.title, "/");
      }
    };

    checkImport();
    window.addEventListener('hashchange', checkImport);
    return () => window.removeEventListener('hashchange', checkImport);
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
    try {
      const res = await fetch(`/api/user-status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSubStatus(data);
    } catch (e) { console.error("Sub status fetch fail", e); }
  };

  const handleUpgrade = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      console.error("Upgrade redirect fail", e);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => {
      window.location.hash = '';
      setView(user ? 'app' : 'landing');
    }} />;
  }

  if (view === 'landing' && !user) {
    return <LandingPage onLogin={() => requestToken()} t={t} />;
  }

  if (!isAuthReady) {
    return <Wizard t={t} />;
  }

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-bg">
      <header className="px-6 py-8 flex bg-bg items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="label-meta text-accent mb-0.5">V5.1_STABLE</div>
            {subStatus.isPro && (
              <div className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[8px] font-black rounded-full flex items-center gap-1 border border-yellow-500/30">
                <Crown size={8} /> PRO
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            ImageSnap<span className="text-accent">_</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
             onClick={() => window.open(window.location.origin, '_blank')}
             title="Open Standalone"
             className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center text-accent hover:bg-accent hover:text-bg transition-colors shadow-[0_0_10px_rgba(212,255,0,0.1)]"
          >
            <ExternalLink size={16} />
          </button>
          <div className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${isSyncing ? 'bg-muted/20 text-muted' : 'bg-accent/10 text-accent'}`}>
            {isSyncing ? 'SYNCING' : 'ONLINE'}
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-240px)] overflow-y-auto">
        {activeTab === 'capture' && (
          <CaptureTab 
            categories={appData.categories} 
            productNames={appData.productNames}
            onSave={handleSaveProduct} 
            t={t} 
            lang={lang}
            initialImages={importedImages}
            importedUrl={importedUrl}
            importedMetadata={importedMetadata}
            onClearInitialImages={() => setImportedImages([])}
            onClearImportedUrl={() => setImportedUrl('')}
            onClearImportedMetadata={() => setImportedMetadata({})}
          />
        )}
        {activeTab === 'data' && (
          <DataTab 
            categories={appData.categories} 
            products={appData.products} 
            onDelete={handleDeleteProduct}
            t={t} 
            lang={lang}
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
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
    </div>
  );
}

const CloudCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m9 13 2 2 4-4"/>
  </svg>
);

