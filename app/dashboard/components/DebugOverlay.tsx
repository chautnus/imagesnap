"use client";

import React, { useState, useEffect } from 'react';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkState = () => {
      const params = new URLSearchParams(window.location.search);
      const isForced = params.get('debug') === '1';
      const isPersisted = localStorage.getItem('imagesnap_debug_visible') === '1';
      if (isForced || isPersisted) setIsVisible(true);
    };

    const handleToggle = () => {
      setIsVisible(prev => {
        const next = !prev;
        localStorage.setItem('imagesnap_debug_visible', next ? '1' : '0');
        return next;
      });
    };

    window.addEventListener('SYS_DEBUG_TOGGLE', handleToggle);
    checkState();

    return () => window.removeEventListener('SYS_DEBUG_TOGGLE', handleToggle);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncLogs = () => {
      setLogs([...((window as any)._debugLogs || [])]);
    };

    window.addEventListener('SYS_DEBUG_UPDATE', syncLogs);
    syncLogs();

    return () => window.removeEventListener('SYS_DEBUG_UPDATE', syncLogs);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-[90vw] max-h-[200px] overflow-y-auto bg-black/90 border border-white/10 rounded-lg p-3 shadow-2xl backdrop-blur-xl">
      <div className="flex justify-between items-center mb-2 border-bottom border-white/5 pb-1">
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Diagnostic Telemetry</span>
        <button onClick={() => setIsVisible(false)} className="text-[10px] text-white/40 hover:text-white uppercase font-bold">Hide</button>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-[9px] font-mono leading-tight break-all">
            <span className={log.includes('FATAL') ? 'text-red-400' : (log.includes('STAGE') ? 'text-accent' : 'text-white/60')}>
              {log}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-[9px] text-white/20 italic">Waiting for logs...</div>}
      </div>
    </div>
  );
}
