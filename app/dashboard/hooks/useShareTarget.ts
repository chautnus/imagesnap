"use client";

import { useState, useRef } from 'react';

export function useShareTarget() {
  const [shareTargetSid, setShareTargetSid] = useState<string | null>(null);
  const isConsumingRef = useRef(false);

  const handleShareTarget = async (providedSid?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = providedSid || urlParams.get('share_id');
    const lastProcessedId = sessionStorage.getItem('imagesnap_last_share_id');

    if ((window as any)._pushDebug) (window as any)._pushDebug(`[IDEMPOTENCY] Check: sid=${sid}, last=${lastProcessedId}, isLocked=${isConsumingRef.current}`);

    if (isConsumingRef.current || (sid && sid === lastProcessedId)) {
      if ((window as any)._pushDebug && sid && sid === lastProcessedId) (window as any)._pushDebug('[IDEMPOTENCY] Share already processed');
      return;
    }

    isConsumingRef.current = true;

    if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_A] Querying IDB v2 sid Storage...');

    const attemptFetch = (attempt: number) => {
      return new Promise<void>((resolve) => {
        const DB_NAME = 'imagesnap-pwa-db';
        const DB_VERSION = 2;
        const STORE_NAME = 'shares';

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = (event: any) => {
          const db = event.target.result;

          // SCRUB URL ONLY ON SUCCESSFUL IDB ACCESS (Fix Bug 3 & 4)
          if (sid) {
            sessionStorage.setItem('imagesnap_last_share_id', sid);
            window.history.replaceState(null, '', window.location.pathname);
            if ((window as any)._pushDebug) (window as any)._pushDebug(`[KERNEL] Success: IDB Open. URL scrubbed for ${sid}`);
          }

          try {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const handleData = (data: any, key: string) => {
              if ((window as any)._pushDebug) (window as any)._pushDebug(`[STAGE_B] Data found for ${key}! Signaling CaptureTab...`);
              setShareTargetSid(key);
            };

            if (sid) {
              const getReq = store.get(sid);
              getReq.onsuccess = () => {
                if (getReq.result) {
                  handleData(getReq.result, sid);
                  resolve();
                } else if (attempt < 3) {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[RETRY] SID ${sid} not found. Attempt ${attempt+1}/3...`);
                  db.close();
                  setTimeout(() => attemptFetch(attempt + 1).then(resolve), 100 * (attempt + 1));
                } else {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[RETRY] SID ${sid} giving up after 3 attempts.`);
                  resolve();
                }
              };
            } else {
              // Legacy/Fallback cursor logic
              const cursorReq = store.openCursor(null, 'prev');
              cursorReq.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if (cursor) {
                  if (cursor.key !== lastProcessedId && cursor.key !== 'latest') {
                    handleData(cursor.value, cursor.key as string);
                    resolve();
                  } else {
                    cursor.continue();
                  }
                } else { resolve(); }
              };
            }

            transaction.oncomplete = () => db.close();
          } catch (e) {
            db.close();
            resolve();
          }
        };

        request.onerror = () => resolve();
      });
    };

    return attemptFetch(0).finally(() => {
      isConsumingRef.current = false;
    });
  };

  return { shareTargetSid, handleShareTarget };
}
