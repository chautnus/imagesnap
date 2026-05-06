"use client";

import React from 'react';
import { PricingPage } from '@web/pages/PricingPage';
import { requestToken } from '@shared/lib/google-auth';
import { NextPublicLayout } from '../components/NextPublicLayout';

export default function Pricing() {
  const handleLogin = () => {
    requestToken('consent', (token) => {
      window.location.href = '/dashboard';
    });
  };

  return (
    <NextPublicLayout onLogin={handleLogin}>
      <PricingPage onLogin={handleLogin} />
    </NextPublicLayout>
  );
}
