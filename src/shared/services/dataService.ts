import { getSheetRows, getSpreadsheetMetadata } from '../lib/sheets';
import { Category, Product, AppData } from '../lib/types';

// Fixed column positions in product sheets — must match the write order in sheets.ts
const COL_ID = 0;
const COL_CREATED_AT = 1;
const COL_IMAGES = 2;
const COL_NAME = 3;
const COL_TAGS = 4;
const COL_AUTHOR_ID = 5;
const COL_AUTHOR_NAME = 6;
const COL_CUSTOM_FIELDS_START = 7;

export async function fetchAllAppData(spreadsheetId: string, providedToken?: string, isStaff: boolean = false): Promise<AppData> {
  try {
    const [catRows, nameRows, metadata] = await Promise.all([
      getSheetRows(spreadsheetId, 'Categories!A2:F', providedToken, isStaff),
      getSheetRows(spreadsheetId, 'ProductNames!A2:B', providedToken, isStaff),
      getSpreadsheetMetadata(spreadsheetId, providedToken, isStaff)
    ]);

    const categories: Category[] = catRows.map((r: any) => {
      let fields = [];
      try {
        fields = JSON.parse(r[3] || '[]');
      } catch (e) {
        console.error("Failed to parse fields for category", r[0], e);
      }
      return {
        id: r[0],
        name: r[1],
        icon: r[2],
        fields: fields,
        updatedAt: r[4],
        _deleted: r[5] === 'TRUE'
      };
    });

    const activeCategories = categories.filter(c => !c._deleted);
    const allProducts: Product[] = [];

    await Promise.all(activeCategories.map(async (cat) => {
      const sheetTitle = cat.name.substring(0, 31);
      const exists = metadata.sheets.some((s: any) => s.properties.title === sheetTitle);
      if (!exists) return;

      const rows = await getSheetRows(spreadsheetId, `${sheetTitle}!A2:Z`, providedToken, isStaff);
      const catProds: Product[] = rows.map((r: any) => {
        const productData: Record<string, any> = {};
        cat.fields.forEach((field, fIdx) => {
          productData[field.id] = r[COL_CUSTOM_FIELDS_START + fIdx] || '';
        });

        return {
          id: r[COL_ID],
          createdAt: r[COL_CREATED_AT],
          images: (r[COL_IMAGES] || '').split(',').filter(Boolean),
          name: r[COL_NAME],
          tags: (r[COL_TAGS] || '').split(',').filter(Boolean),
          authorId: r[COL_AUTHOR_ID],
          authorName: r[COL_AUTHOR_NAME],
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
