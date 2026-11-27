import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BRAND_INFO } from '../data/catalog';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 250);
      return () => clearTimeout(t);
    }

    const start = performance.now();
    const duration = 1150;
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 180);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060608] px-6"
          aria-label="Loading Zenttaar Enterprises"
        >
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex flex-col items-center"
            >
              <img
                src={BRAND_INFO.logoUrl}
                alt={BRAND_INFO.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
                className="h-20 w-20 object-contain mb-4 rounded-xl bg-zinc-900/70 p-2 border border-amber-500/20"
              />
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Zenttaar Enterprises
              </h2>
              <p className="mt-1.5 text-xs text-zinc-400 tracking-wide">
                Custom Luxury Apparel Atelier · Sialkot
              </p>
            </motion.div>

            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 transition-transform duration-75 origin-left"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>

            <div className="mt-3 w-full flex items-center justify-between text-xs font-display tabular-nums text-zinc-400">
              <span>Preparing Showroom</span>
              <span className="text-amber-400">{progress}%</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setVisible(false);
                onComplete();
              }}
              className="mt-6 text-xs text-zinc-500 hover:text-zinc-200 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Enter Directly
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
