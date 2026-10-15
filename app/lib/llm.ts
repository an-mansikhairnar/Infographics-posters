// import { InfographicSchema, clamp, type Infographic } from './schema';
// import { fallbackInfographic } from './fallback';

// const SYSTEM = `You convert text into infographic data. Return ONLY valid JSON, no markdown.
// Shape: {"title": string, "subtitle": string, "intro": string, "takeaway": string, "sections": Section[]}
// Section is one of (each may have an optional "heading" string):
//  {"type":"stats","items":[{"value":"72%","label":"short label","note":"one line of context","icon":ICON}]}   // 2-4 items
//  {"type":"steps","items":[{"title":"","desc":""}]}                                                      // 3-6 items
//  {"type":"timeline","items":[{"date":"2021","title":""}]}                                               // 3-6 items
//  {"type":"comparison","left":{"title":"","points":[""]},"right":{"title":"","points":[""]}}
//  {"type":"bar_chart","unit":"%","data":[{"label":"","value":12}]}                                       // 2-8 items
//  {"type":"list","items":[{"title":"","desc":"","icon":ICON}]}                                           // 3-6 items
//  {"type":"quote","text":"","author":""}
// ICON is one of: chart,users,clock,star,shield,zap,globe,heart,check,dollar.
// Length guide:
// - title: max 10 words. subtitle: max 20 words.
// - intro: 2 sentences (30-45 words) that frame the topic.
// - takeaway: 1-2 sentences (max 30 words) with the main message.
// - item titles: max 8 words. item descriptions / step descriptions / list descriptions: 1-2 sentences, 15-25 words.
// - stat "note": max 15 words. comparison points: max 15 words each. timeline titles: max 15 words.
// Rules:
// - 3 to 5 sections, each a DIFFERENT type. Pick types that fit the content.
// - Use only numbers and facts that appear in the text. Never invent statistics.
// - Only use stats/bar_chart/timeline if the text really contains numbers/dates.`;

// type Provider = (text: string, hint?: string) => Promise<string>;
// const sys = (hint?: string) => SYSTEM + (hint ? `\nYour previous attempt was invalid: ${hint}` : '');

// const failWith = async (label: string, res: Response) => {
//   const body = (await res.text().catch(() => '')).slice(0, 400);
//   console.error(`[llm] ${label} -> ${res.status}: ${body}`); // shows the real reason in your terminal
//   return new Error(`${label} ${res.status}`);
// };

// /** Pull the JSON object out of the reply even if the model wrapped it in text/markdown. */
// const extractJson = (raw: string) => {
//   const t = raw.replace(/```json|```/g, '');
//   return t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1);
// };

// const groqWith =
//   (model: string): Provider =>
//   async (text, hint) => {
//     const oss = model.startsWith('openai/gpt-oss');
//     const base = {
//       model,
//       temperature: 0.4,
//       messages: [
//         { role: 'system', content: sys(hint) },
//         { role: 'user', content: text },
//       ],
//       // gpt-oss is a reasoning model: reasoning tokens count against the limit, so give it room and keep effort low.
//       ...(oss ? { max_completion_tokens: 6000, reasoning_effort: 'low' } : { max_tokens: 2400 }),
//     };
//     // Try strict JSON mode first. Groq answers 400 (json_validate_failed) if the model's JSON is
//     // truncated/invalid, so on a 400 we retry once without response_format and parse it ourselves.
//     for (const jsonMode of [true, false]) {
//       const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         signal: AbortSignal.timeout(30_000),
//         headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify(jsonMode ? { ...base, response_format: { type: 'json_object' } } : base),
//       });
//       if (res.ok) return (await res.json()).choices[0].message.content ?? '';
//       const err = await failWith(`groq ${model}${jsonMode ? '' : ' (no json mode)'}`, res);
//       if (res.status !== 400 || !jsonMode) throw err;
//     }
//     throw new Error('unreachable');
//   };

