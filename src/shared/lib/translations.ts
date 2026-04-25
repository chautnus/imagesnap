const TRANSLATIONS: Record<string, Record<string, string>> = {
  'plant id': { vi: 'Mã cây', en: 'Plant ID' },
  'plant name': { vi: 'Tên cây', en: 'Plant Name' },
  'description': { vi: 'Mô tả', en: 'Description' },
  'size': { vi: 'Kích thước', en: 'Size' },
  'small': { vi: 'Nhỏ', en: 'Small' },
  'medium': { vi: 'Vừa', en: 'Medium' },
  'large': { vi: 'Lớn', en: 'Large' },
  'sunlight': { vi: 'Ánh sáng', en: 'Sunlight' },
  'last harvest': { vi: 'Ngày thu hoạch', en: 'Last Harvest' },
  'product link': { vi: 'Link sản phẩm', en: 'Product Link' },
  'sku': { vi: 'Mã SKU', en: 'SKU' },
  'material': { vi: 'Chất liệu', en: 'Material' },
  'plants': { vi: 'Cây cảnh', en: 'Plants' },
  'pots': { vi: 'Chậu', en: 'Pots' },
  'new category': { vi: 'Danh mục mới', en: 'New Category' },
  'product id': { vi: 'Mã sản phẩm', en: 'Product ID' },
  'new field': { vi: 'Trường mới', en: 'New Field' },
};

export function translate(text: string, lang: string): string {
  const cleanText = text.toLowerCase().trim();
  if (TRANSLATIONS[cleanText]) {
    return lang === 'vi' ? TRANSLATIONS[cleanText].vi : TRANSLATIONS[cleanText].en;
  }
  return text;
}
