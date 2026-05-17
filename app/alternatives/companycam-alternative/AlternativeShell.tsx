"use client";
import dynamic from 'next/dynamic';

const CompanyCamClient = dynamic(() => import('./CompanyCamClient'), { ssr: false });

export default function AlternativeShell() {
  return <CompanyCamClient />;
}
