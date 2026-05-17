"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

// Sub-components
import { CategorySelector } from './CategorySelector';
import { ImageGrid } from './ImageGrid';
import { CaptureForm } from './CaptureForm';
import { QuickAddCategory } from './QuickAddCategory';

// UI components from src
import { BurstCamera } from '@web/components/BurstCamera';
import { ImagePicker, ExtractedImage } from '@web/components/ImagePicker';
import { Globe as GlobeIcon, Camera } from 'lucide-react';
import { Images as ImagesIcon, RefreshCw, ShieldAlert } from 'lucide-react';
import { DiagnosticsWizard } from './DiagnosticsWizard';

interface CaptureTabProps {
  categories: Category[];
  onSave: (product: Partial<Product>, images: string[]) => Promise<void>;
  productNames: { categoryId: string; name: string }[];
  t: (key: string) => string;
  lang: string;
  subStatus: { isPro: boolean; limit: number; usage: number; userEmail?: string; isAdmin?: boolean };
  onUpgrade: () => Promise<void>;
  shareTargetSid: string | null; // Changed from nonce to sid as per Plan Phase 2
  onSaveCategory?: (cat: Category) => Promise<void>;
  onSwitchToHelp: () => void;
}

export const CaptureTab: React.FC<CaptureTabProps> = ({
  categories, onSave, productNames, t, lang, subStatus, onUpgrade,
  shareTargetSid,
  onSaveCategory, onSwitchToHelp
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentCatIds, setRecentCatIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('ps_recent_cats');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => recentCatIds[0] || categories[0]?.id || null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySearchFocus, setKeySearchFocus] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const blobUrlsRef = useRef<string[]>([]);
 
  // Auto-open Wizard if a share error occurred
  useEffect(() => {
    if (shareTargetSid && typeof window !== 'undefined') {
      const isErr = sessionStorage.getItem('imagesnap_pending_fatal_error') === 'true';
      if (isErr) {
        if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Redirecting to Diagnostics Wizard because SW Fatal Error was set.`);
        setShowWizard(true);
      }
    }
  }, [shareTargetSid]);

  // Update recent categories
  useEffect(() => {
    if (selectedCategoryId) {
      const newRecent = [selectedCategoryId, ...recentCatIds.filter(id => id !== selectedCategoryId)].slice(0, 5);
      setRecentCatIds(newRecent);
      localStorage.setItem('ps_recent_cats', JSON.stringify(newRecent));
    }
  }, [selectedCategoryId]);

  // IDB Data Ingestion logic (Coordinator Level - Normal Successful Ingestion)
  useEffect(() => {
    if (shareTargetSid) {
      // Bỏ qua luồng thành công ngầm nếu Wizard đang được kích hoạt
      const isErr = typeof window !== 'undefined' && sessionStorage.getItem('imagesnap_pending_fatal_error') === 'true';
      if (isErr) return;

      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Coordinator: Pulling Share Data for SID: ${shareTargetSid}`);
      
      const DB_NAME = 'imagesnap-pwa-db';
      const STORE_NAME = 'shares';
      const DB_VERSION = 2;
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const getReq = store.get(shareTargetSid);
          
          getReq.onsuccess = () => {
            const data = getReq.result;
            if (data) {
              // 1. Process Images
              if (data.images && Array.isArray(data.images)) {
                const newBlobUrls = data.images.map((b: Blob) => URL.createObjectURL(b));
                setImages(prev => [...prev, ...newBlobUrls]);
                blobUrlsRef.current.push(...newBlobUrls);
              }

              // 2. Process Metadata
              setFormData(prev => {
                const next = { ...prev };
                const cat = categories.find(c => c.id === selectedCategoryId);
                if (cat) {
                  cat.fields.forEach(f => {
                    const label = translate(f.label, lang).toLowerCase();
                    if (data.title && !next[f.id] && (f.type === 'key' || label.includes('name') || label.includes('title'))) {
                      next[f.id] = data.title;
                    }
                    if (data.url && !next[f.id] && f.type === 'url') {
                      next[f.id] = data.url;
                    }
                  });
                }
                return next;
              });
            }
          };
          transaction.oncomplete = () => {
            if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Coordinator: Normal Ingestion finished. Clearing pending status.`);
            sessionStorage.removeItem('imagesnap_pending_share_id');
            sessionStorage.removeItem('imagesnap_pending_fatal_error');
            db.close();
          };
        } catch (e: any) {
          if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Coordinator: Error in ingestion: ${e.message || e}`);
          db.close();
        }
      };
    }
  }, [shareTargetSid, selectedCategoryId]);

  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        const MAX_SIZE = 1600;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleSave = async () => {
    if (isSaving || !selectedCategoryId || images.length === 0) return;
    if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Save Product triggered. Category: ${selectedCategoryId}, Images: ${images.length}`);
    setIsSaving(true);
    try {
      const isStaff = subStatus.userEmail?.endsWith('@staff.imagesnap');
      const processedImages = await Promise.all(images.map(async (img, idx) => {
        let base64 = img;
        if (img.startsWith('blob:')) {
          if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Processing blob URL to base64 for image ${idx + 1}...`);
          const res = await fetch(img);
          const blob = await res.blob();
          base64 = await new Promise(r => { const rd = new FileReader(); rd.onloadend = () => r(rd.result as string); rd.readAsDataURL(blob); });
        }
        return (isStaff && base64.startsWith('data:')) ? await compressImage(base64) : base64;
      }));
      await onSave({ categoryId: selectedCategoryId, data: { ...formData } }, processedImages);
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Product saved successfully to Google Sheets!`);
      setImages([]);
      setFormData({});
    } catch (e: any) {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Product save failed: ${e.message || e}`);
    } finally { setIsSaving(false); }
  };

  const isAtLimit = !subStatus.isPro && subStatus.usage >= subStatus.limit;
  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="pb-24 p-4 flex flex-col gap-5">
      <div className="flex justify-end items-center">
        <button onClick={onSwitchToHelp} className="text-[10px] bg-accent/10 text-accent font-black px-2.5 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all uppercase">
          Help Guide
        </button>
      </div>

      {/* Action Row */}
      <div className="grid grid-cols-4 gap-2">
        <BurstCamera imageCount={images.length} onPhotoTaken={url => {
          if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Burst photo taken. Current images: ${images.length + 1}`);
          setImages(p => [...p, url]);
        }} />
        
        <label htmlFor="file-gallery" className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent transition-all cursor-pointer h-20">
          <ImagesIcon size={18} />
          <span className="text-[10px] font-black uppercase">GALLERY</span>
          <input type="file" accept="image/*" multiple className="hidden" id="file-gallery"
            onChange={e => {
              const files = Array.from(e.target.files || []);
              if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Gallery picker: User selected ${files.length} files.`);
              files.forEach((f, idx) => {
                const r = new FileReader(); 
                r.onload = re => {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Gallery loaded file ${idx + 1}: ${f.name} (${f.size} bytes)`);
                  setImages(p => [...p, re.target!.result as string]);
                };
                r.readAsDataURL(f);
              });
            }}
          />
        </label>
 
        <label htmlFor="file-native" className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent transition-all cursor-pointer h-20">
          <Camera size={18} />
          <span className="text-[10px] font-black uppercase">CAMERA</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" id="file-native"
            onChange={e => {
              const files = Array.from(e.target.files || []);
              if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Native camera picker: User captured ${files.length} files.`);
              files.forEach((f, idx) => {
                const r = new FileReader();
                r.onload = re => {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Native camera loaded file ${idx + 1}: ${f.name} (${f.size} bytes)`);
                  setImages(p => [...p, re.target!.result as string]);
                };
                r.readAsDataURL(f);
              });
            }}
          />
        </label>

        {shareTargetSid && (
          <button
            onClick={() => setShowWizard(true)}
            className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-accent/30 text-accent hover:border-accent transition-all h-20 animate-pulse"
          >
            <ShieldAlert size={18} />
            <span className="text-[10px] font-black uppercase">DIAGNOSE</span>
          </button>
        )}
      </div>

      <ImageGrid images={images} onRemoveImage={idx => setImages(images.filter((_, i) => i !== idx))} />

      <CategorySelector 
        categories={categories} 
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        recentCatIds={recentCatIds}
        onShowQuickAdd={() => setShowQuickAdd(true)}
        lang={lang}
      />

      {activeCategory && (
        <CaptureForm 
          activeCategory={activeCategory}
          formData={formData}
          onFieldChange={(id, val) => setFormData(p => ({ ...p, [id]: val }))}
          isSaving={isSaving}
          isAtLimit={isAtLimit}
          onSave={handleSave}
          t={t}
          lang={lang}
          suggestions={productNames.filter(pn => pn.categoryId === selectedCategoryId)}
          keySearchFocus={keySearchFocus}
          onKeySearchFocus={setKeySearchFocus}
        />
      )}

      <QuickAddCategory 
        isOpen={showQuickAdd} 
        onClose={() => setShowQuickAdd(false)}
        onSave={onSaveCategory!}
      />

      {showWizard && shareTargetSid && (
        <DiagnosticsWizard 
          shareId={shareTargetSid}
          hasFatalError={typeof window !== 'undefined' && sessionStorage.getItem('imagesnap_pending_fatal_error') === 'true'}
          onClose={() => setShowWizard(false)}
          onIngestComplete={(data) => {
            if (data.images && data.images.length > 0) {
              setImages(prev => [...prev, ...data.images]);
              blobUrlsRef.current.push(...data.images);
            }
            setFormData(prev => {
              const next = { ...prev };
              const cat = categories.find(c => c.id === selectedCategoryId);
              if (cat) {
                cat.fields.forEach(f => {
                  const label = translate(f.label, lang).toLowerCase();
                  if (data.title && !next[f.id] && (f.type === 'key' || label.includes('name') || label.includes('title'))) {
                    next[f.id] = data.title;
                  }
                  if (data.url && !next[f.id] && f.type === 'url') {
                    next[f.id] = data.url;
                  }
                });
              }
              return next;
            });
            setShowWizard(false);
          }}
        />
      )}
    </div>
  );
};
