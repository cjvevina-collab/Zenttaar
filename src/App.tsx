/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  BRAND_INFO,
  DEFAULT_SITE_SETTINGS,
  GARMENTS,
  GarmentProduct,
  InquiryItem,
  PRODUCTION_VIDEOS,
  PageRoute,
  ProductionVideo,
  SiteSettingsPublic,
  TESTIMONIALS,
  TestimonialItem,
} from './data/catalog';
import {
  subscribeProducts,
  subscribePublicSettings,
  subscribeTestimonials,
  subscribeVideos,
} from './services/firestoreService';
import { ResilientImage } from './components/ResilientImage';
import { Preloader } from './components/Preloader';
import { LightningCursor } from './components/LightningCursor';
import { Header } from './components/Header';
import { HeroBannerSlider } from './components/HeroBannerSlider';
import { CatalogSection } from './components/CatalogSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { CustomizerStudio } from './components/CustomizerStudio';
import { ProductionVideoSection } from './components/ProductionVideoSection';
import { TestimonialSlider } from './components/TestimonialSlider';
import { ContactInquirySection } from './components/ContactInquirySection';
import { SingleProductPage } from './components/SingleProductPage';
import { AboutPage } from './components/AboutPage';
import { FaqPage } from './components/FaqPage';
import { LegalPage } from './components/LegalPage';
import { InquiryDrawer } from './components/InquiryDrawer';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [siteSettings, setSiteSettings] = useState<SiteSettingsPublic>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<GarmentProduct[]>(GARMENTS);
  const [videos, setVideos] = useState<ProductionVideo[]>(PRODUCTION_VIDEOS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS);

  const [selectedProductId, setSelectedProductId] = useState<string>(GARMENTS[0].id);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([]);
  const [seedProduct, setSeedProduct] = useState<GarmentProduct | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubSettings = subscribePublicSettings(setSiteSettings);
    const unsubProducts = subscribeProducts(setProducts);
    const unsubVideos = subscribeVideos(setVideos);
    const unsubTestimonials = subscribeTestimonials(setTestimonials);
    return () => {
      unsubSettings();
      unsubProducts();
      unsubVideos();
      unsubTestimonials();
    };
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setCurrentPage('home');
      } else if (hash.startsWith('product/')) {
        const pid = hash.replace('product/', '');
        if (products.some((g) => g.id === pid) || GARMENTS.some((g) => g.id === pid)) {
          setSelectedProductId(pid);
          setCurrentPage('product');
        }
      } else if (
        [
          'shop',
          'about',
          'custom-order',
          'testimonials',
          'faq',
          'contact',
          'privacy',
          'terms',
          'returns',
          'admin',
        ].includes(hash)
      ) {
        setCurrentPage(hash as PageRoute);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [products]);

  const navigateTo = (page: PageRoute, productId?: string) => {
    if (page === 'product' && productId) {
      setSelectedProductId(productId);
      window.location.hash = `product/${productId}`;
    } else {
      window.location.hash = page === 'home' ? 'home' : page;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const handleAddToInquiry = (
    product: GarmentProduct,
    colorway: string,
    technique: string,
    quantity: number,
    customNotes?: string
  ) => {
    const tiers = product.priceTiers || [];
    const tierPrice =
      quantity >= 250 && tiers[2]
        ? tiers[2].price
        : quantity >= 100 && tiers[1]
        ? tiers[1].price
        : tiers[0]?.price || product.basePrice || 22;

    setInquiryItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product.id &&
          item.colorway === colorway &&
          item.technique === technique &&
          (item.customNotes || '') === (customNotes || '')
      );
      if (existing) {
        return prev.map((item) =>
          item.uid === existing.uid ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          uid: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          fallbackImage: product.fallbackImage,
          gsm: product.gsm,
          colorway,
          technique,
          quantity,
          unitPriceEstimate: tierPrice,
          customNotes,
        },
      ];
    });

    showToast(`Added ${product.name} (${quantity} pcs) to Inquiry Bag`);
  };

  const handleAddCustomToInquiry = (customItem: InquiryItem) => {
    setInquiryItems((prev) => [...prev, customItem]);
    showToast(`Added ${customItem.name} to Inquiry Bag`);
    setInquiryOpen(true);
  };

  const handleCustomizeProduct = (product: GarmentProduct) => {
    setSeedProduct(product);
    navigateTo('custom-order');
  };

  const handleUpdateQty = (uid: string, delta: number) => {
    setInquiryItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, quantity: Math.max(25, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (uid: string) => {
    setInquiryItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  const handleClearItems = () => {
    setInquiryItems([]);
  };

  const activeProduct =
    products.find((g) => g.id === selectedProductId) || products[0] || GARMENTS[0];

  const pageKey =
    currentPage === 'product' ? `product-${selectedProductId}` : currentPage;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070709] text-zinc-100">
        {/* Full-Site Atmospheric Background Theme Image */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <ResilientImage
            src={siteSettings.backgroundUrl}
            fallbackSrc={BRAND_INFO.fallbackBackdrop}
            alt={`${siteSettings.brandName} luxury dark apparel theme backdrop`}
            loading="eager"
            className="h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/85 via-[#070709]/78 to-[#070709]/92" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 18% 15%, rgba(245, 158, 11, 0.16), transparent 45%), radial-gradient(circle at 82% 65%, rgba(225, 29, 72, 0.14), transparent 45%)',
            }}
          />
        </div>

        {/* Starting Preloader */}
        {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

        {/* Fast Silky Electric Lightning Cursor Trail */}
        <LightningCursor />

        {/* Main Application Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header
            currentPage={currentPage}
            onNavigate={(page) => navigateTo(page)}
            inquiryCount={inquiryItems.length}
            onOpenInquiry={() => setInquiryOpen(true)}
            siteSettings={siteSettings}
          />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentPage === 'home' && (
                  <>
                    <HeroBannerSlider
                      onNavigate={(page) => navigateTo(page)}
                      backgroundUrl={siteSettings.backgroundUrl}
                    />
                    <CatalogSection
                      products={products}
                      title="Featured Hoodies & Blanks"
                      subtitle="Open any silhouette for wholesale pricing tiers and sizing."
                      limit={3}
                      showViewAllButton
                      onViewAll={() => navigateTo('shop')}
                      onSelectProduct={(id) => navigateTo('product', id)}
                      onAddToInquiry={handleAddToInquiry}
                    />
                    <CapabilitiesSection onNavigate={(page) => navigateTo(page)} />
                    <ProductionVideoSection videos={videos} />
                    <TestimonialSlider testimonials={testimonials} />

                    {/* Clean Closing Bulk Order CTA Band */}
                    <section className="border-t border-zinc-800/80 py-14 sm:py-16">
                      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
                          <div className="max-w-xl">
                            <p className="text-xs font-medium text-amber-400">
                              Ready to Manufacture
                            </p>
                            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-white">
                              Have a Tech Pack or Custom Design?
                            </h2>
                            <p className="mt-2 text-sm text-zinc-400">
                              Configure your fabric GSM and print specs or request a factory quote.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => navigateTo('custom-order')}
                              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <span>Custom Order</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateTo('contact')}
                              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:border-amber-500 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <span>Contact Us</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {currentPage === 'shop' && (
                  <CatalogSection
                    products={products}
                    title="Apparel Manufacturing Shop"
                    subtitle="Heavyweight hoodies, tracksuits, and varsity outerwear."
                    onSelectProduct={(id) => navigateTo('product', id)}
                    onAddToInquiry={handleAddToInquiry}
                  />
                )}

                {currentPage === 'product' && (
                  <SingleProductPage
                    product={activeProduct}
                    allProducts={products}
                    onBackToShop={() => navigateTo('shop')}
                    onSelectProduct={(id) => navigateTo('product', id)}
                    onAddToInquiry={handleAddToInquiry}
                    onCustomizeProduct={handleCustomizeProduct}
                  />
                )}

                {currentPage === 'about' && (
                  <AboutPage
                    onNavigate={(page) => navigateTo(page)}
                    siteSettings={siteSettings}
                    videos={videos}
                  />
                )}

                {currentPage === 'custom-order' && (
                  <CustomizerStudio
                    seedProduct={seedProduct}
                    onAddCustomToInquiry={handleAddCustomToInquiry}
                  />
                )}

                {currentPage === 'testimonials' && (
                  <div className="py-10">
                    <TestimonialSlider testimonials={testimonials} />
                    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                      <h2 className="font-display text-2xl font-bold text-white mb-6">
                        Verified Client Reviews
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t) => (
                          <div
                            key={t.id}
                            className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 flex flex-col justify-between"
                          >
                            <p className="text-sm leading-relaxed text-zinc-300">“{t.quote}”</p>
                            <div className="mt-5 border-t border-zinc-800 pt-4">
                              <div className="font-display text-base font-bold text-white">
                                {t.name}
                              </div>
                              <div className="text-xs text-zinc-400">
                                {t.role} · {t.brand} ({t.location})
                              </div>
                              <div className="mt-1.5 font-display text-xs tabular-nums font-medium text-amber-400">
                                {t.orderMetric}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {currentPage === 'faq' && (
                  <FaqPage onNavigate={(page) => navigateTo(page)} />
                )}

                {currentPage === 'contact' && (
                  <ContactInquirySection siteSettings={siteSettings} />
                )}

                {(currentPage === 'privacy' ||
                  currentPage === 'terms' ||
                  currentPage === 'returns') && (
                  <LegalPage
                    type={currentPage}
                    onNavigate={(page) => navigateTo(page)}
                    siteSettings={siteSettings}
                  />
                )}

                {currentPage === 'admin' && (
                  <AdminPortal
                    siteSettings={siteSettings}
                    products={products}
                    videos={videos}
                    testimonials={testimonials}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer
            onNavigate={(page) => navigateTo(page)}
            siteSettings={siteSettings}
          />
        </div>

        {/* Fixed Pure Green Circular WhatsApp Action */}
        <WhatsAppButton whatsappNumber={siteSettings.whatsappNumber} />

        {/* Slide-Over Inquiry Bag Drawer */}
        <InquiryDrawer
          isOpen={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          items={inquiryItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearItems={handleClearItems}
          siteSettings={siteSettings}
        />

        {/* Subtle Inquiry Feedback Toast */}
        {toastMsg && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-4 sm:left-5 z-50 flex items-center gap-3 rounded-lg border border-amber-500/40 bg-[#0d0d12]/95 px-4 py-3 text-xs font-medium text-white shadow-xl backdrop-blur-md max-w-[calc(100vw-6rem)]"
          >
            <span className="truncate">{toastMsg}</span>
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              Open Bag
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
