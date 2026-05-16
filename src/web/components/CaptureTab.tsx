"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, X, Image as ImagesIcon, Link as LinkIcon, Calendar, Search, Command, Globe as GlobeIcon, Save, Plus } from 'lucide-react';
import { Camera } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';

import { translate } from '@shared/lib/translations';
import { DriveImage } from './DriveImage';
import { BurstCamera } from './BurstCamera';
import { ImagePicker, ExtractedImage } from './ImagePicker';

export interface ProductMetadata {
  t?: string;
  d?: string;
  p?: string;
  [key: string]: any;
}

interface CaptureTabProps {
  categories: Category[];
  onSave: (product: Partial<Product>, images: string[]) => Promise<void>;
  productNames: { categoryId: string; name: string }[];
  t: (key: string) => string;
  lang: string;
  subStatus: { isPro: boolean; limit: number; usage: number; userEmail?: string; isAdmin?: boolean };
  onUpgrade: () => Promise<void>;
  shareTargetNonce: number;
  onSaveCategory?: (cat: Category) => Promise<void>;
  onSwitchToHelp: () => void;
}

export const CaptureTab: React.FC<CaptureTabProps> = ({
  categories, onSave, productNames, t, lang, subStatus, onUpgrade,
  shareTargetNonce,
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
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('ðŸ“¦');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySearchFocus, setKeySearchFocus] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (selectedCategoryId) {
      const newRecent = [selectedCategoryId, ...recentCatIds.filter(id => id !== selectedCategoryId)].slice(0, 5);
      setRecentCatIds(newRecent);
      localStorage.setItem('ps_recent_cats', JSON.stringify(newRecent));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (shareTargetNonce > 0) {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Pulling Shared Data (Nonce: ${shareTargetNonce})...`);
      
      const DB_NAME = 'imagesnap-pwa-db';
      const STORE_NAME = 'shares';
      const DB_VERSION = 2;
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const cursorReq = store.openCursor(null, 'prev');
          
          cursorReq.onsuccess = (e: any) => {
            const cursor = e.target.result;
            if (cursor) {
              const data = cursor.value;
              if (data) {
                if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Shared Record Found: ${JSON.stringify(data).substring(0, 50)}...`);
                
                // 1. Process Images
                if (data.images && Array.isArray(data.images)) {
                  const newBlobUrls = data.images.map((b: Blob) => URL.createObjectURL(b));
                  setImages(prev => [...prev, ...newBlobUrls]);
                  blobUrlsRef.current.push(...newBlobUrls);
                } else if (data.image) {
                  const blobUrl = URL.createObjectURL(data.image);
                  setImages(prev => [...prev, blobUrl]);
                  blobUrlsRef.current.push(blobUrl);
                }

                // 2. Process Metadata (URL & Title)
                setFormData(prev => {
                  const next = { ...prev };
                  const cat = categories.find(c => c.id === selectedCategoryId);
                  if (cat) {
                    cat.fields.forEach(f => {
                      const label = translate(f.label, lang).toLowerCase();
                      // Auto-fill Title
                      if (data.title && !next[f.id] && (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title'))) {
                        next[f.id] = data.title;
                      }
                      // Auto-fill URL
                      if (data.url && !next[f.id] && (f.type === 'url')) {
                        next[f.id] = data.url;
                      }
                      // Auto-fill Description/Text
                      if (data.text && !next[f.id] && (label.includes('mô tả') || label.includes('description'))) {
                        next[f.id] = data.text;
                      }
                    });
                  }
                  return next;
                });
                
                // Cleanup: Delete from IDB after successful consumption
                store.delete(cursor.key);
              }
            }
          };

          transaction.oncomplete = () => {
            db.close();
            if ((window as any)._pushDebug) (window as any)._pushDebug(`[KERNEL] IDB Connection Closed (Nonce: ${shareTargetNonce})`);
          };
          transaction.onerror = () => {
            db.close();
          };
        } catch (e) {
          db.close();
          console.error("IDB Pull Error", e);
        }
      };
    }
  }, [shareTargetNonce]);

  // Memory Management: Revoke all blob URLs on unmount
  useEffect(() => {
    return () => {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Cleaning up ${blobUrlsRef.current.length} blob URLs`);
      blobUrlsRef.current.forEach(url => {
        try { URL.revokeObjectURL(url); } catch (e) {}
      });
      blobUrlsRef.current = [];
    };
  }, []);



  const isAtLimit = !subStatus.isPro && subStatus.usage >= subStatus.limit;
  const activeCategory = categories.find(c => c.id === selectedCategoryId);
  const keyFieldId = activeCategory?.fields.find(f => f.type === 'key')?.id || '';
  const currentKeyValue = formData[keyFieldId] || '';
  const filteredSuggestions = productNames.filter(pn => pn.categoryId === selectedCategoryId && pn.name.toLowerCase().includes(currentKeyValue.toLowerCase())).slice(0, 5);
  const isNewValue = currentKeyValue && !productNames.some(pn => pn.categoryId === selectedCategoryId && pn.name.toLowerCase() === currentKeyValue.toLowerCase());

  const handleExtensionSnap = async () => {
    setIsExtracting(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:') || tab.url?.startsWith('https://chrome.google.com/webstore')) {
              alert("TRANG WEB BỊ CHẶN: Trình duyệt không cho phép Extension truy cập vào các trang hệ thống. Vui lòng sử dụng tính năng này trên các trang web mua sắm.");
              return;
            }
          try {
            await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
          } catch (e: any) {
            alert("LỖI CẤP QUYỀN HOẶC TRANG CHƯA TẢI: " + (e.message || "Vui lòng tải lại (F5) trang web và thử lại."));
            return;
          }
          chrome.tabs.sendMessage(tab.id, { action: "extract" }, (response) => {
            if (chrome.runtime.lastError) {
              alert("LỖI KẾT NỐI: Không thể liên lạc với trang web. Vui lòng F5 trang web bạn muốn lấy ảnh và thử lại.");
              setIsExtracting(false);
              return;
            }
            if (response) {
              const { images: extImgs, metadata, url } = response;
              if (extImgs?.length > 0) { setExtractedImages(extImgs); setShowPicker(true); }
              else alert(t('noImagesFound'));
              if (selectedCategoryId) {
                const cat = categories.find(c => c.id === selectedCategoryId);
                if (cat) {
                  setFormData(prev => {
                    const next = { ...prev };
                    cat.fields.forEach(f => {
                      const label = translate(f.label, lang).toLowerCase();
                      if (f.type === 'url' && !next[f.id]) next[f.id] = url;
                      if (metadata.t && !next[f.id] && (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title'))) next[f.id] = metadata.t;
                      if (metadata.p && !next[f.id] && (f.type === 'number' || label.includes('giá') || label.includes('price'))) {
                        const m = (metadata.p as string).match(/[\d.]+/);
                        next[f.id] = m ? m[0] : metadata.p;
                      }
                      if (metadata.d && !next[f.id] && (label.includes('mô tả') || label.includes('description') || label.includes('desc'))) next[f.id] = metadata.d;
                    });
                    return next;
                  });
                }
              }
            }
          });
        }
      } else {
        alert(t('noActiveTab'));
      }
    } catch (e) {
      alert(t('noActiveTab'));
    } finally {
      setIsExtracting(false);
    }
  };

  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Target max 1600px width/height for Staff flow to stay under 4.5MB
        const MAX_SIZE = 1600;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Use 0.7 quality to significantly reduce file size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!selectedCategoryId || !formData[keyFieldId] || images.length === 0) return;
    setIsSaving(true);
    try {
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Preparing to save ${images.length} images...`);
      
      const isStaff = subStatus.userEmail?.endsWith('@staff.imagesnap');

      // Convert all blob URLs to Base64 to ensure server-side saving works
      const processedImages = await Promise.all(images.map(async (img) => {
        let base64 = img;
        if (img.startsWith('blob:')) {
          try {
            const res = await fetch(img);
            const blob = await res.blob();
            base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (e) {
            console.error("Blob conversion failed", e);
          }
        }
        
        // Compress for Staff users to stay under Vercel payload limit
        if (isStaff && base64.startsWith('data:')) {
          return await compressImage(base64);
        }
        return base64;
      }));

      await onSave({ categoryId: selectedCategoryId, name: formData[keyFieldId], tags: [], data: { ...formData } }, processedImages);
      
      // Cleanup local images and keep data for next snap if needed
      setImages([]);
      const keptData: Record<string, any> = {};
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        cat.fields.forEach(f => {
          if ((f.type === 'select' || f.type === 'date') && formData[f.id]) {
            keptData[f.id] = formData[f.id];
          }
        });
      }
      setFormData(keptData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 p-4 flex flex-col gap-5">
      <div className="flex justify-end items-center">
        <button onClick={onSwitchToHelp} className="text-[10px] bg-accent/10 text-accent font-black px-2.5 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all tracking-widest uppercase">
          Help Guide
        </button>
      </div>

      {isAtLimit && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex flex-col gap-2">
          <p className="text-xs text-yellow-500 font-bold leading-tight">⚠️ {t('limitReachedMsg') || 'You have reached the free limit. Upgrade to PRO for unlimited snaps!'}</p>
          <button onClick={onUpgrade} className="text-[11px] bg-yellow-500 text-bg px-3 py-1.5 rounded-lg font-black uppercase w-fit">Upgrade Now</button>
        </div>
      )}

      {/* Action Row */}
      <div className="grid grid-cols-4 gap-2">
        {typeof chrome !== 'undefined' && chrome.tabs && (
          <button onClick={handleExtensionSnap} disabled={isExtracting || isAtLimit}
            className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all h-20 ${isAtLimit ? 'opacity-30 cursor-not-allowed grayscale' : 'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10 shadow-[0_0_15px_rgba(212,255,0,0.1)]'} active:scale-95`}
          >
            {isExtracting ? <RefreshCw size={18} className="animate-spin" /> : <GlobeIcon size={18} />}
            <span className="text-[10px] font-black tracking-tighter uppercase leading-tight text-center">{t('snapFromBrowser')}</span>
          </button>
        )}

        <BurstCamera imageCount={images.length} onPhotoTaken={dataUrl => setImages(prev => [...prev, dataUrl])} />

        <label htmlFor="file-gallery" className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer h-20">
          <ImagesIcon size={18} />
          <span className="text-[10px] font-black tracking-tighter uppercase">GALLERY</span>
          <input type="file" accept="image/*" multiple className="hidden" id="file-gallery"
            onChange={e => Array.from(e.target.files ?? new FileList()).forEach((file: File) => {
              const reader = new FileReader();
              reader.onload = re => { if (typeof re.target?.result === 'string') setImages(prev => [...prev, re.target!.result as string]); };
              reader.readAsDataURL(file);
            })}
          />
        </label>

        <label htmlFor="file-native" className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer h-20">
          <Camera size={18} className="stroke-[2.5]" />
          <span className="text-[10px] font-black tracking-tighter uppercase text-center leading-tight">APP CAMERA</span>
          <input type="file" accept="image/*" capture="environment" multiple className="hidden" id="file-native"
            onChange={e => Array.from(e.target.files ?? new FileList()).forEach((file: File) => {
              const reader = new FileReader();
              reader.onload = re => { if (typeof re.target?.result === 'string') setImages(prev => [...prev, re.target!.result as string]); };
              reader.readAsDataURL(file);
            })}
          />
        </label>
      </div>

      <ImagePicker isOpen={showPicker} extractedImages={extractedImages}
        onConfirm={urls => setImages(prev => [...new Set([...prev, ...urls])])}
        onClose={() => setShowPicker(false)}
      />

      {/* Image Strip */}
      {images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <div key={i} className="relative flex-none w-20 aspect-square rounded-lg overflow-hidden border border-line bg-white/5">
              {img.startsWith('blob:') ? (
                <img src={img} className="w-full h-full object-cover" alt="Imported" />
              ) : (
                <DriveImage url={img} className="w-full h-full object-cover" />
              )}
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 z-10">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <label className="label-meta">Select Category</label>
            <button onClick={() => setShowQuickAdd(true)} className="flex items-center gap-1 text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all">
              <Plus size={12} /> NEW
            </button>
          </div>
          <input type="text" placeholder={lang === 'en' ? 'Search...' : 'Tìm kiếm...'} value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-card border-2 border-line rounded-xl px-4 py-2 text-sm w-36 focus:border-accent outline-none font-bold"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
          {categories
            .filter(cat => translate(cat.name, lang).toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
              const ai = recentCatIds.indexOf(a.id), bi = recentCatIds.indexOf(b.id);
              if (ai !== -1 && bi !== -1) return ai - bi;
              if (ai !== -1) return -1; if (bi !== -1) return 1; return 0;
            })
            .map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${selectedCategoryId === cat.id ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_10px_rgba(212,255,0,0.1)]' : 'border-line bg-card text-muted opacity-80'}`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className="text-[12px] uppercase tracking-tight truncate font-bold">{translate(cat.name, lang)}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Dynamic Form */}
      {activeCategory && (
        <div  className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4">
            {[...activeCategory.fields].sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0)).map(field => (
              <div key={field.id} className={`flex flex-col gap-1.5 ${field.type === 'key' ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : ''}`}>
                <label className="label-meta flex items-center gap-1.5">
                  {translate(field.label, lang)} {field.required && '*'}
                  {field.type === 'url' && <LinkIcon size={10} className="text-muted" />}
                  {field.type === 'date' && <Calendar size={10} className="text-muted" />}
                </label>
                {field.type === 'select' ? (
                  <select className="input text-xs" value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}>
                    <option value="">Select...</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <div className="relative">
                    <div className="relative flex items-center group">
                      <input
                        type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                        className={`input text-xs w-full ${field.type === 'key' ? 'pl-9 border-accent font-bold uppercase !py-3' : (field.type === 'date' || field.type === 'url') ? 'pl-10' : 'pl-4'}`}
                        value={formData[field.id] || ''}
                        onFocus={() => field.type === 'key' && setKeySearchFocus(field.id)}
                        onBlur={() => setTimeout(() => setKeySearchFocus(null), 200)}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        placeholder={field.type === 'key' ? 'SEARCH OR ENTER NEW VALUE...' : ''}
                      />
                      {field.type === 'key' && <Search className="absolute left-3 text-muted group-focus-within:text-accent" size={14} />}
                      {field.type === 'url' && <LinkIcon className="absolute left-3 text-muted" size={14} />}
                      {field.type === 'date' && <Calendar className="absolute left-3 text-muted" size={14} />}
                      {field.type === 'key' && isNewValue && (
                        <div className="absolute right-3 flex items-center gap-1.5">
                          <span className="text-[8px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                        </div>
                      )}
                    </div>
                    {field.type === 'key' && keySearchFocus === field.id && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-line rounded-xl shadow-2xl z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                        {filteredSuggestions.map((s, idx) => (
                          <button key={idx} onMouseDown={e => { e.preventDefault(); setFormData({ ...formData, [field.id]: s.name }); setKeySearchFocus(null); }}
                            className="w-full text-left px-4 py-3 text-xs hover:bg-accent/10 flex items-center justify-between border-b border-line last:border-0 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Command size={10} className="text-muted" />
                              <span className="font-medium uppercase">{s.name}</span>
                            </div>
                            <span className="text-[8px] uppercase text-muted font-bold">Existing</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={isSaving || isAtLimit}
            className={`btn btn-primary py-4 flex items-center justify-center gap-3 font-black text-xs tracking-[0.2em] shadow-[4px_4px_0_#000] border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isSaving ? 'opacity-70 animate-pulse' : ''} ${isAtLimit ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            {isAtLimit ? 'LIMIT_REACHED' : t('save')}
          </button>
        </div>
      )}

      {/* Quick Add Category Modal */}
      <div>
        {showQuickAdd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div 
              className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-accent/20 bg-card"
            >
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-tight">Quick Add Category</h3>
                <p className="text-muted text-[10px] font-bold uppercase mt-1">Create a new registry folder</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="label-meta">CATEGORY_NAME</label>
                  <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Shoes, Electronics..." className="input font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label-meta">ICON / EMOJI</label>
                  <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} className="input text-center text-2xl" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowQuickAdd(false)} className="btn btn-secondary flex-1 font-black">CANCEL</button>
                <button onClick={async () => {
                  if (!newCatName || !onSaveCategory) return;
                  const cat: Category = { id: `cat_${Date.now()}`, name: newCatName, icon: newCatIcon, fields: [{ id: `k_${Date.now()}`, label: 'Product ID', type: 'key', required: true }], updatedAt: new Date().toISOString() };
                  await onSaveCategory(cat);
                  setShowQuickAdd(false); setNewCatName(''); setSelectedCategoryId(cat.id);
                }} className="btn btn-primary flex-1 font-black">CREATE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
