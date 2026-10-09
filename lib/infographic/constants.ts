// w:true => font has 400 + 700 weights on Google Fonts
export const FONTS = [
  { n: 'Inter', w: true }, { n: 'Poppins', w: true }, { n: 'Montserrat', w: true }, { n: 'Roboto', w: true },
  { n: 'Open Sans', w: true }, { n: 'Lato', w: true }, { n: 'Raleway', w: true }, { n: 'Oswald', w: true },
  { n: 'Playfair Display', w: true }, { n: 'Merriweather', w: true }, { n: 'Caveat', w: true },
  { n: 'Dancing Script', w: true }, { n: 'Bebas Neue' }, { n: 'Anton' }, { n: 'Pacifico' }, { n: 'Lobster' },
];

export const PALETTE = ['#0F172A', '#475569', '#FFFFFF', '#2F5BFF', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
export const CHART_COLORS = ['#2F5BFF', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];

export const GRADIENTS = [
  ['#2F5BFF', '#8B5CF6'], ['#06B6D4', '#2F5BFF'], ['#F59E0B', '#EF4444'], ['#10B981', '#06B6D4'],
  ['#0F172A', '#334155'], ['#FDF2F8', '#EDE9FE'], ['#ECFEFF', '#DBEAFE'], ['#FFF7ED', '#FEF3C7'],
];

export const SOLID_BGS = ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#FFF7ED', '#ECFDF5', '#EFF6FF', '#FDF2F8', '#0F172A', '#1E293B', '#2F5BFF'];

export const PAGE_SIZES = [
  { label: 'Long infographic', w: 800, h: 2400 },
  { label: 'Standard infographic', w: 800, h: 2000 },
  { label: 'Short infographic', w: 800, h: 1200 },
  { label: 'Social post (square)', w: 1080, h: 1080 },
  { label: 'Story (9:16)', w: 1080, h: 1920 },
  { label: 'A4 portrait', w: 794, h: 1123 },
  { label: 'Presentation 16:9', w: 1280, h: 720 },
];

export const CUSTOM_PROPS = ['name', 'locked', 'chartData', 'chartType', 'chartStyle', 'fx'];

export const MAX_PAGE_HEIGHT = 12000;
