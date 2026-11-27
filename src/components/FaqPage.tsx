import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS, PageRoute } from '../data/catalog';

interface FaqPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="border-b border-zinc-800/80 pb-8">
        <p className="text-xs font-medium tracking-wide text-amber-400">
          Manufacturing Guide
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Clear answers on MOQs, tech packs, sample turnaround, custom finishes, and international shipping from Sialkot.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
              >
                <span className="font-display text-base font-semibold text-white">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-amber-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-zinc-800/70 px-6 py-4 text-sm leading-relaxed text-zinc-300">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-6 sm:p-8">
        <div>
          <h2 className="font-display text-lg font-bold text-white">
            Have a custom tech pack or sizing question?
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Reach our Sialkot production desk directly for fabric swatch advice and exact quotes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>Ask Production Team</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
