"use client";

import React from 'react';
import { CompanyCamAlternative } from '@web/pages/alternatives/CompanyCamAlternative';
import { requestToken } from '@shared/lib/google-auth';
import { NextPublicLayout } from '../../components/NextPublicLayout';

export default function Page() {
  const handleLogin = () => requestToken();
  
  return (
    <NextPublicLayout onLogin={handleLogin}>
      <CompanyCamAlternative onLogin={handleLogin} />
    </NextPublicLayout>
  );
}
