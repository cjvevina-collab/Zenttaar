import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageRoute, SiteSettingsPublic } from '../data/catalog';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'returns';
  onNavigate: (page: PageRoute) => void;
  siteSettings: SiteSettingsPublic;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate, siteSettings }) => {
  const legalContent = {
    privacy: {
      kicker: 'Legal & Data Protection',
      title: 'Privacy Policy',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: '01. Information We Collect',
          body: `When you submit a manufacturing inquiry, sample request, or custom tech-pack brief to ${siteSettings.brandName} (${siteSettings.domain}), we collect your contact name, brand name, business email address, WhatsApp/phone number, shipping destination, and garment specifications.`,
        },
        {
          heading: '02. Tech-Pack & Intellectual Property Confidentiality',
          body: 'All brand artwork, logos, CAD patterns, and custom measurement specs shared with our Sialkot production studio remain the sole intellectual property of your label. We never resell, publish, or showcase client proprietary graphics without explicit written approval.',
        },
        {
          heading: '03. How We Use Your Data',
          body: 'Your information is used strictly to prepare factory quotations, coordinate pre-production sampling, communicate order status updates, and arrange international customs documentation and freight.',
        },
        {
          heading: '04. Contact Regarding Privacy',
          body: `For data deletion or confidentiality NDA requests, email our production desk directly at ${siteSettings.email}.`,
        },
      ],
    },
    terms: {
      kicker: 'Manufacturing Terms',
      title: 'Terms & Conditions',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: '01. Quotations & Minimum Order Quantities',
          body: 'Custom bulk quotations are prepared upon inquiry FOB Sialkot unless CIF/DDP air freight is explicitly specified. Standard MOQs begin at 50 units per style/colorway (35 units for Melton wool & leather outerwear).',
        },
        {
          heading: '02. Pre-Production Sampling & Approval',
          body: 'Bulk cutting begins only after written client sign-off on the pre-production physical sample or approved digital strike-off. Standard sample development takes 12–14 business days.',
        },
        {
          heading: '03. Production Lead Times & Tolerances',
          body: 'Standard bulk manufacturing turnaround is 18–28 business days after deposit and sample approval. Standard textile tolerances apply (+/- 0.5 inch on garment grading and +/- 3% GSM variance).',
        },
        {
          heading: '04. Payment Schedule',
          body: 'Production slots are reserved upon a 50% deposit, with the remaining 50% balance due following final AQL 2.5 inspection photos/videos prior to airway bill dispatch.',
        },
      ],
    },
    returns: {
      kicker: 'Quality Assurance',
      title: 'Return & Quality Claim Policy',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: '01. Custom-Made Order Policy',
          body: 'Because every order is manufactured to order with your brand’s custom fabric GSM, dye lot, measurements, and labels, custom bulk orders cannot be returned for change of mind once production has been approved.',
        },
        {
          heading: '02. Manufacturing Defect Coverage',
          body: 'If delivered goods exhibit verified manufacturing defects (stitching failure, incorrect artwork placement, or major measurement variance beyond tolerance), notify us within 14 days of delivery with clear photo/video evidence.',
        },
        {
          heading: '03. Resolution & Replacement',
          body: 'Verified defective units are eligible for immediate free replacement production in our next express cycle or pro-rated credit toward your next drop.',
        },
        {
          heading: '04. Pre-Shipment Inspection Rights',
          body: `Clients may request live factory video inspection or independent third-party AQL inspection at our ${siteSettings.address} facility before final shipment release.`,
        },
      ],
    },
  };

  const doc = legalContent[type];

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <header className="mt-6 border-b border-zinc-800/80 pb-8">
        <p className="text-xs font-medium tracking-wide text-amber-400">{doc.kicker}</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
          {doc.title}
        </h1>
        <p className="mt-2 text-xs font-display text-zinc-400">
          {siteSettings.brandName} · {doc.updated}
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {doc.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-6 sm:p-7"
          >
            <h2 className="font-display text-lg font-bold text-white">{section.heading}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
};
