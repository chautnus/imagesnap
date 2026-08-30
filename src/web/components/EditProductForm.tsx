"use client";

import React, { useState } from 'react';
import { LinkIcon, Calendar, ArrowLeft, Save } from 'lucide-react';
import { Category, Product } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface EditProductFormProps {
  product: Product;
  category?: Category;
  onSave: (updated: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  t: (key: string) => string;
  lang: string;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product, category, onSave, onCancel, t, lang
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({ ...product.data });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!category) {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <p className="text-red-500 font-semibold">Category not found for this product.</p>
        <button onClick={onCancel} className="btn">Back</button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const keyField = category.fields.find(f => f.type === 'key');
      const keyFieldId = keyField ? keyField.id : category.fields[0]?.id;
      const updatedName = (keyFieldId && formData[keyFieldId]) ? formData[keyFieldId] : product.name;

      const updatedProduct: Partial<Product> = {
        ...product,
        name: updatedName,
        data: { ...formData },
      };

      await onSave(updatedProduct);
    } catch (err: any) {
      setError(err?.message || 'Failed to save product edits.');
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg border border-line text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-bold text-ink">Edit Record</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          {[...category.fields]
            .sort((a, b) => (a.type === 'key' ? -1 : b.type === 'key' ? 1 : 0))
            .map(field => (
              <div
                key={field.id}
                className={"flex flex-col gap-1.5 " + (field.type === 'key' ? 'p-3 bg-accent/5 rounded-xl border border-accent/20' : '')}
              >
                <label className="label-meta flex items-center gap-1.5 text-ink">
                  {translate(field.label, lang)} {field.required && <span className="text-red-400">*</span>}
                  {field.type === 'url' && <LinkIcon size={10} className="text-muted" />}
                  {field.type === 'date' && <Calendar size={10} className="text-muted" />}
                </label>

                {field.type === 'select' ? (
                  <select
                    className="input text-ink"
                    value={formData[field.id] ?? ''}
                    onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                      className={"input w-full text-ink " + (field.type === 'key' ? 'pl-9 border-accent font-semibold' : (field.type === 'date' || field.type === 'url') ? 'pl-10' : '')}
                      value={formData[field.id] ?? ''}
                      onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                    {field.type === 'url' && <LinkIcon className="absolute left-3 text-muted" size={14} />}
                    {field.type === 'date' && <Calendar className="absolute left-3 text-muted" size={14} />}
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 btn py-3 border border-line text-muted hover:text-ink transition-colors font-medium rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 btn py-3 bg-accent text-white hover:bg-accent/90 transition-colors font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