// // Model IDs change often. GEMINI_MODEL can be a comma-separated list; a 404 moves to the next one.
// // (gemini-2.5-flash is deprecated for new projects, which is why it returns 404 on new keys.)
// const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-3.5-flash,gemini-3.1-flash-lite').split(',').map((m) => m.trim());
// const gemini: Provider = async (text, hint) => {
//   for (const model of GEMINI_MODELS) {
//     const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
//       method: 'POST',
//       signal: AbortSignal.timeout(30_000),
//       headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY!, 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         systemInstruction: { parts: [{ text: sys(hint) }] },
//         contents: [{ role: 'user', parts: [{ text }] }],
//         generationConfig: {
//           responseMimeType: 'application/json',
//           temperature: 0.4,
//           maxOutputTokens: 4000,
//           // Optional: set GEMINI_THINKING_LEVEL=low (or minimal) for faster replies on Gemini 3.x models.
//           ...(process.env.GEMINI_THINKING_LEVEL ? { thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL } } : {}),
//         },
//       }),
//     });
//     if (res.ok) return (await res.json()).candidates[0].content.parts.map((p: { text?: string }) => p.text ?? '').join('');
//     const err = await failWith(`gemini ${model}`, res);
//     if (res.status !== 404) throw err;
//   }
//   throw new Error('gemini: no available model. Set GEMINI_MODEL to one listed in AI Studio.');
// };

// const ALIAS: Record<string, string> = { groq70b: 'groq120', groq8b: 'groq20' }; // old names from the previous version
// const ALL: Record<string, { run: Provider; enabled: boolean }> = {
//   groq120: { run: groqWith(process.env.GROQ_MODEL || 'openai/gpt-oss-120b'), enabled: !!process.env.GROQ_API_KEY },
//   gemini: { run: gemini, enabled: !!process.env.GEMINI_API_KEY },
//   groq20: { run: groqWith('openai/gpt-oss-20b'), enabled: !!process.env.GROQ_API_KEY },
// };
// const ORDER = (process.env.LLM_ORDER || 'groq120,gemini,groq20').split(',').map((s) => ALIAS[s.trim()] ?? s.trim());
// const providers = ORDER.map((k) => ALL[k]).filter((p) => p?.enabled);

// export async function generateInfographic(text: string): Promise<{ data: Infographic; source: string }> {
//   for (const [i, p] of providers.entries()) {
//     let hint: string | undefined;
//     for (let attempt = 0; attempt < 2; attempt++) {
//       try {
//         const raw = await p.run(text, hint);
//         const parsed = InfographicSchema.safeParse(JSON.parse(extractJson(raw)));
//         if (parsed.success) return { data: clamp(parsed.data), source: i === 0 ? 'primary' : 'secondary' };
//         hint = parsed.error.issues
//           .slice(0, 3)
//           .map((x) => `${x.path.join('.')}: ${x.message}`)
//           .join('; ');
//       } catch (e) {
//         console.error('LLM error', e);
//         break; // rate limit / network: go to the next provider
//       }
//     }
//   }
//   return { data: fallbackInfographic(text), source: 'fallback' };
// }


import { InfographicSchema, clamp, type Infographic } from './schema';
import { fallbackInfographic } from './fallback';

