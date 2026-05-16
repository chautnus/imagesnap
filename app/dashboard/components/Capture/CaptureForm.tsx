import React from 'react';
import { RefreshCw, Save, Search, Link as LinkIcon, Calendar, Command } from 'lucide-react';
import { Category } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface CaptureFormProps {
  activeCategory: Category;
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  isSaving: boolean;
  isAtLimit: boolean;
  onSave: () => void;
  t: (key: string) => string;
  lang: string;
  suggestions: { categoryId: string; name: string }[];
  keySearchFocus: string | null;
  onKeySearchFocus: (fieldId: string | null) => void;
}

export const CaptureForm: React.FC<CaptureFormProps> = ({
  activeCategory,
  formData,
  onFieldChange,
  isSaving,
  isAtLimit,
  onSave,
  t,
  lang,
  suggestions,
  keySearchFocus,
  onKeySearchFocus
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4">
        {[...activeCategory.fields]
          .sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0))
          .map(field => {
            const label = translate(field.label, lang);
            const isKey = field.type === 'key';
            const currentVal = formData[field.id] || '';
            
            return (
              <div key={field.id} className={`flex flex-col gap-1.5 ${isKey ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : ''}`}>
                <label className="label-meta flex items-center gap-1.5">
                  {label} {field.required && '*'}
                  {field.type === 'url' && <LinkIcon size={10} className="text-muted" />}
                  {field.type === 'date' && <Calendar size={10} className="text-muted" />}
                </label>

                {field.type === 'select' ? (
                  <select 
                    className="input text-xs" 
                    value={currentVal} 
                    onChange={e => onFieldChange(field.id, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <div className="relative">
                    <div className="relative flex items-center group">
                      <input
                        type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                        className={`input text-xs w-full ${isKey ? 'pl-9 border-accent font-bold uppercase !py-3' : (field.type === 'date' || field.type === 'url') ? 'pl-10' : 'pl-4'}`}
                        value={currentVal}
                        onFocus={() => isKey && onKeySearchFocus(field.id)}
                        onBlur={() => setTimeout(() => onKeySearchFocus(null), 200)}
                        onChange={e => onFieldChange(field.id, e.target.value)}
                        placeholder={isKey ? 'SEARCH OR ENTER NEW VALUE...' : ''}
                      />
                      {isKey && <Search className="absolute left-3 text-muted group-focus-within:text-accent" size={14} />}
                      {field.type === 'url' && <LinkIcon className="absolute left-3 text-muted" size={14} />}
                      {field.type === 'date' && <Calendar className="absolute left-3 text-muted" size={14} />}
                    </div>

                    {isKey && keySearchFocus === field.id && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-line rounded-xl shadow-2xl z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                        {suggestions.map((s, idx) => (
                          <button 
                            key={idx} 
                            onMouseDown={e => { e.preventDefault(); onFieldChange(field.id, s.name); onKeySearchFocus(null); }}
                            className="w-full text-left px-4 py-3 text-xs hover:bg-accent/10 flex items-center justify-between border-b border-line last:border-0 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Command size={10} className="text-muted" />
                              <span className="font-medium uppercase">{s.name}</span>
                            </div>
                            <span className="text-[8px] uppercase text-muted font-bold">Existing</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      
      <button 
        onClick={onSave} 
        disabled={isSaving || isAtLimit}
        className={`btn btn-primary py-4 flex items-center justify-center gap-3 font-black text-xs tracking-[0.2em] shadow-[4px_4px_0_#000] border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isSaving ? 'opacity-70 animate-pulse' : ''} ${isAtLimit ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
        {isAtLimit ? 'LIMIT_REACHED' : t('save')}
      </button>
    </div>
  );
};
