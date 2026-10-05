import React from 'react';
import { db } from '@/lib/db';
import type { AdPosition } from '@prisma/client';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export async function AdSlot({ position, className = '' }: AdSlotProps) {
  let ad = null;

  try {
    ad = await db.advertisement.findFirst({
      where: { position, enabled: true },
    });
  } catch {
    // Silently fail — ads should never break the page
    return null;
  }

  if (!ad) return null;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      data-ad-position={position}
      aria-label="Advertisement"
    >
      <div dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />
    </div>
  );
}
