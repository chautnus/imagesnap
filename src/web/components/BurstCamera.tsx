import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Grid3X3, Square, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BurstCameraProps {
  imageCount: number;
  onPhotoTaken: (dataUrl: string) => void;
}

export const BurstCamera: React.FC<BurstCameraProps> = ({ imageCount, onPhotoTaken }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [exposure, setExposure] = useState(0);
  const [torch, setTorch] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'original' | 'square'>('original');
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [sessionImages, setSessionImages] = useState<string[]>([]);
  // Bug fix: default to 'environment' (rear) and use exact constraint first
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const touchStartDist = useRef<number | null>(null);
  const touchStartZoom = useRef<number>(1);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn("Auto-play failed:", e));
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
    setCapabilities(null);
    setTorch(false);
  };

  const startCamera = async (mode = facingMode) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Trình duyệt này không hỗ trợ Live Camera hoặc bạn đang không sử dụng HTTPS. Hãy dùng nút APP CAMERA bên cạnh để thay thế.");
      return;
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      let stream: MediaStream;
      try {
        // Use exact to force rear camera; falls back if device doesn't support
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: mode }, width: { ideal: 1920, max: 3840 }, height: { ideal: 1080, max: 2160 } }
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: mode } } });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      if (track && 'getCapabilities' in track) {
        const caps = track.getCapabilities() as any;
        setCapabilities(caps);
        if (caps.zoom) setZoom(caps.zoom.min || 1);
        if (caps.exposureCompensation) setExposure(caps.exposureCompensation.min || 0);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play().catch(e => console.warn("Auto-play failed:", e));
      }
      setIsCameraOpen(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("QUYỀN CAMERA BỊ CHẶN: Vui lòng vào cài đặt trình duyệt, tìm mục ImageSnap và chọn 'Allow Camera' sau đó thử lại.");
      } else {
        alert("LỖI CAMERA: " + (err.message || "Không thể khởi động camera."));
      }
      setIsCameraOpen(false);
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track && capabilities?.torch) {
      try {
        const next = !torch;
        await track.applyConstraints({ advanced: [{ torch: next }] } as any);
        setTorch(next);
      } catch (e) { console.warn("Torch failed:", e); }
    }
  };

  const handleExposureChange = async (value: number) => {
    setExposure(value);
    const track = streamRef.current?.getVideoTracks()[0];
    if (track && capabilities?.exposureCompensation) {
      try { await track.applyConstraints({ advanced: [{ exposureCompensation: value }] } as any); }
      catch (e) { console.warn("Exposure failed:", e); }
    }
  };

  const handleZoomChange = async (value: number) => {
    setZoom(value);
    const track = streamRef.current?.getVideoTracks()[0];
    if (track && capabilities?.zoom) {
      try { await track.applyConstraints({ advanced: [{ zoom: value }] } as any); }
      catch (e) { console.warn("Zoom failed:", e); }
    }
  };

  const handleTapToFocus = async (e: React.MouseEvent | React.TouchEvent) => {
    if (!videoRef.current || !streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const rect = videoRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
    else { clientX = e.clientX; clientY = e.clientY; }
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    setFocusPoint({ x: clientX, y: clientY });
    setTimeout(() => setFocusPoint(null), 1000);
    if (capabilities?.focusMode) {
      try { await track.applyConstraints({ advanced: [{ focusMode: 'manual', pointsOfInterest: [{ x, y }] }] } as any); }
      catch (e) { console.warn("Focus failed:", e); }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchStartDist.current = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      touchStartZoom.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null && capabilities?.zoom) {
      const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      const newZoom = Math.min(capabilities.zoom.max, Math.max(capabilities.zoom.min, touchStartZoom.current * (dist / touchStartDist.current)));
      handleZoomChange(newZoom);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (aspectRatio === 'square') {
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onPhotoTaken(dataUrl);
        setSessionImages(prev => [...prev, dataUrl]);
      }
    } else {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onPhotoTaken(dataUrl);
        setSessionImages(prev => [...prev, dataUrl]);
      }
    }
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);
  };

  return (
    <>
      <button
        onClick={() => startCamera()}
        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${isCameraOpen ? 'bg-accent text-bg border-accent shadow-[0_0_20px_rgba(212,255,0,0.3)]' : 'bg-card border-line text-muted hover:border-accent hover:text-accent'}`}
      >
        <Camera size={20} />
        <span className="text-[8px] font-black tracking-tighter uppercase">BURST CAM</span>
      </button>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[150] bg-black flex flex-col overflow-hidden select-none touch-none"
          >
            <div className={`relative flex-1 overflow-hidden bg-black flex items-center justify-center ${aspectRatio === 'square' ? 'aspect-square' : ''}`}>
              <video ref={videoRef} autoPlay playsInline muted onClick={handleTapToFocus}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => { touchStartDist.current = null; }}
                className="w-full h-full object-cover cursor-crosshair"
              />
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(9)].map((_, i) => <div key={i} className={`${i % 3 !== 2 ? 'border-r' : ''} ${i < 6 ? 'border-b' : ''} border-white/20`} />)}
                </div>
              )}
              <AnimatePresence>
                {focusPoint && (
                  <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ left: focusPoint.x - 40, top: focusPoint.y - 40 }}
                    className="absolute w-20 h-20 border-2 border-accent rounded-sm z-[180] pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-1 h-1 bg-accent rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showFlash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-[200]" />}
              </AnimatePresence>
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
                <button onClick={() => setShowGrid(!showGrid)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${showGrid ? 'bg-accent border-accent text-bg' : 'bg-black/40 border-white/20 text-white'}`}>
                  <Grid3X3 size={18} />
                </button>
                <button onClick={() => setAspectRatio(aspectRatio === 'original' ? 'square' : 'original')} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${aspectRatio === 'square' ? 'bg-accent border-accent text-bg' : 'bg-black/40 border-white/20 text-white'}`}>
                  <Square size={18} />
                </button>
                {capabilities?.torch && (
                  <button onClick={toggleTorch} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${torch ? 'bg-accent border-accent text-bg' : 'bg-black/40 border-white/20 text-white'}`}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
