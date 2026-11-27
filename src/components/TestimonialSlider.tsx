import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/catalog';

export const TestimonialSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [paused]);

  const current = TESTIMONIALS[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section
      id="testimonials"
      className="relative border-t border-zinc-800/80 py-14 sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-400">
              Global Brand Partnerships
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              Trusted by Streetwear Labels
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center"
            >
              <div className="lg:col-span-8">
                <Quote className="h-7 w-7 text-amber-500/70 mb-3" />
                <blockquote className="font-display text-lg sm:text-2xl font-medium leading-snug text-zinc-100">
                  “{current.quote}”
                </blockquote>
              </div>

              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-5 lg:pt-0 lg:pl-8">
                <div className="font-display text-lg font-bold text-white">{current.name}</div>
                <div className="mt-0.5 text-sm text-zinc-400">
                  {current.role} · <span className="text-zinc-200">{current.brand}</span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">{current.location}</div>

                <div className="mt-4 border-t border-zinc-800/80 pt-3.5">
                  <div className="text-xs text-zinc-400">Production Scope</div>
                  <div className="mt-0.5 font-display text-sm tabular-nums font-semibold text-amber-400">
                    {current.orderMetric}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex items-center gap-2 border-t border-zinc-800/70 pt-5">
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`Read review from ${item.name}`}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === index ? 'w-8 bg-amber-500' : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
            <span className="ml-auto font-display text-xs tabular-nums text-zinc-500">
              0{index + 1} / 0{TESTIMONIALS.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
