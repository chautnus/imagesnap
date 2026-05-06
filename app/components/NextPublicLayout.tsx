"use client";

import React from 'react';
import { NextPublicHeader } from './NextPublicHeader';
import { NextPublicFooter } from './NextPublicFooter';

interface PublicLayoutProps {
  onLogin: () => void;
  children: React.ReactNode;
}

export const NextPublicLayout: React.FC<PublicLayoutProps> = ({ onLogin, children }) => {
  return (
    <div className="min-h-screen bg-bg text-white selection:bg-accent/30 font-sans overflow-x-hidden">
      <NextPublicHeader onLogin={onLogin} />
      <main>
        {children}
      </main>
      <NextPublicFooter />
    </div>
  );
};
