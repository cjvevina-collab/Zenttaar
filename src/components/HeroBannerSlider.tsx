import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { BANNER_SLIDES, PageRoute } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroBannerSliderProps {
  onNavigate: (page: PageRoute) => void;
}

const STATS = [
  { value: '50+', label: 'MOQ Per Style' },
  { value: '380–620', label: 'GSM Fleece Range' },
  { value: '14 Days', label: 'Sample Turnaround' },
  { value: '35+ Countries', label: 'Global Dispatch' },
];

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const currentSlide = BANNER_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[480px] lg:min-h-[580px] w-full overflow-hidden border-b border-zinc-800/80">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ResilientImage
              src={currentSlide.image}
              fallbackSrc={currentSlide.fallbackImage}
              alt={currentSlide.headline}
              loading="eager"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/95 via-[#070709]/75 to-[#070709]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/40" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex min-h-[480px] lg:min-h-[580px] max-w-7xl flex-col justify-end px-4 pb-10 pt-14 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + '-copy'}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <p className="text-xs sm:text-sm font-medium tracking-wide text-amber-400">
                {currentSlide.kicker}
              </p>

              <h1
                className="mt-2.5 font-display font-bold tracking-tight text-white text-balance"
                style={{ fontSize: 'clamp(2rem, 4.2vw, 3.65rem)', lineHeight: 1.08 }}
              >
                {currentSlide.headline}
              </h1>

              <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-300">
                {currentSlide.subheadline}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate(currentSlide.targetPage)}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap cursor-pointer"
                >
                  <span>{currentSlide.ctaPrimary}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/70 px-5 py-3 text-sm font-medium text-zinc-100 hover:border-amber-500/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Browse Shop</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/80 pt-4">
            <div className="flex items-center gap-2">
              {BANNER_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show banner slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-9 bg-amber-500'
                      : 'w-3.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
              <span className="ml-2 font-display text-xs tabular-nums text-zinc-400">
                0{activeIndex + 1} / 0{BANNER_SLIDES.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous banner"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-amber-500/60 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next banner"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-amber-500/60 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact 4-Column Manufacturing KPI Strip */}
      <div className="border-b border-zinc-800/80 bg-[#0b0b0f]/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-5 py-4 sm:px-8 sm:py-5">
              <div className="font-display text-xl sm:text-2xl font-bold tabular-nums text-white">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
