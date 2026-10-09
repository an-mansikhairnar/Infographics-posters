import type { FabricCanvas, DesignDocument } from './types';

/** Export helpers. `canvas` is the live fabric canvas, `doc` = {name,width,height}, `zoom` = current zoom. */
const MAX_SIDE = 16000;

type ExportOptions = {
  format?: 'png' | 'jpeg';
  scale?: number;
  quality?: number;
  keepSelection?: boolean;
};

export function toDataURL(canvas: FabricCanvas, doc: DesignDocument, zoom: number, { format = 'png', scale = 1, quality = 0.92, keepSelection = false }: ExportOptions = {}) {
  if (!keepSelection) { canvas.discardActiveObject(); canvas.renderAll(); }
  const s = Math.min(scale, MAX_SIDE / doc.width, MAX_SIDE / doc.height);
  // fabric multiplies the current zoom, so compensate to get exactly design-size * s
  return canvas.toDataURL({ format, quality, multiplier: s / zoom, enableRetinaScaling: false });
}

export function download(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}

const safe = (n: string) => (n || 'infographic').replace(/[^\w\-]+/g, '_');
const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

export async function exportImage(canvas: FabricCanvas, doc: DesignDocument, zoom: number, format: 'png' | 'jpg', scale: number) {
  const url = toDataURL(canvas, doc, zoom, { format: format === 'jpg' ? 'jpeg' : 'png', scale });
  download(url, `${safe(doc.name)}.${format}`);
}

export function exportSVG(canvas: FabricCanvas, doc: DesignDocument) {
  canvas.discardActiveObject();
  const svg = canvas.toSVG({ width: doc.width + 'px', height: doc.height + 'px', viewBox: { x: 0, y: 0, width: doc.width, height: doc.height } });
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  download(url, `${safe(doc.name)}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportJSON(json: object, doc: DesignDocument) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }));
  download(url, `${safe(doc.name)}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** mode 'single' = one tall page, 'a4' = long design split into A4-ratio pages */
export async function exportPDF(canvas: FabricCanvas, doc: DesignDocument, zoom: number, mode: 'single' | 'a4' = 'single') {
  const { jsPDF } = await import('jspdf');
  const scale = 2;
  const url = toDataURL(canvas, doc, zoom, { format: 'jpeg', scale, quality: 0.92 });
  const { width: w, height: h } = doc;
  if (mode === 'single') {
    const pdf = new jsPDF({ orientation: w > h ? 'l' : 'p', unit: 'px', format: [w, h], hotfixes: ['px_scaling'] });
    pdf.addImage(url, 'JPEG', 0, 0, w, h);
    pdf.save(`${safe(doc.name)}.pdf`);
    return;
  }
  const img = await loadImg(url);
  const pageH = Math.round(w * 1.4142), pages = Math.ceil(h / pageH);
  const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [w, pageH], hotfixes: ['px_scaling'] });
  for (let p = 0; p < pages; p++) {
    const sliceH = Math.min(pageH, h - p * pageH), c = document.createElement('canvas');
    c.width = img.width; c.height = Math.round(sliceH * (img.width / w));
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, p * pageH * (img.width / w), img.width, c.height, 0, 0, c.width, c.height);
    if (p) pdf.addPage([w, pageH], 'p');
    pdf.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, w, sliceH);
  }
  pdf.save(`${safe(doc.name)}-a4.pdf`);
}

/** Resize/compress an uploaded image file to a data URL (keeps localStorage small). */
export function fileToDataURL(file: File, maxSide = 1600): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = async () => {
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(reader.result as string);
        return;
      }
      try {
        const img = await loadImg(reader.result as string);
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
      } catch (e) { reject(e); }
    };
    reader.readAsDataURL(file);
  });
}
