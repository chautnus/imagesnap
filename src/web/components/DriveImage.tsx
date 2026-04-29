import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@shared/lib/google-auth';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface DriveImageProps {
  url: string;
  className?: string;
  alt?: string;
}

// Cache to store blob URLs to avoid re-fetching the same image
const blobCache: Record<string, string> = {};

export const DriveImage: React.FC<DriveImageProps> = ({ url, className, alt }) => {
  const isBase64 = url && url.startsWith('data:');
  const isDriveUrl = url && (url.includes('drive.google.com') || url.includes('id=') || /[-\w]{25,}/.test(url));
  const isNormalUrl = url && url.startsWith('http') && !url.includes('drive.google.com') && !url.includes('id=');

  const [src, setSrc] = useState<string | null>( (isBase64 || isNormalUrl) ? url : (blobCache[url] || null));
  const [loading, setLoading] = useState(!isBase64 && !isNormalUrl && !blobCache[url]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isBase64 || isNormalUrl) {
      setSrc(url);
      setLoading(false);
      return;
    }
    
    if (blobCache[url]) {
      setSrc(blobCache[url]);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      const token = getAccessToken();
      if (!token || !url) {
        setLoading(false);
        setError(true);
        return;
      }

      // Try multiple regex patterns for Drive ID
      let fileId = null;
      const idParamMatch = url.match(/id=([-\w]{25,})/);
      const dPathMatch = url.match(/\/d\/([-\w]{25,})/);
      const rawIdMatch = url.match(/^([-\w]{25,})$/);

      if (idParamMatch) fileId = idParamMatch[1];
      else if (dPathMatch) fileId = dPathMatch[1];
      else if (rawIdMatch) fileId = rawIdMatch[1];

      if (!fileId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        // Use thumbnail API first (faster)
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        blobCache[url] = blobUrl;
        setSrc(blobUrl);
      } catch (err) {
        console.error("Drive image fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [url]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-white/5 ${className}`}>
        <Loader2 className="w-5 h-5 text-accent animate-spin opacity-50" />
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-white/5 text-muted ${className}`}>
        <ImageIcon className="w-5 h-5 opacity-20" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || "Content"} 
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};
