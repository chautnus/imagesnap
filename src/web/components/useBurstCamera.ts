import { useState, useRef, useEffect } from 'react';

export function useBurstCamera(onPhotoTaken: (dataUrl: string) => void, aspectRatio: 'original' | 'square') {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [exposure, setExposure] = useState(0);
  const [torch, setTorch] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [sessionImages, setSessionImages] = useState<string[]>([]);
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

  return {
    isCameraOpen, showFlash, zoom, exposure, torch, capabilities,
    focusPoint, sessionImages, setSessionImages, videoRef,
    startCamera, stopCamera, switchCamera, toggleTorch,
    handleExposureChange, handleZoomChange, handleTapToFocus,
    handleTouchStart, handleTouchMove, takePhoto,
  };
}
