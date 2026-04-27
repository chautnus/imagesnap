import React, { useState, useEffect } from 'react';
import { LogOut, Globe, Plus, Trash2, Edit3, Save, X, ExternalLink, RefreshCw, Crown, CreditCard, Shield, User as UserIcon, UserMinus, CheckSquare, Square, UserCheck } from 'lucide-react';
import { Category, FieldDefinition, SubscriptionStatus } from '@shared/lib/types';
import { revokeToken, getAccessToken } from '@shared/lib/google-auth';
import { translate } from '@shared/lib/translations';

const API_BASE_URL = (typeof window !== 'undefined' && (window.location.protocol === 'extension:' || window.location.protocol === 'chrome-extension:' || window.location.protocol === 'ms-browser-extension:')) 
  ? 'https://www.imagesnap.cloud' 
  : '';

interface SettingsTabProps {
  categories: Category[];
  onSaveCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  toggleLang: () => void;
  lang: string;
  spreadsheetId: string | null;
  t: (key: string) => string;
  user: any;
  subStatus: SubscriptionStatus;
  onUpgrade: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  categories, 
  onSaveCategory, 
  onDeleteCategory, 
  toggleLang, 
  lang,
  spreadsheetId,
  t,
  user,
  subStatus,
  onUpgrade
}) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [managingUserEmail, setManagingUserEmail] = useState<string | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  useEffect(() => {
    if (subStatus.isAdmin && user?.email) {
      fetchUsers();
    }
  }, [subStatus.isAdmin, user?.email]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users?adminEmail=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setUsers(data);
    } catch (e) { console.error("Fetch users error", e); }
    finally { setIsLoadingUsers(false); }
  };

  const handleUpdateUser = async (targetEmail: string, updates: any) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: user.email, targetEmail, updates })
      });
      fetchUsers();
    } catch (e) { console.error("Update user error", e); }
  };

  const handleDeleteUser = async (targetEmail: string) => {
    if (!confirm(`Delete user ${targetEmail}?`)) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/delete-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: user.email, targetEmail })
      });
      fetchUsers();
    } catch (e) { console.error("Delete user error", e); }
  };

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
      fields: [
        { id: `k_${Date.now()}`, label: 'Product ID', type: 'key', required: true }
      ],
      updatedAt: new Date().toISOString()
    };
    handleEdit(newCat);
  };

  return (
    <div className="pb-24 p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl tracking-tighter">{t('settings')}</h1>
      </div>

      {/* Subscription Status */}
      <div className="flex flex-col gap-4">
        <h2 className="label-meta tracking-[0.3em]">PLAN_STATUS</h2>
        <div className={`card p-6 flex flex-col gap-6 border-2 transition-all ${subStatus.isPro ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-accent/20'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${subStatus.isPro ? 'bg-yellow-500 text-bg shadow-[4px_4px_0_rgba(0,0,0,0.5)]' : 'bg-accent/10 text-accent'}`}>
                {subStatus.isPro ? <Crown size={28} /> : <CreditCard size={28} />}
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter uppercase leading-none mb-1">
                  {subStatus.isPro ? 'PRO_LIFETIME' : 'FREE_TIER'}
                </span>
                <span className="text-[12px] font-mono font-black text-accent">{user?.email || 'OFFLINE_USER'}</span>
              </div>
            </div>
            {!subStatus.isPro && (
              <button onClick={onUpgrade} className="btn btn-primary text-[12px] py-2 px-4 font-black shadow-[4px_4px_0_#000] tracking-widest">
                UPGRADE
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-3 pt-2 border-t border-line/10">
            <div className="flex justify-between items-end">
               <div className="flex flex-col gap-1">
                  <span className="label-meta text-accent opacity-60">CURRENT_USAGE</span>
                  <span className="text-3xl font-black font-mono tracking-tighter">
                    {subStatus.isPro ? '∞' : subStatus.usage}
                  </span>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <span className="label-meta opacity-60 text-right">PLAN_LIMIT</span>
                  <span className="text-xl font-bold font-mono text-muted">
                    {subStatus.isPro ? 'UNLIMITED' : `/ ${subStatus.limit} SNAPS`}
                  </span>
               </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border-2 border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ${subStatus.isPro ? 'w-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(212,255,0,0.5)]'}`}
                style={{ width: subStatus.isPro ? '100%' : `${Math.min(100, (subStatus.usage / subStatus.limit) * 100)}%` }}
              />
            </div>
            
            {subStatus.isAdmin && (
              <button 
                onClick={async () => {
                  const token = getAccessToken();
                  if (!token || !spreadsheetId) return;
                  await fetch(`${API_BASE_URL}/api/admin/set-master-workspace`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adminEmail: user.email, spreadsheetId, accessToken: token })
                  });
                  alert("Workspace Published! Staff can now save to your Drive.");
                }}
                className="w-full py-3 bg-accent text-bg font-black uppercase tracking-widest text-[10px] rounded shadow-[4px_4px_0_#000] hover:scale-[0.98] transition-transform"
              >
                PUBLISH AS MASTER WORKSPACE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="card p-6 flex items-center justify-between border-2 border-accent/20">
        <div className="flex items-center gap-4">
          <Globe size={24} className="text-accent" />
          <div className="flex flex-col">
            <span className="text-lg font-display font-black">LOCALIZATION</span>
            <span className="label-meta">Current: {lang === 'en' ? 'EN_US' : 'VI_VN'}</span>
          </div>
        </div>
        <button onClick={toggleLang} className="btn btn-primary text-[12px] font-black tracking-widest">
          SWITCH_LANG
        </button>
      </div>

      {/* User Management (Admin Only) */}
      {subStatus.isAdmin && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h2 className="label-meta tracking-[0.1em]">USER_DIRECTORY</h2>
            <div className="flex gap-4">
              <button onClick={() => setShowStaffForm(!showStaffForm)} className="text-accent flex items-center gap-1 font-bold text-xs uppercase">
                <Plus size={14} /> ADD_STAFF
              </button>
              <button onClick={fetchUsers} className="text-accent flex items-center gap-1 font-bold text-xs uppercase">
                <RefreshCw size={14} className={isLoadingUsers ? 'animate-spin' : ''} /> REFRESH
              </button>
            </div>
          </div>

          <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg text-[10px] font-mono text-accent">
             STAFF_PORTAL: {window.location.origin}/#staff
          </div>

          {showStaffForm && (
            <div className="card p-5 bg-accent/5 border-accent/30 flex flex-col gap-4">
               <h3 className="font-bold text-sm uppercase">Create Staff Account</h3>
               <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    className="input h-10 text-xs"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="input h-10 text-xs"
                  />
               </div>
               <button 
                  onClick={async () => {
                    if (!staffUsername || !staffPassword) return;
                    await handleUpdateUser(`${staffUsername}@staff.imagesnap`, { 
                      username: staffUsername, 
                      password: staffPassword,
                      role: 'staff',
                      isPro: true, // Staff use Admin's PRO quota
                      limit: 999999
                    });
                    setStaffUsername('');
                    setStaffPassword('');
                    setShowStaffForm(false);
                  }}
                  className="btn btn-primary py-2 text-xs"
                >
                  CREATE_ACCOUNT
               </button>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {Object.entries(users).map(([email, data]) => (
              <div key={email} className="card p-5 flex items-center justify-between bg-white/5 border-transparent">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-white/5 text-muted'}`}>
                    {data.role === 'admin' ? <Shield size={24} /> : <UserIcon size={24} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-black text-sm text-accent">{email}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                      {data.role || 'user'} • Usage: {data.usage || 0} / {data.limit}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                   {email !== user.email && (
                     <>
                        <button 
                          onClick={() => setManagingUserEmail(email)}
                          className={`p-3 border border-line/20 rounded-lg transition-colors ${data.accessibleCategories ? 'text-accent bg-accent/5' : 'text-muted hover:text-accent'}`}
                          title="Manage Category Access"
                        >
                          <UserCheck size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateUser(email, { role: data.role === 'admin' ? 'user' : 'admin', isAdmin: data.role !== 'admin' })}
                          className="p-3 text-muted hover:text-accent transition-colors border border-line/20 rounded-lg"
                          title="Change Role"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(email)}
                          className="p-3 text-muted hover:text-red-500 transition-colors border border-line/20 rounded-lg"
                          title="Delete User"
                        >
                          <UserMinus size={18} />
                        </button>
                     </>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Category Access Modal */}
      {managingUserEmail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-line">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-bold">Category Access</h3>
              <span className="text-xs text-accent font-mono">{managingUserEmail}</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.filter(c => !c._deleted).map(cat => {
                const userObj = users[managingUserEmail];
                const isAccessible = !userObj.accessibleCategories || userObj.accessibleCategories.includes(cat.id);
                
                return (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      let current = userObj.accessibleCategories || categories.filter(c => !c._deleted).map(c => c.id);
                      if (current.includes(cat.id)) {
                        current = current.filter((id: string) => id !== cat.id);
                      } else {
                        current = [...current, cat.id];
                      }
                      handleUpdateUser(managingUserEmail, { accessibleCategories: current });
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
              <button onClick={() => setManagingUserEmail(null)} className="btn btn-primary w-full py-4 mt-2 font-black uppercase tracking-widest">
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Management */}
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

      {/* Extension Section */}
      <div className="flex flex-col gap-4">
        <h2 className="label-meta tracking-[0.1em]">BROWSER_EXTENSION</h2>
        <div className="card p-6 flex flex-col gap-6 bg-accent/5 border-dashed border-accent/20">
          <div className="flex justify-between items-center">
             <div className="font-bold text-lg">ImageSnap Collector</div>
             <span className="px-2 py-0.5 bg-accent text-bg text-[10px] font-black rounded uppercase">EXTENSION_ONLY</span>
          </div>

          <div className="flex flex-col gap-4">
             <p className="text-sm text-muted leading-relaxed">
               {lang === 'en' 
                 ? 'ImageSnap is now exclusively developed as a Browser Extension. Please download and install the extension package for the best experience on Chrome or Edge.' 
                 : 'ImageSnap hiện được phát triển độc quyền dưới dạng Extension trình duyệt. Vui lòng tải và cài đặt gói extension để có trải nghiệm tốt nhất trên Chrome hoặc Edge.'}
             </p>
             
             <button 
               onClick={() => window.open('https://github.com/google/productsnap', '_blank')}
               className="btn btn-primary py-4 flex items-center justify-center gap-3 font-black text-[11px]"
             >
               <ExternalLink size={20} />
               {lang === 'en' ? 'DOWNLOAD EXTENSION (ZIP)' : 'TẢI EXTENSION (ZIP)'}
             </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={() => {
          localStorage.removeItem('ps_sheet_id');
          revokeToken();
          window.location.reload();
        }}
        className="btn btn-secondary mt-12 border-red-900 text-red-500 flex items-center justify-center gap-3 grayscale hover:grayscale-0"
      >
        <LogOut size={18} />
        TERMINATE_SESSION
      </button>

      {/* Edit Category Modal */}
      {editingCatId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="card w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl border-line">
            <h3 className="text-2xl font-bold">Category Details</h3>
            
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="flex flex-col gap-2">
                <label className="label-meta">ICON</label>
                <input 
                  type="text" 
                  value={editForm.icon} 
                  onChange={e => setEditForm({...editForm, icon: e.target.value})}
                  className="input text-3xl text-center !py-3" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label-meta">{t('name')}</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="input font-bold" 
                />
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
                        value={field.options?.join(', ') || ''}
                        onChange={e => {
                          const newFields = [...(editForm.fields || [])];
                          newFields[fIdx] = { ...field, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                          setEditForm({ ...editForm, fields: newFields });
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
                  const newField: FieldDefinition = {
                    id: `field_${Date.now()}`,
                    label: 'New Field',
                    type: 'text',
                    required: false
                  };
                  setEditForm({ ...editForm, fields: [...(editForm.fields || []), newField] });
                }}
                className="btn btn-secondary py-2 text-[11px] flex items-center justify-center gap-2 border-dashed font-bold"
              >
                <Plus size={14} /> ADD_FIELD
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={() => setEditingCatId(null)} className="btn btn-secondary flex-1">
                Cancel
              </button>
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
    </div>
  );
};

const TableProperties = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 3h15c.8 0 1.5.7 1.5 1.5v15c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5v-15C3 3.7 3.7 3 4.5 3Z"/>
    <path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
  </svg>
);
