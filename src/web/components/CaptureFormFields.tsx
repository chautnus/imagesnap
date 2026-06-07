"use client";

import React from 'react';
import { LinkIcon, Calendar, Search, Command } from 'lucide-react';
import { Category } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface CaptureFormFieldsProps {
  activeCategory: Category;
  formData: Record<string, any>;
  setFormData: (d: Record<string, any>) => void;
  keySearchFocus: string | null;
  setKeySearchFocus: (id: string | null) => void;
  filteredSuggestions: { categoryId: string; name: string }[];
  isNewValue: boolean;
  lang: string;
  t: (key: string) => string;
}

export const CaptureFormFields: React.FC<CaptureFormFieldsProps> = ({
  activeCategory, formData, setFormData,
  keySearchFocus, setKeySearchFocus,
  filteredSuggestions, isNewValue, lang, t
}) => (
  <div className="grid grid-cols-1 gap-4">
    {[...activeCategory.fields]
      .sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0))
      .map(field => (
        <div key={field.id}
          className={`flex flex-col gap-1.5 ${field.type === 'key' ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : ''}`}
        >
          <label className="label-meta flex items-center gap-1.5">
            {translate(field.label, lang)} {field.required && <span className="text-red-400">*</span>}
            {field.type === 'url' && <LinkIcon size={10} className="text-muted" />}
            {field.type === 'date' && <Calendar size={10} className="text-muted" />}
          </label>

          {field.type === 'select' ? (
            <select className="input" value={formData[field.id] || ''}
              onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}>
              <option value="">Select…</option>
              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <div className="relative">
              <div className="relative flex items-center group">
                <input
                  type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                  className={`input w-full ${field.type === 'key' ? 'pl-9 border-accent font-semibold' : (field.type === 'date' || field.type === 'url') ? 'pl-10' : ''}`}
                  value={formData[field.id] || ''}
                  onFocus={() => field.type === 'key' && setKeySearchFocus(field.id)}
                  onBlur={() => setTimeout(() => setKeySearchFocus(null), 200)}
                  onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                  placeholder={field.type === 'key' ? 'Search or enter new value…' : ''}
                />
                {field.type === 'key' && <Search className="absolute left-3 text-muted group-focus-within:text-accent transition-colors" size={14} />}
                {field.type === 'url' && <LinkIcon className="absolute left-3 text-muted" size={14} />}
                {field.type === 'date' && <Calendar className="absolute left-3 text-muted" size={14} />}
                {field.type === 'key' && isNewValue && (
                  <span className="absolute right-3 text-[9px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-semibold">New</span>
                )}
              </div>

              {field.type === 'key' && keySearchFocus === field.id && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-line rounded-xl shadow-lg z-50 overflow-hidden max-h-[220px] flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 bg-bg border-b border-line">
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Suggestions</span>
                    <button onMouseDown={e => { e.preventDefault(); setKeySearchFocus(null); }}
                      className="text-[10px] text-muted hover:text-accent font-semibold transition-colors">
                      Close
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {filteredSuggestions.map((s, idx) => (
                      <button key={idx}
                        onMouseDown={e => { e.preventDefault(); setFormData({ ...formData, [field.id]: s.name }); setKeySearchFocus(null); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/5 flex items-center justify-between border-b border-line last:border-0 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Command size={11} className="text-muted" />
                          <span className="font-medium text-ink">{s.name}</span>
                        </div>
                        <span className="text-[10px] text-muted">Existing</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
  </div>
);
