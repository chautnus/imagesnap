'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../lib/cart';
import type { Product } from '../lib/products';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product.inStock) {
    return (
      <button disabled className="w-full bg-[#E8E0D0] text-[#9A9A9A] py-4 rounded-2xl font-medium cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-base transition-all ${
        added
          ? 'bg-[#1C6A3B] text-white'
          : 'bg-[#4A7C59] hover:bg-[#3A6449] text-white'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Add to Cart — ${product.price.toFixed(2)} CAD
        </>
      )}
    </button>
  );
}
