import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, UserMinus, RefreshCw, Plus, UserCheck, Crown } from 'lucide-react';
import { Category, SubscriptionStatus } from '@shared/lib/types';
import { CategoryAccessModal } from './CategoryAccessModal';

interface UserEntry {
  isPro: boolean;
  isAdmin?: boolean;
  role: string;
  usage: number;
  limit: number;
  appId?: string;
  registeredAt?: string;
  accessibleCategories?: string[];
  username?: string;
}

const API_BASE_URL = (typeof window !== 'undefined' && (window.location.protocol === 'extension:' || window.location.protocol === 'chrome-extension:' || window.location.protocol === 'ms-browser-extension:'))
  ? 'https://www.imagesnap.cloud'
  : '';

interface UserDirectoryProps {
  user: any;
  subStatus: SubscriptionStatus;
  categories: Category[];
  lang: string;
}

export const UserDirectory: React.FC<UserDirectoryProps> = ({ user, subStatus, categories, lang }) => {
  const [users, setUsers] = useState<Record<string, UserEntry>>({} as Record<string, UserEntry>);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [managingUserEmail, setManagingUserEmail] = useState<string | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  useEffect(() => {
    if (subStatus.isAdmin && user?.email) fetchUsers();
  }, [subStatus.isAdmin, user?.email]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users?adminEmail=${encodeURIComponent(user.email)}`);
      const data = await res.json() as Record<string, UserEntry>;
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

  if (!subStatus.isAdmin) return null;

  const userEntries = Object.entries(users) as [string, UserEntry][];
  const proCount = userEntries.filter(([, d]) => d.isPro && d.role !== 'admin').length;
  const freeCount = userEntries.filter(([, d]) => !d.isPro && d.role !== 'admin' && d.role !== 'staff').length;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-line pb-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="label-meta tracking-[0.1em]">USER_DIRECTORY</h2>
            <span className="text-[10px] font-mono text-muted opacity-60">
              {userEntries.length} total · <span className="text-yellow-400">{proCount} PRO</span> · {freeCount} FREE
            </span>
          </div>
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
              <input type="text" placeholder="Username" value={staffUsername} onChange={(e) => setStaffUsername(e.target.value)} className="input h-10 text-xs" />
              <input type="password" placeholder="Password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} className="input h-10 text-xs" />
            </div>
            <button
              onClick={async () => {
                if (!staffUsername || !staffPassword) return;
                await handleUpdateUser(`${staffUsername}@staff.imagesnap`, {
                  username: staffUsername, password: staffPassword,
                  role: 'staff', isPro: true, limit: 999999
                });
                setStaffUsername(''); setStaffPassword(''); setShowStaffForm(false);
              }}
              className="btn btn-primary py-2 text-xs"
            >
              CREATE_ACCOUNT
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isLoadingUsers && (
            <div className="text-center text-muted text-xs py-6 font-mono animate-pulse">LOADING_USERS...</div>
          )}
          {!isLoadingUsers && userEntries.length === 0 && (
            <div className="text-center text-muted text-xs py-6 font-mono opacity-40">NO_REGISTERED_USERS</div>
          )}
          {userEntries.map(([email, data]) => (
            <div key={email} className="card p-5 flex items-center justify-between bg-white/5 border-transparent">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.role === 'admin' ? 'bg-accent/20 text-accent' : data.isPro ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-muted'}`}>
                  {data.role === 'admin' ? <Shield size={24} /> : data.isPro ? <Crown size={24} /> : <UserIcon size={24} />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono font-black text-sm text-accent">{email}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${data.isPro ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-muted'}`}>
                      {data.role === 'admin' ? 'ADMIN' : data.role === 'staff' ? 'STAFF' : data.isPro ? 'PRO' : 'FREE'}
                    </span>
                    <span className="text-[10px] font-mono opacity-40">
                      {data.usage || 0} / {data.limit === 999999 ? '∞' : data.limit} snaps
                    </span>
                    {data.registeredAt && (
                      <span className="text-[9px] font-mono opacity-30">
                        since {new Date(data.registeredAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {data.appId && (
                    <span className="text-[8px] font-mono opacity-20 tracking-wider">APP_ID: {data.appId}</span>
                  )}
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

      {managingUserEmail && (
        <CategoryAccessModal
          managingUserEmail={managingUserEmail}
          users={users}
          categories={categories}
          lang={lang}
          onClose={() => setManagingUserEmail(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </>
  );
};
