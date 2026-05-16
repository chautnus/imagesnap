import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Category } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  recentCatIds: string[];
  onShowQuickAdd: () => void;
  lang: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  recentCatIds,
  onShowQuickAdd,
  lang
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <label className="label-meta">Select Category</label>
          <button onClick={onShowQuickAdd} className="flex items-center gap-1 text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all">
            <Plus size={12} /> NEW
          </button>
        </div>
        <input 
          type="text" 
          placeholder={lang === 'en' ? 'Search...' : 'Tìm kiếm...'} 
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="bg-card border-2 border-line rounded-xl px-4 py-2 text-sm w-36 focus:border-accent outline-none font-bold"
        />
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
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${selectedCategoryId === cat.id ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_10px_rgba(212,255,0,0.1)]' : 'border-line bg-card text-muted opacity-80'}`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="text-[12px] uppercase tracking-tight truncate font-bold">{translate(cat.name, lang)}</span>
            </button>
          ))}
      </div>
    </div>
  );
};
