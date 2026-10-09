/**
 * Persistence layer. Everything is async on purpose: to move to a backend later,
 * replace the bodies of these functions with fetch() calls and nothing else changes.
 *
 * Design record shape:
 * { id, name, width, height, bg:{type,c1,c2}, templateId, data (fabric JSON), thumb (dataURL), createdAt, updatedAt }
 */
const KEY = 'infographics:designs:v1';
const ASSET_KEY = 'infographics:assets:v1';

const read = <T>(k: string): T[] => { try { return JSON.parse(localStorage.getItem(k) || '[]') as T[]; } catch { return []; } };
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v)); // may throw QuotaExceededError

export const newId = () => 'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export async function listDesigns(): Promise<DesignRecord[]> { return read<DesignRecord>(KEY).sort((a, b) => b.updatedAt - a.updatedAt); }
export async function getDesign(id: string): Promise<DesignRecord | null> { return read<DesignRecord>(KEY).find((d) => d.id === id) || null; }

export async function saveDesign(design: DesignInput): Promise<DesignRecord> {
  const list = read<DesignRecord>(KEY);
  const i = list.findIndex((d) => d.id === design.id);
  const rec = { ...(i >= 0 ? list[i] : { createdAt: Date.now() }), ...design, updatedAt: Date.now() };
  if (i >= 0) list[i] = rec; else list.push(rec);
  write(KEY, list);
  return rec;
}

export async function deleteDesign(id: string) { write(KEY, read<DesignRecord>(KEY).filter((d) => d.id !== id)); }

export async function duplicateDesign(id: string) {
  const d = await getDesign(id);
  if (!d) return null;
  return saveDesign({ ...d, id: newId(), name: d.name + ' (copy)', createdAt: Date.now() });
}

// Uploaded images library (compressed data URLs). Swap for a real upload API later.
export async function listAssets(): Promise<AssetRecord[]> { return read<AssetRecord>(ASSET_KEY); }
export async function addAsset(src: string): Promise<AssetRecord> {
  const list = read<AssetRecord>(ASSET_KEY);
  const a = { id: newId(), src };
  write(ASSET_KEY, [a, ...list].slice(0, 30));
  return a;
}
export async function deleteAsset(id: string) { write(ASSET_KEY, read<AssetRecord>(ASSET_KEY).filter((a) => a.id !== id)); }
import type { AssetRecord, DesignInput, DesignRecord } from './types';
