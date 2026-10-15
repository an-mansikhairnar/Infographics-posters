import { ObjectDescriptor, Template } from './types';
import { createSpotArt } from './spotArt';

export const THEMES = {
  editorialGold: {
    key: 'editorialGold',
    name: 'Editorial Gold (Typito Style)',
    primary: '#F59E0B',
    secondary: '#FFD100',
    accent: '#FACC15',
    darkBandBg: '#22252A',
    darkBandText: '#FFFFFF',
    splitRightBg: '#FFD100',
    splitLeftBg: '#FFFFFF',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textColor: '#111827',
    mutedText: '#475569',
    headerKicker: '#F59E0B',
    underlineAccent: '#FACC15',
    chartColors: ['#F59E0B', '#FFD100', '#2563EB', '#10B981', '#EF4444'],
    palette: ['#F59E0B', '#FFD100', '#D97706', '#B45309', '#78350F'],
  },
  modernBlue: {
    key: 'modernBlue',
    name: 'Modern Blue',
    primary: '#2563EB',
    secondary: '#38BDF8',
    accent: '#38BDF8',
    darkBandBg: '#0F172A',
    darkBandText: '#FFFFFF',
    splitRightBg: '#DBEAFE',
    splitLeftBg: '#FFFFFF',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textColor: '#0F172A',
    mutedText: '#64748B',
    headerKicker: '#2563EB',
    underlineAccent: '#2563EB',
    chartColors: ['#2563EB', '#38BDF8', '#818CF8', '#F59E0B', '#10B981'],
    palette: ['#2563EB', '#0284C7', '#4F46E5', '#0D9488', '#EA580C'],
  },
  emeraldGrowth: {
    key: 'emeraldGrowth',
    name: 'Eco & Health',
    primary: '#059669',
    secondary: '#34D399',
    accent: '#34D399',
    darkBandBg: '#064E3B',
    darkBandText: '#FFFFFF',
    splitRightBg: '#D1FAE5',
    splitLeftBg: '#FFFFFF',
    bg: '#F0FDF4',
    cardBg: '#FFFFFF',
    cardBorder: '#BBF7D0',
    textColor: '#064E3B',
    mutedText: '#047857',
    headerKicker: '#059669',
    underlineAccent: '#10B981',
    chartColors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#047857'],
    palette: ['#059669', '#10B981', '#0D9488', '#0284C7', '#16A34A'],
  },
  sunsetCoral: {
    key: 'sunsetCoral',
    name: 'Warm Coral',
    primary: '#E11D48',
    secondary: '#F97316',
    accent: '#FB923C',
    darkBandBg: '#4C0519',
    darkBandText: '#FFFFFF',
    splitRightBg: '#FFE4E6',
    splitLeftBg: '#FFFFFF',
    bg: '#FFF1F2',
    cardBg: '#FFFFFF',
    cardBorder: '#FECDD3',
    textColor: '#881337',
    mutedText: '#9F1239',
    headerKicker: '#E11D48',
    underlineAccent: '#F97316',
    chartColors: ['#E11D48', '#F97316', '#FB923C', '#F43F5E', '#BE123C'],
    palette: ['#E11D48', '#F97316', '#D97706', '#EA580C', '#BE123C'],
  },
  midnightDark: {
    key: 'midnightDark',
    name: 'Midnight Dark',
    primary: '#38BDF8',
    secondary: '#818CF8',
    accent: '#38BDF8',
    darkBandBg: '#090D16',
    darkBandText: '#FFFFFF',
    splitRightBg: '#1E293B',
    splitLeftBg: '#0F172A',
    bg: '#0F172A',
    cardBg: '#1E293B',
    cardBorder: '#334155',
    textColor: '#F8FAFC',
    mutedText: '#94A3B8',
    headerKicker: '#38BDF8',
    underlineAccent: '#38BDF8',
    chartColors: ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#34D399'],
    palette: ['#38BDF8', '#818CF8', '#A78BFA', '#2DD4BF', '#F472B6'],
  },
} as const;

export type ThemeKey = keyof typeof THEMES;

// Backend schemas
export interface BackendSectionSplitHero {
  type: 'split_hero';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  leftHeading?: string;
  rightHeading?: string;
  leftItems: Array<{ value: string; label: string; graphic?: string; fraction?: [number, number] }>;
  rightItems: Array<{ value: string; label: string; graphic?: string; fraction?: [number, number] }>;
}

