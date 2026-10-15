import type { AssetRecord, DesignInput, DesignRecord } from './types';

const read = <T>(k: string): T[] => { try { return JSON.parse(localStorage.getItem(k) || '[]') as T[]; } catch { return []; } };
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v)); // may throw QuotaExceededError

export const newId = () => `d_${crypto.randomUUID().replaceAll('-', '')}`;
class DesignRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'DesignRequestError';
  }
}

async function designRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    credentials: 'same-origin',
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : `Request failed (${response.status}).`;
    throw new DesignRequestError(message, response.status);
  }
  return payload as T;
}

export async function listDesigns(): Promise<DesignRecord[]> {
  const response = await designRequest<{ designs: DesignRecord[] }>('/api/creator-designs');
  return response.designs;
}

export async function getDesign(id: string): Promise<DesignRecord | null> {
  try {
    const response = await designRequest<{ design: DesignRecord }>(`/api/creator-designs/${encodeURIComponent(id)}`);
    return response.design;
  } catch (error) {
    if (error instanceof DesignRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function saveDesign(design: DesignInput): Promise<DesignRecord> {
  const response = await designRequest<{ design: DesignRecord }>('/api/creator-designs', {
    method: 'POST',
    body: JSON.stringify(design),
  });
  return response.design;
}

export async function deleteDesign(id: string): Promise<void> {
  await designRequest<{ deleted: boolean }>(`/api/creator-designs/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function duplicateDesign(id: string) {
  const d = await getDesign(id);
  if (!d) return null;
  return saveDesign({ ...d, id: newId(), name: d.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() });
}

const assetKey = (userId?: string) => `infographics:assets:v1:${userId || 'anonymous'}`;

// Uploaded image assets remain local; design documents are stored in the creator API.
export function listAssets(userId?: string): Promise<AssetRecord[]> {
  return Promise.resolve().then(() => read<AssetRecord>(assetKey(userId)));
}
export function addAsset(src: string, userId?: string): Promise<AssetRecord> {
  return Promise.resolve().then(() => {
    const key = assetKey(userId);
    const list = read<AssetRecord>(key);
    const asset = { id: newId(), src };
    write(key, [asset, ...list].slice(0, 30));
    return asset;
  });
}
export function deleteAsset(id: string, userId?: string): Promise<void> {
  return Promise.resolve().then(() => {
    const key = assetKey(userId);
    write(key, read<AssetRecord>(key).filter((asset) => asset.id !== id));
  });
}
