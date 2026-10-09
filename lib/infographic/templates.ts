/**
 * HOW TO ADD A TEMPLATE: push another object into TEMPLATES below (or import it from its own file).
 * A template is plain data: { id, name, category, width, height, bg, objects: [descriptor...] }.
 * Descriptor types: rect, circle, triangle, star, text, icon, image, chart, group  (see factory.js).
 * Thumbnails in the gallery are rendered automatically from this data.
 */
import type { Background, ChartDatum, ObjectDescriptor, Template } from './types';

const T = (text: string, left: number, top: number, width: number, fontSize: number, fill: string, x: Record<string, unknown> = {}): ObjectDescriptor => ({ type: 'text', text, left, top, width, fontSize, fill, ...x });
const R = (left: number, top: number, width: number, height: number, fill: string, x: Record<string, unknown> = {}): ObjectDescriptor => ({ type: 'rect', left, top, width, height, fill, ...x });
const C = (left: number, top: number, radius: number, fill: string, x: Record<string, unknown> = {}): ObjectDescriptor => ({ type: 'circle', left, top, radius, fill, ...x });
const I = (icon: string, left: number, top: number, size: number, fill: string, x: Record<string, unknown> = {}): ObjectDescriptor => ({ type: 'icon', icon, left, top, size, fill, ...x });
const CH = (chartType: string, left: number, top: number, width: number, height: number, data: ChartDatum[], x: Record<string, unknown> = {}): ObjectDescriptor => ({ type: 'chart', chartType, left, top, width, height, data, ...x });
const SH = { color: 'rgba(15,23,42,0.12)', blur: 24, offsetX: 0, offsetY: 8 };
const solid = (c1: string): Background => ({ type: 'solid', c1 });