export interface BackendSectionDarkGrid {
  type: 'dark_grid';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ value: string; label: string; note?: string; graphic?: string }>;
}

export interface BackendSectionZigzagStory {
  type: 'zigzag_story';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ value: string; label: string; desc?: string; graphic?: string }>;
}

export interface BackendSectionStats {
  type: 'stats';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ value: string; label: string; note?: string; icon?: string; graphic?: string; fraction?: [number, number] }>;
}

export interface BackendSectionSteps {
  type: 'steps';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ title: string; desc: string; graphic?: string }>;
}

export interface BackendSectionTimeline {
  type: 'timeline';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ date: string; title: string; graphic?: string }>;
}

export interface BackendSectionComparison {
  type: 'comparison';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  left: { title: string; points: string[] };
  right: { title: string; points: string[] };
}

export interface BackendSectionBarChart {
  type: 'bar_chart';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  unit?: string;
  data: Array<{ label: string; value: number }>;
}

export interface BackendSectionList {
  type: 'list';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  items: Array<{ title: string; desc: string; icon?: string; graphic?: string }>;
}

export interface BackendSectionQuote {
  type: 'quote';
  heading?: string;
  styleVariant?: 'default' | 'dark_band' | 'accent_card' | 'minimal';
  text: string;
  author?: string;
}

export type BackendSection =
  | BackendSectionSplitHero
  | BackendSectionDarkGrid
  | BackendSectionZigzagStory
  | BackendSectionStats
  | BackendSectionSteps
  | BackendSectionTimeline
  | BackendSectionComparison
  | BackendSectionBarChart
  | BackendSectionList
  | BackendSectionQuote;

export interface BackendInfographic {
  title: string;
  subtitle?: string;
  intro?: string;
  takeaway?: string;
  /** Zone 4: authority citation shown before footer */
  source?: string;
  /** Zone 5: footer metadata sign-off text */
  footerText?: string;
  theme?: ThemeKey;
  sections: BackendSection[];
}

const CARD_SHADOW = {
  color: 'rgba(15, 23, 42, 0.08)',
  blur: 20,
  offsetX: 0,
  offsetY: 6,
};

/** Clean raw text from markdown asterisks, backticks, or quotes so it renders pristine */
function cleanText(str?: string): string {
  if (!str) return '';
  return str.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
}

