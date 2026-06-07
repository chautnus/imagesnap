import React from 'react';
import { PUB } from '../styles/theme';

/**
 * Dark wrapper for ALL public/marketing pages.
 * Provides the dark bg + white text context so all children render correctly.
 */
interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PublicPageShell: React.FC<Props> = ({ children, className = '' }) => (
  <div className={`${PUB.page} min-h-screen ${className}`}>
    {children}
  </div>
);
