"use client";

import React, { useEffect } from 'react';
import { LandingPage } from '@web/components/LandingPage';
import { useI18n } from '@shared/lib/i18n';
import { requestToken, initGis, setAccessToken, getUserInfo, establishSession } from '@shared/lib/google-auth';
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

      try {
        const res = await fetch('/api/auth/session');
        const sessionData = await res.json();
        if (sessionData.authenticated && window.location.pathname === '/') {
          const token = sessionData.user?.token;
          if (token) {
            // Verify Google token validity before attempting redirect
            const check = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!check.ok) {
              console.warn("Session token has expired. Deleting session cookie.");
              await fetch('/api/auth/session', { method: 'DELETE' });
              return;
            }
          }
          window.location.href = '/dashboard';
        }
      } catch (e) {
        console.warn("Session check failed, staying on landing.");
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    requestToken('consent', async (token) => {
      try {
        const profile = await getUserInfo(token);
        if (profile?.email) {
          await establishSession(token, profile.email);
          window.location.href = '/dashboard';
        } else {
          alert(t('loginFailed'));
        }
      } catch (e) {
        alert(t('loginFailed'));
      }
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
