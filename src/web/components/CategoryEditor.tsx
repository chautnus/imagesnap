import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, ExternalLink, RefreshCw } from 'lucide-react';
import { Category, FieldDefinition } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

const TableProperties = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 3h15c.8 0 1.5.7 1.5 1.5v15c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5v-15C3 3.7 3.7 3 4.5 3Z"/>
    <path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
  </svg>
);

interface CategoryEditorProps {
  categories: Category[];
  spreadsheetId: string | null;
  onSaveCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  lang: string;
  t: (key: string) => string;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  categories, spreadsheetId, onSaveCategory, onDeleteCategory, lang, t
}) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [optionsRaw, setOptionsRaw] = useState<Record<string, string>>({});

  const handleEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditForm(cat);
  };

  const handleAddNew = () => {
    const newId = `cat_${Date.now()}`;
    const newCat: Category = {
      id: newId,
      name: 'New Category',
      icon: '📦',
      fields: [{ id: `k_${Date.now()}`, label: 'Product ID', type: 'key', required: true }],
      updatedAt: new Date().toISOString()
    };
    handleEdit(newCat);
  };

  return (
    <>
      {/* Categories List */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-line pb-2">
          <h2 className="label-meta tracking-[0.1em]">{t('category')} REGISTRY</h2>
          <button onClick={handleAddNew} className="text-accent flex items-center gap-1 font-bold text-xs uppercase hover:underline">
            <Plus size={16} /> REGISTER_NEW
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {categories.filter(c => !c._deleted).map((cat, idx) => (
            <div key={cat.id} className="card p-4 flex items-center justify-between group bg-white/5 border-transparent hover:border-line transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-30 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-bold text-base">{translate(cat.name, lang)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="p-3 text-muted hover:text-accent transition-colors"><Edit3 size={20} /></button>
                <button onClick={() => onDeleteCategory(cat.id)} className="p-3 text-muted hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Info */}
      {spreadsheetId && (
        <div className="flex flex-col gap-4">
          <h2 className="label-meta tracking-[0.3em]">CLOUD_STORAGE</h2>
          <a
            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 flex flex-col gap-4 group hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-accent shadow-[4px_4px_0px_#333] flex items-center justify-center text-bg">
                <TableProperties size={24} />
              </div>
              <ExternalLink size={20} className="text-muted group-hover:text-accent" />
            </div>
            <div>
              <div className="font-display font-black text-xl">IMAGESNAP.XLSX</div>
              <div className="label-meta truncate mt-1">ID: {spreadsheetId}</div>
            </div>
          </a>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCatId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-line">
            <h3 className="text-2xl font-bold">Category Details</h3>

            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="flex flex-col gap-2">
                <label className="label-meta">ICON</label>
                <input type="text" value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="input text-3xl text-center !py-3" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label-meta">{t('name')}</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input font-bold" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="label-meta">Fields Configuration</label>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                {editForm.fields?.map((field, fIdx) => (
                  <div key={field.id} className={`p-3 bg-white/5 rounded-lg border flex flex-col gap-2 relative group/field ${field.type === 'key' ? 'border-accent/40 bg-accent/5' : 'border-line'}`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => {
                          const newFields = [...(editForm.fields || [])];
                          newFields[fIdx] = { ...field, label: e.target.value };
                          setEditForm({ ...editForm, fields: newFields });
                        }}
                        placeholder={field.type === 'key' ? 'Identifier Field Name (e.g. SKU)' : 'Field Name'}
                        className="input !py-1 flex-1 text-xs"
                      />
                      {field.type !== 'key' && (
                        <>
                          <select
                            value={field.type}
                            onChange={e => {
                              const newType = e.target.value as any;
                              const newFields = [...(editForm.fields || [])];
                              newFields[fIdx] = { ...field, type: newType };
                              setEditForm({ ...editForm, fields: newFields });
                            }}
                            className="input !py-1 text-[11px] w-24 font-bold"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="url">URL</option>
                            <option value="select">Select</option>
                            <option value="date">Date</option>
                          </select>
                          <button
                            onClick={() => {
                              const newFields = editForm.fields?.filter((_, idx) => idx !== fIdx);
                              setEditForm({ ...editForm, fields: newFields });
                            }}
                            className="p-1 text-muted hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {field.type === 'key' && (
                        <div className="text-[10px] bg-accent text-bg px-2 flex items-center rounded-full font-black uppercase">Folder Key</div>
                      )}
                    </div>
                    {field.type === 'select' && (
                      <input
                        type="text"
                        value={optionsRaw[field.id] !== undefined ? optionsRaw[field.id] : (field.options?.join(', ') || '')}
                        onChange={e => {
                          const val = e.target.value;
                          setOptionsRaw(prev => ({ ...prev, [field.id]: val }));
                        }}
                        onBlur={e => {
                          const val = e.target.value;
                          const newFields = [...(editForm.fields || [])];
                          newFields[fIdx] = { ...field, options: val.split(',').map(s => s.trim()).filter(Boolean) };
                          setEditForm({ ...editForm, fields: newFields });
                          setOptionsRaw(prev => {
                            const next = { ...prev };
                            delete next[field.id];
                            return next;
                          });
                        }}
                        placeholder="Options: S, M, L"
                        className="input !py-1 text-[11px]"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const newField: FieldDefinition = { id: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false };
                  setEditForm({ ...editForm, fields: [...(editForm.fields || []), newField] });
                }}
                className="btn btn-secondary py-2 text-[11px] flex items-center justify-center gap-2 border-dashed font-bold"
              >
                <Plus size={14} /> ADD_FIELD
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={() => setEditingCatId(null)} className="btn btn-secondary flex-1">Cancel</button>
              <button
                onClick={async () => {
                  if (isSaving) return;
                  if (!editForm.fields?.some(f => f.type === 'key')) {
                    alert('Category must have at least one Key field');
                    return;
                  }
                  setIsSaving(true);
                  try {
                    await onSaveCategory(editForm as Category);
                    setEditingCatId(null);
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCw className="animate-spin" size={16} /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
