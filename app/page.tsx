"use client";

import React, { useEffect, useState } from 'react';
import { LandingPage } from '@web/components/LandingPage';
import { useI18n } from '@shared/lib/i18n';
import { requestToken, initGis, setAccessToken, getUserInfo } from '@shared/lib/google-auth';
import { NextPublicLayout } from './components/NextPublicLayout';

export default function Home() {
  const { t } = useI18n();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // In Next.js, we need to initialize GIS on the client
    initGis(async (token) => {
      setAccessToken(token);
      // Verify token before redirecting to dashboard
      const profile = await getUserInfo(token);
      if (profile && window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    });
    
    // Also check for staff session
    const isStaff = localStorage.getItem('ps_is_staff') === 'true';
    if (isStaff && window.location.pathname === '/') {
      window.location.href = '/dashboard';
    }

    setIsReady(true);
  }, []);

  const handleLogin = () => {
    requestToken('consent', (token) => {
      // Redirect to dashboard on successful login
      window.location.href = '/dashboard';
    });
  };

  if (!isReady) return null;

  return (
    <NextPublicLayout onLogin={handleLogin}>
      <LandingPage 
        onLogin={handleLogin} 
        t={t} 
      />
    </NextPublicLayout>
  );
}
