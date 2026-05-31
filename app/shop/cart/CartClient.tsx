'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Leaf } from 'lucide-react';
import { useCart } from '../lib/cart';

export default function CartClient() {
  const { items, count, total, removeFromCart, updateQuantity } = useCart();

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-[#EAF2EC] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-[#4A7C59]" />
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C1C1C] mb-3">
          Your cart is empty
        </h1>
        <p className="text-[#6A6A6A] mb-8">
          You haven't added any plants yet. Browse our collection and find your new green companion.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#4A7C59] hover:bg-[#3A6449] text-white px-8 py-3.5 rounded-full font-medium transition-colors"
        >
          <Leaf className="w-4 h-4" />
          Browse Plants
        </Link>
      </div>
    );
  }

  const shipping = total >= 75 ? 0 : 12.99;
  const orderTotal = total + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1C1C1C] mb-8">
        Your Cart ({count} {count === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.slug} className="flex gap-4 bg-white border border-[#EDE8E0] rounded-2xl p-4">
              <Link href={`/shop/${product.slug}`} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5F2EC]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/shop/${product.slug}`} className="font-semibold text-[#1C1C1C] text-sm hover:text-[#4A7C59] transition-colors line-clamp-2">
                    {product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(product.slug)}
                    className="text-[#9A9A9A] hover:text-[#C4622D] transition-colors flex-shrink-0 p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {product.scientificName && (
                  <p className="text-xs text-[#9A9A9A] italic mt-0.5">{product.scientificName}</p>
                )}

                <p className="text-xs text-[#6A6A6A] mt-1">{product.potSize}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.slug, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-[#E0D8CC] flex items-center justify-center text-[#4A4A4A] hover:border-[#4A7C59] hover:text-[#4A7C59] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.slug, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-[#E0D8CC] flex items-center justify-center text-[#4A4A4A] hover:border-[#4A7C59] hover:text-[#4A7C59] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-[#1C1C1C]">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#EDE8E0] rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-[#1C1C1C] text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#4A4A4A]">
                <span>Subtotal</span>
                <span>${total.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between text-[#4A4A4A]">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-[#4A7C59] font-medium">Free 🎉</span>
                ) : (
                  <span>${shipping.toFixed(2)} CAD</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#C4622D] bg-[#FEF3EC] px-3 py-2 rounded-xl">
                  Add ${(75 - total).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t border-[#EDE8E0] pt-3 flex justify-between font-bold text-[#1C1C1C]">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)} CAD</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#4A7C59] hover:bg-[#3A6449] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors">
              Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-[#8A8A8A] text-center mt-3">
              Secure checkout · Free shipping on $75+
            </p>

            <div className="mt-4 pt-4 border-t border-[#EDE8E0]">
              <Link href="/shop" className="text-sm text-[#4A7C59] hover:underline flex items-center justify-center gap-1">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
