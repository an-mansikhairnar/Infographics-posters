// import type { DesignInput } from './types';

// export type DraftRecord = DesignInput & { pendingSave?: boolean };

// const key = (id: string) => `infographics:draft:v1:${id}`;

// export function readDraft(id: string): DraftRecord | null {
//   try {
//     const raw = localStorage.getItem(key(id));
//     return raw ? (JSON.parse(raw) as DraftRecord) : null;
//   } catch {
//     return null;
//   }
// }

// // Throws on QuotaExceededError so callers can react.
// export function writeDraft(draft: DraftRecord) {
//   localStorage.setItem(key(draft.id), JSON.stringify(draft));
// }

// export function clearDraft(id: string) {
//   try { localStorage.removeItem(key(id)); } catch { /* ignore */ }
// }

import type { DesignInput } from './types';

export type DraftRecord = DesignInput & { pendingSave?: boolean };

const key = (id: string) => `infographics:draft:v1:${id}`;

export function readDraft(id: string): DraftRecord | null {
  try {
    const raw = localStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as DraftRecord) : null;
  } catch {
    return null;
  }
}

// Throws on QuotaExceededError so callers can react.
export function writeDraft(draft: DraftRecord) {
  localStorage.setItem(key(draft.id), JSON.stringify(draft));
}

export function clearDraft(id: string) {
  try {
    localStorage.removeItem(key(id));
  } catch {
    /* ignore */
  }
}