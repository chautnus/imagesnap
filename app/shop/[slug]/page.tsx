import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Leaf, Droplets, Sun, Wind, Thermometer, FlaskConical, Package } from 'lucide-react';
import { products, getProductBySlug, getRelatedProducts } from '../lib/products';
import ProductCard from '../components/ProductCard';
import AddToCartButton from './AddToCartButton';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

const careIcons: Record<string, React.ElementType> = {
  light: Sun,
  water: Droplets,
  humidity: Wind,
  temperature: Thermometer,
  soil: FlaskConical,
  fertilizer: Leaf,
};

const careLabels: Record<string, string> = {
  light: 'Light',
  water: 'Watering',
  humidity: 'Humidity',
  temperature: 'Temperature',
  soil: 'Soil Mix',
  fertilizer: 'Fertilizer',
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#8A8A8A] mb-8">
        <Link href="/shop" className="hover:text-[#4A7C59] transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          All Plants
        </Link>
        <span>/</span>
        <span className="text-[#1C1C1C] font-medium truncate">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F2EC]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#C4622D] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.scientificName && (
            <p className="text-[#8A8A8A] text-sm italic mb-1">{product.scientificName}</p>
          )}
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-3">
            {product.name}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-xs text-[#4A7C59] bg-[#EAF2EC] px-3 py-1 rounded-full font-medium"
              >
                <Leaf className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-[#1C1C1C]">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-lg text-[#9A9A9A] line-through">${product.comparePrice.toFixed(2)}</span>
            )}
            <span className="text-sm text-[#8A8A8A]">CAD</span>
          </div>

          {/* Stock */}
          {product.inStock ? (
            <div className="flex items-center gap-2 mb-5 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] inline-block" />
              <span className="text-[#4A7C59] font-medium">In stock</span>
              {product.stockCount !== undefined && product.stockCount <= 3 && (
                <span className="text-[#C4622D]">— only {product.stockCount} left</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-5 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#9A9A9A] inline-block" />
              <span className="text-[#9A9A9A]">Sold out</span>
            </div>
          )}

          <p className="text-[#4A4A4A] leading-relaxed mb-6">{product.shortDescription}</p>

          <AddToCartButton product={product} />

          {/* Shipping info */}
          <div className="mt-4 flex items-start gap-3 bg-[#F5F2EC] rounded-2xl p-4 text-sm">
            <Package className="w-4 h-4 text-[#4A7C59] mt-0.5 flex-shrink-0" />
            <div className="text-[#4A4A4A]">
              <p className="font-medium text-[#1C1C1C]">Shipping from {product.shipsFrom}</p>
              <p>Ships Monday–Wednesday via Canada Post Xpresspost. Heat pack included Oct–Apr.</p>
            </div>
          </div>

          {/* Full description */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1C1C1C] mb-3">
              About this plant
            </h3>
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#4A4A4A] leading-relaxed mb-3">
                {para}
              </p>
            ))}
          </div>

          {/* Pot size */}
          {product.potSize && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#EAF2EC] text-[#4A7C59] text-sm px-3 py-1.5 rounded-full">
              <span className="font-medium">Comes in:</span> {product.potSize}
            </div>
          )}
        </div>
      </div>

      {/* Care guide */}
      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C1C1C] mb-6">
          Care Guide
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(product.care).map(([key, value]) => {
            const Icon = careIcons[key] ?? Leaf;
            return (
              <div key={key} className="bg-white border border-[#EDE8E0] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF2EC] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#4A7C59]" />
                  </div>
                  <span className="font-semibold text-[#1C1C1C] text-sm">{careLabels[key] ?? key}</span>
                </div>
                <p className="text-[#6A6A6A] text-xs leading-relaxed">{value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C1C1C] mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
