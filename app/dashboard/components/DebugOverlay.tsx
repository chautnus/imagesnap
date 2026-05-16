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
      const isPersisted = localStorage.getItem('imagesnap_debug_visible') === '1' || 
                          sessionStorage.getItem('imagesnap_debug_mode') === '1';
      
      if (isForced) {
        sessionStorage.setItem('imagesnap_debug_mode', '1');
        setIsVisible(true);
      } else if (isPersisted) {
        setIsVisible(true);
      }
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
    <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-[999999] flex items-end p-4">
      <div className="pointer-events-auto w-full max-w-md max-h-[40vh] overflow-y-auto bg-black/95 border-2 border-accent/20 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-black/50 backdrop-blur-sm pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Live Diagnostics</span>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-[10px] text-white/40 hover:text-white uppercase font-black tracking-widest px-2 py-1">Dismiss</button>
        </div>
        <div className="space-y-1.5 font-mono">
          {logs.map((log, i) => (
            <div key={i} className="text-[9px] leading-relaxed break-all flex gap-2">
              <span className="text-white/20 shrink-0">[{i}]</span>
              <span className={log.includes('FATAL') || log.includes('FAIL') ? 'text-red-400' : (log.includes('STAGE') || log.includes('BOOT') ? 'text-accent font-black' : 'text-white/70')}>
                {log}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-[10px] text-white/20 italic p-4 text-center">Listening for system events...</div>}
          <div id="debug-bottom" />
        </div>
      </div>
    </div>
  );
}