function processSteps() {
  const steps: [string, string][] = [
    ['Research', 'Understand your audience and gather the data that backs up your story.'],
    ['Outline', 'Pick the three or four points that matter and give each one its own section.'],
    ['Design', 'Choose a palette, add icons and charts, and keep plenty of white space.'],
    ['Review', 'Check every number, trim the copy and test it on a small screen.'],
    ['Share', 'Export a high-resolution image or PDF and publish it where people will see it.'],
  ];
  const o: ObjectDescriptor[] = [
    R(0, 0, 800, 320, '#2F5BFF'),
    T('A FIVE STEP GUIDE', 60, 80, 680, 20, '#C7D2FE', { fontWeight: '700', charSpacing: 300 }),
    T('How to build a great infographic', 60, 120, 680, 50, '#FFFFFF', { fontWeight: '700', fontFamily: 'Poppins', lineHeight: 1.1 }),
  ];
  steps.forEach(([t, d], i) => {
    const y = 380 + i * 250;
    if (i < steps.length - 1) o.push(R(119, y + 90, 6, 250, '#CBD5E1'));
    o.push(R(60, y, 680, 200, '#FFFFFF', { rx: 20, ry: 20, shadow: SH }));
    o.push(C(90, y + 50, 30, ['#2F5BFF', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'][i]));
    o.push(T(String(i + 1), 90, y + 66, 60, 28, '#FFFFFF', { textAlign: 'center', fontWeight: '700', fontFamily: 'Poppins' }));
    o.push(T(t, 175, y + 36, 520, 30, '#0F172A', { fontWeight: '700', fontFamily: 'Poppins' }));
    o.push(T(d, 175, y + 84, 520, 18, '#475569', { lineHeight: 1.4 }));
  });
  o.push(T('Source: your data here', 60, 1740, 680, 16, '#94A3B8', { textAlign: 'center' }));
  return o;
}

function statsReport() {
  const o: ObjectDescriptor[] = [
    T('2026 MARKET REPORT', 60, 70, 680, 18, '#38BDF8', { fontWeight: '700', charSpacing: 300 }),
    T('Where our users spend their time', 60, 105, 680, 46, '#FFFFFF', { fontWeight: '700', fontFamily: 'Poppins', lineHeight: 1.1 }),
  ];
  ([['72%', 'weekly active users'], ['3.4h', 'average daily usage'], ['+18%', 'growth year on year']] as [string, string][]).forEach(([n, l], i) => {
    const x = 60 + i * 235;
    o.push(R(x, 260, 210, 150, '#1E293B', { rx: 18, ry: 18 }));
    o.push(T(n, x, 292, 210, 44, ['#38BDF8', '#34D399', '#FBBF24'][i], { textAlign: 'center', fontWeight: '700', fontFamily: 'Poppins' }));
    o.push(T(l, x + 10, 355, 190, 15, '#CBD5E1', { textAlign: 'center' }));
  });
  o.push(T('Revenue by quarter', 60, 480, 680, 24, '#FFFFFF', { fontWeight: '700', fontFamily: 'Poppins' }));
  o.push(CH('bar', 60, 530, 680, 340, [
    { label: 'Q1', value: 42, color: '#38BDF8' }, { label: 'Q2', value: 58, color: '#38BDF8' },
    { label: 'Q3', value: 51, color: '#38BDF8' }, { label: 'Q4', value: 83, color: '#34D399' }], { textColor: '#E2E8F0' }));
  o.push(T('Traffic sources', 60, 950, 680, 24, '#FFFFFF', { fontWeight: '700', fontFamily: 'Poppins' }));
  o.push(CH('donut', 60, 1000, 680, 300, [
    { label: 'Search', value: 45, color: '#38BDF8' }, { label: 'Social', value: 25, color: '#A78BFA' },
    { label: 'Direct', value: 20, color: '#34D399' }, { label: 'Email', value: 10, color: '#FBBF24' }], { textColor: '#E2E8F0' }));
  o.push(T('Growth by region', 60, 1380, 680, 24, '#FFFFFF', { fontWeight: '700', fontFamily: 'Poppins' }));
  o.push(CH('hbar', 60, 1430, 680, 260, [
    { label: 'Asia', value: 78, color: '#38BDF8' }, { label: 'Europe', value: 54, color: '#A78BFA' },
    { label: 'Americas', value: 63, color: '#34D399' }, { label: 'Africa', value: 31, color: '#FBBF24' }], { textColor: '#E2E8F0' }));
  o.push(T('Source: your data here', 60, 1850, 680, 15, '#64748B', { textAlign: 'center' }));
  return o;
}

function timeline() {
  const items: [string, string, string][] = [['2019', 'Founded', 'The idea starts with a small team.'], ['2020', 'First release', 'Our first version goes live.'],
    ['2022', 'Going global', 'Launched in twelve new markets.'], ['2024', 'One million users', 'A milestone worth celebrating.'], ['2026', 'What is next', 'New products and partnerships.']];
  const o: ObjectDescriptor[] = [
    T('OUR JOURNEY', 0, 80, 800, 18, '#EA580C', { textAlign: 'center', fontWeight: '700', charSpacing: 300 }),
    T('Company timeline', 0, 120, 800, 54, '#431407', { textAlign: 'center', fontWeight: '700', fontFamily: 'Playfair Display' }),
    R(396, 280, 8, 1450, '#FDBA74'),
  ];
  items.forEach(([y, t, d], i) => {
    const top = 320 + i * 285, left = i % 2 === 0, x = left ? 60 : 440;
    o.push(R(x, top, 300, 190, '#FFFFFF', { rx: 18, ry: 18, shadow: SH }));
    o.push(T(y, x + 24, top + 22, 250, 34, '#EA580C', { fontWeight: '700', fontFamily: 'Poppins' }));
    o.push(T(t, x + 24, top + 70, 250, 22, '#431407', { fontWeight: '700' }));
    o.push(T(d, x + 24, top + 104, 252, 16, '#78350F', { lineHeight: 1.4 }));
    o.push(C(380, top + 80, 20, '#EA580C', { stroke: '#FFF7ED', strokeWidth: 6 }));
  });
  return o;
}

function comparison() {
  const o = [
    T('Remote vs Office', 0, 70, 800, 52, '#0F172A', { textAlign: 'center', fontWeight: '700', fontFamily: 'Poppins' }),
    T('What matters most for your team?', 0, 140, 800, 20, '#64748B', { textAlign: 'center' }),
  ];
  ([
    ['Remote', '#2F5BFF', ['Flexible hours', 'No commute', 'Wider talent pool', 'Lower office costs'], 'check', 60],
    ['Office', '#F59E0B', ['Face to face time', 'Easier onboarding', 'Clear separation', 'Team culture'], 'star', 420],
  ] as [string, string, string[], string, number][]).forEach(([title, color, list, icon, x]) => {
    o.push(R(x, 230, 320, 900, '#FFFFFF', { rx: 24, ry: 24, shadow: SH }));
    o.push(R(x, 230, 320, 110, color, { rx: 24, ry: 24 }));
    o.push(R(x, 300, 320, 40, color));
    o.push(T(title, x, 262, 320, 36, '#FFFFFF', { textAlign: 'center', fontWeight: '700', fontFamily: 'Poppins' }));
    list.forEach((s, i) => {
      o.push(I(icon, x + 30, 390 + i * 160, 48, color));
      o.push(T(s, x + 96, 400 + i * 160, 200, 22, '#0F172A', { fontWeight: '700' }));
      o.push(T('Add a short supporting line here.', x + 96, 436 + i * 160, 200, 15, '#64748B'));
    });
  });
  o.push(T('Your conclusion goes here', 60, 1230, 680, 22, '#2F5BFF', { textAlign: 'center', fontWeight: '700' }));
  return o;
}

export const TEMPLATES: Template[] = [
  { id: 'process-steps', name: 'Process steps', category: 'Process', width: 800, height: 1800, bg: solid('#F8FAFC'), objects: processSteps() },
  { id: 'stats-report', name: 'Statistics report', category: 'Data', width: 800, height: 1950, bg: solid('#0F172A'), objects: statsReport() },
  { id: 'timeline', name: 'Timeline', category: 'Timeline', width: 800, height: 1800, bg: solid('#FFF7ED'), objects: timeline() },
  { id: 'comparison', name: 'Comparison', category: 'Comparison', width: 800, height: 1350, bg: solid('#F1F5F9'), objects: comparison() },
];

export const getTemplate = (id: string): Template | null => TEMPLATES.find((t) => t.id === id) || null;
export const TEMPLATE_CATEGORIES = ['All', ...new Set(TEMPLATES.map((t) => t.category))];
