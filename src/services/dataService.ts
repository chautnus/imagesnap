import { getSheetRows, getSpreadsheetMetadata } from '../lib/sheets';
import { Category, Product, AppData } from '../lib/types';

export async function fetchAllAppData(spreadsheetId: string): Promise<AppData> {
  try {
    const [catRows, nameRows, metadata] = await Promise.all([
      getSheetRows(spreadsheetId, 'Categories!A2:F'),
      getSheetRows(spreadsheetId, 'ProductNames!A2:B'),
      getSpreadsheetMetadata(spreadsheetId)
    ]);

    const categories: Category[] = catRows.map((r: any) => ({
      id: r[0],
      name: r[1],
      icon: r[2],
      fields: JSON.parse(r[3] || '[]'),
      updatedAt: r[4],
      _deleted: r[5] === 'TRUE'
    }));

    const activeCategories = categories.filter(c => !c._deleted);
    const allProducts: Product[] = [];

    await Promise.all(activeCategories.map(async (cat) => {
      const sheetTitle = cat.name.substring(0, 31);
      const exists = metadata.sheets.some((s: any) => s.properties.title === sheetTitle);
      if (!exists) return;

      const rows = await getSheetRows(spreadsheetId, `${sheetTitle}!A2:Z`);
      const catProds: Product[] = rows.map((r: any) => {
        const productData: Record<string, any> = {};
        cat.fields.forEach((field, fIdx) => {
          // Field values start after the standard columns (ID, CreatedAt, Images, Name, Tags, AuthID, AuthName -> index 7)
          productData[field.id] = r[7 + fIdx] || '';
        });

        return {
          id: r[0],
          createdAt: r[1],
          images: (r[2] || '').split(',').filter(Boolean),
          name: r[3],
          tags: (r[4] || '').split(',').filter(Boolean),
          authorId: r[5],
          authorName: r[6],
          categoryId: cat.id,
          data: productData
        };
      });
      allProducts.push(...catProds);
    }));

    const productNames = nameRows.map((r: any) => ({ categoryId: r[0], name: r[1] }));

    return {
      categories,
      products: allProducts,
      productNames
    };
  } catch (err) {
    console.error("Data fetch error in dataService:", err);
    throw err;
  }
}
