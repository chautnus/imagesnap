import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Package, Truck, Heart, ChevronRight, Star } from 'lucide-react';
import { products } from './lib/products';
import ProductCard from './components/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Rare Hoya Plants — OrangesHome',
  description: 'Browse our collection of rare and uncommon Hoya plants, hand-propagated in BC, Canada. Free shipping on orders over $75.',
};

export default function ShopPage() {
  const hoyaProducts = products.filter((p) => p.category === 'hoya');
  const mysteryProducts = products.filter((p) => p.category === 'mystery');
  const featuredProduct = products.find((p) => p.badge === 'Rare' && p.inStock);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C2B1F] via-[#243B28] to-[#1C2B1F] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#4A7C59] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#C4622D] blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Leaf className="w-3.5 h-3.5 text-[#7EC896]" />
                <span className="text-[#B8D4B0]">Grown with love in BC, Canada</span>
              </div>

              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Rare Hoyas &amp;{' '}
                <span className="text-[#7EC896]">Tropical</span>{' '}
                Plants
              </h1>

              <p className="text-[#B8C9B0] text-lg leading-relaxed mb-8 max-w-md">
                Hand-propagated in our small greenhouse in British Columbia. Every plant is grown with care and shipped safely to your door, Canada-wide.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="bg-[#4A7C59] hover:bg-[#3A6449] text-white px-7 py-3.5 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  Shop Now
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#about"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Our Story
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-[#8A9E84]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#7EC896]" />
                  <span>Free shipping $75+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#7EC896]" />
                  <span>Secure packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#7EC896]" />
                  <span>Live arrival guarantee</span>
                </div>
              </div>
            </div>

            {/* Featured plant image */}
            {featuredProduct && (
              <div className="relative hidden md:block">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-[#4A7C59] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
                      ✦ Featured
                    </span>
                    <p className="text-white font-semibold text-lg">{featuredProduct.name}</p>
                    <p className="text-white/80 text-sm">${featuredProduct.price.toFixed(2)} CAD</p>
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-[#EDE8E0] w-40">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F5B849] text-[#F5B849]" />
                    ))}
                  </div>
                  <p className="text-[#1C1C1C] text-xs font-semibold">Verified customer</p>
                  <p className="text-[#6A6A6A] text-xs mt-0.5">"Arrived beautifully packaged!"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="border-b border-[#E8E0D0] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-0 scrollbar-hide">
            {[
              { label: 'All Plants', value: 'all', count: products.length },
              { label: 'Hoya Collection', value: 'hoya', count: hoyaProducts.length },
              { label: 'Mystery Plants', value: 'mystery', count: mysteryProducts.length },
            ].map((cat) => (
              <button
                key={cat.value}
                className="flex-shrink-0 px-5 py-4 text-sm font-medium border-b-2 border-[#4A7C59] text-[#4A7C59] first:border-b-2 transition-colors whitespace-nowrap"
              >
                {cat.label}
                <span className="ml-1.5 text-xs bg-[#EAF2EC] text-[#4A7C59] px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1C1C1C]">
              Hoya Collection
            </h2>
            <p className="text-[#6A6A6A] text-sm mt-1">
              {hoyaProducts.length} plants available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {hoyaProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* Mystery plants */}
        {mysteryProducts.length > 0 && (
          <>
            <div className="mt-16 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#E8E0D0]" />
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 bg-[#F0EDF8] text-[#4A3B7C] text-sm font-semibold px-4 py-2 rounded-full">
                    ✦ Mystery Collection
                  </span>
                </div>
                <div className="flex-1 h-px bg-[#E8E0D0]" />
              </div>
              <div className="text-center mt-4">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1C1C1C]">
                  Unidentified Wonders
                </h2>
                <p className="text-[#6A6A6A] text-sm mt-2 max-w-lg mx-auto">
                  Plants from our collection we haven't fully identified yet. Part of the fun is the discovery — help us name them!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mysteryProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* About section */}
      <section id="about" className="bg-[#F5F2EC] border-y border-[#E8E0D0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#4A7C59] font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1C1C1C] mt-2 mb-4">
                Small greenhouse,<br />big passion
              </h2>
              <div className="space-y-4 text-[#4A4A4A] leading-relaxed">
                <p>
                  OrangesHome started as a personal obsession with Hoya plants — those remarkable wax vines from the tropical forests of Asia and Australia. What began as a small windowsill collection has grown into a dedicated greenhouse where we propagate and nurture rare and uncommon varieties.
                </p>
                <p>
                  Based in British Columbia, we grow every plant ourselves. No mass production, no middlemen — just carefully tended plants that we're proud to share with fellow plant lovers across Canada.
                </p>
                <p>
                  Our mystery plant series is something we're especially proud of: unknown cultivars and possible hybrids that we grow with curiosity, inviting our community to help identify them.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {hoyaProducts.slice(0, 4).map((product, i) => (
                <div key={product.slug} className={`relative aspect-square rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : ''}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping info */}
      <section id="shipping" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1C1C1C]">
            Safe delivery, every time
          </h2>
          <p className="text-[#6A6A6A] mt-2">We package every plant by hand to ensure it arrives healthy</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Package,
              title: 'Expert packaging',
              desc: 'Every plant is individually wrapped, cushioned, and secured. Moisture-retaining wrap keeps roots hydrated in transit.',
            },
            {
              icon: Truck,
              title: 'Canada Post Xpresspost',
              desc: 'Ships Monday–Wednesday to minimize weekend delays. Tracking provided. Heat packs included October through April.',
            },
            {
              icon: Heart,
              title: 'Live arrival guarantee',
              desc: 'If your plant arrives dead or severely damaged, we\'ll make it right. Just email us within 24 hours of delivery with a photo.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-[#EDE8E0]">
              <div className="w-10 h-10 bg-[#EAF2EC] rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#4A7C59]" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C] mb-2">{title}</h3>
              <p className="text-[#6A6A6A] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#EAF2EC] border border-[#C8DEC8] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Truck className="w-6 h-6 text-[#4A7C59] flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#1C1C1C]">Free shipping on orders over $75 CAD</p>
            <p className="text-[#4A7C59] text-sm">Standard shipping $12.99 · Express available at checkout</p>
          </div>
        </div>
      </section>

      {/* Care section */}
      <section id="care" className="bg-[#1C2B1F] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <span className="text-[#7EC896] font-medium text-sm uppercase tracking-wider">Care Guides</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold mt-2">
              Keeping your Hoyas happy
            </h2>
            <p className="text-[#8A9E84] mt-2 max-w-lg mx-auto">
              Hoyas are wonderfully low-maintenance once you understand their simple needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: '☀️', title: 'Light', tip: 'Bright indirect light is ideal. A few hours of gentle morning sun helps trigger blooming. Avoid harsh afternoon sun which can bleach leaves.' },
              { emoji: '💧', title: 'Water', tip: 'Less is more! Allow the soil to dry out between waterings. Overwatering is the #1 cause of Hoya decline. They store water in their waxy leaves.' },
              { emoji: '💨', title: 'Humidity', tip: 'Most Hoyas prefer 50–70% humidity. A pebble tray with water or a small humidifier near your plant collection works wonders.' },
              { emoji: '🌡️', title: 'Temperature', tip: 'Keep between 18–30°C (65–86°F). They dislike cold drafts and temperatures below 10°C. Keep away from air conditioning vents.' },
              { emoji: '🌱', title: 'Soil', tip: 'Use a chunky, well-draining mix. Equal parts potting mix, perlite, and orchid bark is excellent. Avoid heavy soils that stay wet.' },
              { emoji: '🌸', title: 'Blooming', tip: 'Never remove old peduncles (flower spurs) — new blooms emerge from the same spot. Root-bound plants bloom more readily. Reduce watering slightly in winter.' },
            ].map(({ emoji, title, tip }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-[#8A9E84] text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">
          Questions? We love talking plants
        </h2>
        <p className="text-[#6A6A6A] mb-6 max-w-md mx-auto">
          Whether you need help choosing a plant, have a care question, or want to know about upcoming stock — we'd love to hear from you.
        </p>
        <a
          href="mailto:hello@orangeshome.ca"
          className="inline-flex items-center gap-2 bg-[#4A7C59] hover:bg-[#3A6449] text-white px-8 py-3.5 rounded-full font-medium transition-colors"
        >
          Email hello@orangeshome.ca
          <ChevronRight className="w-4 h-4" />
        </a>
      </section>
    </>
  );
}
