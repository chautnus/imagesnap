"use client";

import React from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
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
  <div className="pb-24 p-5 flex flex-col gap-6">
    <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent transition-colors w-fit">
      <ChevronLeft size={16} /> {t('back')}
    </button>

    {/* Header */}
    <div className="flex items-center gap-3">
      <span className="text-4xl">{category?.icon}</span>
      <div>
        <h2 className="text-2xl font-bold text-ink">{product.name}</h2>
        <p className="text-sm text-muted mt-0.5">
          {category && translate(category.name, lang)} · {new Date(product.createdAt).toLocaleString()}
        </p>
      </div>
    </div>

    {/* Fields */}
    <div className="card p-5 flex flex-col gap-4">
      {category?.fields.map(field => {
        const value = product.data[field.id];
        return (
          <div key={field.id} className="flex flex-col gap-1 pb-4 border-b border-line last:border-0 last:pb-0">
            <label className="label-meta text-accent">{translate(field.label, lang)}</label>
            <div className="text-base font-medium text-ink leading-relaxed break-words">
              {field.type === 'url' ? (
                <a href={value} target="_blank" rel="noopener noreferrer"
                  className="text-accent underline break-all text-sm flex items-center gap-1 w-fit">
                  {value || '---'} <ExternalLink size={12} />
                </a>
              ) : (value || <span className="text-muted">---</span>)}
            </div>
          </div>
        );
      })}
    </div>

    {/* Images */}
    <div className="flex flex-col gap-3">
      <h3 className="label-meta">Images ({product.images.length})</h3>
      <div className="grid grid-cols-2 gap-3">
        {product.images.map((img, i) => (
          <a key={i} href={img} target="_blank" rel="noopener noreferrer"
            className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-line hover:border-accent hover:shadow-md transition-all group relative"
          >
            <DriveImage url={img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-2xl">
              <span className="text-[12px] font-semibold text-white flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full">
                <ExternalLink size={13} /> Open Drive
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);
