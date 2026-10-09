'use client';
import { useState } from 'react';
import { GRADIENTS, PAGE_SIZES, SOLID_BGS } from '@/lib/infographic/constants';
import { fileToDataURL } from '@/lib/infographic/export';
import { Color, Icon, Section } from './ui';
import type { PanelProps } from './interfaces';

/** Page size + background settings. Used in the left "Page" tab and in the right panel when nothing is selected. */
export default function PagePanel({ api, doc }: Readonly<PanelProps>) {
  const [w, setW] = useState(doc.width), [h, setH] = useState(doc.height);
  const bg = doc.bg || { type: 'solid', c1: '#FFFFFF' };

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      await api.setBgImage(await fileToDataURL(f));
    } catch {
      api.say('Could not read that image.');
    }
    e.target.value = '';
  }

  return (
    <div>
      <Section title="Page size">
        <div className="ie-list">
          {PAGE_SIZES.map((s) => (
            <button key={s.label} className={'ie-row-btn' + (doc.width === s.w && doc.height === s.h ? ' on' : '')} onClick={() => { setW(s.w); setH(s.h); api.resizePage(s.w, s.h); }}>
              {s.label}<small>{s.w} × {s.h}</small>
            </button>
          ))}
        </div>
        <div className="ie-two">
          <div className="ie-field"><label htmlFor="page-width">Width</label><input id="page-width" type="number" value={w} onChange={(e) => setW(Number(e.target.value))} /></div>
          <div className="ie-field"><label htmlFor="page-height">Height</label><input id="page-height" type="number" value={h} onChange={(e) => setH(Number(e.target.value))} /></div>
        </div>
        <div className="ie-row">
          <button className="ie-btn" onClick={() => api.resizePage(w, h)}>Apply size</button>
          <button className="ie-btn" onClick={() => { api.extendPage(500); setH(doc.height + 500); }}><Icon name="plus" /> 500px</button>
        </div>
      </Section>
      <Section title="Background colour">
        <div className="ie-bgs">
          {SOLID_BGS.map((c) => <button key={c} className="ie-sw big" style={{ background: c }} onClick={() => api.setBg({ type: 'solid', c1: c })} title={c} />)}
        </div>
        <Color label="Custom colour" value={bg.c1} swatches={false} onChange={(c) => api.setBg({ type: 'solid', c1: c })} />
      </Section>
      <Section title="Gradient">
        <div className="ie-bgs">
          {GRADIENTS.map(([a, b]) => <button key={a + b} className="ie-sw big" style={{ background: `linear-gradient(${a},${b})` }} onClick={() => api.setBg({ type: 'gradient', c1: a, c2: b })} />)}
        </div>
        {bg.type === 'gradient' && (
          <div className="ie-two">
            <Color label="Top" value={bg.c1} swatches={false} onChange={(c) => api.setBg({ ...bg, c1: c })} />
            <Color label="Bottom" value={bg.c2} swatches={false} onChange={(c) => api.setBg({ ...bg, c2: c })} />
          </div>
        )}
      </Section>
      <Section title="Background image">
        <label className="ie-btn block"><Icon name="upload" /> Upload image<input type="file" accept="image/*" hidden onChange={upload} /></label>
        <p className="ie-hint">Or use the Images tab, then press “Use as background” on a photo.</p>
      </Section>
    </div>
  );
}
