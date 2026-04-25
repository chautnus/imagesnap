import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, ChevronRight, Check, Image as ImagesIcon, Link as LinkIcon, Calendar, Search, Command, Globe as GlobeIcon } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { translate } from '@shared/lib/translations';

export interface ProductMetadata {
  t?: string; // Title
  d?: string; // Description
  p?: string; // Price
  [key: string]: any;
}

interface CaptureTabProps {
  categories: Category[];
  onSave: (product: Partial<Product>, images: string[]) => Promise<void>;
  productNames: { categoryId: string, name: string }[];
  t: (key: string) => string;
  lang: string;
  initialImages?: string[];
  importedUrl?: string;
  importedMetadata?: ProductMetadata;
  onClearInitialImages?: () => void;
  onClearImportedUrl?: () => void;
  onClearImportedMetadata?: () => void;
}

export const CaptureTab: React.FC<CaptureTabProps> = ({ 
  categories, 
  onSave, 
  productNames, 
  t,
  lang,
  initialImages = [],
  importedUrl = '',
  importedMetadata = {} as ProductMetadata,
  onClearInitialImages,
  onClearImportedUrl,
  onClearImportedMetadata
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentCatIds, setRecentCatIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ps_recent_cats');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    return recentCatIds[0] || categories[0]?.id || null;
  });

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
      if (onClearInitialImages) onClearInitialImages();
    }
  }, [initialImages]);

  useEffect(() => {
    if (importedUrl && selectedCategoryId && categories.length > 0) {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        const urlFields = cat.fields.filter(f => f.type === 'url') || [];
        if (urlFields.length > 0) {
          setFormData(prev => {
            const newData = { ...prev };
            urlFields.forEach(f => {
              if (!newData[f.id]) newData[f.id] = importedUrl;
            });
            return newData;
          });
        }
        // Clear only after we've had a chance to apply it to the active category
        if (onClearImportedUrl) onClearImportedUrl();
      }
    }
  }, [importedUrl, selectedCategoryId, categories, onClearImportedUrl]);

  useEffect(() => {
    const { t: importTitle, p: importPrice, d: importDesc } = importedMetadata;
    if ((importTitle || importPrice || importDesc) && selectedCategoryId && categories.length > 0) {
      const cat = categories.find(c => c.id === selectedCategoryId);
      if (cat) {
        setFormData(prev => {
          const newData = { ...prev };
          cat.fields.forEach(f => {
            const label = translate(f.label, lang).toLowerCase();
            
            // Map Title
            if (importTitle && !newData[f.id]) {
              if (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title')) {
                newData[f.id] = importTitle;
              }
            }

            // Map Price
            if (importPrice && !newData[f.id]) {
              if (f.type === 'number' || label.includes('giá') || label.includes('price')) {
                // Try to extract only numbers for price fields
                const priceMatch = importPrice.match(/[\d.]+/);
                newData[f.id] = priceMatch ? priceMatch[0] : importPrice;
              }
            }

            // Map Description
            if (importDesc && !newData[f.id]) {
              if (label.includes('mô tả') || label.includes('description') || label.includes('desc')) {
                newData[f.id] = importDesc;
              }
            }
          });
          return newData;
        });
        if (onClearImportedMetadata) onClearImportedMetadata();
      }
    }
  }, [importedMetadata, selectedCategoryId, categories, lang, onClearImportedMetadata]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUrlInput, setBulkUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySearchFocus, setKeySearchFocus] = useState<string | null>(null);

  const handleExtensionSnap = async () => {
    setIsExtracting(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { action: "extract" }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              alert(t('noActiveTab'));
              return;
            }
            if (response) {
              const { groups, metadata, url } = response;
              const allImgs = [...groups.MAIN, ...groups.OTHERS];
              if (allImgs.length > 0) {
                setImages(prev => [...new Set([...prev, ...allImgs])]);
              } else {
                alert(t('noImagesFound'));
              }
              
              // Apply metadata mapping logic
              if (selectedCategoryId && categories.length > 0) {
                const cat = categories.find(c => c.id === selectedCategoryId);
                if (cat) {
                  setFormData(prev => {
                    const newData = { ...prev };
                    cat.fields.forEach(f => {
                      const label = translate(f.label, lang).toLowerCase();
                      
                      // Map URL
                      if (f.type === 'url' && !newData[f.id]) {
                        newData[f.id] = url;
                      }

                      // Map Title
                      if (metadata.t && !newData[f.id]) {
                        if (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title')) {
                          newData[f.id] = metadata.t;
                        }
                      }

                      // Map Price
                      if (metadata.p && !newData[f.id]) {
                        if (f.type === 'number' || label.includes('giá') || label.includes('price')) {
                          const priceMatch = (metadata.p as string).match(/[\d.]+/);
                          newData[f.id] = priceMatch ? priceMatch[0] : metadata.p;
                        }
                      }

                      // Map Description
                      if (metadata.d && !newData[f.id]) {
                        if (label.includes('mô tả') || label.includes('description') || label.includes('desc')) {
                          newData[f.id] = metadata.d;
                        }
                      }
                    });
                    return newData;
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
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const activeCategory = categories.find(c => c.id === selectedCategoryId);
  const keyFieldId = activeCategory?.fields.find(f => f.type === 'key')?.id || '';
  const currentKeyValue = formData[keyFieldId] || '';

  const filteredSuggestions = productNames
    .filter(pn => pn.categoryId === selectedCategoryId && pn.name.toLowerCase().includes(currentKeyValue.toLowerCase()))
    .slice(0, 5);

  const isNewValue = currentKeyValue && !productNames.some(pn => pn.categoryId === selectedCategoryId && pn.name.toLowerCase() === currentKeyValue.toLowerCase());

  const isKeyEmpty = !formData[keyFieldId];
  const noImages = images.length === 0;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setImages([...images, dataUrl]);
      }
    }
  };

  const handleBulkImport = () => {
    const urls = bulkUrlInput.split('\n').map(u => u.trim()).filter(u => u.startsWith('http'));
    if (urls.length > 0) {
      setImages(prev => [...prev, ...urls]);
      setBulkUrlInput('');
      setShowBulkModal(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategoryId || isKeyEmpty || noImages) return;
    setIsSaving(true);
    try {
      const keyValue = formData[keyFieldId] || '';
      
      const productData = {
        categoryId: selectedCategoryId,
        name: keyValue,
        tags: [],
        data: { ...formData }
      };
      await onSave(productData, images);
      setImages([]);
      setFormData({});
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{t('capture')}</h2>
        <button 
          onClick={() => setShowBulkModal(true)} 
          className="text-[10px] text-accent underline font-bold uppercase"
        >
          {t('bulkImport')}
        </button>
      </div>

      {/* Action Row */}
      <div className="grid grid-cols-4 gap-2">
        {/* Extension Snap (NEW) */}
        {typeof chrome !== 'undefined' && chrome.tabs && (
          <button 
            onClick={handleExtensionSnap}
            disabled={isExtracting}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all bg-accent/5 border-accent/20 text-accent hover:bg-accent/10 shadow-[0_0_15px_rgba(212,255,0,0.1)] active:scale-95`}
          >
            {isExtracting ? <RefreshCw size={20} className="animate-spin" /> : <GlobeIcon size={20} />}
            <span className="text-[8px] font-black tracking-tighter uppercase whitespace-pre-wrap text-center">{t('snapFromBrowser')}</span>
          </button>
        )}

        {/* In-App Camera */}
        <button 
          onClick={startCamera}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${isCameraOpen ? 'bg-accent text-bg border-accent shadow-[0_0_20px_rgba(212,255,0,0.3)]' : 'bg-card border-line text-muted hover:border-accent hover:text-accent'}`}
        >
          <Camera size={20} />
          <span className="text-[8px] font-black tracking-tighter uppercase">LIVE_CAM</span>
        </button>
        
        {/* Gallery */}
        <label 
          htmlFor="file-gallery"
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer"
        >
          <ImagesIcon size={20} />
          <span className="text-[8px] font-black tracking-tighter uppercase">GALLERY</span>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            id="file-gallery"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = Array.from(e.target.files || []);
              files.forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (re: ProgressEvent<FileReader>) => {
                  const result = re.target?.result;
                  if (typeof result === 'string') {
                    setImages(prev => [...prev, result]);
                  }
                };
                reader.readAsDataURL(file);
              });
            }}
          />
        </label>

        {/* Native Camera */}
        <label 
          htmlFor="file-native"
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer"
        >
          <Camera size={20} className="stroke-[3]" />
          <span className="text-[8px] font-black tracking-tighter uppercase whitespace-nowrap">FAST_CAM</span>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            id="file-native"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (re: ProgressEvent<FileReader>) => {
                  const result = re.target?.result;
                  if (typeof result === 'string') {
                    setImages(prev => [...prev, result]);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </div>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <div className="card w-full max-w-sm p-6 flex flex-col gap-4 border-accent/20">
              <h3 className="text-xl font-bold">Bulk URL Import</h3>
              <div className="flex flex-col gap-2">
                <label className="label-meta">{t('pasteUrls')}</label>
                <textarea 
                  value={bulkUrlInput}
                  onChange={(e) => setBulkUrlInput(e.target.value)}
                  placeholder="Paste links here..."
                  className="input min-h-[120px] text-[10px] font-mono"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkModal(false)} className="btn btn-secondary flex-1">
                  Close
                </button>
                <button onClick={handleBulkImport} className="btn btn-primary flex-1">
                  {t('import')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera View Modal/Full */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[150] bg-black flex flex-col"
          >
            <video ref={videoRef} autoPlay playsInline className="w-full flex-1 object-cover" />
            <div className="p-8 pb-12 bg-black/80 flex justify-around items-center">
              <button onClick={stopCamera} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
                <X size={24} />
              </button>
              <button 
                onClick={takePhoto}
                className="w-20 h-20 bg-white rounded-full border-8 border-accent shadow-2xl active:scale-95 transition-transform"
              />
              <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
                <RefreshCw size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Strip */}
      {images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <div key={i} className="relative flex-none w-20 aspect-square rounded-lg overflow-hidden border border-line">
              <img src={img} className="w-full h-full object-cover" />
              <button 
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="label-meta tracking-widest text-[9px]">Select Category</label>
          <input 
            type="text"
            placeholder={lang === 'en' ? 'Search...' : 'Tìm kiếm...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border border-line rounded-lg px-3 py-1 text-[10px] w-32 focus:border-accent outline-none"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
          {categories
            .filter(cat => {
              const name = translate(cat.name, lang).toLowerCase();
              return name.includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
              const aIdx = recentCatIds.indexOf(a.id);
              const bIdx = recentCatIds.indexOf(b.id);
              if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
              if (aIdx !== -1) return -1;
              if (bIdx !== -1) return 1;
              return 0;
            })
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${selectedCategoryId === cat.id ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_10px_rgba(212,255,0,0.1)]' : 'border-line bg-card text-muted opacity-80'}`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className="text-[10px] uppercase tracking-tight truncate">
                  {translate(cat.name, lang)}
                </span>
                </button>
            ))}
        </div>
      </div>

      {/* Dynamic Form */}
      {activeCategory && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-4">
            {[...activeCategory.fields]
              .sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0))
              .map(field => (
                <div key={field.id} className={`flex flex-col gap-1.5 ${field.type === 'key' ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : ''}`}>
                  <label className="label-meta text-[9px] flex items-center gap-1.5">
                    {translate(field.label, lang)} {field.required && '*'}
                    {field.type === 'key' && <span className="text-[7px] bg-accent text-bg px-1 font-bold rounded uppercase">Identity & Name</span>}
                    {field.type === 'url' && <LinkIcon size={10} className="text-muted" />}
                    {field.type === 'date' && <Calendar size={10} className="text-muted" />}
                  </label>
                  {field.type === 'select' ? (
                    <select 
                      className="input text-xs"
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    >
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
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          placeholder={field.type === 'key' ? 'SEARCH OR ENTER NEW KEY...' : ''}
                        />
                        
                        {/* Dynamic Icons based on type */}
                        {field.type === 'key' && (
                          <Search className="absolute left-3 text-muted group-focus-within:text-accent" size={14} />
                        )}
                        {field.type === 'url' && (
                          <LinkIcon className="absolute left-3 text-muted" size={14} />
                        )}
                        {field.type === 'date' && (
                          <Calendar className="absolute left-3 text-muted" size={14} />
                        )}

                        {field.type === 'key' && isNewValue && (
                          <div className="absolute right-3 flex items-center gap-1.5">
                            <span className="text-[8px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                            <button 
                              onClick={() => {}} 
                              className="text-[10px] bg-accent text-bg px-2 py-0.5 rounded font-black hover:scale-105 transition-transform"
                            >
                              ADD
                            </button>
                          </div>
                        )}
                      </div>

                      {field.type === 'key' && keySearchFocus === field.id && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-line rounded-xl shadow-2xl z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                          {filteredSuggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input onBlur before selection
                                setFormData({ ...formData, [field.id]: s.name });
                                setKeySearchFocus(null);
                              }}
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

          <button 
            onClick={handleSave}
            disabled={isSaving || images.length === 0 || !formData[activeCategory.fields.find(f => f.type === 'key')?.id || '']}
            className="btn btn-primary mt-4 py-4 flex items-center justify-center gap-2 text-lg"
          >
            {isSaving ? <RefreshCw className="animate-spin" /> : <span>Save Item</span>}
          </button>
        </motion.div>
      )}
    </div>
  );
};
