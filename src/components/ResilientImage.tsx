import React, { useState } from 'react';
import { IceCreamCone } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FCE8EE] via-[#FFF6F0] to-[#F3E3D8] text-[#5C3A28] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <IceCreamCone className="w-10 h-10 mb-2 text-[#C8436B] opacity-80" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="font-display text-sm font-semibold text-[#3A2116]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
