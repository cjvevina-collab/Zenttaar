export interface ColorwayOption {
  name: string;
  hex: string;
}

export interface PriceTier {
  range: string;
  price: number;
}

export interface GarmentProduct {
  id: string;
  name: string;
  category: 'Hoodies' | 'Sets & Outerwear' | 'Custom Blanks' | 'Streetwear Tees';
  gsm: string;
  moq: number;
  priceRange: string;
  basePrice: number;
  priceTiers: PriceTier[];
  leadTime: string;
  fabric: string;
  stitching: string;
  fit: string;
  image: string;
  fallbackImage: string;
  gallery: string[];
  tag: string;
  description: string;
  colorways: ColorwayOption[];
  techniques: string[];
  sizes: string[];
}

export interface BannerSlide {
  id: string;
  kicker: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  targetPage: PageRoute;
  image: string;
  fallbackImage: string;
  accentLabel: string;
}

export interface ProductionVideo {
  id: string;
  step: string;
  title: string;
  duration: string;
  department: string;
  summary: string;
  posterImage: string;
  fallbackPoster: string;
  videoUrl: string | null;
  specs: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  brand: string;
  location: string;
  orderMetric: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InquiryItem {
  uid: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  fallbackImage: string;
  gsm: string;
  colorway: string;
  technique: string;
  quantity: number;
  unitPriceEstimate: number;
  customNotes?: string;
  isCustomBuild?: boolean;
}

export type PageRoute =
  | 'home'
  | 'shop'
  | 'product'
  | 'about'
  | 'custom-order'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'returns';

export const BRAND_INFO = {
  name: 'Zenttaar Enterprises',
  domain: 'zenttaarenterprises.store',
  websiteUrl: 'http://zenttaarenterprises.store/',
  logoUrl: 'https://i.postimg.cc/J40Cmb4P/Zenttaar-Enterprises-Luxury-Apparel-Logo.png',
  backgroundUrl: 'https://i.postimg.cc/66YTYLmP/Whats-App-Image-2026-11-26-at-11-41-11-PM.jpg',
  fallbackBackdrop: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
  address: 'Factory Area, Shahab Pora Road, Sialkot',
  email: 'rayyanmughal188717@gmail.com',
  phone: '123456789',
  whatsappNumber: '123456789',
  instagramHandle: '@zenttarenterprises',
  instagramUrl: 'https://instagram.com/zenttarenterprises',
  facebookUrl: '#facebook',
  tiktokUrl: '#tiktok',
  youtubeUrl: '#youtube',
};

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    kicker: 'Sialkot Export Manufacturing · OEM & Private Label',
    headline: 'Heavyweight Luxury Hoodies Built From Your Tech Pack',
    subheadline:
      'From 480 GSM brushed fleece milling to precision 3D puff print and multi-head embroidery — engineered for global streetwear labels.',
    ctaPrimary: 'Custom Production',
    targetPage: 'custom-order',
    image: BRAND_INFO.backgroundUrl,
    fallbackImage: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
    accentLabel: 'MOQ Starting 50 Units',
  },
  {
    id: 'slide-2',
    kicker: 'Cut & Sew Atelier · Zero Compromise Craft',
    headline: 'Sharp Colorways, Acid Washes & Signature Silhouette Grading',
    subheadline:
      'Submit sketches, moodboards, or physical samples. Our pattern masters produce graded pre-production samples in 14 days.',
    ctaPrimary: 'Browse Full Shop',
    targetPage: 'shop',
    image: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
    fallbackImage: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    accentLabel: '14-Day Sample Turnaround',
  },
  {
    id: 'slide-3',
    kicker: 'Full-Package Apparel Production · Worldwide Dispatch',
    headline: 'High-Density Embroidery, Silicone Transfers & Custom Hardware',
    subheadline:
      'Complete private labeling with custom woven neck tags, engraved metal aglets, branded zip pulls, and retail-ready packaging.',
    ctaPrimary: 'Request Bulk Quote',
    targetPage: 'contact',
    image: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallbackImage: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
    accentLabel: 'DHL & Air Freight Export',
  },
];

