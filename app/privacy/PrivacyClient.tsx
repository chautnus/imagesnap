"use client";
import { PrivacyPolicy } from '../../src/web/components/PrivacyPolicy';

export default function PrivacyClient() {
  return <PrivacyPolicy onBack={() => { window.location.href = '/'; }} />;
}
