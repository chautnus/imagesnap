"use client";

import React, { useState } from 'react';
import { ChevronRight, Search, LayoutGrid, List } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';
import { DriveImage } from './DriveImage';
import { DataSearchBar } from './DataSearchBar';
import { DataProductCard } from './DataProductCard';
import { DataProductDetail } from './DataProductDetail';

interface DataTabProps {
  categories: Category[];
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  t: (key: string) => string;
  lang: string;
  subStatus?: any;
}

type ViewLayout = 'list' | 'grid';

export const DataTab: React.FC<DataTabProps> = ({ categories, products, onDelete, t, lang, subStatus }) => {
  const [view, setView] = useState<'categories' | 'names' | 'items' | 'search'>('categories');
  const isAdmin = subStatus?.isAdmin || subStatus?.role === 'admin';
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedProdName, setSelectedProdName] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [layout, setLayout] = useState<ViewLayout>(() =>
    (localStorage.getItem('data_layout') as ViewLayout) || 'list'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', categoryId: '', author: '', tag: '' });

  const allFilteredProducts = products.filter(p => !p._deleted).filter(p => {
    const matchesQuery = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.authorName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || new Date(p.createdAt) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(p.createdAt) <= new Date(filters.dateTo + 'T23:59:59');
    const matchesCategory = !filters.categoryId || p.categoryId === filters.categoryId;
    const matchesAuthor = !filters.author || (p.authorName || '').toLowerCase().includes(filters.author.toLowerCase());
    const matchesTag = !filters.tag || p.tags.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()));
    return matchesQuery && matchesDateFrom && matchesDateTo && matchesCategory && matchesAuthor && matchesTag;
  });

  const isSearching = searchQuery || filters.dateFrom || filters.dateTo || filters.categoryId || filters.author || filters.tag;

  const toggleLayout = () => {
    const next: ViewLayout = layout === 'list' ? 'grid' : 'list';
    setLayout(next);
    localStorage.setItem('data_layout', next);
  };

  const searchBarProps = { searchQuery, setSearchQuery, showFilters, setShowFilters, filters, setFilters, categories, t, lang };

  const LayoutToggle = () => (
    <button onClick={toggleLayout}
      className="p-2.5 rounded-lg border border-line text-muted hover:text-accent hover:border-accent transition-all"
      title={layout === 'list' ? 'Switch to grid' : 'Switch to list'}
    >
      {layout === 'list' ? <LayoutGrid size={18} /> : <List size={18} />}
    </button>
  );

  if (selectedProduct) {
    const cat = categories.find(c => c.id === selectedProduct.categoryId);
    return <DataProductDetail product={selectedProduct} category={cat} lang={lang} t={t} onBack={() => setSelectedProduct(null)} />;
  }

  const productGrid = (items: Product[]) => (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'}>
      {items.map((item) => (
        <DataProductCard key={item.id} item={item} categories={categories} lang={lang}
          isAdmin={isAdmin} onDelete={onDelete} onClick={setSelectedProduct} layout={layout} />
      ))}
    </div>
  );

  if (isSearching) {
    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          {!isAdmin && <span className="px-2 py-1 bg-accent/10 text-accent rounded text-[10px] font-black">VIEW ONLY</span>}
          <span className="text-[12px] font-mono text-muted font-bold tracking-widest uppercase">{allFilteredProducts.length} ITEMS FOUND</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><DataSearchBar {...searchBarProps} /></div>
          <LayoutToggle />
        </div>
        {productGrid(allFilteredProducts)}
        {allFilteredProducts.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-muted card border-dashed border-2 border-line/50">
            <Search size={48} className="opacity-10 mb-4" />
            <p className="text-[12px] uppercase tracking-[0.3em] font-black">{t('noResults') || 'No matching records'}</p>
          </div>
        )}
      </div>
    );
  }

  if (view === 'categories') {
    const categoryCounts = allFilteredProducts.reduce((acc, p) => {
      acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        {!isAdmin && <span className="px-2 py-1 bg-accent/10 text-accent rounded text-[10px] font-black w-fit">VIEW ONLY</span>}
        <DataSearchBar {...searchBarProps} />
        <div className="grid grid-cols-2 gap-3">
          {categories.filter(c => !c._deleted).map((cat) => (
            <button key={cat.id}
              onClick={() => { setSelectedCatId(cat.id); setView('items'); setSelectedProdName(null); }}
              className="card p-4 flex flex-col items-center gap-3 text-center group hover:border-accent transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-accent/5 flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                {cat.icon}
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">{translate(cat.name, lang)}</div>
                <div className="text-[9px] text-muted font-mono mt-1">{categoryCounts[cat.id] || 0} ITEMS</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'names') {
    const catProds = allFilteredProducts.filter(p => p.categoryId === selectedCatId);
    const prodNames = Array.from(new Set(catProds.map(p => p.name)));
    const currentCat = categories.find(c => c.id === selectedCatId);

    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest">
          <button onClick={() => setView('categories')}>DATA</button>
          <ChevronRight size={12} />
          <span className="text-accent">{currentCat && translate(currentCat.name, lang)}</span>
        </div>
        <DataSearchBar {...searchBarProps} />
        <div className="flex flex-col gap-2">
          {prodNames.map(name => {
            const count = catProds.filter(p => p.name === name).length;
            const firstImg = catProds.find(p => p.name === name)?.images[0];
            return (
              <button key={name}
                onClick={() => { setSelectedProdName(name); setView('items'); }}
                className="card p-3 flex items-center justify-between hover:border-accent hover:shadow-md group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-line">
                    <DriveImage url={firstImg || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-base text-left">{name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted font-mono">[{count}]</span>
                  <ChevronRight size={16} className="text-muted group-hover:text-accent" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'items') {
    const items = allFilteredProducts.filter(p =>
      p.categoryId === selectedCatId && (!selectedProdName || p.name === selectedProdName)
    );
    const currentCat = categories.find(c => c.id === selectedCatId);

    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-muted text-[12px] font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <button onClick={() => setView('categories')}>DATA</button>
          <ChevronRight size={14} className="flex-none" />
          <span className="text-accent truncate">{currentCat && translate(currentCat.name, lang)}</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><DataSearchBar {...searchBarProps} /></div>
          <LayoutToggle />
        </div>
        {productGrid(items)}
      </div>
    );
  }

  return null;
};
