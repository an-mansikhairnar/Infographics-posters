import type { ObjectDescriptor } from './types';

/**
 * Native Fabric.js Vector Spot Art Illustrations for Editorial Infographics.
 * Completely pure vector primitives (rect, circle, triangle, text) that render
 * instantly at crystal clarity and can be moved, selected, and edited on canvas.
 */

export function createSpotArt(
  key: string,
  x: number,
  y: number,
  color: string,
  darkBg = false,
  fraction?: [number, number]
): ObjectDescriptor[] {
  const normKey = (key || '').toLowerCase().trim();

  // 1. PICTOGRAM: 10 People Grid (e.g. 4/10, 7/10)
  if (normKey.includes('pictogram') || normKey.includes('people') || normKey.includes('fraction') || fraction) {
    const active = fraction ? fraction[0] : 4;
    const total = fraction ? fraction[1] : 10;
    const items: ObjectDescriptor[] = [];
    const inactiveColor = darkBg ? '#475569' : '#CBD5E1';

    for (let i = 0; i < total; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const px = x + col * 18;
      const py = y + row * 34;
      const fill = i < active ? color : inactiveColor;

      // Head
      items.push({
        type: 'circle',
        left: px + 2,
        top: py,
        radius: 5,
        fill,
      });
      // Torso
      items.push({
        type: 'rect',
        left: px,
        top: py + 12,
        width: 14,
        height: 18,
        rx: 4,
        ry: 4,
        fill,
      });
    }
    return items;
  }

  // 2. VIDEO / MOBILE PLAYER CARD
  if (normKey.includes('video') || normKey.includes('player') || normKey.includes('stream')) {
    return [
      // Base Device Card
      {
        type: 'rect',
        left: x,
        top: y,
        width: 76,
        height: 100,
        rx: 10,
        ry: 10,
        fill: darkBg ? '#1E293B' : '#FFFFFF',
        stroke: darkBg ? '#475569' : '#0F172A',
        strokeWidth: 2,
      },
      // Video Screen
      {
        type: 'rect',
        left: x + 8,
        top: y + 8,
        width: 60,
        height: 48,
        rx: 6,
        ry: 6,
        fill: color,
      },
      // Play Triangle Button
      {
        type: 'triangle',
        left: x + 44,
        top: y + 23,
        width: 16,
        height: 18,
        angle: 90,
        fill: '#FFFFFF',
      },
      // Scrub Line
      {
        type: 'rect',
        left: x + 8,
        top: y + 62,
        width: 45,
        height: 4,
        rx: 2,
        ry: 2,
        fill: color,
      },
      // Meta Lines
      {
        type: 'rect',
        left: x + 8,
        top: y + 72,
        width: 58,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#334155' : '#E2E8F0',
      },
      {
        type: 'rect',
        left: x + 8,
        top: y + 82,
        width: 40,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#334155' : '#E2E8F0',
      },
    ];
  }

  // 3. NEWSPAPER / ARTICLE / ENGAGEMENT
  if (normKey.includes('news') || normKey.includes('paper') || normKey.includes('document')) {
    return [
      // Newspaper Sheet
      {
        type: 'rect',
        left: x,
        top: y,
        width: 90,
        height: 72,
        rx: 6,
        ry: 6,
        fill: darkBg ? '#1E293B' : '#FFFFFF',
        stroke: darkBg ? '#475569' : '#0F172A',
        strokeWidth: 2,
      },
      // Header Band
      {
        type: 'rect',
        left: x + 8,
        top: y + 8,
        width: 74,
        height: 14,
        rx: 3,
        ry: 3,
        fill: color,
      },
      {
        type: 'text',
        text: 'NEWS',
        left: x + 12,
        top: y + 9,
        fontSize: 9,
        fontWeight: '800',
        fontFamily: 'Inter',
        fill: '#0F172A',
      },
      // Thumbnail Box
      {
        type: 'rect',
        left: x + 8,
        top: y + 28,
        width: 32,
        height: 32,
        rx: 3,
        ry: 3,
        fill: darkBg ? '#334155' : '#E2E8F0',
        stroke: color,
        strokeWidth: 1.5,
      },
      // Mini play icon
      {
        type: 'triangle',
        left: x + 28,
        top: y + 38,
        width: 9,
        height: 11,
        angle: 90,
        fill: '#EF4444',
      },
      // News lines
      {
        type: 'rect',
        left: x + 46,
        top: y + 30,
        width: 36,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#64748B' : '#94A3B8',
      },
      {
        type: 'rect',
        left: x + 46,
        top: y + 40,
        width: 32,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#64748B' : '#94A3B8',
      },
      {
        type: 'rect',
        left: x + 46,
        top: y + 50,
        width: 36,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#64748B' : '#94A3B8',
      },
    ];
  }

  // 4. DIGITAL CLOCK (10:00 Readout)
  if (normKey.includes('clock') || normKey.includes('time') || normKey.includes('second')) {
    return [
      // Dark Bezel
      {
        type: 'rect',
        left: x,
        top: y,
        width: 96,
        height: 48,
        rx: 8,
        ry: 8,
        fill: '#0F172A',
        stroke: '#334155',
        strokeWidth: 2,
      },
      // Inner Display
      {
        type: 'rect',
        left: x + 6,
        top: y + 6,
        width: 84,
        height: 36,
        rx: 4,
        ry: 4,
        fill: '#1E293B',
      },
      // Digital Digits
      {
        type: 'text',
        text: '10:00',
        left: x + 16,
        top: y + 12,
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'Courier New, monospace',
        fill: color,
        charSpacing: 80,
      },
    ];
  }

  // 5. GLOBE / STREAMING
  if (normKey.includes('globe') || normKey.includes('world') || normKey.includes('earth')) {
    return [
      // Sphere
      {
        type: 'circle',
        left: x,
        top: y,
        radius: 36,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Latitude / Longitude Arcs
      {
        type: 'circle',
        left: x + 12,
        top: y,
        radius: 24,
        fill: 'transparent',
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      // Center Badge
      {
        type: 'rect',
        left: x + 24,
        top: y + 20,
        width: 24,
        height: 32,
        rx: 4,
        ry: 4,
        fill: '#DC2626',
      },
      {
        type: 'text',
        text: 'N',
        left: x + 29,
        top: y + 24,
        fontSize: 20,
        fontWeight: '800',
        fontFamily: 'Poppins',
        fill: '#FFFFFF',
      },
    ];
  }

  // 6. LAPTOP / COMPUTER
  if (normKey.includes('laptop') || normKey.includes('computer') || normKey.includes('tech')) {
    return [
      // Screen Housing
      {
        type: 'rect',
        left: x + 10,
        top: y,
        width: 90,
        height: 58,
        rx: 6,
        ry: 6,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Screen Bezel
      {
        type: 'rect',
        left: x + 16,
        top: y + 6,
        width: 78,
        height: 46,
        rx: 3,
        ry: 3,
        fill: '#FFFFFF',
      },
      // Play Icon in Screen
      {
        type: 'triangle',
        left: x + 62,
        top: y + 20,
        width: 15,
        height: 18,
        angle: 90,
        fill: '#DC2626',
      },
      // Laptop Base
      {
        type: 'rect',
        left: x,
        top: y + 58,
        width: 110,
        height: 10,
        rx: 4,
        ry: 4,
        fill: '#CBD5E1',
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Trackpad
      {
        type: 'rect',
        left: x + 44,
        top: y + 60,
        width: 22,
        height: 5,
        rx: 1,
        ry: 1,
        fill: '#94A3B8',
      },
    ];
  }

  // 7. SHOPPING CART / ENTERPRISE COMMERCE
  if (normKey.includes('cart') || normKey.includes('shop') || normKey.includes('spend')) {
    return [
      // Basket
      {
        type: 'rect',
        left: x + 16,
        top: y + 16,
        width: 60,
        height: 40,
        rx: 6,
        ry: 6,
        fill: 'transparent',
        stroke: darkBg ? '#F8FAFC' : '#0F172A',
        strokeWidth: 3,
      },
      // Packages inside
      {
        type: 'rect',
        left: x + 24,
        top: y + 4,
        width: 28,
        height: 28,
        rx: 4,
        ry: 4,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      {
        type: 'rect',
        left: x + 42,
        top: y + 8,
        width: 24,
        height: 24,
        rx: 3,
        ry: 3,
        fill: '#F59E0B',
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      // Handle
      {
        type: 'rect',
        left: x,
        top: y + 16,
        width: 16,
        height: 4,
        rx: 2,
        ry: 2,
        fill: darkBg ? '#F8FAFC' : '#0F172A',
      },
      // Left Wheel
      {
        type: 'circle',
        left: x + 24,
        top: y + 58,
        radius: 6,
        fill: darkBg ? '#F8FAFC' : '#0F172A',
      },
      // Right Wheel
      {
        type: 'circle',
        left: x + 62,
        top: y + 58,
        radius: 6,
        fill: darkBg ? '#F8FAFC' : '#0F172A',
      },
    ];
  }

  // 8. CAMERA / BROADCAST PRODUCTION
  if (normKey.includes('camera') || normKey.includes('gear') || normKey.includes('creation')) {
    return [
      // Camera Body
      {
        type: 'rect',
        left: x,
        top: y + 12,
        width: 68,
        height: 44,
        rx: 6,
        ry: 6,
        fill: '#0F172A',
        stroke: color,
        strokeWidth: 2,
      },
      // Lens Cylinder
      {
        type: 'rect',
        left: x + 68,
        top: y + 20,
        width: 24,
        height: 28,
        rx: 4,
        ry: 4,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      // Top Handle
      {
        type: 'rect',
        left: x + 16,
        top: y + 2,
        width: 36,
        height: 10,
        rx: 4,
        ry: 4,
        fill: 'transparent',
        stroke: color,
        strokeWidth: 2,
      },
      // Microphone / Accessory
      {
        type: 'circle',
        left: x + 8,
        top: y + 4,
        radius: 5,
        fill: color,
      },
    ];
  }

  // 9. ARTIST PALETTE / CREATIVITY / BRANDING
  if (normKey.includes('palette') || normKey.includes('creative') || normKey.includes('brand') || normKey.includes('design')) {
    return [
      // Palette Body
      {
        type: 'rect',
        left: x,
        top: y,
        width: 76,
        height: 56,
        rx: 26,
        ry: 26,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Paint dabs
      {
        type: 'circle',
        left: x + 16,
        top: y + 12,
        radius: 5,
        fill: '#EF4444',
      },
      {
        type: 'circle',
        left: x + 34,
        top: y + 10,
        radius: 5,
        fill: '#3B82F6',
      },
      {
        type: 'circle',
        left: x + 50,
        top: y + 18,
        radius: 5,
        fill: '#10B981',
      },
      // Thumb hole
      {
        type: 'circle',
        left: x + 24,
        top: y + 30,
        radius: 6,
        fill: darkBg ? '#0F172A' : '#FFFFFF',
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      // Paintbrush handle
      {
        type: 'rect',
        left: x + 44,
        top: y + 28,
        width: 32,
        height: 6,
        rx: 3,
        ry: 3,
        angle: 35,
        fill: '#78350F',
      },
    ];
  }

  // 10. PERSON / SPEAKER / TESTIMONIAL
  if (normKey.includes('person') || normKey.includes('user') || normKey.includes('voice')) {
    return [
      // Head
      {
        type: 'circle',
        left: x + 12,
        top: y,
        radius: 16,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Torso
      {
        type: 'rect',
        left: x,
        top: y + 34,
        width: 48,
        height: 38,
        rx: 12,
        ry: 12,
        fill: color,
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      // Speech Bubble
      {
        type: 'rect',
        left: x + 52,
        top: y + 12,
        width: 50,
        height: 28,
        rx: 8,
        ry: 8,
        fill: '#FFFFFF',
        stroke: '#0F172A',
        strokeWidth: 2,
      },
      {
        type: 'text',
        text: 'NOPE.',
        left: x + 58,
        top: y + 18,
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'Inter',
        fill: '#0F172A',
      },
    ];
  }

  // DEFAULT: Compound Highlight Metric Emblem
  return [
    {
      type: 'circle',
      left: x,
      top: y,
      radius: 30,
      fill: color,
      stroke: darkBg ? '#475569' : '#0F172A',
      strokeWidth: 2,
    },
    {
      type: 'circle',
      left: x + 8,
      top: y + 8,
      radius: 22,
      fill: darkBg ? '#1E293B' : '#FFFFFF',
    },
    {
      type: 'triangle',
      left: x + 35,
      top: y + 20,
      width: 14,
      height: 16,
      angle: 90,
      fill: color,
    },
  ];
}
