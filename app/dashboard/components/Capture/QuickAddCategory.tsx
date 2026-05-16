"use client";

import React, { useState } from 'react';
import { Category } from '@shared/lib/types';

interface QuickAddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Category) => Promise<void>;
}

export const QuickAddCategory: React.FC<QuickAddCategoryProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name) return;
    const cat: Category = { 
      id: `cat_${Date.now()}`, 
      name, 
      icon, 
      fields: [{ id: `k_${Date.now()}`, label: 'Product ID', type: 'key', required: true }], 
      updatedAt: new Date().toISOString() 
    };
    await onSave(cat);
    onClose();
    setName('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-accent/20 bg-card">
        <div className="text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight">Quick Add Category</h3>
          <p className="text-muted text-[10px] font-bold uppercase mt-1">Create a new registry folder</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label-meta">CATEGORY_NAME</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Shoes, Electronics..." className="input font-bold" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-meta">ICON / EMOJI</label>
            <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="input text-center text-2xl" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1 font-black">CANCEL</button>
          <button onClick={handleCreate} className="btn btn-primary flex-1 font-black">CREATE</button>
        </div>
      </div>
    </div>
  );
};
