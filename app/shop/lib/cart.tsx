'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; slug: string }
  | { type: 'UPDATE_QTY'; slug: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.slug === action.product.slug);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.slug === action.product.slug ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.product.slug !== action.slug) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.product.slug !== action.slug) };
      }
      return {
        items: state.items.map((i) =>
          i.product.slug === action.slug ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    case 'HYDRATE':
      return { items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('orangeshome_cart');
      if (saved) {
        dispatch({ type: 'HYDRATE', items: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('orangeshome_cart', JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        count,
        total,
        addToCart: (product) => dispatch({ type: 'ADD', product }),
        removeFromCart: (slug) => dispatch({ type: 'REMOVE', slug }),
        updateQuantity: (slug, quantity) => dispatch({ type: 'UPDATE_QTY', slug, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
