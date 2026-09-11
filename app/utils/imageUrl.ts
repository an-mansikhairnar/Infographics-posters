const DEFAULT_PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL;

const normalizeOrigin = (value?: string | null): string => {
  const raw = (value || '').trim();

  if (!raw) {
    if (!DEFAULT_PUBLIC_ORIGIN) {
      throw new Error(
        'Missing required environment variable: NEXT_PUBLIC_BASE_URL'
      );
    }

    return DEFAULT_PUBLIC_ORIGIN;
  }

  const trimmed = raw.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);

    return `${url.protocol}//${url.host}`;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const host = trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^\/+/, '')
    .split('/')[0];

  return `https://${host}`;
};

export const getPublicOrigin = (): string =>
  normalizeOrigin(
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL
  );

export const buildAbsoluteImageUrl = (
  path?: string | null,
  fallbackPrefix?: string | null
): string => {
  if (!path) return '';

  const cleanedPath = path.trim();

  if (/^https?:\/\//i.test(cleanedPath)) {
    return cleanedPath;
  }

  if (cleanedPath.startsWith('//')) {
    return `https:${cleanedPath}`;
  }

  const prefix = normalizeOrigin(fallbackPrefix || getPublicOrigin());
  const relativePath = cleanedPath.replace(/^\/+/, '');

  return `${prefix}/${relativePath}`;
};
