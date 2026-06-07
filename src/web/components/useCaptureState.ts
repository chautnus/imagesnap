import { useState, useEffect, useRef } from 'react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';
import { ExtractedImage } from './ImagePicker';

export interface ProductMetadata {
  t?: string;
  d?: string;
  p?: string;
  [key: string]: any;
}

interface UseCaptureStateProps {
  categories: Category[];
  productNames: { categoryId: string; name: string }[];
  lang: string;
  subStatus: { isPro: boolean; limit: number; usage: number; userEmail?: string; isAdmin?: boolean };
  shareTargetNonce: number;
  onSave: (product: Partial<Product>, images: string[]) => Promise<void>;
  onSaveCategory?: (cat: Category) => Promise<void>;
  t: (key: string) => string;
}

export function useCaptureState({
  categories, productNames, lang, subStatus, shareTargetNonce, onSave, onSaveCategory, t
}: UseCaptureStateProps) {
  const [images, setImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentCatIds, setRecentCatIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('ps_recent_cats');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    () => recentCatIds[0] || categories[0]?.id || null
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [keySearchFocus, setKeySearchFocus] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const blobUrlsRef = useRef<string[]>([]);

  // Sync recent categories to localStorage
  useEffect(() => {
    if (selectedCategoryId) {
      const newRecent = [selectedCategoryId, ...recentCatIds.filter(id => id !== selectedCategoryId)].slice(0, 5);
      setRecentCatIds(newRecent);
      localStorage.setItem('ps_recent_cats', JSON.stringify(newRecent));
    }
  }, [selectedCategoryId]);

  // Pull shared data from IndexedDB (PWA share target)
  useEffect(() => {
    if (shareTargetNonce <= 0) return;
    if ((window as any)._pushDebug) (window as any)._pushDebug(`[UI] Pulling Shared Data (Nonce: ${shareTargetNonce})...`);

    const request = indexedDB.open('imagesnap-pwa-db', 2);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('shares')) db.createObjectStore('shares');
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      try {
        const transaction = db.transaction('shares', 'readwrite');
        const store = transaction.objectStore('shares');
        const cursorReq = store.openCursor(null, 'prev');
        cursorReq.onsuccess = (e: any) => {
          const cursor = e.target.result;
          if (!cursor?.value) return;
          const data = cursor.value;
          if (data.images && Array.isArray(data.images)) {
            const urls = data.images.map((b: Blob) => URL.createObjectURL(b));
            setImages(prev => [...prev, ...urls]);
            blobUrlsRef.current.push(...urls);
          } else if (data.image) {
            const url = URL.createObjectURL(data.image);
            setImages(prev => [...prev, url]);
            blobUrlsRef.current.push(url);
          }
          setFormData(prev => {
            const next = { ...prev };
            const cat = categories.find(c => c.id === selectedCategoryId);
            if (cat) {
              cat.fields.forEach(f => {
                const label = translate(f.label, lang).toLowerCase();
                if (data.title && !next[f.id] && (f.type === 'key' || label.includes('tên') || label.includes('name') || label.includes('title'))) next[f.id] = data.title;
                if (data.url && !next[f.id] && f.type === 'url') next[f.id] = data.url;
                if (data.text && !next[f.id] && (label.includes('mô tả') || label.includes('description'))) next[f.id] = data.text;
              });
            }
            return next;
          });
          store.delete(cursor.key);
        };
        transaction.oncomplete = () => { db.close(); };
        transaction.onerror = () => { db.close(); };
      } catch (e) { db.close(); console.error('IDB Pull Error', e); }
    };
  }, [shareTargetNonce]);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => { try { URL.revokeObjectURL(url); } catch {} });
      blobUrlsRef.current = [];
    };
  }, []);

  const isAtLimit = !subStatus.isPro && subStatus.usage >= subStatus.limit;
  const activeCategory = categories.find(c => c.id === selectedCategoryId);
  const keyFieldId = activeCategory?.fields.find(f => f.type === 'key')?.id || '';
  const currentKeyValue = formData[keyFieldId] || '';
  const filteredSuggestions = productNames
    .filter(pn => pn.categoryId === selectedCategoryId && pn.name && String(pn.name).toLowerCase().includes(String(currentKeyValue).toLowerCase()))
    .slice(0, 5);
  const isNewValue = !!currentKeyValue && !productNames.some(
    pn => pn.categoryId === selectedCategoryId && pn.name && String(pn.name).toLowerCase() === String(currentKeyValue).toLowerCase()
  );

  const handleExtensionSnap = async () => {
    setIsExtracting(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:') || tab.url?.startsWith('https://chrome.google.com/webstore')) {
            alert('TRANG WEB BỊ CHẶN: Trình duyệt không cho phép Extension truy cập vào các trang hệ thống.');
            return;
          }
          try {
            await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
          } catch (e: any) {
            alert('LỖI CẤP QUYỀN: ' + (e.message || 'Vui lòng tải lại (F5) trang web và thử lại.'));
            return;
          }
          chrome.tabs.sendMessage(tab.id, { action: 'extract' }, (response) => {
            if (chrome.runtime.lastError) { alert('LỖI KẾT NỐI: Vui lòng F5 trang web và thử lại.'); setIsExtracting(false); return; }
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
      } else { alert(t('noActiveTab')); }
    } catch { alert(t('noActiveTab')); }
    finally { setIsExtracting(false); }
  };

  const compressImage = async (dataUrl: string): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX = 1600;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });

  const handleSave = async () => {
    if (isSaving || !selectedCategoryId || !formData[keyFieldId] || images.length === 0) return;
    setIsSaving(true);
    try {
      const isStaff = subStatus.userEmail?.endsWith('@staff.imagesnap');
      const processedImages = await Promise.all(images.map(async (img) => {
        let base64 = img;
        if (img.startsWith('blob:')) {
          try {
            const blob = await fetch(img).then(r => r.blob());
            base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (e) { console.error('Blob conversion failed', e); }
        }
        if (isStaff && base64.startsWith('data:')) return await compressImage(base64);
        return base64;
      }));
      await onSave({ categoryId: selectedCategoryId, name: formData[keyFieldId], tags: [], data: { ...formData } }, processedImages);
      setImages([]);
      const keptData: Record<string, any> = {};
      activeCategory?.fields.forEach(f => {
        if ((f.type === 'select' || f.type === 'date') && formData[f.id]) keptData[f.id] = formData[f.id];
      });
      setFormData(keptData);
    } finally { setIsSaving(false); }
  };

  const handleQuickAddCategory = async () => {
    if (!newCatName || !onSaveCategory) return;
    const cat: Category = {
      id: `cat_${Date.now()}`, name: newCatName, icon: newCatIcon,
      fields: [{ id: `k_${Date.now()}`, label: 'Product ID', type: 'key', required: true }],
      updatedAt: new Date().toISOString()
    };
    await onSaveCategory(cat);
    setShowQuickAdd(false); setNewCatName(''); setSelectedCategoryId(cat.id);
  };

  return {
    images, setImages, blobUrlsRef,
    searchTerm, setSearchTerm,
    recentCatIds, selectedCategoryId, setSelectedCategoryId,
    showQuickAdd, setShowQuickAdd, newCatName, setNewCatName, newCatIcon, setNewCatIcon,
    formData, setFormData, isSaving, isExtracting,
    keySearchFocus, setKeySearchFocus,
    showPicker, setShowPicker, extractedImages,
    isAtLimit, activeCategory, keyFieldId, currentKeyValue, filteredSuggestions, isNewValue,
    handleExtensionSnap, handleSave, handleQuickAddCategory,
  };
}
