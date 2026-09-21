const DEFAULT_PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL;

const mapImageHost = (host: string): string => {
  const normalizedHost = host.toLowerCase();

  const hostMappings: Record<string, string> = {
    'images.infographicsposters.com': 'www.infographicsposters.com',
  };

  return hostMappings[normalizedHost] || host;
};

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
    url.hostname = mapImageHost(url.hostname);

    return `${url.protocol}//${url.host}`;
  }

  if (trimmed.startsWith('//')) {
    const url = new URL(`https:${trimmed}`);
    url.hostname = mapImageHost(url.hostname);

    return `https://${url.host}`;
  }

  const host = trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^\/+/, '')
    .split('/')[0];

  return `https://${mapImageHost(host)}`;
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
  console.log('TCL ->  ~ imageUrl.ts:123 ~ buildAbsoluteImageUrl ~ path:', path)
  if (!path) return '';

  const cleanedPath = path.trim();

  if (/^https?:\/\//i.test(cleanedPath)) {
    const url = new URL(cleanedPath);
    url.hostname = mapImageHost(url.hostname);

    return url.toString();
  }

  if (cleanedPath.startsWith('//')) {
    const url = new URL(`https:${cleanedPath}`);
    url.hostname = mapImageHost(url.hostname);

    return url.toString();
  }

  const prefix = normalizeOrigin(
    fallbackPrefix ?? getPublicOrigin()
  );

  const relativePath = cleanedPath.replace(/^\/+/, '');

  return `${prefix}/${relativePath}`;
};
