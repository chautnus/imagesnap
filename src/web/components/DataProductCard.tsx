"use client";

import React from 'react';
import { Package, Trash2 } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';
import { DriveImage } from './DriveImage';

interface DataProductCardProps {
  item: Product;
  categories: Category[];
  lang: string;
  isAdmin: boolean;
  onDelete: (id: string) => Promise<void>;
  onClick: (item: Product) => void;
  layout?: 'list' | 'grid';
}

export const DataProductCard: React.FC<DataProductCardProps> = ({
  item, categories, lang, isAdmin, onDelete, onClick, layout = 'list'
}) => {
  const cat = categories.find(c => c.id === item.categoryId);

  if (layout === 'grid') {
    return (
      <div
        onClick={() => onClick(item)}
        className="card group hover:border-accent/40 transition-all cursor-pointer flex flex-col overflow-hidden"
      >
        <div className="relative aspect-square bg-black overflow-hidden">
          {item.images[0] ? (
            <DriveImage url={item.images[0]} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted"><Package size={24} /></div>
          )}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-accent/90 text-bg text-[10px] font-black rounded uppercase">
            {cat?.icon} {cat && translate(cat.name, lang)}
          </div>
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="absolute top-1.5 right-1.5 p-1.5 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-card/80 backdrop-blur-md rounded-lg border border-line"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h3 className="font-black text-sm truncate text-white">{item.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted font-mono font-black">{new Date(item.createdAt).toLocaleDateString()}</span>
            <div className="w-5 h-5 rounded bg-accent text-bg flex items-center justify-center text-[9px] font-black">
              {item.authorName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(item)}
      className="card group hover:border-accent/40 transition-all cursor-pointer"
    >
      <div className="flex h-28 relative">
        <div className="w-28 flex-none bg-black overflow-hidden relative">
          {item.images[0] ? (
            <DriveImage url={item.images[0]} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted"><Package size={24} /></div>
          )}
          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent/90 text-bg text-[10px] font-black rounded uppercase">
            {cat?.icon} {cat && translate(cat.name, lang)}
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-black text-base truncate pr-2 text-white mb-1">{item.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent uppercase rounded font-black border border-accent/20">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-end border-t border-line/10 pt-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-accent text-bg flex items-center justify-center text-[10px] font-black flex-none">
                {item.authorName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-[11px] text-white font-bold truncate max-w-[100px]">{item.authorName || 'User'}</span>
            </div>
            <span className="text-[10px] text-muted font-mono whitespace-nowrap font-black">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="absolute top-3 right-3 p-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-card/80 backdrop-blur-md rounded-lg border border-line"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
