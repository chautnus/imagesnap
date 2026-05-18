"use client";

import React from 'react';
import { requestToken } from '@shared/lib/google-auth';
import { PicsioAlternative } from '@web/pages/alternatives/PicsioAlternative';
import { GooglePhotosVsImageSnap } from '@web/pages/alternatives/GooglePhotosVsImageSnap';
import { CompanyCamAlternative } from '@web/pages/alternatives/CompanyCamAlternative';
import { NextPublicLayout } from '../../components/NextPublicLayout';

const COMPONENTS: Record<string, React.FC<any>> = {
  'pics-io-alternative': PicsioAlternative,
  'google-photos-vs-imagesnap': GooglePhotosVsImageSnap,
  'companycam-alternative': CompanyCamAlternative,
};

export function AlternativeClient({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug];
  if (!Component) return null;

  const handleLogin = () => requestToken();

  return (
    <NextPublicLayout onLogin={handleLogin}>
      <Component onLogin={handleLogin} />
    </NextPublicLayout>
  );
}
