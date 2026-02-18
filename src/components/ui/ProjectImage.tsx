'use client';

import { useState } from 'react';

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f1f5f9" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14">Фото объекта</text></svg>'
);

interface ProjectImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export function ProjectImage({ src, alt, fill, className = '' }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const effectiveSrc = failed || !src ? PLACEHOLDER : src.startsWith('/') ? src : src;

  if (fill) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={effectiveSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          onError={() => setFailed(true)}
        />
      </>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
