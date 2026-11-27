import React from 'react';

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ whatsappNumber }) => {
  const digitsOnly = (whatsappNumber || '03335541751').replace(/[^0-9]/g, '') || '923335541751';
  const cleanNumber = digitsOnly.startsWith('0') ? `92${digitsOnly.slice(1)}` : digitsOnly;
  const message = encodeURIComponent(
    'Hello Zenttaar Enterprises, I would like to inquire about custom apparel manufacturing.'
  );
  const href = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="WhatsApp"
      className="fixed bottom-5 left-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/40 hover:bg-[#20BD5A] active:scale-[0.95] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
    >
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.141 5.266-1.375c1.469.797 3.125 1.219 4.766 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-.984-.328-1.688-.641-2.969-1.281-4.906-4.266-5.047-4.453-.141-.188-1.203-1.609-1.203-3.063 0-1.453.766-2.172 1.031-2.469.266-.297.578-.375.766-.375.188 0 .391 0 .563.016.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.531-.094.188-.141.313-.297.484-.156.172-.313.391-.453.516-.156.141-.313.297-.141.594.172.297.781 1.281 1.672 2.078 1.156 1.031 2.125 1.344 2.422 1.5.297.156.469.125.641-.078.172-.203.75-.875.953-1.172.203-.297.391-.25.656-.156.266.094 1.703.797 2 .953.297.156.484.219.563.344.078.125.078.734-.172 1.438z" />
      </svg>
    </a>
  );
};
