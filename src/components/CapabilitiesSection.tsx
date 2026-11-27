import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PageRoute } from '../data/catalog';

interface CapabilitiesSectionProps {
  onNavigate: (page: PageRoute) => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Tech Pack or Concept Brief',
    description:
      'Share your sketches, reference hoodies, or CAD tech pack. Choose fabric GSM (380–620 GSM) and sharp Pantone colorways.',
  },
  {
    num: '02',
    title: '14-Day Graded Physical Sample',
    description:
      'Our Sialkot pattern room builds and ships your pre-production sample with exact puff print, embroidery, and custom trims.',
  },
  {
    num: '03',
    title: 'Cut, Sew & Embellishment Run',
    description:
      'Bulk cutting, reinforced coverstitching, acid/enzyme washes, and private-label woven tags executed under strict QC.',
  },
  {
    num: '04',
    title: 'AQL 2.5 Audit & Air Dispatch',
    description:
      'Every unit is steamed, folded into custom frosted polybags, and dispatched worldwide via DHL Express or air cargo.',
  },
];

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onNavigate }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative border-t border-zinc-800/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-400">
              End-to-End OEM Workflow
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              From Sketch to Retail-Ready Drop
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('custom-order')}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-lg bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Start Custom Order</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
              className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6"
            >
              <div className="font-display text-xs font-semibold text-amber-400">
                Step {step.num}
              </div>
              <h3 className="mt-2 font-display text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
