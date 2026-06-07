"use client";

import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useBurstCamera } from './useBurstCamera';
import { BurstCameraOverlay } from './BurstCameraOverlay';

interface BurstCameraProps {
  imageCount: number;
  onPhotoTaken: (dataUrl: string) => void;
}

export const BurstCamera: React.FC<BurstCameraProps> = ({ imageCount, onPhotoTaken }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'original' | 'square'>('original');
  const touchStartDistRef = useRef<number | null>(null);

  const camera = useBurstCamera(onPhotoTaken, aspectRatio);

  return (
    <div className="relative w-full h-full">
      <button
        onClick={() => camera.startCamera()}
        className={`w-full flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all h-20 ${camera.isCameraOpen ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(0,120,215,0.3)]' : 'bg-card border-line text-muted hover:border-accent hover:text-accent'}`}
      >
        <Camera size={18} />
        <span className="text-[10px] font-black tracking-tighter uppercase">BURST CAM</span>
      </button>

      {camera.isCameraOpen && (
        <BurstCameraOverlay
          imageCount={imageCount}
          showFlash={camera.showFlash}
          zoom={camera.zoom}
          exposure={camera.exposure}
          torch={camera.torch}
          capabilities={camera.capabilities}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          focusPoint={camera.focusPoint}
          sessionImages={camera.sessionImages}
          setSessionImages={camera.setSessionImages}
          videoRef={camera.videoRef}
          stopCamera={camera.stopCamera}
          switchCamera={camera.switchCamera}
          toggleTorch={camera.toggleTorch}
          handleExposureChange={camera.handleExposureChange}
          handleZoomChange={camera.handleZoomChange}
          handleTapToFocus={camera.handleTapToFocus}
          handleTouchStart={camera.handleTouchStart}
          handleTouchMove={camera.handleTouchMove}
          takePhoto={camera.takePhoto}
          touchStartDistRef={touchStartDistRef}
        />
      )}
    </div>
  );
};
