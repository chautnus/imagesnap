import React from 'react';
import { verifySession } from '@shared/lib/dal';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-Side Guard: Validates session and redirects if invalid
  await verifySession(true);

  return <>{children}</>;
}
