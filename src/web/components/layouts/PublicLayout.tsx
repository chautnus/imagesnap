import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../PublicHeader';
import { PublicFooter } from '../PublicFooter';

interface PublicLayoutProps {
  onLogin: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-accent/30 font-sans overflow-x-hidden">
      <PublicHeader onLogin={onLogin} />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
