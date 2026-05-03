import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CaptureTab, ProductMetadata } from './components/CaptureTab';
import { DataTab } from './components/DataTab';
import { SettingsTab } from './components/SettingsTab';
import { HelpTab } from './components/HelpTab';
import { Header } from './components/Header';
import { Wizard } from './components/Wizard';
import { LandingPage } from './components/LandingPage';
import { StaffLogin } from './components/StaffLogin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { PublicLayout } from './components/layouts/PublicLayout';
import { PricingPage } from './pages/PricingPage';
import { CompanyCamAlternative } from './pages/alternatives/CompanyCamAlternative';
import { PicsioAlternative } from './pages/alternatives/PicsioAlternative';
import { GooglePhotosVsImageSnap } from './pages/alternatives/GooglePhotosVsImageSnap';
import { ConstructionTeams } from './pages/use-cases/ConstructionTeams';
import { WebImageImport } from './pages/features/WebImageImport';
import { GenericSEOPage } from './pages/GenericSEOPage';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SEO } from './components/SEO';
import { initGis, getAccessToken, setAccessToken, getUserInfo, requestToken, revokeToken } from '@shared/lib/google-auth';
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
  const [activeTab, setActiveTab] = useState<'capture' | 'data' | 'settings' | 'help'>('capture');
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

  const [landingVariant, setLandingVariant] = useState<number>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    // Match /1, /2, /3 anywhere in the path or as the whole path
    const match = path.match(/\/([123])\/?$/);
    return match ? parseInt(match[1]) : 0;
  });

  useEffect(() => {
    if (landingVariant !== 0) setView('landing');
    
    (window as any).switchToSettings = () => setActiveTab('settings');
    (window as any).switchToHelp = () => setActiveTab('help');
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
    const checkImport = async () => {
      let hash = window.location.hash;
      let search = window.location.search;
      const searchParams = new URLSearchParams(search);

      // 1. Handle Web Share Target (from Service Worker cache)
      if (searchParams.get('share-target') === 'true') {
        try {
          const cache = await caches.open('shared-data');
          const metaRes = await cache.match('/shared-metadata');
          
          if (metaRes) {
            const metadata = await metaRes.json();
            const images: string[] = [];
            
            // Load images from cache as Data URLs
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
            if (metadata.url || metadata.text) {
              setImportedUrl(metadata.url || metadata.text);
            }
            if (metadata.title) {
              setImportedMetadata(prev => ({ ...prev, title: metadata.title }));
            }

            // Clean up cache
            await caches.delete('shared-data');
            // Clean up URL
            window.history.replaceState({}, document.title, "/");
          }
        } catch (e) {
          console.error("Failed to load shared data", e);
        }
        return;
      }

      // 2. Handle hash-based import (from Extension)
      if (hash === '#privacy') {
        setView('privacy');
        return;
      }
      if (hash === '#staff') {
        setView('landing');
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

  const location = useLocation();

  if (view === 'privacy' || location.pathname === '/privacy') {
    return (
      <>
        <SEO title="Privacy Policy — ImageSnap.cloud" description="Our privacy policy and data protection commitment." />
        <PrivacyPolicy onBack={() => {
          window.location.hash = '';
          setView(user ? 'app' : 'landing');
          window.location.href = '/';
        }} />
      </>
    );
  }

  // Auth Guard for the main app
  if (user && isAuthReady) {
    const accessibleCategories = appData.categories.filter(cat => {
      if (subStatus.isAdmin) return true;
      if (!subStatus.accessibleCategories) return true; // Default all if not restricted
      return subStatus.accessibleCategories.includes(cat.id);
    });

    return (
      <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-bg">
        <SEO title="ImageSnap Dashboard" description="Capture and organize your images." />
        <Header 
          activeTab={activeTab}
          user={user}
          subStatus={subStatus}
          isSyncing={isSyncing}
          version="v1.3.1"
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
                setUser(null);
                setSpreadsheetId(null);
                setAccessToken(null);
                setIsStaff(false);
                localStorage.clear();
                revokeToken();
                setView('landing');
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

  // Public Routes
  return (
    <Routes>
      <Route element={<PublicLayout onLogin={() => requestToken()} />}>
        <Route path="/" element={
          window.location.hash === '#staff' ? (
            <StaffLogin onLogin={handleStaffLogin} onBack={() => window.location.hash = ''} t={t} />
          ) : (
            <>
              <SEO 
                title="ImageSnap — Auto-organize team photos in Google Drive" 
                description="Save images from the web directly to Google Drive, auto-classify into folders, and attach detailed metadata."
              />
              <LandingPage onLogin={() => requestToken()} t={t} variant={landingVariant} />
            </>
          )
        } />
        <Route path="/pricing" element={<PricingPage onLogin={() => requestToken()} />} />
        <Route path="/alternatives/companycam-alternative" element={<CompanyCamAlternative onLogin={() => requestToken()} />} />
        <Route path="/alternatives/pics-io-alternative" element={<PicsioAlternative onLogin={() => requestToken()} />} />
        <Route path="/alternatives/google-photos-vs-imagesnap" element={<GooglePhotosVsImageSnap onLogin={() => requestToken()} />} />
        <Route path="/use-cases/construction-teams" element={<ConstructionTeams onLogin={() => requestToken()} />} />
        <Route path="/use-cases/ecommerce-studios" element={<GenericSEOPage onLogin={() => requestToken()} title="E-commerce Studios — ImageSnap" headline="E-commerce Asset Management" />} />
        <Route path="/use-cases/real-estate-photographers" element={<GenericSEOPage onLogin={() => requestToken()} title="Real Estate Photographers — ImageSnap" headline="Real Estate Photo Sync" />} />
        <Route path="/use-cases/field-inspections" element={<GenericSEOPage onLogin={() => requestToken()} title="Field Inspections — ImageSnap" headline="Field Inspection Documentation" />} />
        
        <Route path="/features/web-image-import" element={<WebImageImport onLogin={() => requestToken()} />} />
        <Route path="/features/auto-folder-organization" element={<GenericSEOPage onLogin={() => requestToken()} title="Auto Folder Organization — ImageSnap" headline="Automatic Folder Structure" />} />
        <Route path="/features/team-collaboration" element={<GenericSEOPage onLogin={() => requestToken()} title="Team Collaboration — ImageSnap" headline="Collaborate with your Team" />} />
        <Route path="/features/metadata-auto-fill" element={<GenericSEOPage onLogin={() => requestToken()} title="Metadata Auto-fill — ImageSnap" headline="Automatic Metadata Extraction" />} />
        
        <Route path="/integrations/google-drive" element={<GenericSEOPage onLogin={() => requestToken()} title="Google Drive Integration — ImageSnap" headline="The Best Google Drive Extension" />} />
        
        <Route path="/tools/exif-viewer" element={<GenericSEOPage onLogin={() => requestToken()} title="Free EXIF Viewer — ImageSnap" headline="Online EXIF Data Viewer" />} />
        <Route path="/tools/bulk-photo-renamer" element={<GenericSEOPage onLogin={() => requestToken()} title="Bulk Photo Renamer — ImageSnap" headline="Batch Photo Renaming Tool" />} />
        <Route path="/tools/drive-folder-generator" element={<GenericSEOPage onLogin={() => requestToken()} title="Google Drive Folder Generator — ImageSnap" headline="Instant Folder Structure Creator" />} />
        
        <Route path="/blog" element={<GenericSEOPage onLogin={() => requestToken()} title="Blog — ImageSnap" headline="Tips & Tricks for Digital Organization" />} />
      </Route>
      
      {/* Privacy Policy outside of PublicLayout if needed, or inside */}
      <Route path="/privacy" element={
        <PrivacyPolicy onBack={() => window.location.href = '/'} />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const CloudCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m9 13 2 2 4-4"/>
  </svg>
);

