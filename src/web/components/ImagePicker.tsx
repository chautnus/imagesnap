import React, { useState } from 'react';
import { X, ChevronRight, ChevronDown, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ExtractedImage {
  url: string;
  type: string;
  width: number;
  height: number;
  alt: string;
}

interface ImagePickerProps {
  isOpen: boolean;
  extractedImages: ExtractedImage[];
  onConfirm: (urls: string[]) => void;
  onClose: () => void;
}

const GROUP_ORDER = ['LOGO', 'BANNER', 'MAIN', 'OTHERS', 'ICONS'];

export const ImagePicker: React.FC<ImagePickerProps> = ({ isOpen, extractedImages, onConfirm, onClose }) => {
  const [pickerSelection, setPickerSelection] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(['LOGO', 'BANNER', 'OTHERS', 'ICONS']));

  const handleConfirm = () => {
    onConfirm(Array.from(pickerSelection));
    setPickerSelection(new Set());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[200] flex flex-col backdrop-blur-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-bg/50">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black tracking-tighter">IMAGE_PICKER</h3>
              <span className="label-meta text-accent">{extractedImages.length} IMAGES_DISCOVERED</span>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            {GROUP_ORDER.map(groupType => {
              const groupImgs = extractedImages.filter(img => img.type === groupType);
              if (groupImgs.length === 0) return null;
              const isCollapsed = collapsedGroups.has(groupType);
              const allSelected = groupImgs.every(img => pickerSelection.has(img.url));

              return (
                <div key={groupType} className="flex flex-col gap-4">
                  <div
                    className="flex items-center justify-between sticky top-0 bg-bg/80 py-2 z-10 backdrop-blur-sm cursor-pointer hover:bg-white/5 transition-colors px-2 rounded"
                    onClick={() => {
                      const next = new Set(collapsedGroups);
                      if (next.has(groupType)) next.delete(groupType); else next.add(groupType);
                      setCollapsedGroups(next);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? <ChevronRight size={18} className="text-muted" /> : <ChevronDown size={18} className="text-accent" />}
                      <div className={`w-1.5 h-6 ${isCollapsed ? 'bg-muted' : 'bg-accent'}`} />
                      <h4 className={`font-display font-black text-lg tracking-widest ${isCollapsed ? 'opacity-40' : 'opacity-80'}`}>{groupType}</h4>
                      <span className="text-[10px] font-mono text-muted">({groupImgs.length})</span>
                    </div>
                    {!isCollapsed && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const next = new Set(pickerSelection);
                          if (allSelected) groupImgs.forEach(img => next.delete(img.url));
                          else groupImgs.forEach(img => next.add(img.url));
                          setPickerSelection(next);
                        }}
                        className={`text-[10px] font-black tracking-widest px-3 py-1 rounded border transition-all ${allSelected ? 'bg-accent text-bg border-accent' : 'bg-transparent text-accent border-accent/30 hover:bg-accent/10'}`}
                      >
                        {allSelected ? 'UNSELECT ALL' : 'SELECT ALL'}
                      </button>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
                      {groupImgs.map((img, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.02 }}
                          onClick={() => {
                            const next = new Set(pickerSelection);
                            if (next.has(img.url)) next.delete(img.url); else next.add(img.url);
                            setPickerSelection(next);
                          }}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${pickerSelection.has(img.url) ? 'border-accent shadow-[0_0_20px_rgba(212,255,0,0.4)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                        >
                          <img src={img.url} className="w-full h-full object-cover" alt={img.alt} />
                          {pickerSelection.has(img.url) && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center backdrop-blur-[2px]">
                              <div className="w-8 h-8 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg">
                                <Check size={20} strokeWidth={4} />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-[8px] font-mono font-bold text-white/80">{img.width}x{img.height}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-bg border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <button onClick={handleConfirm} disabled={pickerSelection.size === 0}
              className="btn btn-primary w-full py-5 flex items-center justify-center gap-3 font-black text-sm tracking-[0.2em] shadow-[4px_4px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:grayscale disabled:opacity-50"
            >
              <Save size={20} />
              CONFIRM_SELECTION ({pickerSelection.size})
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
