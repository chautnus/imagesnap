import Link from 'next/link';
import { Leaf, Instagram, Mail, MapPin } from 'lucide-react';

export default function ShopFooter() {
  return (
    <footer className="bg-[#1C2B1F] text-[#B8C9B0] mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-semibold text-lg">OrangesHome</span>
            </div>
            <p className="text-sm leading-relaxed text-[#8A9E84] mb-4">
              Rare and uncommon Hoya plants, lovingly grown in our small greenhouse in British Columbia, Canada.
            </p>
            <div className="flex items-center gap-1 text-sm text-[#8A9E84]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>British Columbia, Canada</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'All Plants', href: '/shop' },
                { label: 'Hoya Collection', href: '/shop?category=hoya' },
                { label: 'Rare & Collectors', href: '/shop?category=rare' },
                { label: 'Mystery Plants', href: '/shop?category=mystery' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Information</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Shipping & Delivery', href: '/shop#shipping' },
                { label: 'Plant Care Guides', href: '/shop#care' },
                { label: 'About Us', href: '/shop#about' },
                { label: 'FAQ', href: '/shop#faq' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@orangeshome.ca"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  hello@orangeshome.ca
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/orangeshome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 flex-shrink-0" />
                  @orangeshome
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-[#243B28] rounded-xl text-xs text-[#8A9E84]">
              <p className="font-medium text-[#B8C9B0] mb-1">Shipping Info</p>
              <p>Ships Canada-wide via Xpresspost. Heat pack included Oct–Apr.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2D3F30] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6A8066]">
          <p>© {new Date().getFullYear()} OrangesHome. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/shop/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/shop/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
