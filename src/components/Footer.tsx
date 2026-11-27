import React from 'react';
import { Lock } from 'lucide-react';
import { PageRoute, SiteSettingsPublic } from '../data/catalog';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  siteSettings: SiteSettingsPublic;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteSettings }) => {
  return (
    <footer className="border-t border-zinc-800/90 bg-[#050507] py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
          {/* Brand Logo Only + Concise Summary + Social Media Icons */}
          <div className="md:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label={siteSettings.brandName}
              className="inline-block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.brandName}
                referrerPolicy="no-referrer"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </button>

            <p className="max-w-xs text-xs leading-relaxed text-zinc-400">
              Custom luxury apparel & heavyweight hoodie manufacturing in Sialkot. Full-package OEM/ODM cut & sew for global brands.
            </p>

            {/* Clean Social Media Icon Buttons Only */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={siteSettings.instagramUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href={siteSettings.facebookUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href={siteSettings.tiktokUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>

              <a
                href={siteSettings.youtubeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="grid grid-cols-2 gap-8 md:col-span-5">
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="font-semibold text-zinc-200">Company</div>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Shop
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('custom-order')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Custom Order
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('testimonials')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Testimonials
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="font-semibold text-zinc-200">Policies & Help</div>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={() => onNavigate('faq')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    FAQ
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Contact
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('returns')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Return Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Sialkot Factory Contact */}
          <div className="md:col-span-3 space-y-2.5 text-xs text-zinc-400">
            <div className="font-semibold text-zinc-200">Manufacturing Hub</div>
            <p className="leading-relaxed">{siteSettings.address}</p>
            <p>
              <a
                href={`mailto:${siteSettings.email}`}
                className="text-zinc-200 hover:text-amber-400 transition-colors break-all"
              >
                {siteSettings.email}
              </a>
            </p>
            <p className="tabular-nums text-zinc-200">{siteSettings.phone}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 pt-6 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>{siteSettings.domain}</span>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-amber-500/60 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