export function compileBackendToTemplate(
  data: BackendInfographic,
  id: string,
  preferredThemeKey?: ThemeKey
): Template {
  const width = 800;
  const activeThemeKey = (preferredThemeKey || data.theme || 'editorialGold') as ThemeKey;
  const theme = THEMES[activeThemeKey] || THEMES.editorialGold;
  const objects: ObjectDescriptor[] = [];

  // ==========================================
  // ZONE 1 — THE HOOK (Header Zone)
  // ==========================================
  let y = 30;
  const titleText = cleanText(data.title || 'Infographic Report');
  const subtitleText = cleanText(data.subtitle || data.intro || '');
  const sourceText = cleanText(data.source || '');
  const footerLabel = cleanText(data.footerText || 'Editorial Report | 2026 Edition');
  const takeawayText = cleanText(data.takeaway || '');

  // Kicker badge above title (category label)
  objects.push({
    type: 'rect',
    left: 50,
    top: y,
    width: 160,
    height: 28,
    fill: theme.primary,
    rx: 6,
    ry: 6,
  });
  objects.push({
    type: 'text',
    text: 'INFOGRAPHIC REPORT',
    left: 50,
    top: y + 7,
    width: 160,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Inter',
    fill: '#FFFFFF',
    textAlign: 'center',
    charSpacing: 100,
  });
  y += 42;

  // Main Title — large, bold, dominant (Zone 1 Hook)
  const titleCharCount = titleText.length;
  const titleEstimatedLines = Math.max(1, Math.ceil(titleCharCount / 26));
  const titleHeight = titleEstimatedLines * 52;

  objects.push({
    type: 'text',
    text: titleText,
    left: 50,
    top: y,
    width: 700,
    fontSize: 44,
    fontWeight: '800',
    fontFamily: 'Poppins',
    fill: theme.textColor,
    lineHeight: 1.15,
    charSpacing: 30,
  });
  y += titleHeight + 8;

  // Thick accent underline bar + thin secondary bar (editorial depth)
  objects.push({
    type: 'rect',
    left: 50,
    top: y,
    width: 300,
    height: 6,
    fill: theme.underlineAccent,
    rx: 3,
    ry: 3,
  });
  objects.push({
    type: 'rect',
    left: 358,
    top: y + 1,
    width: 80,
    height: 4,
    fill: theme.primary,
    rx: 2,
    ry: 2,
  });
  y += 20;

  // Subtitle / Hook sentence (one punchy sentence)
  if (subtitleText) {
    const subtitleLines = Math.max(1, Math.ceil(subtitleText.length / 60));
    objects.push({
      type: 'text',
      text: subtitleText,
      left: 50,
      top: y,
      width: 700,
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Inter',
      fill: theme.mutedText,
      lineHeight: 1.45,
    });
    y += subtitleLines * 24 + 22;
  } else {
    y += 18;
  }

  // ==========================================
  // 2. DYNAMIC SECTION RENDERING
  // ==========================================
  for (const s of data.sections) {
    // --- 1. SPLIT HERO (What's Working vs What's Not) ---
    if (s.type === 'split_hero') {
      const splitTop = y;
      const leftCount = s.leftItems.length;
      const rightCount = s.rightItems.length;
      const maxRows = Math.max(leftCount, rightCount, 2);
      const splitHeight = 100 + maxRows * 150;

      // Left Column Background (Light)
      objects.push({
        type: 'rect',
        left: 0,
        top: splitTop,
        width: 400,
        height: splitHeight,
        fill: theme.splitLeftBg,
      });

      // Right Column Background (Vibrant Accent / Mustard Yellow)
      objects.push({
        type: 'rect',
        left: 400,
        top: splitTop,
        width: 400,
        height: splitHeight,
        fill: theme.splitRightBg,
      });

      // Subtle Center Divider
      objects.push({
        type: 'rect',
        left: 399,
        top: splitTop,
        width: 2,
        height: splitHeight,
        fill: 'rgba(0, 0, 0, 0.08)',
      });

      // Headings
      const leftHeading = cleanText(s.leftHeading || "WHAT'S WORKING").toUpperCase();
      const rightHeading = cleanText(s.rightHeading || "WHAT'S NOT").toUpperCase();

      objects.push({
        type: 'text',
        text: leftHeading,
        left: 50,
        top: splitTop + 24,
        width: 280,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'Inter',
        fill: theme.textColor,
        charSpacing: 80,
      });

      // Center Thumbs Up / Down Graphic
      objects.push(...createSpotArt('thumbs_up_down', 368, splitTop + 14, theme.primary));

      objects.push({
        type: 'text',
        text: rightHeading,
        left: 440,
        top: splitTop + 24,
        width: 300,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'Inter',
        fill: '#111827',
        charSpacing: 80,
      });

      // Left Column Items
      let curLeftY = splitTop + 72;
      s.leftItems.forEach((item) => {
        const valStr = cleanText(item.value);
        const artKey = item.graphic || (valStr.includes('/') ? 'pictogram' : 'video');
        const fraction = item.fraction || (valStr.includes('/') ? [parseInt(valStr) || 4, 10] as [number, number] : undefined);

        // Art on left (starts at 45, width ~90)
        const art = createSpotArt(artKey, 45, curLeftY + 4, theme.primary, false, fraction);
        objects.push(...art);

        // Text starts safely at 155 (155 > 45 + 95)
        objects.push({
          type: 'text',
          text: valStr,
          left: 155,
          top: curLeftY,
          width: 225,
          fontSize: 46,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
        });

        objects.push({
          type: 'text',
          text: cleanText(item.label),
          left: 155,
          top: curLeftY + 52,
          width: 225,
          fontSize: 13.5,
          fontWeight: '600',
          fontFamily: 'Inter',
          fill: theme.mutedText,
          lineHeight: 1.35,
        });

        curLeftY += 150;
      });

      // Right Column Items
      let curRightY = splitTop + 72;
      s.rightItems.forEach((item, idx) => {
        const valStr = cleanText(item.value);
        const artKey = item.graphic || (idx === 0 ? 'newspaper' : 'clock');

        if (idx === 0) {
          // Newspaper art at 435, text at 545
          const art = createSpotArt(artKey, 435, curRightY + 4, theme.primary, false);
          objects.push(...art);

          objects.push({
            type: 'text',
            text: valStr,
            left: 545,
            top: curRightY,
            width: 220,
            fontSize: 46,
            fontWeight: '800',
            fontFamily: 'Poppins',
            fill: '#111827',
          });

          objects.push({
            type: 'text',
            text: cleanText(item.label),
            left: 545,
            top: curRightY + 52,
            width: 220,
            fontSize: 13.5,
            fontWeight: '600',
            fontFamily: 'Inter',
            fill: '#111827',
            lineHeight: 1.35,
          });
        } else {
          // Stat at 435, clock art on right at 660
          objects.push({
            type: 'text',
            text: valStr,
            left: 435,
            top: curRightY,
            width: 215,
            fontSize: 46,
            fontWeight: '800',
            fontFamily: 'Poppins',
            fill: '#111827',
          });

          objects.push({
            type: 'text',
            text: cleanText(item.label),
            left: 435,
            top: curRightY + 52,
            width: 215,
            fontSize: 13.5,
            fontWeight: '600',
            fontFamily: 'Inter',
            fill: '#111827',
            lineHeight: 1.35,
          });

          const art = createSpotArt(artKey, 660, curRightY + 12, theme.primary, true);
          objects.push(...art);
        }

        curRightY += 150;
      });

      y += splitHeight;
    }

    // --- 2. DARK GRID (Deep-Dive Charcoal Chapter) ---
    else if (s.type === 'dark_grid') {
      const bandTop = y;
      const rowCount = Math.ceil(s.items.length / 2);
      const bandHeight = 120 + rowCount * 160;

      objects.push({
        type: 'rect',
        left: 0,
        top: bandTop,
        width: 800,
        height: bandHeight,
        fill: theme.darkBandBg,
      });

      const heading = cleanText(s.heading || 'Industry & Benchmark Overview').toUpperCase();
      objects.push({
        type: 'text',
        text: heading,
        left: 50,
        top: bandTop + 30,
        width: 700,
        fontSize: 22,
        fontWeight: '800',
        fontFamily: 'Poppins',
        fill: '#FFFFFF',
        charSpacing: 100,
      });

      objects.push({
        type: 'rect',
        left: 50,
        top: bandTop + 62,
        width: 320,
        height: 6,
        fill: theme.accent,
        rx: 3,
        ry: 3,
      });

      const gridStartY = bandTop + 90;
      s.items.slice(0, 4).forEach((item, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const colX = col === 0 ? 50 : 420;
        const rowY = gridStartY + row * 160;
        const artKey = item.graphic || (idx === 0 ? 'globe' : idx === 1 ? 'laptop' : idx === 2 ? 'person' : 'newspaper');

        // Art on left (width ~90)
        const art = createSpotArt(artKey, colX, rowY + 6, theme.accent, true);
        objects.push(...art);

        // Text starts safely at colX + 115 (no overlap with 90-100px art)
        const textX = colX + 115;
        objects.push({
          type: 'text',
          text: cleanText(item.value),
          left: textX,
          top: rowY,
          width: 230,
          fontSize: 42,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: '#FFFFFF',
        });

        const fullDesc = cleanText(item.label) + (item.note ? ` • ${cleanText(item.note)}` : '');
        objects.push({
          type: 'text',
          text: fullDesc,
          left: textX,
          top: rowY + 48,
          width: 230,
          fontSize: 13.5,
          fontFamily: 'Inter',
          fill: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.35,
        });
      });

      y += bandHeight;
    }

    // --- 3. ZIGZAG STORY (Alternating Flow) ---
    else if (s.type === 'zigzag_story') {
      const bandTop = y;
      const count = s.items.length;
      const bandHeight = 110 + count * 160;

      const heading = cleanText(s.heading || 'Accelerating Market Shifts').toUpperCase();
      objects.push({
        type: 'text',
        text: heading,
        left: 50,
        top: bandTop + 30,
        width: 700,
        fontSize: 22,
        fontWeight: '800',
        fontFamily: 'Poppins',
        fill: theme.textColor,
        charSpacing: 100,
      });

      objects.push({
        type: 'rect',
        left: 50,
        top: bandTop + 62,
        width: 320,
        height: 6,
        fill: theme.primary,
        rx: 3,
        ry: 3,
      });

      let rowY = bandTop + 90;
      s.items.forEach((item, idx) => {
        const isLeftStat = idx % 2 === 0;
        const artKey = item.graphic || (idx === 0 ? 'laptop' : idx === 1 ? 'cart' : 'camera');
        const desc = cleanText(item.label) + (item.desc ? `\n${cleanText(item.desc)}` : '');

        if (isLeftStat) {
          // Stat on Left, Graphic on Right
          objects.push({
            type: 'text',
            text: cleanText(item.value),
            left: 70,
            top: rowY,
            width: 380,
            fontSize: 46,
            fontWeight: '800',
            fontFamily: 'Poppins',
            fill: theme.textColor,
          });

          objects.push({
            type: 'text',
            text: desc,
            left: 70,
            top: rowY + 52,
            width: 380,
            fontSize: 13.5,
            fontWeight: '600',
            fontFamily: 'Inter',
            fill: theme.mutedText,
            lineHeight: 1.35,
          });

          const art = createSpotArt(artKey, 560, rowY + 10, theme.primary, false);
          objects.push(...art);
        } else {
          // Graphic on Left (starts at 70, ends at ~160), Stat starts safely at 220
          const art = createSpotArt(artKey, 70, rowY + 10, theme.primary, false);
          objects.push(...art);

          objects.push({
            type: 'text',
            text: cleanText(item.value),
            left: 220,
            top: rowY,
            width: 500,
            fontSize: 46,
            fontWeight: '800',
            fontFamily: 'Poppins',
            fill: theme.textColor,
          });

          objects.push({
            type: 'text',
            text: desc,
            left: 220,
            top: rowY + 52,
            width: 500,
            fontSize: 13.5,
            fontWeight: '600',
            fontFamily: 'Inter',
            fill: theme.mutedText,
            lineHeight: 1.35,
          });
        }

        rowY += 160;
      });

      y += bandHeight;
    }

    // --- 4. STEPS (Process Roadmap with Numbers, Connectors, & Art) ---
    else if (s.type === 'steps') {
      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 50;
      }

      // Vertical connector line linking steps
      if (s.items.length > 1) {
        objects.push({
          type: 'rect',
          left: 96,
          top: y + 40,
          width: 4,
          height: (s.items.length - 1) * 150,
          fill: '#CBD5E1',
          rx: 2,
          ry: 2,
        });
      }

      s.items.forEach((step, idx) => {
        const stepY = y;
        const color = theme.palette[idx % theme.palette.length];
        const artKey = step.graphic;

        // Card Container (Generous 135px height so text never overflows)
        objects.push({
          type: 'rect',
          left: 50,
          top: stepY,
          width: 700,
          height: 135,
          fill: theme.cardBg,
          stroke: theme.cardBorder,
          strokeWidth: 1.5,
          rx: 16,
          ry: 16,
          shadow: CARD_SHADOW,
        });

        // Left accent strip
        objects.push({
          type: 'rect',
          left: 50,
          top: stepY,
          width: 8,
          height: 135,
          fill: color,
          rx: 4,
          ry: 4,
        });

        // Step Circle Badge
        objects.push({
          type: 'circle',
          left: 74,
          top: stepY + 44,
          radius: 22,
          fill: color,
        });

        // Step Number Text
        objects.push({
          type: 'text',
          left: 74,
          top: stepY + 54,
          width: 44,
          text: String(idx + 1),
          fontSize: 20,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: '#FFFFFF',
          textAlign: 'center',
        });

        // Step Title
        objects.push({
          type: 'text',
          left: 140,
          top: stepY + 22,
          width: artKey ? 470 : 570,
          text: cleanText(step.title),
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Poppins',
          fill: theme.textColor,
        });

        // Step Description
        objects.push({
          type: 'text',
          left: 140,
          top: stepY + 52,
          width: artKey ? 470 : 570,
          text: cleanText(step.desc),
          fontSize: 13.5,
          fontFamily: 'Inter',
          fill: theme.mutedText,
          lineHeight: 1.4,
        });

        // Optional Spot Art on right side of card
        if (artKey) {
          const art = createSpotArt(artKey, 635, stepY + 28, color, false);
          objects.push(...art);
        }

        y += 150;
      });
      y += 15;
    }

    // --- 5. COMPARISON (Side A vs Side B) ---
    else if (s.type === 'comparison') {
      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 50;
      }

      const colW = 338;
      const maxPts = Math.max(s.left.points.length, s.right.points.length);
      const cardH = 90 + maxPts * 48;

      // Left Column Card (Side A)
      objects.push({
        type: 'rect',
        left: 50,
        top: y,
        width: colW,
        height: cardH,
        fill: theme.cardBg,
        stroke: theme.cardBorder,
        strokeWidth: 1.5,
        rx: 16,
        ry: 16,
        shadow: CARD_SHADOW,
      });
      // Header Band Left
      objects.push({
        type: 'rect',
        left: 50,
        top: y,
        width: colW,
        height: 48,
        fill: theme.primary,
        rx: 16,
        ry: 16,
      });
      objects.push({
        type: 'rect',
        left: 50,
        top: y + 24,
        width: colW,
        height: 24,
        fill: theme.primary,
      });
      objects.push({
        type: 'text',
        text: cleanText(s.left.title).toUpperCase(),
        left: 65,
        top: y + 14,
        width: colW - 30,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'Poppins',
        fill: '#FFFFFF',
      });

      // Left Points
      s.left.points.forEach((pt, i) => {
        const ptY = y + 66 + i * 48;
        objects.push({
          type: 'circle',
          left: 70,
          top: ptY + 6,
          radius: 5,
          fill: theme.primary,
        });
        objects.push({
          type: 'text',
          text: cleanText(pt),
          left: 90,
          top: ptY,
          width: colW - 55,
          fontSize: 13.5,
          fontFamily: 'Inter',
          fill: theme.textColor,
          lineHeight: 1.35,
        });
      });

      // Right Column Card (Side B)
      const rightX = 412;
      objects.push({
        type: 'rect',
        left: rightX,
        top: y,
        width: colW,
        height: cardH,
        fill: theme.cardBg,
        stroke: theme.cardBorder,
        strokeWidth: 1.5,
        rx: 16,
        ry: 16,
        shadow: CARD_SHADOW,
      });
      // Header Band Right
      objects.push({
        type: 'rect',
        left: rightX,
        top: y,
        width: colW,
        height: 48,
        fill: theme.secondary,
        rx: 16,
        ry: 16,
      });
      objects.push({
        type: 'rect',
        left: rightX,
        top: y + 24,
        width: colW,
        height: 24,
        fill: theme.secondary,
      });
      objects.push({
        type: 'text',
        text: cleanText(s.right.title).toUpperCase(),
        left: rightX + 15,
        top: y + 14,
        width: colW - 30,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'Poppins',
        fill: '#111827',
      });

      // Right Points
      s.right.points.forEach((pt, i) => {
        const ptY = y + 66 + i * 48;
        objects.push({
          type: 'circle',
          left: rightX + 20,
          top: ptY + 6,
          radius: 5,
          fill: theme.secondary,
        });
        objects.push({
          type: 'text',
          text: cleanText(pt),
          left: rightX + 40,
          top: ptY,
          width: colW - 55,
          fontSize: 13.5,
          fontFamily: 'Inter',
          fill: theme.textColor,
          lineHeight: 1.35,
        });
      });

      y += cardH + 30;
    }

    // --- 6. STATS (Elevated Metric Cards with Clean Non-Overlapping Hierarchy) ---
    else if (s.type === 'stats') {
      const isDark = s.styleVariant === 'dark_band';

      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: isDark ? '#FFFFFF' : theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 48;
      }

      const items = s.items.slice(0, 4);
      const gap = 16;
      const cardW = (700 - (items.length - 1) * gap) / items.length;
      const cardH = 175; // Generous height for non-overlapping vertical hierarchy

      items.forEach((item, idx) => {
        const left = 50 + idx * (cardW + gap);
        const color = theme.palette[idx % theme.palette.length];
        const artKey = item.graphic;

        // Card Container
        objects.push({
          type: 'rect',
          left,
          top: y,
          width: cardW,
          height: cardH,
          fill: isDark ? theme.darkBandBg : theme.cardBg,
          stroke: isDark ? '#334155' : theme.cardBorder,
          strokeWidth: 1.5,
          rx: 16,
          ry: 16,
          shadow: CARD_SHADOW,
        });

        // Top Accent Strip
        objects.push({
          type: 'rect',
          left,
          top: y,
          width: cardW,
          height: 6,
          fill: color,
          rx: 3,
          ry: 3,
        });

        // Compact Icon Badge at Top (Starts at y + 20, never overlaps number)
        objects.push({
          type: 'circle',
          left: left + 18,
          top: y + 20,
          radius: 15,
          fill: isDark ? '#1E293B' : '#F1F5F9',
        });
        objects.push({
          type: 'circle',
          left: left + 27,
          top: y + 29,
          radius: 6,
          fill: color,
        });

        // Number placed cleanly below the badge (at y + 60)
        objects.push({
          type: 'text',
          text: cleanText(item.value),
          left: left + 18,
          top: y + 60,
          width: cardW - 36,
          fontSize: 36,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: color,
        });

        // Label placed cleanly below the number (at y + 112)
        objects.push({
          type: 'text',
          text: cleanText(item.label),
          left: left + 18,
          top: y + 112,
          width: cardW - 36,
          fontSize: 13,
          fontWeight: '600',
          fontFamily: 'Inter',
          fill: isDark ? '#F8FAFC' : theme.textColor,
          lineHeight: 1.3,
        });
      });

      y += cardH + 30;
    }

    // --- 7. TIMELINE (Milestone Cards) ---
    else if (s.type === 'timeline') {
      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 48;
      }

      s.items.forEach((item, idx) => {
        const itemY = y;
        const color = theme.palette[idx % theme.palette.length];

        objects.push({
          type: 'rect',
          left: 50,
          top: itemY,
          width: 700,
          height: 72,
          fill: theme.cardBg,
          stroke: theme.cardBorder,
          strokeWidth: 1.5,
          rx: 14,
          ry: 14,
          shadow: CARD_SHADOW,
        });

        // Date pill badge
        objects.push({
          type: 'rect',
          left: 66,
          top: itemY + 16,
          width: 90,
          height: 38,
          fill: color,
          rx: 8,
          ry: 8,
        });
        objects.push({
          type: 'text',
          left: 66,
          top: itemY + 25,
          width: 90,
          text: cleanText(item.date),
          fontSize: 14,
          fontWeight: '800',
          fill: '#FFFFFF',
          textAlign: 'center',
          fontFamily: 'Poppins',
        });

        // Milestone Title
        objects.push({
          type: 'text',
          left: 175,
          top: itemY + 24,
          width: 540,
          text: cleanText(item.title),
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'Inter',
          fill: theme.textColor,
        });

        y += 86;
      });
      y += 15;
    }

    // --- 8. BAR CHART (Elevated Container Card) ---
    else if (s.type === 'bar_chart') {
      const cardW = 700;
      const cardH = 320;

      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 48;
      }

      objects.push({
        type: 'rect',
        left: 50,
        top: y,
        width: cardW,
        height: cardH,
        fill: theme.cardBg,
        stroke: theme.cardBorder,
        strokeWidth: 1.5,
        rx: 16,
        ry: 16,
        shadow: CARD_SHADOW,
      });

      objects.push({
        type: 'chart',
        chartType: 'bar',
        left: 70,
        top: y + 25,
        width: 660,
        height: 260,
        data: s.data.map((d, i) => ({
          label: cleanText(d.label),
          value: d.value,
          color: theme.chartColors[i % theme.chartColors.length],
        })),
        chartStyle: { fontFamily: 'Inter', textColor: theme.textColor },
      });

      y += cardH + 25;
    }

    // --- 9. LIST / CHECKLIST ---
    else if (s.type === 'list') {
      if (s.heading) {
        objects.push({
          type: 'text',
          text: cleanText(s.heading).toUpperCase(),
          left: 50,
          top: y,
          width: 700,
          fontSize: 22,
          fontWeight: '800',
          fontFamily: 'Poppins',
          fill: theme.textColor,
          charSpacing: 80,
        });
        objects.push({
          type: 'rect',
          left: 50,
          top: y + 30,
          width: 260,
          height: 6,
          fill: theme.primary,
          rx: 3,
          ry: 3,
        });
        y += 48;
      }

      s.items.forEach((item, idx) => {
        const itemY = y;
        const color = theme.palette[idx % theme.palette.length];

        objects.push({
          type: 'rect',
          left: 50,
          top: itemY,
          width: 700,
          height: 90,
          fill: theme.cardBg,
          stroke: theme.cardBorder,
          strokeWidth: 1.5,
          rx: 14,
          ry: 14,
          shadow: CARD_SHADOW,
        });

        // Check badge
        objects.push({
          type: 'circle',
          left: 70,
          top: itemY + 26,
          radius: 18,
          fill: color,
        });
        objects.push({
          type: 'text',
          left: 70,
          top: itemY + 32,
          width: 36,
          text: '✓',
          fontSize: 18,
          fontWeight: '800',
          fill: '#FFFFFF',
          textAlign: 'center',
        });

        // Title
        objects.push({
          type: 'text',
          left: 120,
          top: itemY + 18,
          width: 600,
          text: cleanText(item.title),
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'Poppins',
          fill: theme.textColor,
        });

        // Description
        objects.push({
          type: 'text',
          left: 120,
          top: itemY + 46,
          width: 600,
          text: cleanText(item.desc),
          fontSize: 13,
          fontFamily: 'Inter',
          fill: theme.mutedText,
          lineHeight: 1.35,
        });

        y += 105;
      });
      y += 15;
    }

    // --- 10. QUOTE ---
    else if (s.type === 'quote') {
      objects.push({
        type: 'rect',
        left: 50,
        top: y + 15,
        width: 700,
        height: 110,
        fill: theme.bg,
        stroke: theme.cardBorder,
        strokeWidth: 1.5,
        rx: 16,
        ry: 16,
      });

      objects.push({
        type: 'text',
        text: `“${cleanText(s.text)}”`,
        left: 80,
        top: y + 30,
        width: 640,
        fontSize: 17,
        fontWeight: '600',
        fontFamily: 'Poppins',
        fill: theme.textColor,
        lineHeight: 1.35,
      });

      if (s.author) {
        objects.push({
          type: 'text',
          text: `— ${cleanText(s.author)}`,
          left: 80,
          top: y + 80,
          width: 640,
          fontSize: 13,
          fontFamily: 'Inter',
          fill: theme.primary,
          fontWeight: '700',
        });
      }

      y += 140;
    }
  }

  // ==========================================
  // ZONE 4 — PROOF & AUTHORITY (Data Zone)
  // ==========================================
  y += 20;

  // Takeaway power stat bar
  if (takeawayText) {
    objects.push({
      type: 'rect',
      left: 50,
      top: y,
      width: 700,
      height: 72,
      fill: theme.darkBandBg,
      rx: 14,
      ry: 14,
    });
    // Key insight label
    objects.push({
      type: 'rect',
      left: 66,
      top: y + 16,
      width: 100,
      height: 24,
      fill: theme.primary,
      rx: 5,
      ry: 5,
    });
    objects.push({
      type: 'text',
      text: 'KEY INSIGHT',
      left: 66,
      top: y + 21,
      width: 100,
      fontSize: 9,
      fontWeight: '800',
      fontFamily: 'Inter',
      fill: '#FFFFFF',
      textAlign: 'center',
      charSpacing: 80,
    });
    objects.push({
      type: 'text',
      text: takeawayText,
      left: 180,
      top: y + 22,
      width: 550,
      fontSize: 14,
      fontWeight: '700',
      fontFamily: 'Inter',
      fill: '#FFFFFF',
      lineHeight: 1.3,
    });
    y += 88;
  }

  // Source citation (authority reference)
  if (sourceText) {
    objects.push({
      type: 'text',
      text: sourceText,
      left: 50,
      top: y,
      width: 700,
      fontSize: 11,
      fontFamily: 'Inter',
      fill: theme.mutedText,
      lineHeight: 1.3,
    });
    y += 24;
  }

  // ==========================================
  // ZONE 5 — THE FOOTER (Sign-off Zone)
  // ==========================================
  y += 16;

  // Full-width footer background bar
  objects.push({
    type: 'rect',
    left: 0,
    top: y,
    width: 800,
    height: 48,
    fill: theme.darkBandBg,
  });

  // Left: footer metadata label from LLM
  objects.push({
    type: 'text',
    text: footerLabel.toUpperCase(),
    left: 50,
    top: y + 16,
    width: 500,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter',
    fill: 'rgba(255,255,255,0.75)',
    charSpacing: 80,
  });

  // Right: accent dot + year badge
  objects.push({
    type: 'circle',
    left: 716,
    top: y + 20,
    radius: 6,
    fill: theme.primary,
  });
  objects.push({
    type: 'text',
    text: '2026',
    left: 728,
    top: y + 16,
    width: 50,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Inter',
    fill: '#FFFFFF',
    charSpacing: 40,
  });

  y += 68;

  return {
    id,
    name: titleText || 'Infographic Report',
    category: 'AI Editorial Infographics',
    width,
    height: Math.max(1200, Math.ceil(y)),
    bg: { type: 'solid', c1: theme.bg },
    objects,
  };
}
