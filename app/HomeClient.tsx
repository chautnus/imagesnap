"use client";

import React, { useEffect } from 'react';
import { LandingPage } from '@web/components/LandingPage';
import { useI18n } from '@shared/lib/i18n';
import { requestToken, initGis, setAccessToken, getUserInfo } from '@shared/lib/google-auth';
import { NextPublicLayout } from './components/NextPublicLayout';

export default function HomeClient() {
  const { t } = useI18n();

  useEffect(() => {
    initGis(async (token) => {
      setAccessToken(token);
      const profile = await getUserInfo(token);
      if (profile && window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    });
    
    const isStaff = localStorage.getItem('ps_is_staff') === 'true';
    if (isStaff && window.location.pathname === '/') {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = () => {
    requestToken('consent', (token) => {
      window.location.href = '/dashboard';
    });
  };

  return (
    <NextPublicLayout onLogin={handleLogin}>
      <LandingPage 
        onLogin={handleLogin} 
        t={t} 
      />
    </NextPublicLayout>
  );
}
