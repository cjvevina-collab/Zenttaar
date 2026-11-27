import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Mail, CheckCircle2, Copy } from 'lucide-react';
import { BRAND_INFO, InquiryItem } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryItem[];
  onUpdateQty: (uid: string, delta: number) => void;
  onRemoveItem: (uid: string) => void;
  onClearItems: () => void;
}

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearItems,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedSubtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceEstimate,
    0
  );

  const buildSummaryText = (refId: string) => {
    const lines = items.map(
      (item, i) =>
        `${i + 1}. ${item.name} | ${item.gsm} | Color: ${item.colorway} | Print/Craft: ${item.technique} | Qty: ${item.quantity} units (~$${item.unitPriceEstimate}/unit)${
          item.customNotes ? ` | Notes: ${item.customNotes}` : ''
        }`
    );
    return `Zenttaar Enterprises Bulk Inquiry [${refId}]\nClient: ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone}\nTotal Units: ${totalUnits}\n\nItems:\n${lines.join(
      '\n'
    )}`;
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Add at least one garment or custom spec to your Inquiry Bag first.');
      return;
    }

    if (!clientName.trim() || !clientEmail.trim()) {
      setFormError('Please enter your name and business email to receive your quote.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim());
    if (!emailValid) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const refId = `ZEN-BAG-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refId);
  };

  const handleCopyBrief = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(buildSummaryText(submittedRef));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk Manufacturing Inquiry Bag"
    >
      <div className="flex h-full w-full max-w-lg flex-col border-l border-zinc-800 bg-[#09090d] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Manufacturing Inquiry Bag</h2>
            <p className="text-xs text-zinc-400">
              Combine multiple silhouettes & custom specs into one bulk quote
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry drawer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submittedRef ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-6 text-center">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-400" />
              <h3 className="mt-3 font-display text-xl font-bold text-white">
                Inquiry Bag Submitted
              </h3>
              <p className="mt-1 text-xs font-display text-amber-400">Ref: {submittedRef}</p>
              <p className="mt-2 text-sm text-zinc-300">
                Your {items.length}-item manufacturing brief ({totalUnits} total units) is ready for{' '}
                {BRAND_INFO.name}.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={`mailto:${BRAND_INFO.email}?subject=${encodeURIComponent(
                    `Bulk Inquiry Bag [${submittedRef}] - ${clientName}`
                  )}&body=${encodeURIComponent(buildSummaryText(submittedRef))}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Brief to {BRAND_INFO.email}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'Copied Brief to Clipboard' : 'Copy Inquiry Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClearItems();
                    setSubmittedRef(null);
                    onClose();
                  }}
                  className="mt-2 text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4 cursor-pointer"
                >
                  Start Fresh Inquiry Bag
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="font-display text-base font-semibold text-zinc-200">
                Your Inquiry Bag is Empty
              </p>
              <p className="mt-1.5 max-w-xs text-xs text-zinc-400">
                Select hoodies, tracksuits, or build a custom tech-pack garment to request a unified factory quote.
              </p>
              <a
                href="#catalog"
                onClick={onClose}
                className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400"
              >
                Browse Apparel Catalog
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.uid}
                  className="flex gap-3.5 rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                    <ResilientImage
                      src={item.image}
                      fallbackSrc={item.fallbackImage}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="truncate font-display text-sm font-semibold text-white">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.uid)}
                        aria-label={`Remove ${item.name}`}
                        className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-1 text-xs text-zinc-400">
                      {item.gsm} · {item.colorway}
                    </div>
                    <div className="text-xs text-amber-400/90">{item.technique}</div>
                    {item.customNotes && (
                      <div className="mt-1 line-clamp-2 text-xs text-zinc-500">
                        {item.customNotes}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.uid, -10)}
                          aria-label="Decrease quantity by 10"
                          className="p-1.5 text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 font-display text-xs tabular-nums text-white">
                          {item.quantity} pcs
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.uid, 10)}
                          aria-label="Increase quantity by 10"
                          className="p-1.5 text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-display text-xs tabular-nums text-zinc-300">
                        ~${(item.quantity * item.unitPriceEstimate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Submission Form */}
        {items.length > 0 && !submittedRef && (
          <form
            onSubmit={handleSubmitInquiry}
            className="border-t border-zinc-800 bg-[#0b0b10] px-6 py-5 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Total Units ({items.length} styles)</span>
              <span className="font-display tabular-nums font-semibold text-white">
                {totalUnits} pcs · Est. ${estimatedSubtotal.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your Name / Brand *"
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Business Email *"
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="WhatsApp / Phone Number (Optional)"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            />

            {formError && (
              <p role="alert" className="text-xs text-rose-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Submit Bulk Quote Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
