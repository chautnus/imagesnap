"use client";

import React from 'react';

interface CaptureQuickAddModalProps {
  newCatName: string;
  setNewCatName: (v: string) => void;
  newCatIcon: string;
  setNewCatIcon: (v: string) => void;
  onCancel: () => void;
  onCreate: () => Promise<void>;
}

export const CaptureQuickAddModal: React.FC<CaptureQuickAddModalProps> = ({
  newCatName, setNewCatName, newCatIcon, setNewCatIcon, onCancel, onCreate
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-ink/30 backdrop-blur-sm">
    <div className="card w-full max-w-sm p-7 flex flex-col gap-6 shadow-xl border-line">
      <div className="text-center">
        <h3 className="text-xl font-bold text-ink">New Category</h3>
        <p className="text-muted text-sm mt-1">Add a new collection folder</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="label-meta">Category name</label>
          <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)}
            placeholder="e.g. Shoes, Electronics…" className="input" autoFocus />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-meta">Icon / Emoji</label>
          <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)}
            className="input text-center text-2xl" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="btn btn-secondary flex-1">Cancel</button>
        <button onClick={onCreate} className="btn btn-primary flex-1">Create</button>
      </div>
    </div>
  </div>
);
