'use client';

import Link from 'next/link';
import { ShoppingBag, Leaf, Menu, X } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useState } from 'react';

export default function ShopHeader() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFAF5]/95 backdrop-blur-sm border-b border-[#E8E0D0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center group-hover:bg-[#3A6449] transition-colors">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[#1C1C1C] font-semibold text-lg leading-none tracking-tight">Oranges</span>
              <span className="text-[#4A7C59] font-semibold text-lg leading-none tracking-tight">Home</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm text-[#4A4A4A] hover:text-[#1C1C1C] transition-colors font-medium">
              Shop
            </Link>
            <Link href="/shop#about" className="text-sm text-[#4A4A4A] hover:text-[#1C1C1C] transition-colors font-medium">
              About
            </Link>
            <Link href="/shop#care" className="text-sm text-[#4A4A4A] hover:text-[#1C1C1C] transition-colors font-medium">
              Care Guides
            </Link>
            <Link href="/shop#contact" className="text-sm text-[#4A4A4A] hover:text-[#1C1C1C] transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop/cart"
              className="relative flex items-center gap-2 bg-[#4A7C59] hover:bg-[#3A6449] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C4622D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-[#4A4A4A] hover:text-[#1C1C1C]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E8E0D0] py-4 flex flex-col gap-4">
            {['Shop', 'About', 'Care Guides', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/shop${item === 'Shop' ? '' : '#' + item.toLowerCase().replace(' ', '-')}`}
                className="text-[#4A4A4A] hover:text-[#1C1C1C] font-medium text-sm px-1"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
