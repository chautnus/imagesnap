import { appendRow, updateRowBySearch, deleteRowBySearch } from '../lib/sheets';
import { Category } from '../lib/types';

export async function saveCategory(spreadsheetId: string, category: Category, isNew: boolean) {
  const row = [
    category.id,
    category.name,
    category.icon,
    JSON.stringify(category.fields),
    category.updatedAt,
    category._deleted ? 'TRUE' : 'FALSE'
  ];

  if (isNew) {
    await appendRow(spreadsheetId, 'Categories!A2', row);
  } else {
    // Search by ID (column A)
    await updateRowBySearch(spreadsheetId, 'Categories', category.id, row);
  }
}

export async function deleteCategory(spreadsheetId: string, categoryId: string) {
  // Hard delete from Categories sheet
  await deleteRowBySearch(spreadsheetId, 'Categories', categoryId);
}
