import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, Plus, SlidersHorizontal } from 'lucide-react';
import { GarmentProduct } from '../data/catalog';
import { ResilientImage } from './ResilientImage';
import { ColorPickerField, describeColorName } from './ColorPickerField';

interface SingleProductPageProps {
  product: GarmentProduct;
  allProducts: GarmentProduct[];
  onBackToShop: () => void;
  onSelectProduct: (productId: string) => void;
  onAddToInquiry: (
    product: GarmentProduct,
    colorway: string,
    technique: string,
    quantity: number,
    customNotes?: string
  ) => void;
  onCustomizeProduct: (product: GarmentProduct) => void;
}

const SIZE_CHART = [
  { size: 'XS', chest: '22.5"', length: '25.5"', shoulder: '21.5"' },
  { size: 'S', chest: '23.5"', length: '26.5"', shoulder: '22.5"' },
  { size: 'M', chest: '24.5"', length: '27.5"', shoulder: '23.5"' },
  { size: 'L', chest: '25.5"', length: '28.5"', shoulder: '24.5"' },
  { size: 'XL', chest: '27.0"', length: '29.5"', shoulder: '25.5"' },
  { size: '2XL', chest: '28.5"', length: '30.5"', shoulder: '26.5"' },
  { size: '3XL', chest: '30.0"', length: '31.5"', shoulder: '27.5"' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom Sizing'];

const CUSTOM_FITS = [
  'Oversized Drop-Shoulder',
  'Boxy Cropped Fit',
  'Relaxed Streetwear Fit',
  'Regular Retail Cut',
  'Wide-Leg / Stacked Cut',
  'Tailored Outerwear Cut',
];

const CUSTOM_FABRICS = [
  '320 GSM Loopback Terry',
  '380 GSM French Terry',
  '450 GSM Combed Cotton Terry',
  '500 GSM Heavyweight Fleece',
  '550 GSM Luxury Brushed Fleece',
  '620 GSM Heavy Melton / Fleece',
  '100% Organic Ring-Spun Cotton',
  '85/15 CVC Anti-Pill Fleece',
];

const CUSTOM_STITCHING = [
  'Double-Needle Coverstitch',
  '4-Thread Heavy Overlock',
  'Flatlock Exposed Seam',
  'Distressed Raw-Edge Seam',
  'Chain-Stitch Detailing',
  'Triple-Needle Reinforced',
];

const CUSTOM_WASHES = [
  'Clean Reactive Dye',
  'Stone Enzyme Wash',
  'Vintage Acid Wash',
  'Sun-Fade Garment Dye',
  'Silicone Bio-Polish',
  'Heavy Distressed Finish',
];

const CUSTOM_RIBBING = [
  'Double-Layer Self Hood + 2x2 Rib',
  'Single-Layer Hood + Raw Hem',
  'No-Drawcord Minimal Hood',
  'Heavy Elastic Waist + Braided Cord',
  'Custom Knit Striped Bomber Rib',
];

const ARTWORK_PLACEMENTS = [
  'Front Chest',
  'Full Back',
  'Left Sleeve',
  'Right Sleeve',
  'Hood / Collar',
  'Woven Hem Tag',
];

const CUSTOM_TRIMS = [
  'Damask Woven Neck Label',
  'Satin Wash & Care Tag',
  'Engraved Metal Aglets',
  'Custom YKK Two-Way Zipper',
  'Embossed Snap Buttons',
  'Branded Hang Tags',
  'Frosted Zip-Lock Polybag',
];

function parseTierMinQty(range: string, fallback: number): number {
  const match = range.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

export const SingleProductPage: React.FC<SingleProductPageProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToInquiry,
  onCustomizeProduct,
}) => {
  const initialHex = product.colorways?.[0]?.hex || '#141418';
  const safeTechs =
    product.techniques?.length > 0
      ? product.techniques
      : ['3D Puff Print', 'High-Density Screen', 'Multi-Head Embroidery', 'Chenille Patch'];

  const safeTiers =
    product.priceTiers?.length >= 3
      ? product.priceTiers
      : [
          { range: `${product.moq} – 99 pcs`, price: product.basePrice || 24 },
          { range: '100 – 249 pcs', price: Math.max(12, (product.basePrice || 24) - 3) },
          { range: '250+ pcs', price: Math.max(10, (product.basePrice || 24) - 6) },
        ];

  const [selectedHex, setSelectedHex] = useState(initialHex);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [selectedFit, setSelectedFit] = useState(CUSTOM_FITS[0]);
  const [selectedFabric, setSelectedFabric] = useState(
    CUSTOM_FABRICS.find((f) => f.includes(product.gsm)) || CUSTOM_FABRICS[3]
  );
  const [selectedStitch, setSelectedStitch] = useState(CUSTOM_STITCHING[0]);
  const [selectedWash, setSelectedWash] = useState(CUSTOM_WASHES[0]);
  const [selectedRibbing, setSelectedRibbing] = useState(CUSTOM_RIBBING[0]);
  const [selectedTech, setSelectedTech] = useState(safeTechs[0]);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['Front Chest', 'Full Back']);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([
    'Damask Woven Neck Label',
    'Frosted Zip-Lock Polybag',
  ]);
  const [quantity, setQuantity] = useState(product.moq);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setSelectedHex(product.colorways?.[0]?.hex || '#141418');
    setSelectedSizes(
      product.sizes?.length > 0 ? product.sizes.slice(0, 4) : ['S', 'M', 'L', 'XL']
    );
    setSelectedFit(CUSTOM_FITS[0]);
    setSelectedFabric(
      CUSTOM_FABRICS.find((f) => f.includes(product.gsm)) || CUSTOM_FABRICS[3]
    );
    setSelectedStitch(CUSTOM_STITCHING[0]);
    setSelectedWash(CUSTOM_WASHES[0]);
    setSelectedRibbing(CUSTOM_RIBBING[0]);
    setSelectedTech(safeTechs[0]);
    setSelectedPlacements(['Front Chest', 'Full Back']);
    setSelectedTrims(['Damask Woven Neck Label', 'Frosted Zip-Lock Polybag']);
    setQuantity(product.moq);
    setNotes('');
    setAdded(false);
  }, [product]);

  const tierMins = safeTiers.map((t, idx) =>
    parseTierMinQty(t.range, idx === 0 ? product.moq : idx === 1 ? 100 : 250)
  );

  let activeTierIdx = 0;
  for (let i = tierMins.length - 1; i >= 0; i--) {
    if (quantity >= tierMins[i]) {
      activeTierIdx = i;
      break;
    }
  }
  const activeTier = safeTiers[activeTierIdx] || safeTiers[0];
  const colorLabel = describeColorName(selectedHex);

  const toggleMulti = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    keepOne = false
  ) => {
    setter((prev) => {
      if (prev.includes(item)) {
        if (keepOne && prev.length === 1) return prev;
        return prev.filter((x) => x !== item);
      }
      return [...prev, item];
    });
  };

  const handleSelectTier = (idx: number) => {
    const minQty = Math.max(product.moq, tierMins[idx] || product.moq);
    setQuantity(minQty);
  };

  const handleAdd = () => {
    const combinedSpecs = [
      `Sizes: ${selectedSizes.join(', ') || 'S–XL'}`,
      `Fit: ${selectedFit}`,
      `Stuff: ${selectedFabric}`,
      `Stitching: ${selectedStitch}`,
      `Finish: ${selectedWash}`,
      `Construction: ${selectedRibbing}`,
      selectedPlacements.length > 0 ? `Placement: ${selectedPlacements.join(', ')}` : '',
      selectedTrims.length > 0 ? `Trims: ${selectedTrims.join(', ')}` : '',
      notes.trim() ? `Notes: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    onAddToInquiry(
      product,
      `${colorLabel} (${selectedWash})`,
      selectedTech,
      quantity,
      combinedSpecs
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const related = allProducts.filter((g) => g.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Clean Single-Line Navigation Header */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 min-w-0 truncate">
          <span className="shrink-0">Shop</span>
          <span>/</span>
          <span className="shrink-0">{product.category}</span>
          <span>/</span>
          <span className="text-zinc-200 truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Contiguous PDP Layout */}
      <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Single Tall Product Image (No Cropping) + Product Overview */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-6 lg:sticky lg:top-24 space-y-5"
        >
          <div className="relative h-[480px] sm:h-[600px] lg:h-[680px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <ResilientImage
              src={product.image}
              fallbackSrc={product.fallbackImage}
              alt={product.name}
              loading="eager"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-2.5 rounded-lg border border-zinc-700/80 bg-[#070709]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <span
                className="h-4 w-4 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: selectedHex }}
              />
              <span>{colorLabel}</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-6 space-y-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-amber-400">
              Product Craftsmanship &amp; Details
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300">
              {product.description}
            </p>
          </div>
        </motion.div>

        {/* Right: Clean Single-Column Purchase & Full Customization Module */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.04 }}
          className="lg:col-span-6 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-7 space-y-6"
        >
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
              <span className="font-medium text-amber-400">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-medium text-zinc-300">{product.gsm}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{product.leadTime}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Custom Made</span>
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Clickable Volume Tiers (Pricing via Inquiry) */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-zinc-300">
                Select Order Volume Tier
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                {activeTier.range}
              </span>
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2.5">
              {safeTiers.map((tier, idx) => {
                const isSelected = activeTierIdx === idx;
                return (
                  <button
                    key={tier.range}
                    type="button"
                    onClick={() => handleSelectTier(idx)}
                    aria-pressed={isSelected}
                    className={`relative flex sm:flex-col items-center justify-between sm:justify-center rounded-lg border px-3.5 py-3 sm:text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white tabular-nums whitespace-nowrap">
                      {tier.range}
                    </span>
                    <span
                      className={`text-[11px] sm:mt-1 font-medium whitespace-nowrap ${
                        isSelected ? 'text-amber-400' : 'text-zinc-400'
                      }`}
                    >
                      Inquire for Quote
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Base Specification Summary */}
          <dl className="divide-y divide-zinc-800/70 border-y border-zinc-800 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Default Fabric</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.fabric}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Standard Fit</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.fit}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Stitching Spec</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.stitching}</dd>
            </div>
          </dl>

          {/* Visual Full-Spectrum Color Picker (No Color Codes) */}
          <ColorPickerField
            value={selectedHex}
            onChange={setSelectedHex}
            label="Custom Garment Color (Pick Any Shade)"
          />

          {/* Size Run Selector (Multi-Select) */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span>Size Run Selection (Select Sizes Needed)</span>
              <span className="text-amber-400">{selectedSizes.length} selected</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleMulti(selectedSizes, setSelectedSizes, sz, true)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
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

          {/* Fit & Pattern Cut */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Silhouette Fit &amp; Pattern Cut
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CUSTOM_FITS.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setSelectedFit(fit)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    selectedFit === fit
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Stuff & GSM Selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Fabric Stuff &amp; GSM Weight
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUSTOM_FABRICS.map((fab) => (
                <button
                  key={fab}
                  type="button"
                  onClick={() => setSelectedFabric(fab)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedFabric === fab
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {fab}
                </button>
              ))}
            </div>
          </div>

          {/* Stitching, Wash & Ribbing Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Stitching &amp; Seam Spec
              </label>
              <select
                value={selectedStitch}
                onChange={(e) => setSelectedStitch(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {CUSTOM_STITCHING.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Dye &amp; Wash Finish
              </label>
              <select
                value={selectedWash}
                onChange={(e) => setSelectedWash(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {CUSTOM_WASHES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Hood, Collar &amp; Ribbing Finish
            </label>
            <select
              value={selectedRibbing}
              onChange={(e) => setSelectedRibbing(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              {CUSTOM_RIBBING.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Print & Embroidery Technique */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Print &amp; Embroidery Technique
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {safeTechs.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedTech === tech
                      ? 'border-amber-500 bg-amber-500 text-zinc-950 font-semibold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Artwork Placement */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Artwork &amp; Logo Placement
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ARTWORK_PLACEMENTS.map((place) => {
                const active = selectedPlacements.includes(place);
                return (
                  <button
                    key={place}
                    type="button"
                    onClick={() => toggleMulti(selectedPlacements, setSelectedPlacements, place)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      active
                        ? 'border-amber-500/80 bg-amber-500/15 text-white font-medium'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-amber-400" />}
                    <span>{place}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Private Label Trims, Hardware & Packaging */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Private Label Trims, Hardware &amp; Packaging
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUSTOM_TRIMS.map((trim) => {
                const active = selectedTrims.includes(trim);
                return (
                  <button
                    key={trim}
                    type="button"
                    onClick={() => toggleMulti(selectedTrims, setSelectedTrims, trim)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      active
                        ? 'border-amber-500/80 bg-amber-500/15 text-white font-medium'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-amber-400" />}
                    <span>{trim}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Quote Notice */}
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div>
              <label htmlFor="pdp-qty" className="block text-xs font-medium text-zinc-300">
                Order Quantity (MOQ {product.moq} pcs)
              </label>
              <span className="mt-0.5 block text-xs font-medium text-amber-400">
                Custom pricing shared upon inquiry or contact
              </span>
            </div>

            <input
              id="pdp-qty"
              type="number"
              min={product.moq}
              step={10}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))
              }
              className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-right font-display text-sm font-semibold tabular-nums text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="pdp-notes" className="block text-xs font-medium text-zinc-300">
              Custom Size Ratio / Tech-Pack Notes (Optional)
            </label>
            <input
              id="pdp-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 20 pcs M, 30 pcs L, custom neck tag, puff print on back"
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
                added
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
              }`}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{added ? 'Added to Inquiry Bag' : 'Add to Inquiry Bag'}</span>
            </button>

            <button
              type="button"
              onClick={() => onCustomizeProduct(product)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white hover:border-amber-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Full Studio</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Clean Size Chart */}
      <div className="mt-10 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">
            Standard Grading Measurements (Inches)
          </h2>
          <span className="text-xs text-zinc-400">
            Custom tech-pack sizing available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="py-2.5 pr-3 font-medium">Size</th>
                <th className="py-2.5 px-3 font-medium">Half Chest</th>
                <th className="py-2.5 px-3 font-medium">Length</th>
                <th className="py-2.5 pl-3 font-medium">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 tabular-nums text-zinc-200">
              {SIZE_CHART.map((row) => (
                <tr key={row.size}>
                  <td className="py-2.5 pr-3 font-semibold text-amber-400">{row.size}</td>
                  <td className="py-2.5 px-3">{row.chest}</td>
                  <td className="py-2.5 px-3">{row.length}</td>
                  <td className="py-2.5 pl-3">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
          More Silhouettes
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {related.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectProduct(item.id)}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 text-left hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <div className="h-[380px] sm:h-[420px] w-full overflow-hidden bg-zinc-950">
                <ResilientImage
                  src={item.image}
                  fallbackSrc={item.fallbackImage}
                  alt={item.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 w-full">
                <div className="text-xs text-amber-400 truncate">
                  {item.category} · {item.gsm}
                </div>
                <div className="mt-1 font-display text-base font-semibold text-white truncate">
                  {item.name}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-zinc-400 whitespace-nowrap">
                  <span>MOQ {item.moq} pcs</span>
                  <span className="font-display text-xs font-semibold text-amber-400">
                    Quote on Inquiry
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
