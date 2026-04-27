import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CaptureTab, ProductMetadata } from './components/CaptureTab';
import { DataTab } from './components/DataTab';
import { SettingsTab } from './components/SettingsTab';
import { Wizard } from './components/Wizard';
import { LandingPage } from './components/LandingPage';
import { StaffLogin } from './components/StaffLogin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { initGis, getAccessToken, setAccessToken, getUserInfo, requestToken } from '@shared/lib/google-auth';
import { 
  findOrCreateWorkspace, 
  appendRow, 
} from '@shared/lib/sheets';
import { useAppData } from '@shared/hooks/useAppData';
import { useI18n } from '@shared/lib/i18n';
import { ExternalLink, Crown, Image as ImageIcon } from 'lucide-react';
import { SubscriptionStatus } from '@shared/lib/types';

const API_BASE_URL = (window.location.protocol === 'extension:' || window.location.protocol === 'chrome-extension:' || window.location.protocol === 'ms-browser-extension:') 
  ? 'https://www.imagesnap.cloud' 
  : '';

export default function App() {
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings'>('capture');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState<'app' | 'landing' | 'privacy'>('landing');
  const [user, setUser] = useState<any>(null);
  const [isStaff, setIsStaff] = useState(false);
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
    (window as any).switchToSettings = () => setActiveTab('settings');
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

    // If in extension, we can init immediately as initGis handles both cases
    // @ts-ignore
    const isExtension = !!(window.chrome && window.chrome.identity);

    if (isExtension || (window as any).google) {
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
    // Client-side fallback for main admin
    const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSubStatus({ ...data, isAdmin: data.isAdmin || isAdmin });
    } catch (e) { 
      console.error("Sub status fetch fail", e);
      // Use fallback if fetch fails
      setSubStatus(prev => ({ ...prev, isAdmin }));
    }
  };

  const handleUpgrade = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
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

  const handleStaffLogin = (data: { username: string, masterSpreadsheetId: string, user: any }) => {
    setUser({ ...data.user, email: `${data.username}@staff.imagesnap` });
    setIsStaff(true);
    setSpreadsheetId(data.masterSpreadsheetId);
    setIsAuthReady(true);
    setView('app');
    // Refresh data from the master spreadsheet
    refreshData(data.masterSpreadsheetId);
  };

  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => {
      window.location.hash = '';
      setView(user ? 'app' : 'landing');
    }} />;
  }

  if (view === 'landing' && !user) {
    if (window.location.hash === '#staff') {
      return <StaffLogin onLogin={handleStaffLogin} onBack={() => window.location.hash = ''} t={t} />;
    }
    return <LandingPage onLogin={() => requestToken()} t={t} />;
  }

  if (!isAuthReady) {
    return <Wizard t={t} />;
  }

  const accessibleCategories = appData.categories.filter(cat => {
    if (subStatus.isAdmin) return true;
    if (!subStatus.accessibleCategories) return true; // Default all if not restricted
    return subStatus.accessibleCategories.includes(cat.id);
  });

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-bg">
      <header className="px-6 py-6 flex bg-bg items-center justify-between border-b border-white/5 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
               <ImageIcon size={12} className="text-bg fill-current" />
             </div>
             <span className="text-[10px] font-black tracking-widest text-white uppercase italic">ImageSnap_</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter mt-1">
             {activeTab.toUpperCase()}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
               <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${subStatus.isAdmin ? 'bg-accent text-bg' : 'bg-blue-500 text-white'}`}>
                 {subStatus.isAdmin ? 'ADMIN' : 'STAFF'}
               </span>
               <span className="text-[11px] font-bold text-white max-w-[120px] truncate">
                 {user?.email || user?.username || 'OFFLINE'}
               </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
               {subStatus.isPro && <span className="text-[8px] font-black text-yellow-500 flex items-center gap-0.5"><Crown size={8} /> PRO</span>}
               <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-muted animate-pulse' : 'bg-accent shadow-[0_0_8px_var(--accent)]'}`} />
            </div>
          </div>
          <button 
             onClick={() => window.open(window.location.origin, '_blank')}
             className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-all bg-card"
          >
            <ExternalLink size={18} />
          </button>
        </div>
      </header>
 
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
              // Refresh status after save to update usage count
              if (user?.email) fetchSubStatus(user.email);
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
              setUser(null);
              setAccessToken(null);
              setView('landing');
              window.location.reload();
            }}
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

