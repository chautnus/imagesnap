export interface Product {
  slug: string;
  name: string;
  scientificName?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string[];
  category: 'hoya' | 'rare' | 'mystery';
  tags: string[];
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  shortDescription: string;
  description: string;
  care: {
    light: string;
    water: string;
    humidity: string;
    temperature: string;
    soil: string;
    fertilizer: string;
  };
  potSize?: string;
  shipsFrom: string;
}

export const products: Product[] = [
  {
    slug: 'h-lacunosa-obscura',
    name: 'Hoya Lacunosa × Obscura',
    scientificName: 'Hoya lacunosa × obscura',
    price: 32.99,
    comparePrice: 39.99,
    image: '/plants/h-lacunosa-obscura.jpg',
    category: 'hoya',
    tags: ['fragrant', 'rare hybrid', 'vining'],
    inStock: true,
    stockCount: 3,
    badge: 'Limited',
    shortDescription: 'A striking hybrid between two beloved Hoya species, featuring waxy, deeply veined leaves with extraordinary fragrance.',
    description: `The Hoya Lacunosa × Obscura is a rare natural hybrid that combines the best traits of both parent species. Inheriting the deeply grooved, lacunose texture from H. lacunosa and the rich, dark undertones from H. obscura, this plant is a collector's dream.

Grown in our small greenhouse in Canada, each plant is propagated from our own cuttings. You'll receive a rooted plant with 2–4 nodes, ready to climb or trail from a hanging planter.

This Hoya is known for its sweet, cinnamon-like fragrance that intensifies in the evening — a truly sensory experience. It blooms in small clusters of creamy white flowers.`,
    care: {
      light: 'Bright indirect light, 2–4 hours of morning sun ideal',
      water: 'Allow top 2″ of soil to dry completely between waterings',
      humidity: '50–70% — thrives with a pebble tray or humidifier',
      temperature: '18–28°C (65–82°F), protect from frost',
      soil: 'Well-draining mix: orchid bark + perlite + potting mix (1:1:1)',
      fertilizer: 'Balanced fertilizer at ¼ strength, monthly during growing season',
    },
    potSize: '4" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'h-leucantha',
    name: 'Hoya Leucantha',
    scientificName: 'Hoya leucantha',
    price: 27.99,
    image: '/plants/h-leucantha.jpg',
    category: 'hoya',
    tags: ['white flowers', 'compact', 'beginner-friendly'],
    inStock: true,
    stockCount: 5,
    shortDescription: 'One of the most prolific Hoya bloomers — pure white, star-shaped clusters of fragrant flowers on slender vines.',
    description: `Hoya leucantha is cherished among collectors for its reliable and abundant blooms. The name "leucantha" means white-flowered, and this species lives up to its name — producing stunning white to pale yellow umbels that perfume your home with a sweet, honey-like scent.

The narrow, elongated leaves grow on trailing or vining stems, making it perfect for hanging baskets or trained on a small trellis. This species is relatively forgiving and adapts well to indoor conditions, making it a great choice for both beginners and experienced Hoya growers.`,
    care: {
      light: 'Medium to bright indirect light',
      water: 'Water when the top inch of soil is dry',
      humidity: '40–60%',
      temperature: '16–30°C (60–86°F)',
      soil: 'Chunky, well-draining mix preferred',
      fertilizer: 'Balanced NPK monthly in spring and summer',
    },
    potSize: '4" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'h-minibelle',
    name: 'Hoya Minibelle',
    scientificName: 'Hoya × bella hybrid "Minibelle"',
    price: 24.99,
    image: '/plants/h-minibelle.jpg',
    category: 'hoya',
    tags: ['compact', 'hanging', 'easy care'],
    inStock: true,
    stockCount: 8,
    shortDescription: 'A compact, fast-growing Hoya perfect for small spaces — dainty star-shaped flowers in dusty pink and white.',
    description: `Hoya Minibelle is a hybrid cultivar beloved for its petite size and prolific flowering habit. The compact vining habit makes it ideal for small spaces — a windowsill, a kitchen shelf, or a small hanging pot.

Each peduncle (flower spur) produces clusters of 10–15 waxy, star-shaped flowers with a white corona and a vibrant pink center. Once the peduncle forms, never remove it — future blooms will emerge from the same spot season after season.

This is one of the most rewarding Hoyas to grow indoors, as it blooms readily even in relatively low light.`,
    care: {
      light: 'Medium indirect light to bright indirect light',
      water: 'Allow to dry between waterings — very drought tolerant once established',
      humidity: '40–60%',
      temperature: '16–28°C (60–82°F)',
      soil: 'Well-draining potting mix with added perlite',
      fertilizer: 'Low-nitrogen fertilizer encourages blooming',
    },
    potSize: '3" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'h-obscura',
    name: 'Hoya Obscura',
    scientificName: 'Hoya obscura',
    price: 34.99,
    comparePrice: 42.00,
    image: '/plants/h-obscura.jpg',
    category: 'hoya',
    tags: ['rare', 'dark foliage', 'collector'],
    inStock: true,
    stockCount: 2,
    badge: 'Rare',
    shortDescription: 'A collector\'s gem from the Philippines — remarkable dark foliage with reddish veins and salmon-pink blooms.',
    description: `Hoya obscura is a sought-after species from the Philippines, prized for its visually striking foliage and beautiful blooms. The elongated leaves display a deep green to bronze colouration with prominent lighter veins, giving the plant a jewel-like quality even when not in bloom.

When it does flower, it produces compact umbels of salmon-pink to orange flowers with a sweet, light fragrance. This Hoya prefers slightly more humidity than other species and rewards attentive growers with spectacular growth.

Stock is extremely limited — these plants are propagated slowly from our mother plant.`,
    care: {
      light: 'Bright indirect light — avoid harsh direct afternoon sun',
      water: 'Keep slightly more moist than other Hoyas, but never waterlogged',
      humidity: '60–80% preferred',
      temperature: '20–30°C (68–86°F)',
      soil: 'Mix with excellent drainage and some moisture retention: coco coir + perlite + bark',
      fertilizer: 'Diluted balanced fertilizer every 2–3 weeks during growth',
    },
    potSize: '4" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'h-odeteae',
    name: 'Hoya Odeteae',
    scientificName: 'Hoya odeteae',
    price: 38.99,
    image: '/plants/h-odeteae.jpg',
    category: 'hoya',
    tags: ['rare', 'unique foliage', 'collector'],
    inStock: true,
    stockCount: 2,
    badge: 'Rare',
    shortDescription: 'A rarely seen Hoya species with distinctly textured leaves and beautiful clustered blooms — a true collector\'s plant.',
    description: `Hoya odeteae is one of the lesser-known species in the Hoya world, making it a prized find for serious collectors. The leaves have a distinctive texture and shape that set it apart from the more common Hoyas. In its native habitat, it grows as an epiphyte in tropical forests.

Growing this plant is a rewarding challenge — it prefers slightly elevated humidity and benefits from being root-bound before blooming. Our plants are all hand-propagated and carefully selected for health and vigour.`,
    care: {
      light: 'Bright indirect light',
      water: 'Allow to partially dry between waterings',
      humidity: '55–75%',
      temperature: '20–30°C (68–86°F)',
      soil: 'Epiphytic mix: orchid bark, perlite, moss',
      fertilizer: 'Balanced orchid fertilizer at half strength monthly',
    },
    potSize: '4" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'd41-na6',
    name: 'Mystery Hoya "D41-NA6"',
    price: 19.99,
    image: '/plants/d41-na6.jpg',
    category: 'mystery',
    tags: ['mystery', 'unidentified', 'special'],
    inStock: true,
    stockCount: 4,
    badge: 'Mystery',
    shortDescription: 'An unidentified Hoya cultivar from our breeding program — distinctive features unlike anything in current catalogs.',
    description: `This is one of our special "mystery" plants — an unidentified Hoya cultivar that we've been growing for years but have not yet matched to a named species. It shows characteristics of multiple Hoya species, suggesting it may be a natural hybrid or a rare undescribed variety.

Part of the fun of owning a mystery plant is the discovery process. We invite our customers to share photos and help identify these intriguing specimens. Who knows — you might be growing a plant that hasn't been officially named yet!

All mystery plants are healthy, well-rooted cuttings or small potted specimens.`,
    care: {
      light: 'Bright indirect light',
      water: 'Standard Hoya care — allow to dry between waterings',
      humidity: '50–65%',
      temperature: '18–28°C (65–82°F)',
      soil: 'Well-draining mix',
      fertilizer: 'Balanced fertilizer monthly during growing season',
    },
    potSize: '3" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'd41-na7',
    name: 'Mystery Hoya "D41-NA7"',
    price: 19.99,
    image: '/plants/d41-na7.jpg',
    category: 'mystery',
    tags: ['mystery', 'unidentified', 'special'],
    inStock: true,
    stockCount: 3,
    badge: 'Mystery',
    shortDescription: 'Sister cultivar to NA6 with subtly different leaf morphology — another intriguing unknown from our collection.',
    description: `D41-NA7 is the sister cultivar to our popular D41-NA6 mystery plant, sharing the same lineage but displaying subtly different leaf shape, texture, and growth habit. Side-by-side, the differences become apparent — NA7 has slightly more elongated leaves with a different sheen.

These plants are propagated from our own greenhouse stock and are perfect conversation starters. Each plant comes with a care card and an invitation to join our community of plant detectives helping to identify our mystery collection.`,
    care: {
      light: 'Bright indirect light',
      water: 'Allow top 2″ to dry between waterings',
      humidity: '50–65%',
      temperature: '18–28°C (65–82°F)',
      soil: 'Well-draining mix with good aeration',
      fertilizer: 'Balanced fertilizer monthly',
    },
    potSize: '3" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
  {
    slug: 'na1',
    name: 'Mystery Hoya "NA-1"',
    price: 16.99,
    image: '/plants/na1.jpg',
    category: 'mystery',
    tags: ['mystery', 'starter', 'unidentified'],
    inStock: true,
    stockCount: 6,
    badge: 'Mystery',
    shortDescription: 'From our mystery series — an unidentified Hoya specimen with intriguing foliage and great potential.',
    description: `Our "NA" series represents plants from our collection that we are actively working to identify. NA-1 is a healthy, vigorous grower that has been in our collection for over two years. It grows readily and produces lush foliage that suggests it could be a hybrid or a less commonly catalogued species.

This is a budget-friendly way to start or expand your Hoya collection while potentially discovering something new. Perfect for those who love a botanical mystery!`,
    care: {
      light: 'Medium to bright indirect light',
      water: 'Allow to dry slightly between waterings',
      humidity: '45–65%',
      temperature: '18–28°C',
      soil: 'Standard well-draining Hoya mix',
      fertilizer: 'Monthly balanced fertilizer',
    },
    potSize: '3" nursery pot',
    shipsFrom: 'British Columbia, Canada',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 3): Product[] {
  return products
    .filter((p) => p.slug !== product.slug && (p.category === product.category || p.tags.some((t) => product.tags.includes(t))))
    .slice(0, count);
}
