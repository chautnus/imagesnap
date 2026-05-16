"use client";

import { useState } from 'react';
import { SubscriptionStatus } from '@shared/lib/types';
import { apiClient } from '@shared/lib/api-client';

export function useSubStatus() {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const [dataStatus, setDataStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const fetchSubStatus = async (email: string) => {
    const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
    setDataStatus('loading');
    try {
      const res = await apiClient(`/api/user-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const finalStatus = { ...data, isAdmin: data.isAdmin || isAdmin };

      if (finalStatus.isAdmin) {
        finalStatus.isPro = true;
        finalStatus.limit = 999999;
      }
      setSubStatus(finalStatus);
      setDataStatus('success');
    } catch (e) {
      setSubStatus(prev => ({ ...prev, isAdmin }));
      setDataStatus('error');
      console.error("fetchSubStatus failed:", e);
    }
  };

  return { subStatus, setSubStatus, dataStatus, fetchSubStatus };
}
