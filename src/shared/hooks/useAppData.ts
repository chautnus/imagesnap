import { useState, useCallback } from 'react';
import { AppData, Product, Category, User } from '../lib/types';
import { fetchAllAppData } from '../services/dataService';
import { saveProduct, deleteProduct } from '../services/productService';
import { saveCategory, deleteCategory } from '../services/categoryService';
import { appendRow } from '../lib/sheets';

const API_BASE_URL = (typeof window !== 'undefined' && 
  (window.location.protocol === 'extension:' || 
   window.location.protocol === 'chrome-extension:' || 
   window.location.protocol === 'ms-browser-extension:')) 
  ? 'https://www.imagesnap.cloud' 
  : '';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'plants',
    name: 'Plants',
    icon: '🌿',
    fields: [
      { id: 'plant_id', label: 'Plant ID', type: 'key', required: true },
      { id: 'plant_name_field', label: 'Plant Name', type: 'text', required: false },
      { id: 'description', label: 'Description', type: 'text', required: false },
      { id: 'size', label: 'Size', type: 'select', required: false, options: ['Small', 'Medium', 'Large'] },
      { id: 'sunlight', label: 'Sunlight', type: 'text', required: false },
      { id: 'last_harvest', label: 'Last Harvest', type: 'date', required: false },
      { id: 'source_url', label: 'Product Link', type: 'url', required: false }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pots',
    name: 'Pots',
    icon: '🏺',
    fields: [
      { id: 'pot_sku', label: 'SKU', type: 'key', required: true },
      { id: 'material', label: 'Material', type: 'text', required: false },
      { id: 'source_url', label: 'Product Link', type: 'url', required: false }
    ],
    updatedAt: new Date().toISOString()
  }
];

export function useAppData(spreadsheetId: string | null, user: User | null) {
  const [appData, setAppData] = useState<AppData>({
    categories: [],
    products: [],
    productNames: []
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshData = useCallback(async (id: string) => {
    setIsSyncing(true);
    try {
      const data = await fetchAllAppData(id);
      
      if (data.categories.length === 0) {
        // Initialize with defaults if empty
        for (const cat of DEFAULT_CATEGORIES) {
          await appendRow(id, 'Categories!A2:F', [
            cat.id, cat.name, cat.icon, JSON.stringify(cat.fields), cat.updatedAt, 'FALSE'
          ]);
        }
        const freshData = await fetchAllAppData(id);
        setAppData(freshData);
      } else {
        setAppData(data);
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handleSaveProduct = async (product: Partial<Product>, base64Images: string[]) => {
    if (!spreadsheetId) return;
    setIsSyncing(true);
    try {
      // Check if user is staff (staff email format)
      const isStaff = user?.email?.endsWith('@staff.imagesnap');

      if (isStaff) {
        // Staff Proxy Save
        const res = await fetch(`${API_BASE_URL}/api/proxy/save-product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            spreadsheetId, 
            product, 
            base64Images,
            // The server will use the Admin's token stored in config
          })
        });
        if (!res.ok) throw new Error("Staff Proxy save failed");
      } else {
        // Admin Direct Save
        const { keyValue } = await saveProduct(
          spreadsheetId,
          product,
          base64Images,
          appData.categories,
          user?.id,
          user?.username
        );

        // Also handle product naming suggestions
        const existsInNames = appData.productNames.some(pn => pn.categoryId === product.categoryId && pn.name === keyValue);
        if (!existsInNames) {
          await appendRow(spreadsheetId, 'ProductNames!A2:B', [product.categoryId, keyValue]);
        }
      }

      await refreshData(spreadsheetId);

      // Increment usage on server
      if (user?.email) {
        try {
          await fetch(`${API_BASE_URL}/api/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
        } catch (e) { console.error("Failed to increment usage", e); }
      }
    } catch (err) {
      console.error("Save product error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!spreadsheetId) return;
    setIsSyncing(true);
    try {
      const product = appData.products.find(p => p.id === productId);
      const cat = appData.categories.find(c => c.id === product?.categoryId);
      if (product && cat) {
        await deleteProduct(spreadsheetId, cat.name, productId);
        await refreshData(spreadsheetId);
      }
    } catch (err) {
      console.error("Delete product error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    if (!spreadsheetId) return;
    setIsSyncing(true);
    try {
      const isNew = !appData.categories.some(c => c.id === cat.id);
      await saveCategory(spreadsheetId, cat, isNew);
      await refreshData(spreadsheetId);
    } catch (err) {
      console.error("Save category error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!spreadsheetId) return;
    setIsSyncing(true);
    try {
      await deleteCategory(spreadsheetId, categoryId);
      await refreshData(spreadsheetId);
    } catch (err) {
      console.error("Delete category error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    appData,
    isSyncing,
    refreshData,
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveCategory,
    handleDeleteCategory
  };
}
