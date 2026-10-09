'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon, IconBtn } from './ui';
import type { EditorApi, EditorDocument, EditorStatus } from './interfaces';

type TopBarProps = {
  api: EditorApi;
  doc: EditorDocument;
  zoom: number;
  status: EditorStatus;
  flags: { undo: boolean; redo: boolean };
};

const EXPORTS = [
  ['png', 'PNG · standard', 'Original size'],
  // ['png2', 'PNG · high resolution', '2× size, best for print'],
  ['jpg', 'JPG', '2× size, smaller file'],
  // ['pdf', 'PDF · single page', 'One long page'], ['pdfa4', 'PDF · A4 pages', 'Long design split across pages'],
  // ['svg', 'SVG', 'Vector, editable elsewhere'], ['json', 'Design file (JSON)', 'Backup or reuse as a template'],
];

export default function TopBar({ api, doc, zoom, status, flags }: Readonly<TopBarProps>) {
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  // const label: Record<EditorStatus, string> = { saved: 'All changes saved', saving: 'Saving…', dirty: 'Unsaved changes', error: 'Not saved' };
const label: Record<EditorStatus, string> = {
  saved: '✓ All changes saved',
  saving: 'Saving your changes…',
  dirty: 'You have unsaved changes',
  error: 'Unable to save changes',
};
  return (
    <header className="ie-top">
      <button className="ie-back" onClick={() => api.leave()}><Icon name="back" /> Designs</button>
      <input className="ie-name" value={doc.name} onChange={(e) => api.setName(e.target.value)} aria-label="Design name" />
      <span className={'ie-status ' + status}>{label[status]}</span>
      <div className="ie-spacer" />
      <IconBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!flags.undo} onClick={() => api.undo()} />
      <IconBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!flags.redo} onClick={() => api.redo()} />
      <div className="ie-sep" />
      <IconBtn icon="minus" title="Zoom out" onClick={() => api.setZoom(zoom - 0.1)} />
      <button className="ie-zoom" title="Fit to width" onClick={() => api.fit()}>{Math.round(zoom * 100)}%</button>
      <IconBtn icon="plus" title="Zoom in" onClick={() => api.setZoom(zoom + 0.1)} />
      <div className="ie-sep" />
      <button className="ie-btn" onClick={() => api.extendPage(500)} title="Make the page 500px taller"><Icon name="plus" /> Add 500px height</button>
      <button className="ie-btn" onClick={() => { void api.saveNow(); api.say('Saved'); }}><Icon name="save" /> Save</button>
      <div className="ie-menu" ref={ref}>
        <button className="ie-btn primary" onClick={() => setMenu(!menu)}><Icon name="download" /> Export</button>
        {menu && (
          <div className="ie-pop">
            {EXPORTS.map(([k, t, d]) => (
              <button key={k} onClick={() => { setMenu(false); void api.exportAs(k); }}><b>{t}</b><span>{d}</span></button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
