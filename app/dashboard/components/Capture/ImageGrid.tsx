"use client";

import React from 'react';
import { X } from 'lucide-react';
import { DriveImage } from '@web/components/DriveImage';

interface ImageGridProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {images.map((img, i) => (
        <div key={i} className="relative flex-none w-20 aspect-square rounded-lg overflow-hidden border border-line bg-white/5">
          {img.startsWith('blob:') || img.startsWith('data:') ? (
            <img src={img} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <DriveImage url={img} className="w-full h-full object-cover" />
          )}
          <button 
            onClick={() => onRemoveImage(i)} 
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 z-10"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
};