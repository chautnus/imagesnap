"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppData, Product, Category, User } from '../lib/types';
import { fetchAllAppData } from '../services/dataService';
import { saveProduct, deleteProduct } from '../services/productService';
import { saveCategory, deleteCategory } from '../services/categoryService';
import { appendRow } from '../lib/sheets';
import { apiClient } from '../lib/api-client';

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
  
  // Fix Stale Closure: Keep a ref of the current user for use in callbacks
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  const refreshData = useCallback(async (id: string) => {
    if (!id) return;
    setIsSyncing(true);
    try {
      const currentUser = userRef.current;
      const isStaff = currentUser?.email?.endsWith('@staff.imagesnap');
      
      if (typeof window !== 'undefined' && (window as any)._pushDebug) {
        (window as any)._pushDebug(`[DATA] Refreshing workspace: ${id} | Role: ${isStaff ? 'Staff' : 'Admin'}`);
      }

      const data = await fetchAllAppData(id, undefined, isStaff);
      
      // Only seed defaults for a genuinely new workspace: both categories AND productNames empty.
      if (data.categories.length === 0 && data.productNames.length === 0) {
        if (typeof window !== 'undefined' && (window as any)._pushDebug) {
          (window as any)._pushDebug(`[DATA] Workspace empty, seeding defaults...`);
        }
        for (const cat of DEFAULT_CATEGORIES) {
          await appendRow(id, 'Categories!A2:F', [
            cat.id, cat.name, cat.icon, JSON.stringify(cat.fields), cat.updatedAt, 'FALSE'
          ]);
        }
        const freshData = await fetchAllAppData(id, undefined, isStaff);
        setAppData(freshData);
      } else {
        setAppData(data);
        if (typeof window !== 'undefined' && (window as any)._pushDebug) {
          (window as any)._pushDebug(`[DATA] Successfully loaded ${data.categories.length} categories`);
        }
      }
    } catch (err) {
      console.error("[REFRESH_ERROR] Data fetch failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handleSaveProduct = async (product: Partial<Product>, base64Images: string[]) => {
    if (!spreadsheetId) return;
    setIsSyncing(true);
    try {
      const currentUser = userRef.current;
      const STAFF_DOMAIN = '@staff.imagesnap';
      const isStaff = currentUser?.email?.endsWith(STAFF_DOMAIN);

      if (isStaff) {
        const res = await fetch(`${API_BASE_URL}/api/proxy/save-product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spreadsheetId, product, base64Images })
        });
        if (!res.ok) throw new Error("Staff Proxy save failed");
        
        const response = await res.json();
        const kv = response.keyValue;

        const existsInNames = appData.productNames.some(pn => pn.categoryId === product.categoryId && pn.name === kv);
        if (!existsInNames && kv) {
          await appendRow(spreadsheetId, 'ProductNames!A2:B', [product.categoryId, kv]);
        }
      } else {
        const { keyValue } = await saveProduct(
          spreadsheetId,
          product,
          base64Images,
          appData.categories,
          currentUser?.id,
          currentUser?.username
        );

        const existsInNames = appData.productNames.some(pn => pn.categoryId === product.categoryId && pn.name === keyValue);
        if (!existsInNames && keyValue) {
          await appendRow(spreadsheetId, 'ProductNames!A2:B', [product.categoryId, keyValue]);
        }
      }

      await refreshData(spreadsheetId);

      if (currentUser?.email) {
        try {
          await apiClient(`${API_BASE_URL}/api/increment-usage`, {
            method: 'POST',
            body: JSON.stringify({ email: currentUser.email })
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
