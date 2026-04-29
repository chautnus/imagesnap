import { getAccessToken } from './google-auth';
import { findOrCreateFolder } from './drive';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function sheetsRequest(path: string, options: any = {}) {
  const token = getAccessToken();
  if (!token) throw new Error('No access token');

  const url = path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Sheets API error');
  }

  return response.json();
}

/**
 * Find or create the "ProductSnap Workspace" spreadsheet in the "ProductSnap Images" folder.
 */
export async function findOrCreateWorkspace() {
  const token = getAccessToken();
  
  // 1. First, try to find ANY existing imagesnap.xlsx spreadsheet on the user's Drive
  // ignore folder for a moment to prioritize data recovery
  const globalQuery = "name='imagesnap.xlsx' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
  const globalSearchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(globalQuery)}&fields=files(id, parents)`;
  
  const gResponse = await fetch(globalSearchUrl, { headers: { 'Authorization': `Bearer ${token}` } });
  const gData = await gResponse.json();

  if (gData.files && gData.files.length > 0) {
    const existingId = gData.files[0].id;
    console.log("Found existing workspace:", existingId);
    return existingId;
  }

  // 2. If not found globally, proceed with folder creation and new file
  const parentFolderId = await findOrCreateFolder('ImageSnap');

  // Create new spreadsheet
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

  // Move the spreadsheet to the folder if it's not already there
  // Note: sheets.create doesn't support 'parents' in body directly in v4, 
  // we use Drive v3 to move it if needed or just handle it if it was created in root.
  // Actually, Drive API v3 can be used to move files.
  await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${parentFolderId}&removeParents=root`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  await initWorkspaceHeaders(spreadsheetId);
  return spreadsheetId;
}

async function initWorkspaceHeaders(spreadsheetId: string) {
  const updates = [
    { range: 'Categories!A1:F1', values: [['ID', 'Name', 'Icon', 'Fields JSON', 'Updated At', '_deleted']] },
    { range: 'Users!A1:E1', values: [['ID', 'Username', 'Password', 'Role', 'Created At']] },
    { range: 'ProductNames!A1:B1', values: [['Category', 'Name']] }
  ];

  for (const update of updates) {
    await sheetsRequest(`${spreadsheetId}/values/${update.range}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ values: update.values })
    });
  }
}

export async function getSheetRows(spreadsheetId: string, range: string) {
  try {
    const data = await sheetsRequest(`${spreadsheetId}/values/${range}`);
    return data.values || [];
  } catch (err) {
    // If sheet doesn't exist, return empty
    return [];
  }
}

export async function getSpreadsheetMetadata(spreadsheetId: string) {
  return sheetsRequest(`${spreadsheetId}`);
}

export async function appendRow(spreadsheetId: string, range: string, values: any[]) {
  return sheetsRequest(`${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    body: JSON.stringify({ values: [values] })
  });
}

/**
 * Ensures a sheet exists with the given name and headers.
 * If header counts don't match, we assume the sheet might need updating or is new.
 */
export async function ensureSheetExists(spreadsheetId: string, sheetName: string, headers: string[]) {
  const metadata = await sheetsRequest(`${spreadsheetId}`);
  const sheet = metadata.sheets.find((s: any) => s.properties.title === sheetName);

  if (!sheet) {
    // Add sheet
    await sheetsRequest(`${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          { addSheet: { properties: { title: sheetName } } }
        ]
      })
    });

    // Add headers
    await sheetsRequest(`${spreadsheetId}/values/${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ values: [headers] })
    });
  }
}

export async function deleteRowBySearch(spreadsheetId: string, sheetName: string, id: string) {
  const rows = await getSheetRows(spreadsheetId, `${sheetName}!A:A`);
  const rowIndex = rows.findIndex((r: any) => r[0] === id);
  if (rowIndex === -1) return; // Already gone

  // To delete a row in v4, we use batchUpdate with deleteDimension
  // But wait, it's easier to just find the sheet ID first.
  const metadata = await sheetsRequest(`${spreadsheetId}`);
  const sheet = metadata.sheets.find((s: any) => s.properties.title === sheetName);
  const sheetId = sheet.properties.sheetId;

  await sheetsRequest(`${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            }
          }
        }
      ]
    })
  });
}

export async function updateRowBySearch(spreadsheetId: string, sheetName: string, id: string, values: any[]) {
  // Find current rows
  const rows = await getSheetRows(spreadsheetId, `${sheetName}!A:A`);
  const rowIndex = rows.findIndex((r: any) => r[0] === id);
  if (rowIndex === -1) throw new Error(`Row with ID ${id} not found in ${sheetName}`);

  const range = `${sheetName}!A${rowIndex + 1}`;
  return sheetsRequest(`${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values: [values] })
  });
}
