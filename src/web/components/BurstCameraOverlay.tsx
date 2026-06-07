"use client";

import React from 'react';
import { RefreshCw, X, Grid3X3, Square, Zap } from 'lucide-react';

interface BurstCameraOverlayProps {
  imageCount: number;
  showFlash: boolean;
  zoom: number;
  exposure: number;
  torch: boolean;
  capabilities: any;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  aspectRatio: 'original' | 'square';
  setAspectRatio: (v: 'original' | 'square') => void;
  focusPoint: { x: number; y: number } | null;
  sessionImages: string[];
  setSessionImages: (v: string[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  stopCamera: () => void;
  switchCamera: () => void;
  toggleTorch: () => void;
  handleExposureChange: (v: number) => void;
  handleZoomChange: (v: number) => void;
  handleTapToFocus: (e: React.MouseEvent | React.TouchEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  takePhoto: () => void;
  touchStartDistRef: React.MutableRefObject<number | null>;
}

export const BurstCameraOverlay: React.FC<BurstCameraOverlayProps> = ({
  imageCount, showFlash, zoom, exposure, torch, capabilities,
  showGrid, setShowGrid, aspectRatio, setAspectRatio, focusPoint,
  sessionImages, setSessionImages, videoRef,
  stopCamera, switchCamera, toggleTorch,
  handleExposureChange, handleZoomChange, handleTapToFocus,
  handleTouchStart, handleTouchMove, takePhoto, touchStartDistRef,
}) => (
  <div className="fixed inset-0 z-[150] bg-black flex flex-col overflow-hidden select-none touch-none">
    <div className={`relative flex-1 overflow-hidden bg-black flex items-center justify-center ${aspectRatio === 'square' ? 'aspect-square' : ''}`}>
      <video ref={videoRef} autoPlay playsInline muted onClick={handleTapToFocus}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
        onTouchEnd={() => { touchStartDistRef.current = null; }}
        className="w-full h-full object-cover cursor-crosshair"
      />
      {showGrid && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[...Array(9)].map((_, i) => <div key={i} className={`${i % 3 !== 2 ? 'border-r' : ''} ${i < 6 ? 'border-b' : ''} border-white/20`} />)}
        </div>
      )}
      <div>
        {focusPoint && (
          <div
            style={{ left: focusPoint.x - 40, top: focusPoint.y - 40 }}
            className="absolute w-20 h-20 border-2 border-accent rounded-sm z-[180] pointer-events-none flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          </div>
        )}
      </div>
      <div>
        {showFlash && <div className="absolute inset-0 bg-white z-[190]" />}
      </div>
    </div>

    {sessionImages.length > 0 && (
      <div className="flex-none h-16 bg-black/40 backdrop-blur-md border-y border-white/5 flex items-center gap-2 px-4 overflow-x-auto no-scrollbar py-2">
        {sessionImages.map((img, idx) => (
          <div key={idx} className="h-full aspect-square rounded-md overflow-hidden border border-white/20 flex-none">
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    )}

    {capabilities?.zoom && (
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-48 flex flex-col items-center gap-4 z-[170]">
        <span className="text-white text-[10px] font-black">{zoom.toFixed(1)}x</span>
        <input type="range" min={capabilities.zoom.min} max={capabilities.zoom.max} step={0.1} value={zoom}
          onChange={e => handleZoomChange(parseFloat(e.target.value))}
          className="w-1 h-full appearance-none bg-white/20 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full"
          style={{ writingMode: 'vertical-lr', direction: 'rtl' } as any}
        />
      </div>
    )}

    {capabilities?.exposureCompensation && (
      <div className="absolute left-6 top-1/2 -translate-y-1/2 h-48 flex flex-col items-center gap-4 z-[170]">
        <span className="text-white text-[10px] font-black">{exposure > 0 ? `+${exposure.toFixed(1)}` : exposure.toFixed(1)}</span>
        <input type="range" min={capabilities.exposureCompensation.min} max={capabilities.exposureCompensation.max} step={0.1} value={exposure}
          onChange={e => handleExposureChange(parseFloat(e.target.value))}
          className="w-1 h-full appearance-none bg-white/20 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          style={{ writingMode: 'vertical-lr', direction: 'rtl' } as any}
        />
      </div>
    )}

    <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-[170]">
      <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-white font-black text-xs tracking-widest">{imageCount} PHOTOS</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setShowGrid(!showGrid)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${showGrid ? 'bg-accent border-accent text-white' : 'bg-black/40 border-white/20 text-white'}`}>
          <Grid3X3 size={18} />
        </button>
        <button onClick={() => setAspectRatio(aspectRatio === 'original' ? 'square' : 'original')} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${aspectRatio === 'square' ? 'bg-accent border-accent text-white' : 'bg-black/40 border-white/20 text-white'}`}>
          <Square size={18} />
        </button>
        {capabilities?.torch && (
          <button onClick={toggleTorch} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${torch ? 'bg-accent border-accent text-white' : 'bg-black/40 border-white/20 text-white'}`}>
            <Zap size={18} fill={torch ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </div>

    <div className="p-4 pb-10 bg-black/80 flex justify-around items-center z-[170] flex-none">
      <button onClick={() => { setSessionImages([]); stopCamera(); }} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
        <X size={24} />
      </button>
      <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-accent shadow-2xl active:scale-90 transition-transform" />
      <button onClick={switchCamera} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
        <RefreshCw size={24} />
      </button>
    </div>
  </div>
);
