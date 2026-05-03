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
        console.log(`[DriveImage] Fetching ${fileId}...`);
        // Try fetching metadata first to see if we can get a thumbnail or check permissions
        const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink,mimeType`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!metaRes.ok) {
          if (metaRes.status === 401 && typeof window !== 'undefined' && (window as any).chrome?.identity) {
             (window as any).chrome.identity.removeCachedAuthToken({ token }, () => console.log("Cleared expired token."));
             throw new Error("Token expired (401). Please close and reopen the extension to refresh.");
          }
          // Fallback: If 404 (due to Client ID mismatch/drive.file scope limitation) or other error,
          // try using the browser's native cookies to fetch the thumbnail directly via img src.
          console.warn(`[DriveImage] Metadata fetch failed (${metaRes.status}). Falling back to browser cookie auth.`);
          const fallbackUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
          blobCache[url] = fallbackUrl;
          setSrc(fallbackUrl);
          setLoading(false);
          return;
        }
        
        const metadata = await metaRes.json();
        console.log(`[DriveImage] Metadata found, type: ${metadata.mimeType}`);

        if (metadata.thumbnailLink) {
          // Drive provides a thumbnail URL. Replace size param with a larger one.
          const thumbUrl = metadata.thumbnailLink.replace(/=s\d+/, '=s800').replace(/=w\d+-h\d+/, '=w800-h800');
          blobCache[url] = thumbUrl;
          setSrc(thumbUrl);
          setLoading(false);
          return;
        }

        // Try media fetch if no thumbnail
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
           if (response.status === 401 && typeof window !== 'undefined' && (window as any).chrome?.identity) {
             (window as any).chrome.identity.removeCachedAuthToken({ token }, () => console.log("Cleared expired token."));
           }
           // Fallback to cookie method
           console.warn(`[DriveImage] Media fetch failed (${response.status}). Falling back to browser cookie auth.`);
           const fallbackUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
           blobCache[url] = fallbackUrl;
           setSrc(fallbackUrl);
           setLoading(false);
           return;
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        blobCache[url] = blobUrl;
        setSrc(blobUrl);
      } catch (err: any) {
        console.error("[DriveImage] Error:", err.message);
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
