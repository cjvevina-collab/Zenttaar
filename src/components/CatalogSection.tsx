import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { GarmentProduct } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface CatalogSectionProps {
  products: GarmentProduct[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
  onSelectProduct: (productId: string) => void;
  onAddToInquiry: (
    product: GarmentProduct,
    colorway: string,
    technique: string,
    quantity: number
  ) => void;
}

const CATEGORIES = ['All', 'Hoodies', 'Sets & Outerwear', 'Custom Blanks'] as const;

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  title = 'Signature Silhouettes',
  subtitle = 'Heavyweight cuts ready for private-label branding.',
  limit,
  showViewAllButton = false,
  onViewAll,
  onSelectProduct,
  onAddToInquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [addedId, setAddedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredByCat =
    selectedCategory === 'All'
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const displayItems = limit ? filteredByCat.slice(0, limit) : filteredByCat;

  const handleQuickAdd = (product: GarmentProduct) => {
    onAddToInquiry(
      product,
      product.colorways?.[0]?.name || 'Custom Color',
      product.techniques?.[0] || 'Custom Print',
      product.moq
    );
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalog" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-400">
              Private Label Collection
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              {title}
            </h2>
            {subtitle && <p className="mt-2 max-w-xl text-sm text-zinc-400">{subtitle}</p>}
          </div>

          <div
            className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/90 p-1 self-start md:self-auto"
            role="tablist"
            aria-label="Filter catalog categories"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Uniform Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayItems.map((product, index) => {
            const isAdded = addedId === product.id;

            return (
              <motion.article
                key={product.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.25, delay: (index % 3) * 0.03 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 transition-transform duration-200 hover:-translate-y-0.5 hover:border-amber-500/40"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(product.id)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 text-left cursor-pointer"
                >
                  <ResilientImage
                    src={product.image}
                    fallbackSrc={product.fallbackImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/20" />
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 whitespace-nowrap overflow-hidden">
                    <span className="text-amber-400 font-medium truncate">{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums shrink-0">{product.gsm}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(product.id)}
                    className="mt-1.5 text-left font-display text-lg font-semibold text-white hover:text-amber-400 transition-colors truncate cursor-pointer"
                  >
                    {product.name}
                  </button>

                  {/* Colorways Row */}
                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-500">Colorways</span>
                    <div className="flex items-center gap-1.5" aria-label="Available colorways">
                      {product.colorways.map((color) => (
                        <span
                          key={color.name}
                          title={color.name}
                          className="h-3.5 w-3.5 rounded-full border border-white/25 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Single-Line Pricing & MOQ Row */}
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800/80 pt-3.5 whitespace-nowrap">
                    <span className="text-xs tabular-nums text-zinc-400 shrink-0">
                      MOQ {product.moq} pcs
                    </span>
                    <span className="font-display text-sm tabular-nums font-semibold text-white shrink-0">
                      {product.priceRange} <span className="text-xs font-normal text-zinc-400">/ pc</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                      }`}
                    >
                      {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      <span>{isAdded ? 'Added' : 'Add to Inquiry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2.5 text-xs font-medium text-zinc-200 hover:border-amber-500/70 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {showViewAllButton && onViewAll && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/80 px-6 py-3 text-sm font-semibold text-white hover:border-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span>Explore Full Shop</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
