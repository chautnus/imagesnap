import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Image as ImagesIcon, Link as LinkIcon, Calendar, Search, Command, Globe as GlobeIcon, Save, Plus } from 'lucide-react';
import { Camera } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { motion, AnimatePresence } from 'motion/react';
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
  initialImages?: string[];
  importedUrl?: string;
  importedMetadata?: ProductMetadata;
  onClearInitialImages?: () => void;
  onClearImportedUrl?: () => void;
  onClearImportedMetadata: () => void;
  onSaveCategory?: (cat: Category) => Promise<void>;
  onSwitchToHelp: () => void;
}

export const CaptureTab: React.FC<CaptureTabProps> = ({
  categories, onSave, productNames, t, lang, subStatus, onUpgrade,
  initialImages = [], importedUrl = '', importedMetadata = {} as ProductMetadata,
  onClearInitialImages, onClearImportedUrl, onClearImportedMetadata,
  onSaveCategory, onSwitchToHelp
}) => {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentCatIds, setRecentCatIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ps_recent_cats');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => recentCatIds[0] || categories[0]?.id || null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySearchFocus, setKeySearchFocus] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);

  useEffect(() => {
    if (selectedCategoryId) {
      const newRecent = [selectedCategoryId, ...recentCatIds.filter(id => id !== selectedCategoryId)].slice(0, 5);
      setRecentCatIds(newRecent);
      localStorage.setItem('ps_recent_cats', JSON.stringify(newRecent));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(prev => [...prev, ...initialImages]);
      onClearInitialImages?.();
    }
  }, [initialImages]);

  useEffect(() => {
    if (importedUrl && selectedCategoryId && categories.length > 0) {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        const urlFields = cat.fields.filter(f => f.type === 'url');
        if (urlFields.length > 0) {
          setFormData(prev => {
            const next = { ...prev };
            urlFields.forEach(f => { if (!next[f.id]) next[f.id] = importedUrl; });
            return next;
          });
        }
        onClearImportedUrl?.();
      }
    }
  }, [importedUrl, selectedCategoryId, categories]);

  useEffect(() => {
    const { t: importTitle, p: importPrice, d: importDesc } = importedMetadata;
    if ((importTitle || importPrice || importDesc) && selectedCategoryId && categories.length > 0) {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        setFormData(prev => {
          const next = { ...prev };
          cat.fields.forEach(f => {
            const label = translate(f.label, lang).toLowerCase();
            if (importTitle && !next[f.id] && (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title'))) next[f.id] = importTitle;
            if (importPrice && !next[f.id] && (f.type === 'number' || label.includes('giá') || label.includes('price'))) {
              const m = importPrice.match(/[\d.]+/);
              next[f.id] = m ? m[0] : importPrice;
            }
            if (importDesc && !next[f.id] && (label.includes('mô tả') || label.includes('description') || label.includes('desc'))) next[f.id] = importDesc;
          });
          return next;
        });
        onClearImportedMetadata?.();
      }
    }
  }, [importedMetadata, selectedCategoryId, categories, lang]);

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

  const handleSave = async () => {
    if (!selectedCategoryId || !formData[keyFieldId] || images.length === 0) return;
    setIsSaving(true);
    try {
      await onSave({ categoryId: selectedCategoryId, name: formData[keyFieldId], tags: [], data: { ...formData } }, images);
      setImages([]);
      setFormData({});
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 p-4 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tighter uppercase">{t('capture')}</h2>
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
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${isAtLimit ? 'opacity-30 cursor-not-allowed grayscale' : 'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10 shadow-[0_0_15px_rgba(212,255,0,0.1)]'} active:scale-95`}
          >
            {isExtracting ? <RefreshCw size={20} className="animate-spin" /> : <GlobeIcon size={20} />}
            <span className="text-[10px] font-black tracking-tight uppercase leading-tight text-center">{t('snapFromBrowser')}</span>
          </button>
        )}

        <BurstCamera imageCount={images.length} onPhotoTaken={dataUrl => setImages(prev => [...prev, dataUrl])} />

        <label htmlFor="file-gallery" className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer">
          <ImagesIcon size={20} />
          <span className="text-[11px] font-black tracking-tighter uppercase">GALLERY</span>
          <input type="file" accept="image/*" multiple className="hidden" id="file-gallery"
            onChange={e => Array.from(e.target.files ?? new FileList()).forEach((file: File) => {
              const reader = new FileReader();
              reader.onload = re => { if (typeof re.target?.result === 'string') setImages(prev => [...prev, re.target!.result as string]); };
              reader.readAsDataURL(file);
            })}
          />
        </label>

        <label htmlFor="file-native" className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer">
          <Camera size={20} className="stroke-[3]" />
          <span className="text-[11px] font-black tracking-tighter uppercase text-center leading-tight">APP CAMERA</span>
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
            <div key={i} className="relative flex-none w-20 aspect-square rounded-lg overflow-hidden border border-line">
              <DriveImage url={img} className="w-full h-full object-cover" />
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1">
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
            <label className="label-meta tracking-widest text-[12px]">Select Category</label>
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4">
            {[...activeCategory.fields].sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0)).map(field => (
              <div key={field.id} className={`flex flex-col gap-1.5 ${field.type === 'key' ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : ''}`}>
                <label className="label-meta text-[9px] flex items-center gap-1.5">
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
        </motion.div>
      )}

      {/* Quick Add Category Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
