import { CHART_COLORS } from './constants';
import type { FabricObject } from 'fabric';
import type { FabricApi, ChartDatum, ChartOptions } from './types';

export const sampleData = (n = 4): ChartDatum[] =>
  ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'].slice(0, n).map((label, i) => ({
    label, value: [40, 65, 30, 80, 55, 70][i], color: CHART_COLORS[i % CHART_COLORS.length],
  }));

export const CHART_TYPES = [
  { key: 'bar', label: 'Bar' }, { key: 'hbar', label: 'Horizontal' }, { key: 'line', label: 'Line' },
  { key: 'pie', label: 'Pie' }, { key: 'donut', label: 'Donut' },
];

/** Builds a chart out of native fabric shapes (so it is vector, scalable and exportable). */
// export function buildChart(F: FabricApi, opts: ChartOptions) {
//   const { chartType = 'bar', data, width: W = 420, height: H = 280, textColor = '#1E293B', fontFamily = 'Inter' } = opts;
//   const items = data && data.length ? data : sampleData();
//   const n = items.length;
//   const val = (it: ChartDatum) => Math.max(0, +it.value || 0);
//   const max = Math.max(...items.map(val), 1);
//   const objs: FabricObject[] = [new F.Rect({ left: 0, top: 0, width: W, height: H, fill: 'rgba(0,0,0,0)' })]; // fixed bounding box
//   const txt = (s: string | number, size = 12, extra: Record<string, unknown> = {}) => new F.FabricText(String(s), { fontSize: size, fill: textColor, fontFamily, ...extra });
//   const put = (t: InstanceType<typeof F.FabricText>, x: number, y: number, center = false) => { t.set({ left: center ? x - t.width / 2 : x, top: y }); objs.push(t); };

