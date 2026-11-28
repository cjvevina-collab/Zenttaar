import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { GarmentProduct, InquiryItem } from '../data/catalog';
import { ResilientImage } from './ResilientImage';
import { ColorPickerField, describeColorName } from './ColorPickerField';

interface CustomizerStudioProps {
  seedProduct: GarmentProduct | null;
  onAddCustomToInquiry: (item: InquiryItem) => void;
}

const SILHOUETTES = [
  {
    id: 'hoodie-boxy',
    name: 'Drop-Shoulder Boxy Hoodie',
    basePrice: 21,
    image: 'https://i.postimg.cc/N0CBRpMg/Whats-App-Image-2026-11-27-at-12-42-55-AM.jpg',
    fallback: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
  },
  {
    id: 'hoodie-wash',
    name: 'Enzyme-Wash Streetwear Hoodie',
    basePrice: 23,
    image: 'https://i.postimg.cc/N0CBRpMs/Whats-App-Image-2026-11-27-at-12-42-55-AM-(1).jpg',
    fallback: '/src/assets/images/hoodie_crimson_streetwear_1795766291867.jpg',
  },
  {
    id: 'hoodie-zip',
    name: 'Two-Way Heavy Zip Hoodie',
    basePrice: 24,
    image: 'https://i.postimg.cc/3wfY2nRY/Whats-App-Image-2026-11-27-at-12-42-56-AM.jpg',
    fallback: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
  },
  {
    id: 'tracksuit',
    name: '2-Piece Heavy Fleece Tracksuit',
    basePrice: 34,
    image: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
    fallback: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
  },
  {
    id: 'varsity',
    name: 'Melton Wool & Leather Varsity',
    basePrice: 54,
    image: '/src/assets/images/atelier_embroidery_craft_1795766292456.jpg',
    fallback: '/src/assets/images/apparel_varsity_tracksuit_1795766291516.jpg',
  },
];

const FABRICS = [
  { label: '380 GSM French Terry', add: 0 },
  { label: '480 GSM Brushed Fleece', add: 2.5 },
  { label: '550 GSM Luxury Heavyweight', add: 4.5 },
  { label: '620 GSM Melton / Fleece', add: 7 },
];

const WASH_FINISHES = ['Clean Reactive Dye', 'Vintage Enzyme Wash', 'Acid / Sun-Fade Patina'];

const TECHNIQUES = [
  '3D Puff Screen Print',
  'Multi-Head Heavy Embroidery',
  'Chenille Varsity Patchwork',
  'High-Density Silicone Transfer',
];

