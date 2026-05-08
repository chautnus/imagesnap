"use client";

import React, { useEffect } from 'react';
import { LandingPage } from '@web/components/LandingPage';
import { useI18n } from '@shared/lib/i18n';
import { requestToken, initGis, setAccessToken, getUserInfo } from '@shared/lib/google-auth';
import { NextPublicLayout } from './components/NextPublicLayout';

export default function HomeClient() {
  const { t } = useI18n();

  useEffect(() => {
    const checkAuth = async () => {
      const isStaff = localStorage.getItem('ps_is_staff') === 'true';
      if (isStaff) {
        window.location.href = '/dashboard';
        return;
      }

      initGis(async (token) => {
        setAccessToken(token);
        try {
          const profile = await getUserInfo(token);
          if (profile && window.location.pathname === '/') {
            window.location.href = '/dashboard';
          }
        } catch (e) {
          console.warn("Silent auth failed, staying on landing.");
        }
      });
    };
    
    checkAuth();
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