//   if (chartType === 'bar') {
//     const topPad = 24, labelH = 26, ch = H - topPad - labelH, slot = W / n, bw = Math.min(slot * 0.6, 90);
//     objs.push(new F.Rect({ left: 0, top: topPad + ch, width: W, height: 2, fill: '#CBD5E1' }));
//     items.forEach((it, i) => {
//       const bh = Math.max(2, (ch * val(it)) / max), x = slot * i + (slot - bw) / 2;
//       objs.push(new F.Rect({ left: x, top: topPad + ch - bh, width: bw, height: bh, fill: it.color, rx: 5, ry: 5 }));
//       put(txt(it.value, 13, { fontWeight: '700' }), x + bw / 2, topPad + ch - bh - 19, true);
//       put(txt(it.label, 12), slot * i + slot / 2, topPad + ch + 8, true);
//     });
//   } else if (chartType === 'hbar') {
//     const labelW = Math.min(110, W * 0.28), valW = 44, rowH = H / n, bh = Math.min(rowH * 0.55, 30), full = W - labelW - valW;
//     items.forEach((it, i) => {
//       const y = rowH * i + (rowH - bh) / 2, bw = Math.max(4, (full * val(it)) / max);
//       put(txt(it.label, 12), 0, y + bh / 2 - 7);
//       objs.push(new F.Rect({ left: labelW, top: y, width: full, height: bh, fill: '#E2E8F0', rx: bh / 2, ry: bh / 2 }));
//       objs.push(new F.Rect({ left: labelW, top: y, width: bw, height: bh, fill: it.color, rx: bh / 2, ry: bh / 2 }));
//       put(txt(it.value, 13, { fontWeight: '700' }), labelW + bw + 8, y + bh / 2 - 8);
//     });
//   } else if (chartType === 'line') {
//     const topPad = 26, labelH = 28, ch = H - topPad - labelH, x0 = 24, step = n > 1 ? (W - 48) / (n - 1) : 0;
//     for (let k = 0; k <= 4; k++) objs.push(new F.Rect({ left: 0, top: topPad + (ch * k) / 4, width: W, height: 1, fill: '#E2E8F0' }));
//     const pts = items.map((it, i) => ({ x: x0 + step * i, y: topPad + ch - (ch * val(it)) / max }));
//     const color = items[0]?.color || '#2F5BFF';
//     if (n > 1) objs.push(new F.Polyline(pts, { fill: 'rgba(0,0,0,0)', stroke: color, strokeWidth: 3, strokeLineJoin: 'round' }));
//     items.forEach((it, i) => {
//       objs.push(new F.Circle({ left: pts[i].x - 6, top: pts[i].y - 6, radius: 6, fill: it.color, stroke: '#fff', strokeWidth: 2 }));
//       put(txt(it.value, 12, { fontWeight: '700' }), pts[i].x, pts[i].y - 24, true);
//       put(txt(it.label, 12), pts[i].x, topPad + ch + 10, true);
//     });
//   } else {
//     // pie / donut
//     const d = Math.min(W * 0.55, H), r = d / 2, cx = r, cy = H / 2, inner = chartType === 'donut' ? r * 0.58 : 0;
//     const total = items.reduce((s, it) => s + val(it), 0) || 1;
//     const P = (rad: number, a: number): [number, number] => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
//     let a = -Math.PI / 2;
//     items.forEach((it) => {
//       const v = val(it); if (!v) return;
//       const sweep = Math.min((v / total) * Math.PI * 2, Math.PI * 2 - 1e-4), a2 = a + sweep, large = sweep > Math.PI ? 1 : 0;
//       const [x1, y1] = P(r, a), [x2, y2] = P(r, a2);
//       let path;
//       if (inner) {
//         const [x3, y3] = P(inner, a2), [x4, y4] = P(inner, a);
//         path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
//       } else path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
//       objs.push(new F.Path(path, { fill: it.color, stroke: '#ffffff', strokeWidth: 2 }));
//       if (sweep > 0.35) {
//         const [lx, ly] = P(inner ? (r + inner) / 2 : r * 0.65, a + sweep / 2);
//         const t = txt(`${Math.round((v / total) * 100)}%`, 13, { fill: '#fff', fontWeight: '700' });
//         put(t, lx, ly - 8, true);
//       }
//       a = a2;
//     });
//     const rowH = Math.min(28, H / n), y0 = H / 2 - (rowH * n) / 2, lx = d + 28;
//     items.forEach((it, i) => {
//       const y = y0 + rowH * i;
//       objs.push(new F.Rect({ left: lx, top: y + rowH / 2 - 6, width: 12, height: 12, fill: it.color, rx: 3, ry: 3 }));
//       put(txt(`${it.label}  ·  ${it.value}`, 13), lx + 20, y + rowH / 2 - 8);
//     });
//   }

//   const g = new F.Group(objs);
//   g.set({ left: opts.left || 0, top: opts.top || 0, name: 'chart', chartType, chartData: items, chartStyle: { textColor, fontFamily } });
//   return g;
// }

