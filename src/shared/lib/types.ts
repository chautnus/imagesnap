export interface Category {
  id: string;
  name: string;
  icon: string;
  fields: FieldDefinition[];
  updatedAt: string;
  _deleted?: boolean;
}

export interface FieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'url' | 'date' | 'time' | 'datetime' | 'key';
  required: boolean;
  options?: string[]; // For select field
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  images: string[]; // Google Drive view URLs
  tags: string[];
  authorId?: string;
  authorName?: string;
  data: Record<string, any>; // Dynamic fields
  createdAt: string;
  _deleted?: boolean;
}

export interface AppData {
  categories: Category[];
  products: Product[];
  productNames: { categoryId: string; name: string }[];
}

export interface SyncState {
  pendingChanges: PendingChange[];
  lastSyncTimestamp: number;
  isSyncing: boolean;
}

export interface PendingChange {
  id: string;
  type: 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT' | 'CREATE_CATEGORY' | 'UPDATE_CATEGORY' | 'DELETE_CATEGORY';
  data: any;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface SubscriptionStatus {
  isPro: boolean;
  limit: number;
  usage: number;
  isAdmin?: boolean;
  role?: string;
  appId?: string;
  registeredAt?: string;
  accessibleCategories?: string[];
}
