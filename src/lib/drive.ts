import { getAccessToken } from './google-auth';

/**
 * Ensures a folder exists and returns its ID.
 */
export async function findOrCreateFolder(name: string, parentId?: string) {
  const token = getAccessToken();
  let query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();

  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create folder
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    })
  });
  const created = await createResponse.json();
  return created.id;
}

/**
 * Upload base64 image to Google Drive.
 */
export async function uploadBase64Image(base64: string, name: string, parentId: string) {
  const token = getAccessToken();
  
  // Strip metadata from base64 string
  const base64Data = base64.split(',')[1] || base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  const metadata = {
    name,
    parents: [parentId],
    mimeType: 'image/jpeg'
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
  
  // Make file public if needed, or just return view link
  // (Architecture says: Public view link (anyone with link))
  await fetch(`https://www.googleapis.com/drive/v3/files/${uploadData.id}/permissions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  return uploadData.webViewLink;
}

/**
 * Download a remote image and upload it to Google Drive.
 */
export async function uploadUrlImage(url: string, name: string, parentId: string) {
  const token = getAccessToken();
  
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
