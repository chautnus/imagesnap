'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Leaf } from 'lucide-react';
import { useCart } from '../lib/cart';
import type { Product } from '../lib/products';

interface Props {
  product: Product;
}

const badgeColors: Record<string, string> = {
  Rare: 'bg-[#8B1A1A] text-white',
  Limited: 'bg-[#C4622D] text-white',
  Mystery: 'bg-[#4A3B7C] text-white',
  New: 'bg-[#1C6A3B] text-white',
};

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#EDE8E0] hover:border-[#4A7C59]/40 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#F5F2EC]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[product.badge] ?? 'bg-[#4A7C59] text-white'}`}>
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white text-[#6A6A6A] text-sm font-medium px-4 py-1.5 rounded-full border border-[#DDD]">
              Sold Out
            </span>
          </div>
        )}
        {product.stockCount !== undefined && product.stockCount <= 3 && product.inStock && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[#C4622D] text-xs font-medium px-2.5 py-1 rounded-full">
              Only {product.stockCount} left
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-semibold text-[#1C1C1C] text-sm leading-tight group-hover:text-[#4A7C59] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {product.scientificName && (
          <p className="text-xs text-[#8A8A8A] italic mb-2">{product.scientificName}</p>
        )}

        <p className="text-xs text-[#6A6A6A] leading-relaxed mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center gap-1.5 mb-3">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-[#4A7C59] bg-[#EAF2EC] px-2 py-0.5 rounded-full"
            >
              <Leaf className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#1C1C1C]">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xs text-[#9A9A9A] line-through ml-1.5">${product.comparePrice.toFixed(2)}</span>
            )}
            <span className="text-xs text-[#8A8A8A] ml-1">CAD</span>
          </div>

          <button
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 bg-[#4A7C59] hover:bg-[#3A6449] disabled:bg-[#CCC] text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