const SYSTEM = `You are a world-class Infographic Creative Director & Visual Information Architect.
Your mission is to transform any user topic into a rich, comprehensive, publication-grade infographic poster.
Do NOT force every topic into the same template. Different topics demand completely different visual architectures.

Return ONLY valid JSON matching the exact schema below. No markdown fences. No extra keys. No conversational text.

FULL OUTPUT SHAPE:
{
  "title": string,          // ZONE 1: Main heading — catchy, bold, topic-clear (max 10 words)
  "subtitle": string,       // ZONE 1: Hook — ONE punchy sentence explaining why the reader should care (max 18 words)
  "intro": string,          // ZONE 1: Brief context sentence (max 20 words)
  "theme": THEME,           // Auto-selected palette key
  "sections": Section[],    // ZONE 2 + 3: 4 to 5 rich content sections
  "source": string,         // ZONE 4: Credible data source or authority citation (e.g. "Source: McKinsey Global Institute, 2026" or "Based on 500+ enterprise survey respondents")
  "footerText": string,     // ZONE 5: Metadata sign-off (e.g. "Editorial Report | 2026 Edition" or "Infographic Guide | Created with AI")
  "takeaway": string        // ZONE 4: One bold power takeaway fact (max 20 words)
}

═══════════════════════════════════════════════
ZONE 1 — THE HOOK (Header Zone)
═══════════════════════════════════════════════
- "title": Bold, catchy, and clearly states the topic. Max 10 words.
- "subtitle": ONE short sentence explaining why this matters to the reader. Max 18 words.
- "intro": Brief contextual opener. Max 20 words.

═══════════════════════════════════════════════
ZONE 2 — THE SUBSTANCE (Core Content Zone)
═══════════════════════════════════════════════
- Include 4 to 5 sections using DIFFERENT complementary types (do not repeat types).
- Every item description ("desc", "note", "label") must be max 15–20 words.
- Every section must have a concise "heading" that categorizes the content clearly.
- All content wrapped in visual card/container structures (use card archetypes below).

═══════════════════════════════════════════════
ZONE 3 — VISUAL ANCHORS (Icon & Color Zone)
═══════════════════════════════════════════════
- Every section item MUST include a "graphic" key for contextual illustration.
- Stat items MUST include an "icon" key for the badge icon.
- Color palette is automatically applied by the theme system — do NOT specify colors inline.

═══════════════════════════════════════════════
ZONE 4 — PROOF & AUTHORITY (Data Zone)
═══════════════════════════════════════════════
- All numeric values must be oversized and standalone (e.g. "+35%", "2.5x", "85%", "$4.2B"). Do NOT embed numbers in sentences.
- "source": Always include a credible, specific data source reference (real org or survey type).
- "takeaway": One bold conclusive power stat or insight. Max 20 words.
- Always include at least one "quote" section with a real-sounding authority insight and "author" attribution.

═══════════════════════════════════════════════
ZONE 5 — THE FOOTER (Sign-off Zone)
═══════════════════════════════════════════════
- "footerText": Short metadata string. Format: "<Category> | <Year> Edition" (e.g. "Editorial Research Report | 2026 Edition").

AUTOMATIC THEME SELECTION (choose single best "theme" value based on topic):
- "emeraldGrowth": Health, morning habits, fitness, wellness, nutrition, biology, environment, psychology.
- "modernBlue": Tech, productivity tools, remote work, SaaS, cloud, enterprise, finance, management.
- "editorialGold": Business reports, media, creator economy, publishing, research studies, journalism.
- "midnightDark": Artificial intelligence, machine learning, cybersecurity, developers, crypto, gaming.
- "sunsetCoral": Leadership, marketing, consumer culture, lifestyle, sales, hospitality, social media.

SECTION ARCHETYPES (pick 4-5 complementary types, never repeat):
- {"type":"steps", "heading": string, "items":[{"title": string, "desc": string, "graphic": GRAPHIC}]} // 4-5 items, desc max 15 words
- {"type":"comparison", "heading": string, "left":{"title": string, "points":[string]}, "right":{"title": string, "points":[string]}} // 3-4 points each, max 12 words per point
- {"type":"split_hero", "heading": string, "leftHeading": string, "rightHeading": string, "leftItems":[{"value": string, "label": string, "graphic": GRAPHIC, "fraction"?: [num, 10]}], "rightItems":[{"value": string, "label": string, "graphic": GRAPHIC}]}
- {"type":"dark_grid", "heading": string, "items":[{"value": string, "label": string, "note"?: string, "graphic": GRAPHIC}]} // 3-4 items, note max 10 words
- {"type":"zigzag_story", "heading": string, "items":[{"value": string, "label": string, "desc"?: string, "graphic": GRAPHIC}]} // 3-4 items, desc max 15 words
- {"type":"stats", "heading": string, "styleVariant"?: "dark_band"|"accent_card"|"default", "items":[{"value": string, "label": string, "note"?: string, "graphic": GRAPHIC, "icon": ICON}]} // 3-4 items
- {"type":"bar_chart", "heading": string, "unit"?: string, "data":[{"label": string, "value": number}]} // 3-6 items
- {"type":"timeline", "heading": string, "items":[{"date": string, "title": string, "graphic": GRAPHIC}]} // 4-5 items, title max 10 words
- {"type":"list", "heading": string, "items":[{"title": string, "desc": string, "graphic": GRAPHIC, "icon": ICON}]} // 3-5 items, desc max 15 words
- {"type":"quote", "heading"?: string, "text": string, "author"?: string} // text max 25 words

AVAILABLE GRAPHIC KEYS: video, newspaper, clock, globe, laptop, cart, camera, palette, person, pictogram, chart, shield, growth.
AVAILABLE ICON KEYS: chart, users, clock, star, shield, zap, globe, heart, check, dollar.

STRICT RULES:
- Do NOT use markdown (no **, no *, no #, no backticks) anywhere in any value.
- Numbers/percentages MUST be clean standalone values — never embedded in descriptive sentences.
- Every item description max 15–20 words for high readability on infographic canvas.
- "source" and "footerText" are REQUIRED — always include both.`;

