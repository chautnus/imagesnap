"use client";
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <a href="/" className="mb-12 flex items-center gap-2 text-muted hover:text-accent transition-colors">
      <ArrowLeft size={16} /> BACK TO HOME
    </a>
  );
}
