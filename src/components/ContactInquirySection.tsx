import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail, MapPin, Phone, Globe, CheckCircle2, Send, Instagram } from 'lucide-react';
import { SiteSettingsPublic } from '../data/catalog';
import { submitPublicInquiry } from '../services/firestoreService';

interface ContactInquirySectionProps {
  siteSettings: SiteSettingsPublic;
}

export const ContactInquirySection: React.FC<ContactInquirySectionProps> = ({
  siteSettings,
}) => {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Heavyweight Hoodies');
  const [quantity, setQuantity] = useState('100 - 300 Units');
  const [techPackUrl, setTechPackUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please enter your name, email address, and manufacturing requirements.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailValid) {
      setError('Please enter a valid business email address.');
      return;
    }

    const refId = `ZEN-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmitting(true);
    try {
      await submitPublicInquiry({
        refId,
        source: 'contact_form',
        name,
        brandName,
        email,
        phone,
        category,
        quantity,
        techPackUrl,
        message,
      });
    } catch (err) {
      console.warn('Firestore inquiry log fallback:', err);
    } finally {
      setSubmitting(false);
      setSubmittedRef(refId);
    }
  };

  return (
    <section id="contact" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left: Direct Sialkot Factory Contact Card */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-amber-400">
                Direct Manufacturing Desk
              </p>
              <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
                Start a Bulk Order
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                Share your tech pack or garment specs to receive custom factory pricing. Our Sialkot desk responds within 12 hours.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-zinc-400">Factory Address</div>
                  <div className="mt-0.5 text-sm font-medium text-white">{siteSettings.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-zinc-800/80 pt-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-zinc-400">Production Email</div>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="mt-0.5 block text-sm font-medium text-white hover:text-amber-400 transition-colors break-all"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-zinc-800/80 pt-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-zinc-400">Phone / WhatsApp</div>
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="mt-0.5 block font-display tabular-nums text-sm font-medium text-white hover:text-amber-400 transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-zinc-800/80 pt-4">
                <Globe className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-zinc-400">Website</div>
                  <a
                    href={siteSettings.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-sm font-medium text-white hover:text-amber-400 transition-colors"
                  >
                    {siteSettings.domain}
                  </a>
                </div>
              </div>

              <div className="border-t border-zinc-800/80 pt-4">
                <div className="text-xs font-medium text-zinc-400 mb-2.5">Social Channels</div>
                <div className="flex items-center gap-2.5">
                  <a
                    href={siteSettings.instagramUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={siteSettings.facebookUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Bulk Manufacturing Inquiry Form */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-7 rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95 p-5 sm:p-8"
          >
            {submittedRef ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="mt-4 font-display text-2xl font-bold text-white">
                  Manufacturing Inquiry Logged
                </h3>
                <p className="mt-2 text-sm text-zinc-300">
                  Reference ID:{' '}
                  <span className="font-display font-semibold tabular-nums text-amber-400">
                    {submittedRef}
                  </span>
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
                  Thank you, {name}. Your production brief for {category} ({quantity}) has been prepared for our Sialkot factory desk.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`mailto:${siteSettings.email}?subject=${encodeURIComponent(
                      `Bulk Inquiry [${submittedRef}] - ${brandName || name}`
                    )}&body=${encodeURIComponent(
                      `Name: ${name}\nBrand: ${brandName}\nEmail: ${email}\nPhone: ${phone}\nCategory: ${category}\nQuantity: ${quantity}\nTech Pack Link: ${techPackUrl}\n\nDetails:\n${message}`
                    )}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send via Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMessage('');
                    }}
                    className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 cursor-pointer"
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inq-name" className="block text-xs font-medium text-zinc-300">
                      Your Name *
                    </label>
                    <input
                      id="inq-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="inq-brand" className="block text-xs font-medium text-zinc-300">
                      Brand / Company Name
                    </label>
                    <input
                      id="inq-brand"
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Your clothing label"
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inq-email" className="block text-xs font-medium text-zinc-300">
                      Business Email *
                    </label>
                    <input
                      id="inq-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@yourbrand.com"
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="inq-phone" className="block text-xs font-medium text-zinc-300">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="inq-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 / +1 / +92 ..."
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inq-category" className="block text-xs font-medium text-zinc-300">
                      Garment Category
                    </label>
                    <select
                      id="inq-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option>Heavyweight Hoodies</option>
                      <option>Fleece Tracksuits</option>
                      <option>Varsity & Outerwear</option>
                      <option>Oversized Streetwear Tees</option>
                      <option>Full Seasonal Collection</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inq-qty" className="block text-xs font-medium text-zinc-300">
                      Estimated Order Volume
                    </label>
                    <select
                      id="inq-qty"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option>50 - 100 Units (Starter MOQ)</option>
                      <option>100 - 300 Units</option>
                      <option>300 - 1,000 Units</option>
                      <option>1,000+ Units (Wholesale)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="inq-techpack" className="block text-xs font-medium text-zinc-300">
                    Tech Pack / Design Reference Link (Optional)
                  </label>
                  <input
                    id="inq-techpack"
                    type="url"
                    value={techPackUrl}
                    onChange={(e) => setTechPackUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="inq-msg" className="block text-xs font-medium text-zinc-300">
                    Production Requirements & Fabric GSM *
                  </label>
                  <textarea
                    id="inq-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your desired GSM, colorways, embroidery/puff print placement, and delivery destination..."
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-rose-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-60 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Submitting Inquiry...' : 'Request Manufacturing Quote'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
