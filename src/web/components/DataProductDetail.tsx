"use client";

import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';
import { DriveImage } from './DriveImage';

interface DataProductDetailProps {
  product: Product;
  category: Category | undefined;
  lang: string;
  t: (key: string) => string;
  onBack: () => void;
}

export const DataProductDetail: React.FC<DataProductDetailProps> = ({ product, category, lang, t, onBack }) => (
  <div className="pb-24 p-6 flex flex-col gap-8">
    <div className="flex items-center gap-3 text-muted text-[12px] font-black uppercase tracking-[0.2em] mb-2">
      <button onClick={onBack} className="hover:text-accent flex items-center gap-1">
        <X size={14} /> {t('back')}
      </button>
    </div>

    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category?.icon}</span>
          <h2 className="text-3xl font-black tracking-tight uppercase">{product.name}</h2>
        </div>
        <div className="label-meta">
          {category && translate(category.name, lang)} • {new Date(product.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="card p-6 flex flex-col gap-6 bg-accent/5 border-accent/20">
        {category?.fields.map(field => {
          const value = product.data[field.id];
          return (
            <div key={field.id} className="flex flex-col gap-1.5 border-b border-line/10 pb-4 last:border-0 last:pb-0">
              <label className="label-meta text-accent opacity-70">{translate(field.label, lang)}</label>
              <div className="text-lg font-medium leading-relaxed break-words">
                {field.type === 'url' ? (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all font-mono text-sm">
                    {value || '---'}
                  </a>
                ) : (value || '---')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="label-meta">Captured Images ({product.images.length})</h3>
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer"
              className="aspect-square bg-black rounded-2xl overflow-hidden border-2 border-line hover:border-accent transition-all group relative"
            >
              <DriveImage url={img} className="w-full h-full object-cover transition-all" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <span className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <ExternalLink size={14} /> Open Drive
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);
