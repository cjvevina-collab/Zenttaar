import React, { useState } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';
import { BRAND_INFO, PageRoute } from '../data/catalog';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  inquiryCount: number;
  onOpenInquiry: () => void;
}

const NAV_LINKS: { label: string; page: PageRoute }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Shop', page: 'shop' },
  { label: 'About Us', page: 'about' },
  { label: 'Custom Order', page: 'custom-order' },
  { label: 'Contact', page: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  inquiryCount,
  onOpenInquiry,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#070709]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-8 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Zone 1: Enlarged Brand Logo Only */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          aria-label={BRAND_INFO.name}
          className="flex items-center shrink-0 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <img
            src={BRAND_INFO.logoUrl}
            alt={BRAND_INFO.name}
            referrerPolicy="no-referrer"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              currentPage === link.page ||
              (link.page === 'shop' && currentPage === 'product');
            return (
              <button
                key={link.page}
                type="button"
                onClick={() => handleNavClick(link.page)}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-200 ${
                  isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Desktop Primary Action + Mobile 3-Line Menu Trigger (No Inquiry Bag button on mobile top bar) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenInquiry}
            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Briefcase className="h-4 w-4" />
            <span>Inquiry Bag</span>
            <span className="tabular-nums font-bold">({inquiryCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 text-zinc-100 hover:border-amber-500/60 cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800/80 bg-[#09090c] px-4 py-4">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive =
                currentPage === link.page ||
                (link.page === 'shop' && currentPage === 'product');
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => handleNavClick(link.page)}
                  className={`rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenInquiry();
              }}
              className="mt-2 inline-flex items-center justify-between rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 cursor-pointer"
            >
              <span>Inquiry Bag</span>
              <span className="tabular-nums font-bold">{inquiryCount} items</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
