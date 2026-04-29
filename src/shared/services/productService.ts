import { appendRow, ensureSheetExists, deleteRowBySearch } from '../lib/sheets';
import { findOrCreateFolder, uploadBase64Image, uploadUrlImage } from '../lib/drive';
import { Product, Category, AppData } from '../lib/types';

export async function saveProduct(
  spreadsheetId: string,
  product: Partial<Product>,
  base64Images: string[],
  categories: Category[],
  userSub?: string,
  userName?: string
) {
  const rootFolderId = await findOrCreateFolder('ImageSnap');
  const cat = categories.find(c => c.id === product.categoryId);
  if (!cat) throw new Error("Category not found");

  const keyField = cat.fields.find(f => f.type === 'key');
  const keyValue = keyField ? (product.data?.[keyField.id] || 'Unnamed') : (product.name || 'Unnamed');

  // Ensure Drive folders exist
  const catFolderId = await findOrCreateFolder(cat.name || 'Other', rootFolderId);
  const keyFolderId = await findOrCreateFolder(keyValue.toString(), catFolderId);

  const imageUrls = [];
  for (let i = 0; i < base64Images.length; i++) {
    const img = base64Images[i];
    const fileName = `${keyValue}-${(i + 1).toString().padStart(3, '0')}.jpg`;
    
    try {
      if (img.startsWith('data:')) {
        const url = await uploadBase64Image(img, fileName, keyFolderId);
        imageUrls.push(url);
      } else if (img.startsWith('http')) {
        // Attempt to upload remote URL. If CORS fails, it returns original URL.
        const url = await uploadUrlImage(img, fileName, keyFolderId);
        imageUrls.push(url);
      } else {
        imageUrls.push(img);
      }
    } catch (err) {
      console.error(`Failed to handle image ${i}:`, err);
      imageUrls.push(img); // Fallback to raw string
    }
  }

  const sheetTitle = cat.name.substring(0, 31);
  const headers = ['ID', 'Created At', 'Images', 'Name', 'Tags', 'Author ID', 'Author Name', ...cat.fields.map(f => f.label)];
  await ensureSheetExists(spreadsheetId, sheetTitle, headers);

  const id = `prod_${Date.now()}`;
  const createdAt = new Date().toISOString();
  const fieldValues = cat.fields.map(f => product.data?.[f.id] || '');

  const row = [
    id,
    createdAt,
    imageUrls.join(','),
    product.name || keyValue,
    (product.tags || []).join(','),
    userSub || '',
    userName || '',
    ...fieldValues
  ];

  await appendRow(spreadsheetId, `${sheetTitle}!A2`, row);

  return { id, keyValue };
}

export async function deleteProduct(spreadsheetId: string, categoryName: string, productId: string) {
  const sheetTitle = categoryName.substring(0, 31);
  // Delete by ID (column A)
  await deleteRowBySearch(spreadsheetId, sheetTitle, productId);
}
