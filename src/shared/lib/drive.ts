import { getAccessToken } from './google-auth';

// In-memory folder ID cache (session-scoped, works in ext/web/PWA)
const _folderCache = new Map<string, string>();

function _folderKey(name: string, parentId?: string) {
  return `${parentId ?? 'root'}::${name}`;
}

function _getCachedFolder(name: string, parentId?: string): string | null {
  const key = _folderKey(name, parentId);
  if (_folderCache.has(key)) return _folderCache.get(key)!;
  try {
    const raw = localStorage.getItem(`imgsnap_fid_${key}`);
    if (raw) {
      const { id, ts } = JSON.parse(raw);
      if (Date.now() - ts < 86_400_000) { // 24h TTL
        _folderCache.set(key, id);
        return id;
      }
    }
  } catch {}
  return null;
}

function _setCachedFolder(name: string, parentId: string | undefined, id: string) {
  const key = _folderKey(name, parentId);
  _folderCache.set(key, id);
  try {
    localStorage.setItem(`imgsnap_fid_${key}`, JSON.stringify({ id, ts: Date.now() }));
  } catch {}
}

/**
 * Ensures a folder exists and returns its ID. Results are cached for 24h.
 */
export async function findOrCreateFolder(name: string, parentId?: string, providedToken?: string) {
  const cached = _getCachedFolder(name, parentId);
  if (cached) return cached;

  const token = providedToken || getAccessToken();
  let query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) query += ` and '${parentId}' in parents`;

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();

  if (data.files && data.files.length > 0) {
    _setCachedFolder(name, parentId, data.files[0].id);
    return data.files[0].id;
  }

  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    })
  });
  const created = await createResponse.json();
  _setCachedFolder(name, parentId, created.id);
  return created.id;
}

/**
 * Upload base64 image to Google Drive.
 */
export async function uploadBase64Image(base64: string, name: string, parentId: string, providedToken?: string) {
  const token = providedToken || getAccessToken();

  // Use native fetch to decode data URL — ~10x faster than manual charCodeAt loop
  const blob = await fetch(base64).then(r => r.blob());

  const metadata = { name, parents: [parentId], mimeType: 'image/jpeg' };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const [uploadData] = await Promise.all([
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,thumbnailLink', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    }).then(r => r.json())
  ]);

  // Set public permission in parallel with nothing else to await — fire and return
  fetch(`https://www.googleapis.com/drive/v3/files/${uploadData.id}/permissions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  return uploadData.webViewLink;
}

/**
 * Download a remote image and upload it to Google Drive.
 */
export async function uploadUrlImage(url: string, name: string, parentId: string, providedToken?: string) {
  const token = providedToken || getAccessToken();
  
  try {
    let response;
    try {
      response = await fetch(url);
      if (!response.ok) throw new Error("Direct fetch failed");
    } catch (e) {
      console.log(`Direct fetch failed for ${url}, trying server proxy...`);
      // Try local proxy if direct fetch fails (usual for cross-origin images)
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    
    const metadata = {
      name,
      parents: [parentId],
      mimeType: blob.type || 'image/jpeg'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,thumbnailLink', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    });

    const uploadData = await uploadResponse.json();
    
    await fetch(`https://www.googleapis.com/drive/v3/files/${uploadData.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    });

    return uploadData.webViewLink;
  } catch (error) {
    console.error('Failed to download/upload remote image:', error);
    // Return original URL as fallback if download fails (CORS etc)
    return url;
  }
}
