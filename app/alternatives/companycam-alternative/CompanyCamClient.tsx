"use client";
import { CompanyCamAlternative } from '@web/pages/alternatives/CompanyCamAlternative';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { requestToken } from '@shared/lib/google-auth';

export default function CompanyCamClient() {
  const handleLogin = () => requestToken();
  return (
    <NextPublicLayout onLogin={handleLogin}>
      <CompanyCamAlternative onLogin={handleLogin} />
    </NextPublicLayout>
  );
}
