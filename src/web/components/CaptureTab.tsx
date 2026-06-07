"use client";

import React from 'react';
import { RefreshCw, X, Image as ImagesIcon, Globe as GlobeIcon, Save, Plus, Camera } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';
import { DriveImage } from './DriveImage';
import { BurstCamera } from './BurstCamera';
import { ImagePicker } from './ImagePicker';
import { CaptureFormFields } from './CaptureFormFields';
import { CaptureQuickAddModal } from './CaptureQuickAddModal';
import { useCaptureState } from './useCaptureState';

export type { ProductMetadata } from './useCaptureState';

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

export const CaptureTab: React.FC<CaptureTabProps> = (props) => {
  const { categories, t, lang, subStatus, onUpgrade, onSwitchToHelp } = props;

  const state = useCaptureState({ ...props });
  const {
    images, setImages,
    searchTerm, setSearchTerm,
    recentCatIds, selectedCategoryId, setSelectedCategoryId,
    showQuickAdd, setShowQuickAdd, newCatName, setNewCatName, newCatIcon, setNewCatIcon,
    formData, setFormData, isSaving, isExtracting,
    keySearchFocus, setKeySearchFocus,
    showPicker, setShowPicker, extractedImages,
    isAtLimit, activeCategory, filteredSuggestions, isNewValue,
    handleExtensionSnap, handleSave, handleQuickAddCategory,
  } = state;

  return (
    <div className="pb-24 p-4 flex flex-col gap-5">

      {/* Top bar */}
      <div className="flex justify-end">
        <button onClick={onSwitchToHelp}
          className="text-[11px] font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all">
          Help Guide
        </button>
      </div>

      {/* Limit warning */}
      {isAtLimit && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-2">
          <p className="text-sm text-amber-700 font-medium leading-tight">
            ⚠️ {t('limitReachedMsg') || "You've reached the free limit. Upgrade to PRO for unlimited snaps!"}
          </p>
          <button onClick={onUpgrade}
            className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold w-fit">
            Upgrade Now
          </button>
        </div>
      )}

      {/* Capture action buttons */}
      <div className="grid grid-cols-4 gap-2">
        {typeof chrome !== 'undefined' && chrome.tabs && (
          <button onClick={handleExtensionSnap} disabled={isExtracting || isAtLimit}
            className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all h-20 active:scale-95
              ${isAtLimit ? 'opacity-30 cursor-not-allowed grayscale' : 'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10'}`}
          >
            {isExtracting ? <RefreshCw size={18} className="animate-spin" /> : <GlobeIcon size={18} />}
            <span className="text-[10px] font-semibold leading-tight text-center">{t('snapFromBrowser')}</span>
          </button>
        )}

        <BurstCamera imageCount={images.length} onPhotoTaken={dataUrl => setImages(prev => [...prev, dataUrl])} />

        <label htmlFor="file-gallery"
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer h-20">
          <ImagesIcon size={18} />
          <span className="text-[10px] font-semibold">Gallery</span>
          <input type="file" accept="image/*" multiple className="hidden" id="file-gallery"
            onChange={e => Array.from(e.target.files ?? new FileList()).forEach((file: File) => {
              const reader = new FileReader();
              reader.onload = re => { if (typeof re.target?.result === 'string') setImages(prev => [...prev, re.target!.result as string]); };
              reader.readAsDataURL(file);
            })} />
        </label>

        <label htmlFor="file-native"
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 bg-card border-line text-muted hover:border-accent hover:text-accent transition-all cursor-pointer h-20">
          <Camera size={18} strokeWidth={2} />
          <span className="text-[10px] font-semibold text-center leading-tight">Camera</span>
          <input type="file" accept="image/*" capture="environment" multiple className="hidden" id="file-native"
            onChange={e => Array.from(e.target.files ?? new FileList()).forEach((file: File) => {
              const reader = new FileReader();
              reader.onload = re => { if (typeof re.target?.result === 'string') setImages(prev => [...prev, re.target!.result as string]); };
              reader.readAsDataURL(file);
            })} />
        </label>
      </div>

      <ImagePicker isOpen={showPicker} extractedImages={extractedImages}
        onConfirm={urls => setImages(prev => [...new Set([...prev, ...urls])])}
        onClose={() => setShowPicker(false)} />

      {/* Image strip */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <div key={i} className="relative flex-none w-20 aspect-square rounded-xl overflow-hidden border border-line bg-slate-100 shadow-sm">
              {img.startsWith('blob:')
                ? <img src={img} className="w-full h-full object-cover" alt="Preview" />
                : <DriveImage url={img} className="w-full h-full object-cover" />
              }
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-ink/50 text-white rounded-full p-1 z-10 hover:bg-ink/80 transition-colors">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category picker */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="label-meta">Category</label>
            <button onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all">
              <Plus size={11} /> New
            </button>
          </div>
          <input type="text" placeholder="Search…" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-white border border-line rounded-xl px-3 py-1.5 text-sm w-32 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
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
                className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 transition-all text-left
                  ${selectedCategoryId === cat.id
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-line bg-card hover:border-accent/40'}`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className={`text-[13px] truncate font-semibold ${selectedCategoryId === cat.id ? 'text-accent' : 'text-ink'}`}>
                  {translate(cat.name, lang)}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Dynamic form */}
      {activeCategory && (
        <div className="flex flex-col gap-4">
          <CaptureFormFields
            activeCategory={activeCategory}
            formData={formData}
            setFormData={setFormData}
            keySearchFocus={keySearchFocus}
            setKeySearchFocus={setKeySearchFocus}
            filteredSuggestions={filteredSuggestions}
            isNewValue={isNewValue}
            lang={lang}
            t={t}
          />
          <button onClick={handleSave} disabled={isSaving || isAtLimit}
            className={`btn btn-primary py-4 flex items-center justify-center gap-2 text-sm font-semibold
              ${isSaving ? 'opacity-70' : ''} ${isAtLimit ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {isAtLimit ? 'Limit reached' : t('save')}
          </button>
        </div>
      )}

      {/* Quick add modal */}
      {showQuickAdd && (
        <CaptureQuickAddModal
          newCatName={newCatName} setNewCatName={setNewCatName}
          newCatIcon={newCatIcon} setNewCatIcon={setNewCatIcon}
          onCancel={() => setShowQuickAdd(false)}
          onCreate={handleQuickAddCategory}
        />
      )}
    </div>
  );
};
