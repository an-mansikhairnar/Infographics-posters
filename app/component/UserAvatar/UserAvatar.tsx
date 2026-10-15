'use client';

import Image from 'next/image';
import { useState } from 'react';

type UserAvatarProps = Readonly<{
  name?: string | null;
  image?: string | null;
  fallbackName?: string | null;
  size?: 'small' | 'large';
}>;

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0];
  const last = parts.at(-1) ?? first;
  return `${first[0]}${last[0]}`.toUpperCase();
}

export default function UserAvatar({
  name,
  image,
  fallbackName,
  size = 'small',
}: UserAvatarProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const initials = getInitials(name?.trim() || fallbackName?.trim() || 'Account');
  const sizeClass = size === 'large' ? 'h-24 w-24 text-2xl' : 'h-10 w-10 text-sm';

  if (image && failedImage !== image) {
    return (
      <Image
        src={image}
        alt={name ? `${name}'s profile picture` : 'Profile picture'}
        width={size === 'large' ? 96 : 40}
        height={size === 'large' ? 96 : 40}
        unoptimized
        onError={() => setFailedImage(image)}
        className={`${sizeClass} rounded-full border border-white/20 object-cover`}
      />
    );
  }

  return (
    <span
      aria-label={name || fallbackName || 'Account'}
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full border border-white/20 bg-cyan-700 font-semibold text-white`}
    >
      {initials}
    </span>
  );
}