export const GARMENTS: GarmentProduct[] = [
  {
    id: 'zen-hoodie-01',
    name: 'Sovereign Drop-Shoulder Hoodie',
    category: 'Hoodies',
    gsm: '500 GSM',
    moq: 50,
    priceRange: '$18 – $24',
    basePrice: 21,
    priceTiers: [
      { range: '50 – 99 pcs', price: 24 },
      { range: '100 – 249 pcs', price: 21 },
      { range: '250+ pcs', price: 18 },
    ],
    leadTime: '18–24 Days',
    fabric: '100% Combed Ring-Spun French Terry',
    stitching: 'Double-needle coverstitch with reinforced shoulder tape',
    fit: 'Oversized Boxy Drop-Shoulder',
    image: 'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
    fallbackImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    gallery: [
      'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
      '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
      '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    ],
    tag: 'Signature Cut',
    description:
      'Boxy architectural silhouette featuring a double-layered self-lined hood, clean no-drawstring neckline option, and dense 2x2 ribbed cuffs built for luxury streetwear labels.',
    colorways: [
      { name: 'Obsidian Black', hex: '#141418' },
      { name: 'Burnished Amber', hex: '#D97706' },
      { name: 'Crimson Ember', hex: '#DC2626' },
      { name: 'Chalk Bone', hex: '#E4E4E7' },
    ],
    techniques: ['3D Puff Print', 'High-Density Screen', 'Chain-Stitch Embroidery', 'Woven Label'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'zen-hoodie-02',
    name: 'Vanguard Enzyme-Wash Hoodie',
    category: 'Hoodies',
    gsm: '480 GSM',
    moq: 50,
    priceRange: '$20 – $26',
    basePrice: 23,
    priceTiers: [
      { range: '50 – 99 pcs', price: 26 },
      { range: '100 – 249 pcs', price: 23 },
      { range: '250+ pcs', price: 20 },
    ],
    leadTime: '20–25 Days',
    fabric: 'Heavy Brushed Fleece · Vintage Enzyme Wash',
    stitching: 'Raw-edge distressed seams with flatlock reinforcement',
    fit: 'Relaxed Cropped Boxy Fit',
    image: 'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    fallbackImage: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    gallery: [
      'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
      '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
      '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    ],
    tag: 'Custom Wash',
    description:
      'Garment-dyed and stone-enzyme washed for an authentic sun-faded patina. Engineered to hold oversized cracked screen prints, chenille appliqués, or heavy metallic embroidery.',
    colorways: [
      { name: 'Washed Slate', hex: '#27272A' },
      { name: 'Royal Cobalt', hex: '#2563EB' },
      { name: 'Emerald Deep', hex: '#059669' },
      { name: 'Crimson Rust', hex: '#B91C1C' },
    ],
    techniques: ['Acid / Enzyme Wash', 'Chenille Patch', 'Cracked Plastisol', 'Distressed Hem'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'zen-hoodie-03',
    name: 'Monarch Atelier Graphic Hoodie',
    category: 'Hoodies',
    gsm: '550 GSM',
    moq: 50,
    priceRange: '$22 – $29',
    basePrice: 25,
    priceTiers: [
      { range: '50 – 99 pcs', price: 29 },
      { range: '100 – 249 pcs', price: 25 },
      { range: '250+ pcs', price: 22 },
    ],
    leadTime: '21–28 Days',
    fabric: 'Ultra-Heavyweight Organic Cotton Fleece',
    stitching: 'Heavy gauge 4-thread overlock with kangaroo bar-tacks',
    fit: 'Structured Luxury Oversized',
    image: 'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
    fallbackImage: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    gallery: [
      'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
      '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
      '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    ],
    tag: '550 GSM Heavy',
    description:
      'Our flagship heavyweight luxury blank designed for statement graphic releases. Structured drape that holds shape effortlessly, paired with custom embossed hardware and neck branding.',
    colorways: [
      { name: 'Pitch Onyx', hex: '#09090B' },
      { name: 'Imperial Gold', hex: '#CA8A04' },
      { name: 'Scarlet Sharp', hex: '#E11D48' },
      { name: 'Forest Moss', hex: '#15803D' },
    ],
    techniques: ['3D Silicone Transfer', 'Multi-Head Embroidery', 'Rhinestone Studs', 'Custom Aglets'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'zen-set-04',
    name: 'Apex Heavy Fleece Tracksuit Set',
    category: 'Sets & Outerwear',
    gsm: '460 GSM',
    moq: 60,
    priceRange: '$31 – $39',
    basePrice: 35,
    priceTiers: [
      { range: '60 – 119 sets', price: 39 },
      { range: '120 – 249 sets', price: 35 },
      { range: '250+ sets', price: 31 },
    ],
    leadTime: '22–28 Days',
    fabric: '85% Combed Cotton / 15% Poly Anti-Pill Fleece',
    stitching: 'Reinforced crotch gusset & piped side-seam construction',
    fit: 'Boxy Top & Wide-Leg Jogger',
    image: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    fallbackImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    gallery: [
      '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
      '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    ],
    tag: '2-Piece Set',
    description:
      'Coordinated boxy hoodie and wide-leg cuffed or open-hem fleece joggers. Delivered with custom silicone-dipped drawstrings, tonal embroidery, and matched dye-lot consistency.',
    colorways: [
      { name: 'Charcoal Obsidian', hex: '#18181B' },
      { name: 'Cobalt Electric', hex: '#1D4ED8' },
      { name: 'Amber Gold', hex: '#D97706' },
      { name: 'Off-White Bone', hex: '#F4F4F5' },
    ],
    techniques: ['Tonal Satin Stitch', 'High-Density Print', 'Custom Zip Pulls', 'Branded Waistband'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'zen-outer-05',
    name: 'Heritage Wool & Leather Varsity',
    category: 'Sets & Outerwear',
    gsm: '620 GSM',
    moq: 35,
    priceRange: '$48 – $64',
    basePrice: 56,
    priceTiers: [
      { range: '35 – 99 pcs', price: 64 },
      { range: '100 – 249 pcs', price: 56 },
      { range: '250+ pcs', price: 48 },
    ],
    leadTime: '28–35 Days',
    fabric: 'Melton Wool Body · Full-Grain Cowhide Sleeves',
    stitching: 'Quilted satin lining with internal welt pocket',
    fit: 'Classic Tailored Streetwear',
    image: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallbackImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    gallery: [
      '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
      '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    ],
    tag: 'Cut & Sew Outerwear',
    description:
      'Crafted in Sialkot using premium Melton wool and supple full-grain leather sleeves. Supports custom chenille lettering, direct chain-stitching, and custom dyed snap buttons.',
    colorways: [
      { name: 'Black / Onyx Leather', hex: '#09090B' },
      { name: 'Crimson / Cream', hex: '#991B1B' },
      { name: 'Emerald / Gold', hex: '#065F46' },
    ],
    techniques: ['Chenille Appliqué', 'Chain-Stitch', 'Embossed Snaps', 'Quilted Jacquard Lining'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'zen-blank-06',
    name: 'Nocturne Full-Zip Boxy Hoodie',
    category: 'Custom Blanks',
    gsm: '450 GSM',
    moq: 50,
    priceRange: '$21 – $27',
    basePrice: 24,
    priceTiers: [
      { range: '50 – 99 pcs', price: 27 },
      { range: '100 – 249 pcs', price: 24 },
      { range: '250+ pcs', price: 21 },
    ],
    leadTime: '18–24 Days',
    fabric: 'Loopback Heavyweight Cotton Terry',
    stitching: 'Concealed YKK two-way antique brass or matte black zipper',
    fit: 'Cropped Drop-Shoulder Zip',
    image: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    fallbackImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    gallery: [
      '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
      'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
    ],
    tag: 'Private Label',
    description:
      'Engineered with a two-way heavy metal zipper, cropped boxy proportions, and split kangaroo pockets. Ready for full private-label transformation with custom care and neck labels.',
    colorways: [
      { name: 'Midnight Black', hex: '#111115' },
      { name: 'Crimson Flame', hex: '#DC2626' },
      { name: 'Electric Sapphire', hex: '#2563EB' },
      { name: 'Warm Sand', hex: '#D6D3D1' },
    ],
    techniques: ['Two-Way Custom Zip', 'Puff Screen Print', 'Subtle Chest Embroidery', 'Acid Wash'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
];

export const PRODUCTION_VIDEOS: ProductionVideo[] = [
  {
    id: 'vid-01',
    step: '01',
    title: 'Heavyweight Fleece Milling & GSM Calibration',
    duration: '01:15',
    department: 'Fabric Knitting & Dye House',
    summary:
      'Every production run begins in our Sialkot partner mills—testing yarn twist, shrinkage tolerance under 3%, and exact 380–620 GSM density before cutting.',
    posterImage: BRAND_INFO.backgroundUrl,
    fallbackPoster: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
    videoUrl: null,
    specs: ['Ring-Spun Combed Cotton', 'Pantone Custom Dye Lots', 'Pre-Shrunk Sanforized Finish'],
  },
  {
    id: 'vid-02',
    step: '02',
    title: 'CAD Pattern Grading & Precision Laser Cutting',
    duration: '01:40',
    department: 'Pattern Studio & Cutting Floor',
    summary:
      'Your tech pack is digitized into graded size runs (XS–3XL) with zero-variance drop-shoulder tolerances and matched grain alignment.',
    posterImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    fallbackPoster: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    videoUrl: null,
    specs: ['Custom Silhouette Patterns', 'Size Grading XS to 3XL', 'Zero-Waste Nesting'],
  },
  {
    id: 'vid-03',
    step: '03',
    title: 'Multi-Head Gold Embroidery & Chenille Craft',
    duration: '01:28',
    department: 'Embellishment Atelier',
    summary:
      'High-speed Japanese Tajima multi-head embroidery, dense chenille patches, and 3D satin-stitch crests executed with crisp edge registration.',
    posterImage: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallbackPoster: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    videoUrl: null,
    specs: ['Metallic & Matte Threads', 'Chenille & Felt Appliqué', 'High-Stitch Count Density'],
  },
  {
    id: 'vid-04',
    step: '04',
    title: '3D Puff Printing, Silicone & Enzyme Washing',
    duration: '01:52',
    department: 'Screen Print & Wash Lab',
    summary:
      'Raised puff plastisol, crackle vintage inks, high-density silicone transfers, and controlled enzyme or acid baths for unmistakable retail depth.',
    posterImage: 'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    fallbackPoster: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    videoUrl: null,
    specs: ['Multi-Pass Puff Inks', 'Vintage Acid & Sun Fade', 'Wash-Fastness Tested'],
  },
  {
    id: 'vid-05',
    step: '05',
    title: 'Private Label Finishing, QC & Global Dispatch',
    duration: '01:08',
    department: 'Quality Assurance & Export',
    summary:
      '100% garment measurement audit, custom woven neck & care labels, frosted zip-lock brand polybags, and tracked air freight worldwide.',
    posterImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    fallbackPoster: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    videoUrl: null,
    specs: ['AQL 2.5 Final Inspection', 'Custom Woven & Hang Tags', 'DHL / FedEx / Air Cargo'],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'rev-01',
    name: 'Marcus Vance',
    role: 'Creative Director',
    brand: 'Nocturne District',
    location: 'London, UK',
    orderMetric: '1,400 Heavyweight Hoodies · 3 Drops',
    quote:
      'Before switching to Zenttaar Enterprises, we struggled with inconsistent GSM and cracked puff prints across suppliers. Their Sialkot pattern team nailed our 520 GSM boxy block on the first sample, and every bulk unit arrived retail-ready.',
  },
  {
    id: 'rev-02',
    name: 'Tariq Al-Mansoor',
    role: 'Founder',
    brand: 'Kinetix Street Atelier',
    location: 'Dubai, UAE',
    orderMetric: '950 Custom Tracksuits · 21-Day Turnaround',
    quote:
      'We sent a rough tech pack and Pantone references—Zenttaar handled custom fabric dyeing, engraved metal aglets, and multi-head embroidery. Our launch collection sold out in 72 hours with zero quality returns.',
  },
  {
    id: 'rev-03',
    name: 'Elena Rostova',
    role: 'Head of Production',
    brand: 'Verve Collective',
    location: 'Berlin, Germany',
    orderMetric: '600 Enzyme-Wash Hoodies · 0.4% Defect Rate',
    quote:
      'Their enzyme-wash lab produces that authentic archival fade without weakening the cotton fleece. Communication from Shahab Pora factory floor updates to DHL airway bills was transparent at every stage.',
  },
  {
    id: 'rev-04',
    name: 'Devon Brooks',
    role: 'Co-Founder',
    brand: 'Monolith Supply Co.',
    location: 'Toronto, Canada',
    orderMetric: '2,200 Units · Hoodies & Varsity Outerwear',
    quote:
      'Scaling from 50-piece test runs to 1,000+ unit seasonal drops was seamless. Zenttaar Enterprises builds garments with real luxury weight and stitch discipline you rarely see outside flagship European ateliers.',
  },
  {
    id: 'rev-05',
    name: 'Sora Takahashi',
    role: 'Brand Manager',
    brand: 'Kuro Studio',
    location: 'Tokyo, Japan',
    orderMetric: '400 Wool-Leather Varsities · Custom Chenille',
    quote:
      'Every chenille crest, Melton wool panel, and quilted satin lining matched our strict Tokyo retail spec. We rely on Zenttaar as our primary cut-and-sew partner for heavyweight outerwear.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is your Minimum Order Quantity (MOQ) for custom hoodies and streetwear?',
    answer:
      'Our standard MOQ starts at 50 pieces per style/colorway for hoodies, tracksuits, and custom blanks, and 35 pieces for Melton wool & leather varsity jackets. Mixed size grading (XS through 2XL or 3XL) is included within your MOQ.',
  },
  {
    question: 'Can I order a pre-production sample before committing to bulk manufacturing?',
    answer:
      'Yes. We strongly recommend a physical pre-production sample. Once your tech pack or artwork is finalized, our Sialkot sample room produces and dispatches your custom graded sample within 12–14 business days via DHL Express.',
  },
  {
    question: 'Do I need a full CAD tech pack, or can you work from sketches and reference photos?',
    answer:
      'While CAD tech packs speed up development, you can also send rough sketches, Adobe Illustrator files, or reference garment photos. Our pattern masters will convert your concepts into measurement specs and digital mockups for approval.',
  },
  {
    question: 'What printing, embroidery, and custom wash techniques do you offer in-house?',
    answer:
      'We operate in-house 3D puff screen printing, high-density silicone transfers, vintage crackle plastisol, Tajima multi-head embroidery, chenille & chain-stitch patchwork, rhinestone applications, and enzyme/acid-wash dye baths.',
  },
  {
    question: 'Do you provide private-label woven neck labels, hang tags, and custom packaging?',
    answer:
      'Yes. Every bulk order can be customized with high-density damask woven neck labels, satin care tags, embossed hang tags, engraved metal aglets, custom YKK zipper pulls, and frosted branded zip-lock polybags.',
  },
  {
    question: 'How do shipping, customs clearance, and global delivery work from Sialkot?',
    answer:
      'We ship door-to-door worldwide (USA, UK, EU, UAE, Canada, Australia, Japan) via DHL Express, FedEx Priority, UPS Air Cargo, or sea freight for large container shipments, complete with commercial invoices and packing lists.',
  },
];
