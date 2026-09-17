import { appendRow, ensureSheetExists, deleteRowBySearch, updateRowBySearch, getSheetRows } from '../lib/sheets';
import { findOrCreateFolder, uploadBase64Image, uploadUrlImage } from '../lib/drive';
import { Product, Category, AppData } from '../lib/types';

export async function saveProduct(
  spreadsheetId: string,
  product: Partial<Product>,
  base64Images: string[],
  categories: Category[],
  userSub?: string,
  userName?: string,
  providedToken?: string
) {
  const rootFolderId = await findOrCreateFolder('ImageSnap Data', undefined, providedToken);
  const cat = categories.find(c => c.id === product.categoryId);
  if (!cat) throw new Error("Category not found");

  const keyField = cat.fields.find(f => f.type === 'key');
  const keyValue = keyField ? (product.data?.[keyField.id] || 'Unnamed') : (product.name || 'Unnamed');

  // Ensure Drive folders exist
  const catFolderId = await findOrCreateFolder(cat.name || 'Other', rootFolderId, providedToken);
  const keyFolderId = await findOrCreateFolder(keyValue.toString(), catFolderId, providedToken);

  const imageUrls = await Promise.all(
    base64Images.map(async (img, i) => {
      const fileName = `${keyValue}-${(i + 1).toString().padStart(3, '0')}.jpg`;
      try {
        if (img.startsWith('data:')) return await uploadBase64Image(img, fileName, keyFolderId, providedToken);
        if (img.startsWith('http')) return await uploadUrlImage(img, fileName, keyFolderId, providedToken);
        return img;
      } catch (err) {
        console.error(`Failed to handle image ${i}:`, err);
        return img;
      }
    })
  );

  const sheetTitle = cat.name.substring(0, 31);
  const headers = ['ID', 'Created At', 'Images', 'Name', 'Tags', 'Author ID', 'Author Name', ...cat.fields.map(f => f.label), 'Folder Link'];
  await ensureSheetExists(spreadsheetId, sheetTitle, headers, providedToken);

  const id = `prod_${Date.now()}`;
  const createdAt = new Date().toISOString();
  const fieldValues = cat.fields.map(f => product.data?.[f.id] || '');
  const folderUrl = `https://drive.google.com/drive/folders/${keyFolderId}`;

  const row = [
    id,
    createdAt,
    imageUrls.join(','),
    product.name || keyValue,
    (product.tags || []).join(','),
    userSub || '',
    userName || '',
    ...fieldValues,
    folderUrl
  ];

  await appendRow(spreadsheetId, `${sheetTitle}!A2`, row, providedToken);

  return { id, keyValue };
}

export async function updateProduct(
  spreadsheetId: string,
  product: Product,
  categories: Category[],
  providedToken?: string
) {
  const cat = categories.find(c => c.id === product.categoryId);
  if (!cat) throw new Error("Category not found");

  const sheetTitle = cat.name.substring(0, 31);
  const fieldValues = cat.fields.map(f => product.data?.[f.id] || '');

  const rows = await getSheetRows(spreadsheetId, `${sheetTitle}!A:Z`, providedToken);
  const currentRow = rows.find((r: any) => r[0] === product.id);
  const folderColIdx = 7 + cat.fields.length;
  let existingFolderLink = currentRow?.[folderColIdx] || '';

  if (!existingFolderLink.startsWith('https://drive.google.com/drive/folders/')) {
    const keyField = cat.fields.find(f => f.type === 'key');
    const keyValue = keyField ? (product.data?.[keyField.id] || 'Unnamed') : (product.name || 'Unnamed');
    const rootFolderId = await findOrCreateFolder('ImageSnap Data', undefined, providedToken);
    const catFolderId = await findOrCreateFolder(cat.name || 'Other', rootFolderId, providedToken);
    const keyFolderId = await findOrCreateFolder(keyValue.toString(), catFolderId, providedToken);
    existingFolderLink = `https://drive.google.com/drive/folders/${keyFolderId}`;
  }

  const row = [
    product.id,
    product.createdAt,
    (product.images || []).join(','),
    product.name,
    (product.tags || []).join(','),
    product.authorId || '',
    product.authorName || '',
    ...fieldValues,
    existingFolderLink
  ];

  await updateRowBySearch(spreadsheetId, sheetTitle, product.id, row, providedToken);

  return { id: product.id, keyValue: product.name };
}

export async function deleteProduct(spreadsheetId: string, categoryName: string, productId: string) {
  const sheetTitle = categoryName.substring(0, 31);
  // Delete by ID (column A)
  await deleteRowBySearch(spreadsheetId, sheetTitle, productId);
}
