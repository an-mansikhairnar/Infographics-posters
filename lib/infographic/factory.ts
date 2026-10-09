import { ICONS } from './icons';
import { buildChart } from './charts';
import type { FabricImage, SerializedShadowOptions } from 'fabric';
import type { AnyFabricCanvas, Background, FabricApi, InfographicObject, ObjectDescriptor, Template } from './types';

export function starPoints(n = 5, outer = 60, inner = 26): { x: number; y: number }[] {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner, a = (Math.PI / n) * i - Math.PI / 2;
    pts.push({ x: outer + r * Math.cos(a), y: outer + r * Math.sin(a) });
  }
  return pts;
}

/**
 * Turns a plain descriptor (the format used by templates & the side panels) into a fabric object.
 * F = the fabric module (loaded lazily in the browser).
 */
export async function createObject(F: FabricApi, d: ObjectDescriptor): Promise<InfographicObject> {
  // const { type, ...o } = d;
  const { type, ...raw } = d;

const o = {
  originX: 'left' as const,
  originY: 'top' as const,
  ...raw,
};
  if (o.shadow && !(o.shadow instanceof F.Shadow)) o.shadow = new F.Shadow(o.shadow as Partial<SerializedShadowOptions>);
  switch (type) {
    case 'rect': return new F.Rect({ width: 200, height: 120, fill: '#2F5BFF', ...o } as ConstructorParameters<typeof F.Rect>[0]);
    case 'circle': return new F.Circle({ radius: 60, fill: '#2F5BFF', ...o } as ConstructorParameters<typeof F.Circle>[0]);
    case 'triangle': return new F.Triangle({ width: 120, height: 110, fill: '#2F5BFF', ...o } as ConstructorParameters<typeof F.Triangle>[0]);
    case 'star': return new F.Polygon(starPoints(5, 60, 26), { fill: '#F59E0B', ...o } as ConstructorParameters<typeof F.Polygon>[1]);
    case 'text': {
      const { text = 'Add text', ...rest } = o;
      return new F.Textbox(text as string, { fontFamily: 'Inter', fontSize: 28, fill: '#0F172A', width: 320, ...rest } as ConstructorParameters<typeof F.Textbox>[1]);
    }
    case 'icon': {
      const { icon, size = 90, ...rest } = o;
      const p = new F.Path(ICONS[icon as keyof typeof ICONS] || ICONS.star);
      const s = (size as number) / Math.max(p.width, p.height);
      p.set({ fill: '#2F5BFF', scaleX: s, scaleY: s, name: 'icon', ...rest });
      return p;
    }
    case 'image': {
      const { src, maxWidth, ...rest } = o;
      const img = await F.FabricImage.fromURL(src as string, { crossOrigin: 'anonymous' });
      if (maxWidth && img.width > (maxWidth as number)) img.scaleToWidth(maxWidth as number);
      img.set(rest);
      return img;
    }
    case 'chart': return buildChart(F, o);
    case 'group': {
      const { objects, ...rest } = o;
      const kids = await Promise.all((objects as ObjectDescriptor[]).map((c) => createObject(F, c)));
      const g = new F.Group(kids);
      g.set(rest);
      return g;
    }
//    case 'group': {
//   const { objects, ...rest } = o;

//   const kids = await Promise.all(
//     (objects as ObjectDescriptor[]).map((c) => createObject(F, c))
//   );

//   const g = new F.Group(kids, {
//     subTargetCheck: true,
//     interactive: true,
//   });

//   g.set(rest);

//   return g;
// }
    default: throw new Error('Unknown object type: ' + type);
  }
}

export function applyBackground(F: FabricApi, canvas: AnyFabricCanvas, bg: Background, h: number) {
  if (bg?.type === 'gradient') {
    canvas.backgroundColor = new F.Gradient({
      type: 'linear', gradientUnits: 'pixels', coords: { x1: 0, y1: 0, x2: 0, y2: h },
      colorStops: [{ offset: 0, color: bg.c1 }, { offset: 1, color: bg.c2 }],
    });
  } else canvas.backgroundColor = bg?.c1 || '#FFFFFF';
  canvas.requestRenderAll();
}

/** Adds all objects of a template to a (static or interactive) canvas. */
export async function buildTemplate(F: FabricApi, canvas: AnyFabricCanvas, tpl: Template) {
  for (const d of tpl.objects) canvas.add(await createObject(F, d));
}

export function applyLock(o: InfographicObject) {
  const l = !!o.locked;
  o.set({ lockMovementX: l, lockMovementY: l, lockRotation: l, lockScalingX: l, lockScalingY: l, hasControls: !l });
}

export function applyFx(F: FabricApi, o: FabricImage & InfographicObject) {
  const fx = o.fx || {};
  const f = [];
  if (fx.grayscale) f.push(new F.filters.Grayscale());
  if (fx.sepia) f.push(new F.filters.Sepia());
  if (fx.invert) f.push(new F.filters.Invert());
  if (fx.brightness) f.push(new F.filters.Brightness({ brightness: fx.brightness }));
  if (fx.contrast) f.push(new F.filters.Contrast({ contrast: fx.contrast }));
  if (fx.blur) f.push(new F.filters.Blur({ blur: fx.blur }));
  o.filters = f;
  o.applyFilters();
}
