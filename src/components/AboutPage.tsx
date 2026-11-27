import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { BRAND_INFO, PageRoute } from '../data/catalog';
import { ResilientImage } from './ResilientImage';
import { ProductionVideoSection } from './ProductionVideoSection';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

const PILLARS = [
  {
    step: '01',
    title: 'In-House Fabric Milling & Custom Pantone Dyeing',
    detail:
      'We mill ring-spun combed French terry and brushed cotton fleece from 380 GSM to 620 GSM with under 3% shrinkage tolerance and exact Pantone color matching.',
  },
  {
    step: '02',
    title: 'Precision CAD Pattern Grading & Cut-and-Sew',
    detail:
      'Whether you provide a full tech pack or reference garments, our pattern masters digitize graded blocks (XS–3XL) with double-needle coverstitching and reinforced shoulder seams.',
  },
  {
    step: '03',
    title: 'Tajima Embroidery, Puff Print & Enzyme Wash Lab',
    detail:
      'High-density 3D puff plastisol, crackle vintage ink, heavy metallic embroidery, chenille patches, and controlled stone-enzyme washes executed under one roof.',
  },
  {
    step: '04',
    title: 'AQL 2.5 Quality Audit & Door-to-Door Export',
    detail:
      'Every piece undergoes measurement verification, thread trimming, custom woven labeling, and frosted polybag packing before DHL Express or air cargo dispatch.',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pb-16">
      {/* Editorial Header Split */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-6 space-y-5"
          >
            <p className="text-xs font-medium tracking-wide text-amber-400">
              About Zenttaar Enterprises
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              Sialkot’s Luxury Streetwear & Cut-and-Sew Atelier
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
              Located in {BRAND_INFO.address}, Zenttaar Enterprises is a dedicated OEM and private-label apparel manufacturer built for independent streetwear houses, athletic labels, and luxury fashion startups worldwide.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-400">
              From your initial concept or tech pack to small-batch 50-piece launches and 5,000+ unit wholesale drops, we combine heavy-gauge fleece craftsmanship with transparent production timelines.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('custom-order')}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <span>Build Custom Order</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:border-amber-500 transition-colors cursor-pointer"
              >
                <span>Contact Factory Desk</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
          >
            <ResilientImage
              src="/src/assets/images/atelier_embroidery_craft_1795766292456.jpg"
              fallbackSrc="/src/assets/images/hero_atelier_backdrop_1795766290321.jpg"
              alt="Zenttaar Enterprises Sialkot embroidery and garment production floor"
              loading="eager"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 bg-[#0d0d12] px-6 py-4 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>{BRAND_INFO.address}</span>
              </span>
              <span className="font-display font-medium text-amber-400">ISO-Aligned QC · AQL 2.5</span>
            </div>
          </motion.div>
        </div>

        {/* 4 Manufacturing Pillars */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PILLARS.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 sm:p-8"
            >
              <div className="font-display text-xs font-semibold text-amber-400">
                {item.step}. Manufacturing Pillar
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-white">{item.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Export Standards List */}
        <div className="mt-12 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-white">
            Included With Every Private Label Run
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-zinc-300">
            {[
              'Pre-production physical sample in 12–14 days',
              'Custom damask woven neck & care labels',
              'Pantone-matched reactive or pigment dye baths',
              'Engraved metal aglets & custom YKK zippers',
              'Individual frosted zip-lock retail polybags',
              'Worldwide DHL Express & air cargo dispatch',
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductionVideoSection />
    </div>
  );
};
