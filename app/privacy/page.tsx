"use client";

import React from 'react';
import { PrivacyPolicy } from '../../src/web/components/PrivacyPolicy';

export default function Privacy() {
  return (
    <PrivacyPolicy 
      onBack={() => {
        window.location.href = '/';
      }} 
    />
  );
}
