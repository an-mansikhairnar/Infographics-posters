import { FONTS } from './constants';
import type { FontSource } from './types';

export function injectFonts() {
  if (typeof document === 'undefined' || document.getElementById('ie-fonts')) return;
  const fam = FONTS.map((f) => `family=${f.n.replace(/ /g, '+')}${f.w ? ':wght@400;700' : ''}`).join('&');
  const link = document.createElement('link');
  link.id = 'ie-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fam}&display=swap`;
  document.head.appendChild(link);
}

export async function ensureFonts(names: string[] | undefined) {
  const uniq = [...new Set((names || []).filter(Boolean))];
  await Promise.all(uniq.map(async (n) => {
    try { await document.fonts.load(`400 16px "${n}"`); await document.fonts.load(`700 16px "${n}"`); } catch {}
  }));
}

export function collectFonts(json: FontSource | null | undefined, out: string[] = []): string[] {
  if (!json) return out;
  if (json.fontFamily) out.push(json.fontFamily);
  if (json.chartStyle?.fontFamily) out.push(json.chartStyle.fontFamily);
  (json.objects || []).forEach((o) => collectFonts(o, out));
  return out;
}
