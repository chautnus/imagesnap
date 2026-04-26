import React, { useState } from 'react';
import { ChevronRight, Folder, Package, Trash2, Filter, Search, Calendar, User, Tag, X } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { translate } from '@shared/lib/translations';
import { ExternalLink } from 'lucide-react';

const getDriveThumbnail = (url: string) => {
  if (!url || !url.includes('drive.google.com')) return url;
  // Extract file ID from webViewLink
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk
  const match = url.match(/\/d\/(.+?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w600`;
  }
  return url;
};

interface DataTabProps {
  categories: Category[];
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  t: (key: string) => string;
  lang: string;
}

export const DataTab: React.FC<DataTabProps> = ({ categories, products, onDelete, t, lang }) => {
  const [view, setView] = useState<'categories' | 'names' | 'items' | 'search'>('categories');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedProdName, setSelectedProdName] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    categoryId: '',
    author: '',
    tag: ''
  });

  const allFilteredProducts = products.filter(p => !p._deleted).filter(p => {
    // Basic search query (Name, Tags, Author)
    const matchesQuery = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.authorName || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Advanced filters
    const matchesDateFrom = !filters.dateFrom || new Date(p.createdAt) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(p.createdAt) <= new Date(filters.dateTo + 'T23:59:59');
    const matchesCategory = !filters.categoryId || p.categoryId === filters.categoryId;
    const matchesAuthor = !filters.author || (p.authorName || '').toLowerCase().includes(filters.author.toLowerCase());
    const matchesTag = !filters.tag || p.tags.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()));

    return matchesQuery && matchesDateFrom && matchesDateTo && matchesCategory && matchesAuthor && matchesTag;
  });

  const isSearching = searchQuery || filters.dateFrom || filters.dateTo || filters.categoryId || filters.author || filters.tag;

  const renderSearchHeader = () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={16} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="input pl-10 text-sm font-medium"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-lg border transition-all ${showFilters ? 'bg-accent border-accent text-bg' : 'border-line text-muted'}`}
        >
          <Filter size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-4 grid grid-cols-2 gap-4 border-accent/20 bg-accent/5">
              <div className="flex flex-col gap-1.5">
                <label className="label-meta text-[11px]">{t('dateFrom')}</label>
                <input 
                  type="date" 
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="input !py-1.5 !text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-meta text-[11px]">{t('dateTo')}</label>
                <input 
                  type="date" 
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="input !py-1.5 !text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-meta text-[11px]">{t('category')}</label>
                <select 
                  value={filters.categoryId}
                  onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
                  className="input !py-1.5 !text-[10px]"
                >
                  <option value="">All</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{translate(c.name, lang)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-meta text-[11px]">{t('tags')}</label>
                <input 
                  type="text" 
                  value={filters.tag}
                  onChange={(e) => setFilters({...filters, tag: e.target.value})}
                  placeholder="Tag..."
                  className="input !py-1.5 !text-[10px]"
                />
              </div>
              <button 
                onClick={() => setFilters({ dateFrom: '', dateTo: '', categoryId: '', author: '', tag: '' })}
                className="col-span-2 text-[11px] text-accent font-bold uppercase tracking-widest hover:underline text-center mt-1"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProductItem = (item: Product, idx: number) => {
    const cat = categories.find(c => c.id === item.categoryId);
    return (
      <div key={item.id} className="card group hover:border-accent/40 transition-all">
        <div className="flex h-28 relative">
          <div className="w-28 flex-none bg-black overflow-hidden relative">
            {item.images[0] ? (
              <img 
                src={getDriveThumbnail(item.images[0])} 
                className="w-full h-full object-cover transition-all duration-500" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted"><Package size={24} /></div>
            )}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent/90 text-bg text-[10px] font-black rounded uppercase">
              {cat?.icon} {cat && translate(cat.name, lang)}
            </div>
          </div>
          <div 
            onClick={() => setSelectedProduct(item)}
            className="flex-1 p-4 flex flex-col justify-between min-w-0 cursor-pointer hover:bg-accent/5 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-base truncate pr-2">{item.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 bg-white/5 text-muted-foreground uppercase rounded-sm border border-white/5">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end border-t border-line/10 pt-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[12px] font-black flex-none">
                  {item.authorName?.charAt(0) || 'U'}
                </div>
                <span className="text-[12px] text-muted truncate max-w-[100px] font-bold">{item.authorName || 'Unknown'}</span>
              </div>
              <span className="text-[11px] text-muted opacity-50 font-mono whitespace-nowrap font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button 
            onClick={() => onDelete(item.id)}
            className="absolute top-3 right-3 p-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-card/80 rounded-lg border border-line"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (isSearching) {
    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black uppercase tracking-tight">{t('data')}</h2>
          <span className="text-[12px] font-mono text-muted font-bold tracking-widest">{allFilteredProducts.length} ITEMS FOUND</span>
        </div>
        {renderSearchHeader()}
        <div className="grid grid-cols-1 gap-3">
          {allFilteredProducts.map((item, idx) => renderProductItem(item, idx))}
          {allFilteredProducts.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-muted card border-dashed border-2 border-line/50">
              <Search size={48} className="opacity-10 mb-4" />
              <p className="text-[12px] uppercase tracking-[0.3em] font-black">{t('noResults') || 'No matching records'}</p>
            </div>
          )}
        </div>
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
        <h2 className="text-3xl font-black uppercase tracking-tight">{t('data')}</h2>
        {renderSearchHeader()}
        <div className="grid grid-cols-2 gap-3">
          {categories.filter(c => !c._deleted).map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCatId(cat.id); setView('names'); }}
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
        
        <h2 className="text-2xl font-bold">{currentCat && translate(currentCat.name, lang)}</h2>
        {renderSearchHeader()}
        
        <div className="flex flex-col gap-2">
          {prodNames.map(name => {
            const count = catProds.filter(p => p.name === name).length;
            const firstImg = catProds.find(p => p.name === name)?.images[0];
            return (
              <button
                key={name}
                onClick={() => { setSelectedProdName(name); setView('items'); }}
                className="card p-3 flex items-center justify-between hover:border-accent group bg-white/5 border-transparent hover:border-line"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-line">
                    <img src={getDriveThumbnail(firstImg || '')} className="w-full h-full object-cover transition-all" />
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

  if (selectedProduct) {
    const cat = categories.find(c => c.id === selectedProduct.categoryId);
    return (
      <div className="pb-24 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-muted text-[12px] font-black uppercase tracking-[0.2em] mb-2">
          <button onClick={() => setSelectedProduct(null)} className="hover:text-accent flex items-center gap-1">
             <X size={14} /> {t('back')}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{cat?.icon}</span>
              <h2 className="text-3xl font-black tracking-tight uppercase">{selectedProduct.name}</h2>
            </div>
            <div className="label-meta">{cat && translate(cat.name, lang)} • {new Date(selectedProduct.createdAt).toLocaleString()}</div>
          </div>

          <div className="card p-6 flex flex-col gap-6 bg-accent/5 border-accent/20">
            {cat?.fields.map(field => {
              const value = selectedProduct.data[field.id];
              return (
                <div key={field.id} className="flex flex-col gap-1.5 border-b border-line/10 pb-4 last:border-0 last:pb-0">
                  <label className="label-meta text-accent opacity-70">{translate(field.label, lang)}</label>
                  <div className="text-lg font-medium leading-relaxed break-words">
                    {field.type === 'url' ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all font-mono text-sm">
                        {value || '---'}
                      </a>
                    ) : (
                      value || '---'
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="label-meta">Captured Images ({selectedProduct.images.length})</h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedProduct.images.map((img, i) => (
                <a 
                  key={i} 
                  href={img} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aspect-square bg-black rounded-2xl overflow-hidden border-2 border-line hover:border-accent transition-all group relative"
                >
                  <img src={getDriveThumbnail(img)} className="w-full h-full object-cover grayscale-0 transition-all" />
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
  }

  if (view === 'items') {
    const items = allFilteredProducts.filter(p => p.categoryId === selectedCatId && p.name === selectedProdName);
    const currentCat = categories.find(c => c.id === selectedCatId);

    return (
      <div className="pb-24 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-muted text-[12px] font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <button onClick={() => setView('categories')}>DATA</button>
          <ChevronRight size={14} className="flex-none" />
          <button onClick={() => setView('names')}>{currentCat && translate(currentCat.name, lang)}</button>
          <ChevronRight size={14} className="flex-none" />
          <span className="text-accent truncate">{selectedProdName}</span>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black uppercase tracking-tight">{selectedProdName}</h2>
          <span className="text-[10px] font-mono text-muted">[{items.length}]</span>
        </div>
        {renderSearchHeader()}

        <div className="grid grid-cols-1 gap-4">
          {items.map((item, idx) => renderProductItem(item, idx))}
        </div>
      </div>
    );
  }

  return null;
};
