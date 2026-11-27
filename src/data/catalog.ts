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
  sortOrder?: number;
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
  videoUrl: string;
  specs: string[];
  sortOrder?: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  brand: string;
  location: string;
  orderMetric: string;
  quote: string;
  sortOrder?: number;
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

export interface SiteSettingsPublic {
  brandName: string;
  domain: string;
  websiteUrl: string;
  logoUrl: string;
  backgroundUrl: string;
  address: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}

export interface SiteSettingsBanking {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branchAddress: string;
  paymentNotes: string;
}

export interface InquiryRecord {
  docId: string;
  refId: string;
  source: 'contact_form' | 'inquiry_bag';
  name: string;
  brandName?: string;
  email: string;
  phone?: string;
  category?: string;
  quantity?: string;
  techPackUrl?: string;
  message?: string;
  itemsSummary?: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'archived';
  createdAt?: unknown;
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
  | 'returns'
  | 'admin';

export const DEFAULT_SITE_SETTINGS: SiteSettingsPublic = {
  brandName: 'Zenttaar Enterprises',
  domain: 'zenttaarenterprises.store',
  websiteUrl: 'https://zenttaarenterprises.store/',
  logoUrl: 'https://i.postimg.cc/J40Cmb4P/Zenttaar-Enterprises-Luxury-Apparel-Logo.png',
  backgroundUrl: 'https://i.postimg.cc/66YTYLmP/Whats-App-Image-2026-11-26-at-11-41-11-PM.jpg',
  address: 'Factory Area, Shahab Pora Road, Sialkot',
  email: 'info@zenttaarenterprises.store',
  phone: '03335541751',
  whatsappNumber: '923335541751',
  instagramUrl: 'https://instagram.com/zenttarenterprises',
  facebookUrl: 'https://facebook.com/',
  tiktokUrl: 'https://tiktok.com/',
  youtubeUrl: 'https://youtube.com/',
};

export const DEFAULT_BANKING_SETTINGS: SiteSettingsBanking = {
  bankName: 'Bank Name (Configure in Admin)',
  accountTitle: 'Zenttaar Enterprises',
  accountNumber: '0000-0000-0000-00',
  iban: 'PK00XXXX0000000000000000',
  swiftCode: 'XXXXXXXX',
  branchAddress: 'Shahab Pora Road, Sialkot',
  paymentNotes: '50% deposit to initiate production, 50% balance prior to DHL/cargo dispatch.',
};

export const BRAND_INFO = {
  ...DEFAULT_SITE_SETTINGS,
  fallbackBackdrop: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
  instagramHandle: '@zenttarenterprises',
};

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    kicker: 'Sialkot Export Manufacturing · OEM & Private Label',
    headline: 'Heavyweight Luxury Hoodies Built From Your Tech Pack',
    subheadline:
      '480–550 GSM fleece milling, 3D puff print, and multi-head embroidery for global streetwear labels.',
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
      'Submit sketches or reference garments. Graded pre-production samples dispatched in 14 days.',
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
      'Custom woven neck tags, engraved metal aglets, branded zip pulls, and retail packaging.',
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
    fabric: '100% Combed Ring-Spun French Terry (Customizable 380–600 GSM)',
    stitching: 'Double-needle coverstitch, 4-thread overlock & reinforced shoulder tape',
    fit: 'Oversized Boxy Drop-Shoulder (Custom Grading XS–3XL)',
    image: 'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
    fallbackImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    gallery: [
      'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
    ],
    tag: 'Signature Cut',
    description:
      'Engineered in our Sialkot factory for luxury streetwear labels seeking total creative control over fabric, construction, and finish. Select your exact knit from 380 GSM loopback French terry up to 600 GSM brushed fleece, pre-shrunk for under 3% shrinkage tolerance. Tailor every seam with double-needle coverstitching, exposed flatlock panels, raw-edge distressing, and bar-tacked kangaroo pockets. Custom vat dyeing matches any shade you choose, paired with 3D puff plastisol, high-density silicone transfers, chain-stitch embroidery, chenille crests, damask woven neck labels, engraved metal aglets, and frosted zip-lock packaging.',
    colorways: [
      { name: 'Custom Shade', hex: '#141418' },
    ],
    techniques: ['3D Puff Print', 'High-Density Screen', 'Chain-Stitch Embroidery', 'Woven Label'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 1,
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
    fabric: 'Heavy Brushed Cotton Fleece / CVC Blend · Vintage Enzyme & Acid Wash',
    stitching: 'Raw-edge distressed seams or clean flatlock reinforcement',
    fit: 'Relaxed Cropped Boxy Fit (Custom Tech-Pack Measurements)',
    image: 'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    fallbackImage: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    gallery: [
      'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    ],
    tag: 'Custom Wash',
    description:
      'Built for archival streetwear aesthetics with full factory customization from yarn selection to final finish. Choose 100% organic ring-spun cotton fleece, diagonal loopback terry, or cotton-poly anti-pill blends between 400 and 580 GSM. Our dye house executes garment-dyed stone-enzyme washes, acid washes, and sun-fade patinas matched cleanly to your chosen garment shade. Customize seam construction with exposed flatlock stitching, distressed raw hems, or tonal coverstitching, alongside single or double self-lined hoods, cracked vintage plastisol, multi-pass 3D puff, chenille felt patches, and custom woven tags.',
    colorways: [
      { name: 'Custom Wash Shade', hex: '#27272A' },
    ],
    techniques: ['Acid / Enzyme Wash', 'Chenille Patch', 'Cracked Plastisol', 'Distressed Hem'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 2,
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
    fabric: 'Ultra-Heavyweight Organic Cotton Fleece (480–620 GSM Options)',
    stitching: 'Heavy gauge 4-thread overlock with kangaroo bar-tacks & 2x2 Lycra rib',
    fit: 'Structured Luxury Oversized (Fully Adjustable Pattern Block)',
    image: 'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
    fallbackImage: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    gallery: [
      'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
    ],
    tag: '550 GSM Heavy',
    description:
      'Our flagship heavyweight silhouette engineered for high-ticket luxury streetwear drops where every specification can be tailored to your brand. Choose custom-milled 500 to 620 GSM organic cotton fleece or dense French terry with heavyweight 2x2 ribbed cuffs and hem. Specify custom panel cuts, drop-shoulder angles, sleeve volume, and thread colors across all double-needle seams. Dye to your exact custom shade with optional silicone bio-polish or vintage enzyme wash, finished with 3D silicone transfers, high-density multi-head embroidery, debossed hardware, satin care labels, and retail polybags.',
    colorways: [
      { name: 'Custom Luxury Shade', hex: '#09090B' },
    ],
    techniques: ['3D Silicone Transfer', 'Multi-Head Embroidery', 'Rhinestone Studs', 'Custom Aglets'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 3,
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
    fabric: '85% Combed Cotton / 15% Poly Anti-Pill Fleece or 100% Cotton Terry',
    stitching: 'Reinforced crotch gusset, piped side-seam & triple-needle elastic waistband',
    fit: 'Boxy Top & Wide-Leg / Stacked Jogger (Custom Inseam & Leg Opening)',
    image: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    fallbackImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    gallery: [
      '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    ],
    tag: '2-Piece Set',
    description:
      'Complete 2-piece coordinated hoodie and jogger program manufactured with single-vat dye-lot consistency across top and bottom. Customize fabric stuff—brushed fleece, unbrushed French terry, or heavyweight interlock from 380 to 550 GSM—in any custom garment color. Tailor jogger proportions with open wide-leg hems, stacked flares, zippered ankle gussets, or elastic cuffs, plus custom jacquard waistbands, contrast piping, and reinforced stitching. Complete the set with tonal satin embroidery, 3D puff chest and thigh logos, custom zip pulls, engraved drawcord tips, and matched retail packaging.',
    colorways: [
      { name: 'Custom Set Shade', hex: '#18181B' },
    ],
    techniques: ['Tonal Satin Stitch', 'High-Density Print', 'Custom Zip Pulls', 'Branded Waistband'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 4,
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
    fabric: 'Melton Wool Body (24 oz) · Full-Grain Cowhide / Nubuck / Heavy Fleece Sleeves',
    stitching: 'Quilted satin or custom jacquard lining with leather-welt pockets',
    fit: 'Classic Tailored or Boxy Cropped Streetwear Outerwear',
    image: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallbackImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    gallery: [
      '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    ],
    tag: 'Cut & Sew Outerwear',
    description:
      'Hand-built in Sialkot with full cut-and-sew customization across body, sleeves, lining, and hardware. Choose 620 GSM Melton wool, heavy cotton twill, or suede body panels paired with genuine full-grain cowhide leather, sheep nappa, or heavyweight fleece sleeves. Pair any custom shade across body, sleeves, and custom-knitted striped rib collar and cuffs. Customize quilted satin or branded jacquard interior linings, internal welt phone pockets, engraved snap buttons, two-way YKK zippers, multi-layer chenille appliqué crests, chain-stitch lettering, leather patch embroidery, and garment dust bags.',
    colorways: [
      { name: 'Custom Outerwear Shade', hex: '#09090B' },
    ],
    techniques: ['Chenille Appliqué', 'Chain-Stitch', 'Embossed Snaps', 'Quilted Jacquard Lining'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 5,
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
    fabric: 'Loopback Heavyweight Cotton Terry or Brushed Fleece (400–580 GSM)',
    stitching: 'Concealed or exposed YKK two-way zipper with double-needle placket',
    fit: 'Cropped Drop-Shoulder Zip (Custom Boxy or Relaxed Cut)',
    image: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    fallbackImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    gallery: [
      '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    ],
    tag: 'Private Label',
    description:
      'Designed as an ultra-versatile full-zip streetwear staple ready for complete OEM customization. Select fabric stuff from crisp 450 GSM French terry to plush 560 GSM brushed fleece, custom-dyed to your chosen shade with optional pigment or enzyme wash. Customize hardware including heavy #8 two-way YKK zippers in matte black, antique brass, gunmetal, or custom logo-molded zip pulls. Specify concealed or exposed zipper plackets, double-layered oversized hoods, raw-edge or coverstitched seams, puff screen prints, subtle chest embroidery, woven neck labels, care tags, and retail packaging.',
    colorways: [
      { name: 'Custom Zip Shade', hex: '#111115' },
    ],
    techniques: ['Two-Way Custom Zip', 'Puff Screen Print', 'Subtle Chest Embroidery', 'Acid Wash'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    sortOrder: 6,
  },
];

export const PRODUCTION_VIDEOS: ProductionVideo[] = [
  {
    id: 'vid-01',
    step: '01',
    title: 'Heavyweight Fleece Milling & Fabric Inspection',
    duration: '00:45',
    department: 'Fabric Knitting & Dye House',
    summary:
      'Testing combed cotton yarn density, shrinkage control, and custom dye batches before cutting.',
    posterImage: BRAND_INFO.backgroundUrl,
    fallbackPoster: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.53%20AM%20(1).mp4',
    specs: ['Ring-Spun Combed Cotton', 'Pantone Custom Dye Lots', 'Pre-Shrunk Sanforized Finish'],
    sortOrder: 1,
  },
  {
    id: 'vid-02',
    step: '02',
    title: 'CAD Pattern Grading & Precision Cutting Floor',
    duration: '00:52',
    department: 'Pattern Studio & Cutting',
    summary:
      'Digitized size runs from XS to 3XL with drop-shoulder tolerances and matched grain alignment.',
    posterImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    fallbackPoster: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.53%20AM%20(2).mp4',
    specs: ['Custom Silhouette Patterns', 'Size Grading XS to 3XL', 'Zero-Waste Nesting'],
    sortOrder: 2,
  },
  {
    id: 'vid-03',
    step: '03',
    title: 'Multi-Head Embroidery & Chenille Craft',
    duration: '00:48',
    department: 'Embellishment Atelier',
    summary:
      'High-speed multi-head embroidery, chenille crests, and precision satin-stitch detailing.',
    posterImage: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallbackPoster: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.54%20AM%20(1).mp4',
    specs: ['Metallic & Matte Threads', 'Chenille & Felt Appliqué', 'High-Stitch Density'],
    sortOrder: 3,
  },
  {
    id: 'vid-04',
    step: '04',
    title: '3D Puff Printing & Screen Craftsmanship',
    duration: '00:55',
    department: 'Print & Wash Lab',
    summary:
      'Raised puff plastisol, crackle vintage inks, and high-density silicone transfers.',
    posterImage: 'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    fallbackPoster: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.54%20AM%20(2).mp4',
    specs: ['Multi-Pass Puff Inks', 'Vintage Acid & Sun Fade', 'Wash-Fastness Tested'],
    sortOrder: 4,
  },
  {
    id: 'vid-05',
    step: '05',
    title: 'Cut & Sew Assembly & Heavy Coverstitch',
    duration: '00:50',
    department: 'Stitching Line',
    summary:
      'Reinforced double-needle coverstitching, kangaroo bar-tacks, and clean seam finishing.',
    posterImage: 'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
    fallbackPoster: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.54%20AM.mp4',
    specs: ['Double-Needle Coverstitch', 'Custom Woven Tags', 'Bar-Tack Reinforcement'],
    sortOrder: 5,
  },
  {
    id: 'vid-06',
    step: '06',
    title: 'Final Quality Audit & Export Packaging',
    duration: '00:44',
    department: 'Quality Assurance & Export',
    summary:
      'Measurement checks, custom frosted zip-lock polybags, and tracked air freight dispatch.',
    posterImage: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    fallbackPoster: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    videoUrl: 'https://sportzfy.mtyofficial.online/WhatsApp%20Video%202026-11-27%20at%2012.42.55%20AM.mp4',
    specs: ['AQL 2.5 Inspection', 'Custom Hang Tags', 'DHL / Air Cargo'],
    sortOrder: 6,
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
      'Zenttaar nailed our 520 GSM boxy block on the first sample, and every bulk unit arrived retail-ready.',
    sortOrder: 1,
  },
  {
    id: 'rev-02',
    name: 'Tariq Al-Mansoor',
    role: 'Founder',
    brand: 'Kinetix Street Atelier',
    location: 'Dubai, UAE',
    orderMetric: '950 Custom Tracksuits · 21-Day Turnaround',
    quote:
      'We sent a rough tech pack and Pantone references—our launch collection sold out in 72 hours with zero quality returns.',
    sortOrder: 2,
  },
  {
    id: 'rev-03',
    name: 'Elena Rostova',
    role: 'Head of Production',
    brand: 'Verve Collective',
    location: 'Berlin, Germany',
    orderMetric: '600 Enzyme-Wash Hoodies · 0.4% Defect Rate',
    quote:
      'Their enzyme-wash lab produces that authentic archival fade without weakening the cotton fleece.',
    sortOrder: 3,
  },
  {
    id: 'rev-04',
    name: 'Devon Brooks',
    role: 'Co-Founder',
    brand: 'Monolith Supply Co.',
    location: 'Toronto, Canada',
    orderMetric: '2,200 Units · Hoodies & Varsity Outerwear',
    quote:
      'Scaling from 50-piece test runs to 1,000+ unit seasonal drops was seamless with real luxury stitch discipline.',
    sortOrder: 4,
  },
  {
    id: 'rev-05',
    name: 'Sora Takahashi',
    role: 'Brand Manager',
    brand: 'Kuro Studio',
    location: 'Tokyo, Japan',
    orderMetric: '400 Wool-Leather Varsities · Custom Chenille',
    quote:
      'Every chenille crest, Melton wool panel, and quilted satin lining matched our strict Tokyo retail spec.',
    sortOrder: 5,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is your Minimum Order Quantity (MOQ) for custom hoodies and streetwear?',
    answer:
      'Our standard MOQ starts at 50 pieces per style/colorway for hoodies, tracksuits, and custom blanks, and 35 pieces for Melton wool & leather varsity jackets.',
  },
  {
    question: 'Can I order a pre-production sample before committing to bulk manufacturing?',
    answer:
      'Yes. Once your tech pack or artwork is finalized, our Sialkot sample room produces and dispatches your custom graded sample within 12–14 business days via DHL Express.',
  },
  {
    question: 'Do I need a full CAD tech pack, or can you work from sketches and reference photos?',
    answer:
      'You can send rough sketches, Illustrator files, or reference photos. Our pattern masters convert your concepts into graded measurement specs for approval.',
  },
  {
    question: 'What printing, embroidery, and custom wash techniques do you offer?',
    answer:
      'We operate in-house 3D puff screen printing, high-density silicone transfers, vintage crackle ink, multi-head embroidery, chenille patchwork, and enzyme/acid-wash dye baths.',
  },
  {
    question: 'Do you provide private-label woven neck labels, hang tags, and custom packaging?',
    answer:
      'Yes. Every bulk order can include damask woven neck labels, satin care tags, embossed hang tags, engraved metal aglets, and frosted branded zip-lock polybags.',
  },
  {
    question: 'How do shipping and global delivery work from Sialkot?',
    answer:
      'We ship door-to-door worldwide via DHL Express, FedEx Priority, UPS Air Cargo, or sea freight, complete with commercial invoices and packing lists.',
  },
];
