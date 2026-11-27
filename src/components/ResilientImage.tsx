import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const [activeSrc, setActiveSrc] = useState<string>(src);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  React.useEffect(() => {
    setActiveSrc(src);
    setHasFailedAll(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30 text-zinc-400 p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="w-8 h-8 text-amber-500/70 mb-2" />
        <span className="text-xs font-medium text-center text-zinc-300 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
