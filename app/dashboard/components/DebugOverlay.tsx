"use client";

import React, { useState, useEffect } from 'react';

import { flushCloudLogs } from '@shared/lib/sheets';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Cloud Logger Flush Interval (Every 3 seconds)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(async () => {
      try {
        const bufferStr = localStorage.getItem('imagesnap_log_buffer');
        if (bufferStr) {
          const buffer = JSON.parse(bufferStr);
          if (buffer.length > 0) {
            // Clear buffer immediately to prevent duplicate flushing if API is slow
            localStorage.setItem('imagesnap_log_buffer', '[]');
            await flushCloudLogs(buffer);
          }
        }
      } catch (e) {
        // Silent catch for flush loop
      }
    }, 3000);

    return () => clearInterval(interval);
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[999999]">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-black/95 border-2 border-accent/20 rounded-full px-4 py-2 text-[10px] font-black text-accent shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center gap-2 animate-pulse"
        >
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          SYS LOGS RUNNING
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-[999999] flex items-end p-4">
      <div className="pointer-events-auto w-full max-w-md max-h-[40vh] overflow-y-auto bg-black/95 border-2 border-accent/20 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-black/50 backdrop-blur-sm pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Live Diagnostics</span>
          </div>
          <button onClick={() => setIsMinimized(true)} className="text-[10px] text-white/40 hover:text-white uppercase font-black tracking-widest px-2 py-1">Minimize</button>
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
