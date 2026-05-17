import { getAccessToken, reauthenticate, setAccessToken } from './google-auth';
import { findOrCreateFolder } from './drive';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function sheetsRequest(path: string, options: any = {}, providedToken?: string, isStaff: boolean = false) {
  if (isStaff && typeof window !== 'undefined') {
    const API_BASE_URL = window.location.origin;
    const res = await fetch(`${API_BASE_URL}/api/proxy/get-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        spreadsheetId: path.split('/')[0], 
        range: path.includes('/values/') ? path.split('/values/')[1].split('?')[0] : undefined,
        path: !path.includes('/values/') ? path : undefined
      })
    });
    if (!res.ok) {
      const error = await res.json();
      const err: any = new Error(error.error || 'Proxy Sheets error');
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  const token = providedToken || getAccessToken();
  if (!token) throw new Error('No access token');

  const url = path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  let response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      const newToken = await reauthenticate();
      setAccessToken(newToken);
      response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } catch (reauthErr) {
      console.error("[SHEETS] Re-authentication failed:", reauthErr);
    }
  }

  if (!response.ok) {
    const error = await response.json();
    const msg = error.error?.message || 'Sheets API error';
    const err: any = new Error(msg);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function findOrCreateWorkspace() {
  const token = getAccessToken();
  
  // [AUDIT v1.10.17] Isolating workspace to 'ImageSnap Data' folder
  const FOLDER_NAME = 'ImageSnap Data';
  const parentFolderId = await findOrCreateFolder(FOLDER_NAME);

  // 1. Search ONLY inside the dedicated folder
  const query = `name='imagesnap.xlsx' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
  
  let gResponse = await fetch(searchUrl, { headers: { 'Authorization': `Bearer ${token}` } });
  
  if (gResponse.status === 401) {
    if (typeof window !== 'undefined') {
      try {
        await reauthenticate();
      } catch (e) {
        throw new Error("Request had invalid authentication credentials. Session expired.");
      }
    } else {
      throw new Error("Request had invalid authentication credentials. Session expired.");
    }
  }

  const gData = await gResponse.json();

  if (gData.files && gData.files.length > 0) {
    const existingId = gData.files[0].id;
    if (typeof window !== 'undefined' && (window as any)._pushDebug) {
      (window as any)._pushDebug(`[DRIVE] Found workspace in ${FOLDER_NAME}: ${existingId.substring(0,8)}`);
    }
    return existingId;
  }

  // 2. Create new spreadsheet if not found in folder
  if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug(`[DRIVE] Creating new workspace in ${FOLDER_NAME}...`);
  
  const createData = await sheetsRequest('', {
    method: 'POST',
    body: JSON.stringify({
      properties: { title: 'imagesnap.xlsx' },
      sheets: [
        { properties: { title: 'Categories' } },
        { properties: { title: 'Users' } },
        { properties: { title: 'ProductNames' } }
      ]
    })
  });

  const spreadsheetId = createData.spreadsheetId;

  // Move/Set parents in Drive v3
  await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${parentFolderId}&removeParents=root`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  await initWorkspaceHeaders(spreadsheetId, token);
  return spreadsheetId;
}

async function initWorkspaceHeaders(spreadsheetId: string, providedToken?: string) {
  const updates = [
    { range: 'Categories!A1:F1', values: [['ID', 'Name', 'Icon', 'Fields JSON', 'Updated At', '_deleted']] },
    { range: 'Users!A1:E1', values: [['ID', 'Username', 'Password', 'Role', 'Created At']] },
    { range: 'ProductNames!A1:B1', values: [['Category', 'Name']] }
  ];

  for (const update of updates) {
    await sheetsRequest(`${spreadsheetId}/values/${update.range}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ values: update.values })
    }, providedToken);
  }
}

export async function getSheetRows(spreadsheetId: string, range: string, providedToken?: string, isStaff: boolean = false) {
  try {
    const data = await sheetsRequest(`${spreadsheetId}/values/${range}`, {}, providedToken, isStaff);
    return data.values || [];
  } catch (err: any) {
    if (err.status === 404 || err.status === 400) return [];
    throw err;
  }
}

export async function getSpreadsheetMetadata(spreadsheetId: string, providedToken?: string, isStaff: boolean = false) {
  return sheetsRequest(`${spreadsheetId}`, {}, providedToken, isStaff);
}

export async function appendRow(spreadsheetId: string, range: string, values: any[], providedToken?: string) {
  return sheetsRequest(`${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    body: JSON.stringify({ values: [values] })
  }, providedToken);
}

export async function ensureSheetExists(spreadsheetId: string, sheetName: string, headers: string[], providedToken?: string) {
  const metadata = await sheetsRequest(`${spreadsheetId}`, {}, providedToken);
  const sheet = metadata.sheets.find((s: any) => s.properties.title === sheetName);

  if (!sheet) {
    await sheetsRequest(`${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: sheetName } } }]
      })
    }, providedToken);

    await sheetsRequest(`${spreadsheetId}/values/${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ values: [headers] })
    }, providedToken);
  }
}

export async function deleteRowBySearch(spreadsheetId: string, sheetName: string, id: string, providedToken?: string) {
  const rows = await getSheetRows(spreadsheetId, `${sheetName}!A:A`, providedToken);
  const rowIndex = rows.findIndex((r: any) => r[0] === id);
  if (rowIndex === -1) return;

  const metadata = await sheetsRequest(`${spreadsheetId}`, {}, providedToken);
  const sheet = metadata.sheets.find((s: any) => s.properties.title === sheetName);
  const sheetId = sheet.properties.sheetId;

  await sheetsRequest(`${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 }
        }
      }]
    })
  }, providedToken);
}

export async function updateRowBySearch(spreadsheetId: string, sheetName: string, id: string, values: any[], providedToken?: string) {
  const rows = await getSheetRows(spreadsheetId, `${sheetName}!A:A`, providedToken);
  const rowIndex = rows.findIndex((r: any) => r[0] === id);
  if (rowIndex === -1) throw new Error(`Row with ID ${id} not found in ${sheetName}`);

  const range = `${sheetName}!A${rowIndex + 1}`;
  return sheetsRequest(`${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values: [values] })
  }, providedToken);
}

export async function flushCloudLogs(logs: string[]) {
  if (logs.length === 0) return;
  const token = getAccessToken();
  const spreadsheetId = typeof window !== 'undefined' ? localStorage.getItem('ps_sheet_id') : null;
  if (!token || !spreadsheetId) return;

  try {
    await ensureSheetExists(spreadsheetId, 'Logs', ['Timestamp', 'Message'], token);
    const rows = logs.map(log => [new Date().toISOString(), log]);
    await sheetsRequest(`${spreadsheetId}/values/Logs!A:B:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      body: JSON.stringify({ values: rows })
    }, token);
  } catch (e) {
    console.error('Failed to flush logs to cloud:', e);
  }
}
