import React from 'react';
import type { Metadata } from 'next';
import { verifySession } from '@shared/lib/dal';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-Side Guard: Validates session and redirects if invalid
  await verifySession(true);

  return <>{children}</>;
}
