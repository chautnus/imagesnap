"use client";

import React, { useEffect, useState } from 'react';
import { LandingPage } from '@web/components/LandingPage';
import { useI18n } from '@shared/lib/i18n';
import { requestToken, initGis, setAccessToken } from '@shared/lib/google-auth';
import { NextPublicLayout } from './components/NextPublicLayout';

export default function Home() {
  const { t } = useI18n();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // In Next.js, we need to initialize GIS on the client
    initGis((token) => {
      setAccessToken(token);
      // If we have a token, we might want to redirect to dashboard
      // But for the landing page, we just want to be ready for the login button
    });
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