export function buildChart(F: FabricApi, opts: ChartOptions) {
  const {
    chartType = 'bar',
    data,
    width: W = 420,
    height: H = 280,
    textColor = '#1E293B',
    fontFamily = 'Inter',
  } = opts;

  const items = data && data.length ? data : sampleData();
  const n = items.length;

  const val = (it: ChartDatum) =>
    Math.max(0, Number(it.value) || 0);

  const max = Math.max(...items.map(val), 1);

  /*
   * IMPORTANT:
   * All chart children use top-left coordinates.
   * This makes the chart independent of Fabric 7 origin defaults.
   */
  const childDefaults = {
    originX: 'left' as const,
    originY: 'top' as const,
  };

  const objs: FabricObject[] = [
    new F.Rect({
      ...childDefaults,
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: 'rgba(0,0,0,0)',
      selectable: false,
      evented: false,
    }),
  ];

  const txt = (
    s: string | number,
    size = 12,
    extra: Record<string, unknown> = {},
  ) =>
    new F.FabricText(String(s), {
      ...childDefaults,
      fontSize: size,
      fill: textColor,
      fontFamily,
      ...extra,
    });

  const put = (
    t: InstanceType<typeof F.FabricText>,
    x: number,
    y: number,
    center = false,
  ) => {
    t.set({
      left: center ? x - (t.width || 0) / 2 : x,
      top: y,
      originX: 'left',
      originY: 'top',
    });

    objs.push(t);
  };

  /*
   * BAR CHART
   */
  if (chartType === 'bar') {
    const topPad = 24;
    const labelH = 26;

    const ch = Math.max(
      1,
      H - topPad - labelH
    );

    const slot = W / n;

    const bw = Math.min(
      slot * 0.6,
      90
    );

    objs.push(
      new F.Rect({
        ...childDefaults,
        left: 0,
        top: topPad + ch,
        width: W,
        height: 2,
        fill: '#CBD5E1',
      })
    );

    items.forEach((it, i) => {
      const bh = Math.max(
        2,
        (ch * val(it)) / max
      );

      const x =
        slot * i +
        (slot - bw) / 2;

      const y =
        topPad +
        ch -
        bh;

      objs.push(
        new F.Rect({
          ...childDefaults,
          left: x,
          top: y,
          width: bw,
          height: bh,
          fill: it.color,
          rx: 5,
          ry: 5,
        })
      );

      put(
        txt(it.value, 13, {
          fontWeight: '700',
        }),
        x + bw / 2,
        y - 19,
        true
      );

      put(
        txt(it.label, 12),
        slot * i + slot / 2,
        topPad + ch + 8,
        true
      );
    });

  /*
   * HORIZONTAL BAR
   */
  } else if (chartType === 'hbar') {
    const labelW = Math.min(
      110,
      W * 0.28
    );

    const valW = 44;

    const rowH = H / n;

    const bh = Math.min(
      rowH * 0.55,
      30
    );

    const full =
      W -
      labelW -
      valW;

    items.forEach((it, i) => {
      const y =
        rowH * i +
        (rowH - bh) / 2;

      const bw = Math.max(
        4,
        (full * val(it)) / max
      );

      put(
        txt(it.label, 12),
        0,
        y + bh / 2 - 7
      );

      objs.push(
        new F.Rect({
          ...childDefaults,
          left: labelW,
          top: y,
          width: full,
          height: bh,
          fill: '#E2E8F0',
          rx: bh / 2,
          ry: bh / 2,
        })
      );

      objs.push(
        new F.Rect({
          ...childDefaults,
          left: labelW,
          top: y,
          width: bw,
          height: bh,
          fill: it.color,
          rx: bh / 2,
          ry: bh / 2,
        })
      );

      put(
        txt(it.value, 13, {
          fontWeight: '700',
        }),
        labelW + bw + 8,
        y + bh / 2 - 8
      );
    });

  /*
   * LINE CHART
   */
  } else if (chartType === 'line') {
    const topPad = 26;
    const labelH = 28;

    const ch = Math.max(
      1,
      H - topPad - labelH
    );

    const x0 = 24;

    const step =
      n > 1
        ? (W - 48) / (n - 1)
        : 0;

    for (let k = 0; k <= 4; k++) {
      objs.push(
        new F.Rect({
          ...childDefaults,
          left: 0,
          top: topPad + (ch * k) / 4,
          width: W,
          height: 1,
          fill: '#E2E8F0',
        })
      );
    }

    const pts = items.map((it, i) => ({
      x: x0 + step * i,
      y:
        topPad +
        ch -
        (ch * val(it)) / max,
    }));

    const color =
      items[0]?.color ||
      '#2F5BFF';

    if (n > 1) {
      objs.push(
        new F.Polyline(pts, {
          ...childDefaults,
          fill: 'rgba(0,0,0,0)',
          stroke: color,
          strokeWidth: 3,
          strokeLineJoin: 'round',
        })
      );
    }

    items.forEach((it, i) => {
      const p = pts[i];

      objs.push(
        new F.Circle({
          ...childDefaults,
          left: p.x - 6,
          top: p.y - 6,
          radius: 6,
          fill: it.color,
          stroke: '#fff',
          strokeWidth: 2,
        })
      );

      put(
        txt(it.value, 12, {
          fontWeight: '700',
        }),
        p.x,
        p.y - 24,
        true
      );

      put(
        txt(it.label, 12),
        p.x,
        topPad + ch + 10,
        true
      );
    });

  /*
   * PIE / DONUT
   */
  } else {
    const d = Math.min(
      W * 0.55,
      H
    );

    const r = d / 2;

    const cx = r;
    const cy = H / 2;

    const inner =
      chartType === 'donut'
        ? r * 0.58
        : 0;

    const total =
      items.reduce(
        (s, it) => s + val(it),
        0
      ) || 1;

    const P = (
      rad: number,
      a: number
    ): [number, number] => [
      cx + rad * Math.cos(a),
      cy + rad * Math.sin(a),
    ];

    let a = -Math.PI / 2;

    items.forEach((it) => {
      const v = val(it);

      if (!v) return;

      const sweep = Math.min(
        (v / total) * Math.PI * 2,
        Math.PI * 2 - 0.0001
      );

      const a2 = a + sweep;

      const large =
        sweep > Math.PI ? 1 : 0;

      const [x1, y1] = P(r, a);
      const [x2, y2] = P(r, a2);

      let path: string;

      if (inner) {
        const [x3, y3] =
          P(inner, a2);

        const [x4, y4] =
          P(inner, a);

        path =
          `M ${x1} ${y1}` +
          ` A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` +
          ` L ${x3} ${y3}` +
          ` A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4}` +
          ` Z`;
      } else {
        path =
          `M ${cx} ${cy}` +
          ` L ${x1} ${y1}` +
          ` A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` +
          ` Z`;
      }

      objs.push(
        new F.Path(path, {
          ...childDefaults,
          fill: it.color,
          stroke: '#ffffff',
          strokeWidth: 2,
        })
      );

      if (sweep > 0.35) {
        const [
          lx,
          ly,
        ] = P(
          inner
            ? (r + inner) / 2
            : r * 0.65,
          a + sweep / 2
        );

        const t = txt(
          `${Math.round(
            (v / total) * 100
          )}%`,
          13,
          {
            fill: '#fff',
            fontWeight: '700',
          }
        );

        put(
          t,
          lx,
          ly - 8,
          true
        );
      }

      a = a2;
    });

    const rowH = Math.min(
      28,
      H / n
    );

    const y0 =
      H / 2 -
      (rowH * n) / 2;

    const lx = d + 28;

    items.forEach((it, i) => {
      const y =
        y0 + rowH * i;

      objs.push(
        new F.Rect({
          ...childDefaults,
          left: lx,
          top:
            y +
            rowH / 2 -
            6,
          width: 12,
          height: 12,
          fill: it.color,
          rx: 3,
          ry: 3,
        })
      );

      put(
        txt(
          `${it.label}  ·  ${it.value}`,
          13
        ),
        lx + 20,
        y + rowH / 2 - 8
      );
    });
  }

  /*
   * IMPORTANT FABRIC 7 FIX:
   *
   * The group itself also uses top-left positioning.
   */
  const g = new F.Group(objs, {
    originX: 'left',
    originY: 'top',
  });

  g.set({
    left: opts.left ?? 0,
    top: opts.top ?? 0,
      chartWidth: W,
  chartHeight: H,
    originX: 'left',
    originY: 'top',
    name: 'chart',
    chartType,
    chartData: items,
    chartStyle: {
      textColor,
      fontFamily,
    },
  });

  g.setCoords();

  return g;
}