const TRIMS = [
  'Woven Neck & Care Labels',
  'Engraved Metal Aglets & Zippers',
  'Double-Layer Self Hood',
  'Custom Frosted Retail Polybag',
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  seedProduct,
  onAddCustomToInquiry,
}) => {
  const [silhouette, setSilhouette] = useState(SILHOUETTES[0]);
  const [fabric, setFabric] = useState(FABRICS[1]);
  const [customHex, setCustomHex] = useState('#141418');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [wash, setWash] = useState(WASH_FINISHES[0]);
  const [technique, setTechnique] = useState(TECHNIQUES[0]);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([TRIMS[0], TRIMS[2]]);
  const [brandLabelText, setBrandLabelText] = useState('');
  const [techPackLink, setTechPackLink] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [customNotes, setCustomNotes] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!seedProduct) return;
    if (seedProduct.name.toLowerCase().includes('varsity')) {
      setSilhouette(SILHOUETTES[4]);
    } else if (seedProduct.category === 'Sets & Outerwear') {
      setSilhouette(SILHOUETTES[3]);
    } else if (seedProduct.name.toLowerCase().includes('zip')) {
      setSilhouette(SILHOUETTES[2]);
    } else if (seedProduct.name.toLowerCase().includes('enzyme')) {
      setSilhouette(SILHOUETTES[1]);
    } else {
      setSilhouette(SILHOUETTES[0]);
    }
    setCustomNotes(`Reference silhouette: ${seedProduct.name} (${seedProduct.gsm})`);
  }, [seedProduct]);

  const toggleTrim = (trim: string) => {
    setSelectedTrims((prev) =>
      prev.includes(trim) ? prev.filter((t) => t !== trim) : [...prev, trim]
    );
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sz)) {
        return prev.length === 1 ? prev : prev.filter((s) => s !== sz);
      }
      return [...prev, sz];
    });
  };

  const colorLabel = describeColorName(customHex);

  const handleAddSpec = () => {
    const item: InquiryItem = {
      uid: `custom-${Date.now()}`,
      productId: silhouette.id,
      name: `Custom ${silhouette.name}`,
      category: 'Custom Tech-Pack Order',
      image: silhouette.image,
      fallbackImage: silhouette.fallback,
      gsm: fabric.label,
      colorway: `${colorLabel} · ${wash}`,
      technique,
      quantity,
      unitPriceEstimate: 0,
      customNotes: `Sizes: ${selectedSizes.join(', ')} · ${
        brandLabelText ? `Brand Label: ${brandLabelText} · ` : ''
      }Trims: ${selectedTrims.join(', ') || 'Standard'}${
        techPackLink ? ` · Tech Pack: ${techPackLink}` : ''
      }${customNotes ? ` · ${customNotes}` : ''}`,
      isCustomBuild: true,
    };

    onAddCustomToInquiry(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <section id="customizer" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.25 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium tracking-wide text-amber-400">
            Custom Manufacturing
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Build Your Custom Garment Spec
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Configure silhouette, fabric GSM, exact dye color code, stitching, and print finish for a direct factory quote.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left: Studio Summary Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95">
            <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden bg-zinc-950">
              <ResilientImage
                src={silhouette.image}
                fallbackSrc={silhouette.fallback}
                alt={silhouette.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/60 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-amber-400">Selected Cut</div>
                  <div className="font-display text-lg font-bold text-white truncate">
                    {silhouette.name}
                  </div>
                </div>
                <span
                  className="h-7 w-7 shrink-0 rounded-full border-2 border-white/40 shadow-lg"
                  style={{ backgroundColor: customHex }}
                  title={colorLabel}
                />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <dl className="space-y-2.5 text-xs border-b border-zinc-800/80 pb-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Fabric Weight</dt>
                  <dd className="font-medium text-zinc-100 text-right">{fabric.label}</dd>
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <dt className="text-zinc-400">Selected Color</dt>
                  <dd className="inline-flex items-center gap-2 font-medium text-amber-400 text-right">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/35 shrink-0"
                      style={{ backgroundColor: customHex }}
                    />
                    <span>{colorLabel}</span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Size Run</dt>
                  <dd className="font-medium text-zinc-100 text-right">{selectedSizes.join(', ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Wash Finish</dt>
                  <dd className="font-medium text-zinc-100 text-right">{wash}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Embellishment</dt>
                  <dd className="font-medium text-amber-400 text-right">{technique}</dd>
                </div>
              </dl>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-zinc-400">Batch Volume</span>
                  <span className="font-display text-base font-bold tabular-nums text-white">
                    {quantity} pcs
                  </span>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-300 leading-relaxed">
                  Pricing is calculated per spec and shared once you submit your inquiry or contact our Sialkot desk.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Configuration Steps */}
          <div className="lg:col-span-7 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                01. Silhouette
              </label>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SILHOUETTES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSilhouette(item)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                      silhouette.id === item.id
                        ? 'border-amber-500 bg-amber-500/15 text-white font-semibold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                02. Fabric GSM
              </label>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {FABRICS.map((fab) => (
                  <button
                    key={fab.label}
                    type="button"
                    onClick={() => setFabric(fab)}
                    className={`rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
                      fabric.label === fab.label
                        ? 'border-amber-500 bg-amber-500 text-zinc-950 font-semibold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {fab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <ColorPickerField
                value={customHex}
                onChange={setCustomHex}
                label="03. Custom Garment Color (Pick Any Shade)"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  03b. Size Run
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom Sizing'].map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                          active
                            ? 'border-amber-500 bg-amber-500 text-zinc-950 font-semibold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  04. Dye &amp; Wash
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {WASH_FINISHES.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWash(w)}
                      className={`rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
                        wash === w
                          ? 'border-amber-500 bg-amber-500/15 text-white font-semibold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                05. Print & Embroidery
              </label>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TECHNIQUES.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setTechnique(tech)}
                    className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                      technique === tech
                        ? 'border-amber-500 bg-amber-500 text-zinc-950 font-semibold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                06. Private Label Trims
              </label>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRIMS.map((trim) => {
                  const active = selectedTrims.includes(trim);
                  return (
                    <button
                      key={trim}
                      type="button"
                      onClick={() => toggleTrim(trim)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
                        active
                          ? 'border-amber-500/80 bg-amber-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span>{trim}</span>
                      {active && <Check className="h-3.5 w-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="custom-graphic-text" className="block text-xs font-medium text-zinc-300">
                  Brand / Neck Label Name
                </label>
                <input
                  id="custom-graphic-text"
                  type="text"
                  maxLength={32}
                  value={brandLabelText}
                  onChange={(e) => setBrandLabelText(e.target.value)}
                  placeholder="Your Clothing Label"
                  className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                  <label htmlFor="custom-moq-range">Order Volume</label>
                  <span className="tabular-nums font-semibold text-amber-400">{quantity} pcs</span>
                </div>
                <input
                  id="custom-moq-range"
                  type="range"
                  min={50}
                  max={1000}
                  step={25}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-3.5 w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="custom-techpack-url" className="block text-xs font-medium text-zinc-300">
                  Tech Pack Link (Optional)
                </label>
                <input
                  id="custom-techpack-url"
                  type="url"
                  value={techPackLink}
                  onChange={(e) => setTechPackLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="custom-tech-notes" className="block text-xs font-medium text-zinc-300">
                  Sizing & Pantone Notes (Optional)
                </label>
                <input
                  id="custom-tech-notes"
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Oversized drop shoulder S–2XL"
                  className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Clean Submit Button WITHOUT AI Sparkles Icon */}
            <button
              type="button"
              onClick={handleAddSpec}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                addedFeedback
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-[0.99]'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added Custom Order to Inquiry Bag</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Custom Order to Inquiry Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
