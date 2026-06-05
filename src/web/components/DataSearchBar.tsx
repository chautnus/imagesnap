"use client";

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Category } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface Filters {
  dateFrom: string;
  dateTo: string;
  categoryId: string;
  author: string;
  tag: string;
}

interface DataSearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories: Category[];
  t: (key: string) => string;
  lang: string;
}

export const DataSearchBar: React.FC<DataSearchBarProps> = ({
  searchQuery, setSearchQuery, showFilters, setShowFilters,
  filters, setFilters, categories, t, lang
}) => (
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

    {showFilters && (
      <div className="card p-4 grid grid-cols-2 gap-4 border-accent/20 bg-accent/5">
        <div className="flex flex-col gap-1.5">
          <label className="label-meta text-[11px]">{t('dateFrom')}</label>
          <input type="date" value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="input !py-1.5 !text-[10px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-meta text-[11px]">{t('dateTo')}</label>
          <input type="date" value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="input !py-1.5 !text-[10px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-meta text-[11px]">{t('category')}</label>
          <select value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            className="input !py-1.5 !text-[10px]">
            <option value="">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{translate(c.name, lang)}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-meta text-[11px]">{t('tags')}</label>
          <input type="text" value={filters.tag} placeholder="Tag..."
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="input !py-1.5 !text-[10px]" />
        </div>
        <button
          onClick={() => setFilters({ dateFrom: '', dateTo: '', categoryId: '', author: '', tag: '' })}
          className="col-span-2 text-[11px] text-accent font-bold uppercase tracking-widest hover:underline text-center mt-1"
        >
          Reset Filters
        </button>
      </div>
    )}
  </div>
);