type Provider = (text: string, hint?: string) => Promise<string>;
const sys = (hint?: string) => SYSTEM + (hint ? `\nYour previous attempt was invalid: ${hint}` : '');

const failWith = async (label: string, res: Response) => {
  const body = (await res.text().catch(() => '')).slice(0, 400);
  console.error(`[llm] ${label} -> ${res.status}: ${body}`); // shows the real reason in your terminal
  return new Error(`${label} ${res.status}`);
};

/** Pull the JSON object out of the reply even if the model wrapped it in text/markdown. */
const extractJson = (raw: string) => {
  const t = raw.replace(/```json|```/g, '');
  return t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1);
};

const groqWith =
  (model: string): Provider =>
  async (text, hint) => {
    const oss = model.startsWith('openai/gpt-oss');
    const base = {
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: sys(hint) },
        { role: 'user', content: text },
      ],
      // gpt-oss is a reasoning model: reasoning tokens count against the limit, so give it room and keep effort low.
      ...(oss ? { max_completion_tokens: 6000, reasoning_effort: 'low' } : { max_tokens: 2400 }),
    };
    // Try strict JSON mode first. Groq answers 400 (json_validate_failed) if the model's JSON is
    // truncated/invalid, so on a 400 we retry once without response_format and parse it ourselves.
    for (const jsonMode of [true, false]) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: AbortSignal.timeout(30_000),
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonMode ? { ...base, response_format: { type: 'json_object' } } : base),
      });
      if (res.ok) return (await res.json()).choices[0].message.content ?? '';
      const err = await failWith(`groq ${model}${jsonMode ? '' : ' (no json mode)'}`, res);
      if (res.status !== 400 || !jsonMode) throw err;
    }
    throw new Error('unreachable');
  };

// Model IDs change often. GEMINI_MODEL can be a comma-separated list; a 404 moves to the next one.
// (gemini-2.5-flash is deprecated for new projects, which is why it returns 404 on new keys.)
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-3.5-flash,gemini-3.1-flash-lite').split(',').map((m) => m.trim());
const gemini: Provider = async (text, hint) => {
  for (const model of GEMINI_MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys(hint) }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 4000,
          // Optional: set GEMINI_THINKING_LEVEL=low (or minimal) for faster replies on Gemini 3.x models.
          ...(process.env.GEMINI_THINKING_LEVEL ? { thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL } } : {}),
        },
      }),
    });
    if (res.ok) return (await res.json()).candidates[0].content.parts.map((p: { text?: string }) => p.text ?? '').join('');
    const err = await failWith(`gemini ${model}`, res);
    if (res.status !== 404) throw err;
  }
  throw new Error('gemini: no available model. Set GEMINI_MODEL to one listed in AI Studio.');
};

const ALIAS: Record<string, string> = { groq70b: 'groq120', groq8b: 'groq20' }; // old names from the previous version
const ALL: Record<string, { run: Provider; enabled: boolean }> = {
  groq120: { run: groqWith(process.env.GROQ_MODEL || 'openai/gpt-oss-120b'), enabled: !!process.env.GROQ_API_KEY },
  gemini: { run: gemini, enabled: !!process.env.GEMINI_API_KEY },
  groq20: { run: groqWith('openai/gpt-oss-20b'), enabled: !!process.env.GROQ_API_KEY },
};
const ORDER = (process.env.LLM_ORDER || 'groq120,gemini,groq20').split(',').map((s) => ALIAS[s.trim()] ?? s.trim());
const providers = ORDER.map((k) => ALL[k]).filter((p) => p?.enabled);

export async function generateInfographic(text: string): Promise<{ data: Infographic; source: string }> {
  for (const [i, p] of providers.entries()) {
    let hint: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await p.run(text, hint);
        const parsed = InfographicSchema.safeParse(JSON.parse(extractJson(raw)));
        if (parsed.success) return { data: clamp(parsed.data), source: i === 0 ? 'primary' : 'secondary' };
        hint = parsed.error.issues
          .slice(0, 3)
          .map((x) => `${x.path.join('.')}: ${x.message}`)
          .join('; ');
      } catch (e) {
        console.error('LLM error', e);
        break; // rate limit / network: go to the next provider
      }
    }
  }
  return { data: fallbackInfographic(text), source: 'fallback' };
}
