import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, Plus, SlidersHorizontal } from 'lucide-react';
import { GarmentProduct } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

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
  { size: 'S', chest: '23.5"', length: '26.5"', shoulder: '22.5"' },
  { size: 'M', chest: '24.5"', length: '27.5"', shoulder: '23.5"' },
  { size: 'L', chest: '25.5"', length: '28.5"', shoulder: '24.5"' },
  { size: 'XL', chest: '27.0"', length: '29.5"', shoulder: '25.5"' },
  { size: '2XL', chest: '28.5"', length: '30.5"', shoulder: '26.5"' },
];

export const SingleProductPage: React.FC<SingleProductPageProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToInquiry,
  onCustomizeProduct,
}) => {
  const safeColors =
    product.colorways?.length > 0
      ? product.colorways
      : [{ name: 'Obsidian Black', hex: '#141418' }];
  const safeTechs =
    product.techniques?.length > 0 ? product.techniques : ['3D Puff Print'];
  const safeTiers =
    product.priceTiers?.length >= 3
      ? product.priceTiers
      : [
          { range: `${product.moq}+ pcs`, price: product.basePrice || 22 },
          { range: '100+ pcs', price: product.basePrice || 20 },
          { range: '250+ pcs', price: product.basePrice || 18 },
        ];
  const safeGallery =
    product.gallery?.length > 0 ? product.gallery : [product.image];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(safeColors[0].name);
  const [selectedTech, setSelectedTech] = useState(safeTechs[0]);
  const [quantity, setQuantity] = useState(product.moq);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    setActiveImageIdx(0);
    setSelectedColor(safeColors[0].name);
    setSelectedTech(safeTechs[0]);
    setQuantity(product.moq);
    setNotes('');
    setAdded(false);
  }, [product]);

  const activeTier =
    quantity >= 250
      ? safeTiers[2]
      : quantity >= 100
      ? safeTiers[1]
      : safeTiers[0];

  const handleAdd = () => {
    onAddToInquiry(product, selectedColor, selectedTech, quantity, notes);
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
        {/* Left: Product Gallery */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-6 lg:sticky lg:top-24 space-y-3"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <ResilientImage
              src={safeGallery[activeImageIdx] || product.image}
              fallbackSrc={product.fallbackImage}
              alt={product.name}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {safeGallery.map((imgUrl, idx) => (
              <button
                key={imgUrl + idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`aspect-[4/3] overflow-hidden rounded-lg border transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-zinc-800 opacity-75 hover:opacity-100'
                }`}
              >
                <ResilientImage
                  src={imgUrl}
                  fallbackSrc={product.fallbackImage}
                  alt={`${product.name} view ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: Clean Single-Column Purchase & Manufacturing Module */}
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
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {product.name}
            </h1>

            <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
              {product.description}
            </p>
          </div>

          {/* Mobile-Friendly Bulk Pricing Tiers */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-4">
            <div className="text-xs font-semibold text-zinc-300 mb-3">
              Wholesale Pricing Tiers
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2.5">
              {safeTiers.map((tier) => {
                const isSelected = activeTier.range === tier.range;
                return (
                  <div
                    key={tier.range}
                    className={`flex sm:flex-col items-center justify-between sm:justify-center rounded-lg border px-3.5 py-2.5 sm:text-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900/50'
                    }`}
                  >
                    <span className="text-xs font-medium text-zinc-400 tabular-nums whitespace-nowrap">
                      {tier.range}
                    </span>
                    <span
                      className={`font-display text-base sm:mt-1 font-bold tabular-nums whitespace-nowrap ${
                        isSelected ? 'text-amber-400' : 'text-white'
                      }`}
                    >
                      ${tier.price}{' '}
                      <span className="text-xs font-normal text-zinc-400">/ pc</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Aligned Specification Rows */}
          <dl className="divide-y divide-zinc-800/70 border-y border-zinc-800 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Fabric</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.fabric}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Fit & Cut</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.fit}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
              <dt className="text-zinc-400 shrink-0">Stitching</dt>
              <dd className="font-medium text-zinc-100 sm:text-right leading-snug">{product.stitching}</dd>
            </div>
          </dl>

          {/* Colorways */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Colorway: <span className="text-amber-400 font-semibold">{selectedColor}</span>
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {safeColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedColor === color.name
                      ? 'border-amber-500 bg-amber-500/15 text-white font-medium'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/25 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Print / Embroidery */}
          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Embellishment Option
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

          {/* Quantity & Estimate */}
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div>
              <label htmlFor="pdp-qty" className="block text-xs font-medium text-zinc-300">
                Quantity (MOQ {product.moq})
              </label>
              <span className="font-display text-sm font-semibold tabular-nums text-amber-400">
                Est. ${(quantity * activeTier.price).toLocaleString()}
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
              Size Ratio / Label Notes (Optional)
            </label>
            <input
              id="pdp-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. S–XL mix · custom neck label"
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
              <span>Customize</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Clean Size Chart */}
      <div className="mt-12 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-8">
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
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                <ResilientImage
                  src={item.image}
                  fallbackSrc={item.fallbackImage}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <span className="font-display text-sm font-semibold text-zinc-100">
                    {item.priceRange} / pc
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
