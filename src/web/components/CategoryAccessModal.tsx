import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Category } from '@shared/lib/types';
import { translate } from '@shared/lib/translations';

interface CategoryAccessModalProps {
  managingUserEmail: string;
  users: Record<string, any>;
  categories: Category[];
  lang: string;
  onClose: () => void;
  onUpdate: (email: string, updates: any) => Promise<void>;
}

export const CategoryAccessModal: React.FC<CategoryAccessModalProps> = ({
  managingUserEmail, users, categories, lang, onClose, onUpdate
}) => {
  const userObj = users[managingUserEmail];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
      <div className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-line">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold">Category Access</h3>
          <span className="text-xs text-accent font-mono">{managingUserEmail}</span>
        </div>

        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.filter(c => !c._deleted).map(cat => {
            const isAccessible = !userObj?.accessibleCategories || userObj.accessibleCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  let current = userObj?.accessibleCategories || categories.filter(c => !c._deleted).map(c => c.id);
                  if (current.includes(cat.id)) {
                    current = current.filter((id: string) => id !== cat.id);
                  } else {
                    current = [...current, cat.id];
                  }
                  onUpdate(managingUserEmail, { accessibleCategories: current });
                }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isAccessible ? 'border-accent/40 bg-accent/5' : 'border-line bg-white/5 opacity-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-bold">{translate(cat.name, lang)}</span>
                </div>
                {isAccessible ? <CheckSquare size={20} className="text-accent" /> : <Square size={20} className="text-muted" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <p className="text-[10px] text-muted leading-tight uppercase font-black opacity-50">
            * If no categories are selected, the user may see all by default or none based on system rules.
          </p>
          <button onClick={onClose} className="btn btn-primary w-full py-4 mt-2 font-black uppercase tracking-widest">
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
