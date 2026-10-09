// 'use client';
// import { useEffect, useRef } from 'react';
// import { applyBackground, buildTemplate } from '@/lib/infographic/factory';
// import { ensureFonts, injectFonts } from '@/lib/infographic/fonts';

// /** Renders a template-like object ({width,height,bg,objects}) into a small static canvas. */
// export default function Preview({ tpl, width = 200 }) {
//   const host = useRef(null);
//   useEffect(() => {
//     let dead = false, sc, el;
//     (async () => {
//       injectFonts();
//       const F = await import('fabric');
//       if (dead || !host.current) return;
//       const z = width / tpl.width;
//       el = document.createElement('canvas');
//       host.current.innerHTML = '';
//       host.current.appendChild(el);
//       sc = new F.StaticCanvas(el, { width: tpl.width * z, height: tpl.height * z, renderOnAddRemove: false });
//       sc.setZoom(z);
//       applyBackground(F, sc, tpl.bg, tpl.height);
//       await ensureFonts(tpl.objects.map((o) => o.fontFamily).concat(['Inter', 'Poppins', 'Playfair Display']));
//       if (dead) return;
//       await buildTemplate(F, sc, tpl);
//       if (!dead) sc.requestRenderAll();
//     })().catch(() => {});
//     return () => { dead = true; try { sc?.dispose(); } catch {} if (host.current) host.current.innerHTML = ''; };
//   }, [tpl, width]);
//   return <div ref={host} className="ie-preview" style={{ width, minHeight: (tpl.height * width) / tpl.width }} />;
// }
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { StaticCanvas } from 'fabric';
import { applyBackground, buildTemplate } from '@/lib/infographic/factory';
import { ensureFonts, injectFonts } from '@/lib/infographic/fonts';
import type { TemplatePreviewProps } from './interfaces';

/** Renders a template-like object ({width,height,bg,objects}) into a small static image. */
export default function Preview({ tpl, width = 200 }: Readonly<TemplatePreviewProps>) {
  const [preview, setPreview] = useState<{ tpl: TemplatePreviewProps['tpl']; width: number; src: string } | null>(null);

  useEffect(() => {
    let dead = false, sc: StaticCanvas | null = null;
    (async () => {
      injectFonts();
      const F = await import('fabric');
      if (dead) return;

      // Build at NATIVE size (same as the editor), no zoom, no retina scaling
      const el = document.createElement('canvas');
      sc = new F.StaticCanvas(el, {
        width: tpl.width,
        height: tpl.height,
        renderOnAddRemove: false,
        enableRetinaScaling: false,
      });
      applyBackground(F, sc, tpl.bg, tpl.height);

      await ensureFonts(
        tpl.objects.map((o) => o.fontFamily).filter((font): font is string => Boolean(font)).concat(['Inter', 'Poppins', 'Playfair Display'])
      );
      if (dead) return;

      await buildTemplate(F, sc, tpl);
      if (dead) return;
      sc.renderAll();

      // Downscale on export
      const url = sc.toDataURL({ format: 'png', multiplier: (width * 2) / tpl.width }); // 2x for crispness
      if (!dead) setPreview({ tpl, width, src: url });
    })().catch(() => {});

    return () => {
      dead = true;
      sc?.dispose().catch((error) => console.error('Preview cleanup failed:', error));
    };
  }, [tpl, width]);

  return (
    <div
      className="ie-preview"
      style={{ width, aspectRatio: `${tpl.width} / ${tpl.height}` }}
    >
      {preview?.tpl === tpl && preview.width === width && (
        <Image
          src={preview.src}
          alt={tpl.name || 'Template preview'}
          width={Math.round(width * 2)}
          height={Math.round((tpl.height * width * 2) / tpl.width)}
          unoptimized
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}