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

// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { GRADIENTS, PAGE_SIZES, SOLID_BGS } from '@/lib/infographic/constants';
// import { fileToDataURL } from '@/lib/infographic/export';
// import { Color, Icon, Section } from './ui';
// import type { PanelProps } from './interfaces';

// function DeviceIcon() {
//   return (
//     <svg className="size-3.5 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <rect x="6" y="2" width="12" height="20" rx="2.5" />
//       <line x1="11" y1="18" x2="13" y2="18" />
//     </svg>
//   );
// }

// function ChevronIcon({ open }: Readonly<{ open: boolean }>) {
//   return (
//     <svg
//       className={'size-[18px] shrink-0 text-white transition-transform duration-150 ' + (open ? 'rotate-180' : '')}
//       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
//     >
//       <polyline points="6 9 12 15 18 9" />
//     </svg>
//   );
// }

// const noSpin =
//   '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

// /** Page size + background settings. Used in the left "Page" tab and in the right panel when nothing is selected. */
// export default function PagePanel({ api, doc }: Readonly<PanelProps>) {
//   const [w, setW] = useState(doc.width), [h, setH] = useState(doc.height);
//   const [open, setOpen] = useState(false);
//   const selectRef = useRef<HTMLDivElement>(null);
//   const bg = doc.bg || { type: 'solid', c1: '#FFFFFF' };

//   const current = PAGE_SIZES.find((s) => s.w === doc.width && s.h === doc.height);

//   // close dropdown on outside click / Escape
//   useEffect(() => {
//     if (!open) return;
//     const onDown = (e: MouseEvent) => {
//       if (!selectRef.current?.contains(e.target as Node)) setOpen(false);
//     };
//     const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
//     document.addEventListener('mousedown', onDown);
//     document.addEventListener('keydown', onKey);
//     return () => {
//       document.removeEventListener('mousedown', onDown);
//       document.removeEventListener('keydown', onKey);
//     };
//   }, [open]);

//   async function upload(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0]; if (!f) return;
//     try {
//       await api.setBgImage(await fileToDataURL(f));
//     } catch {
//       api.say('Could not read that image.');
//     }
//     e.target.value = '';
//   }

//   return (
//     <div>
//       {/* ── Canvas size ── */}
//       <div className="pb-5 pt-1 text-neutral-100">
//         <h3 className="mb-2 text-lg font-semibold">Canvas Size</h3>
//         <p className="mb-6 text-sm leading-snug text-neutral-400">
//           Choose a preset size or enter custom dimensions.
//         </p>

//         <label id="preset-size-label" className="mb-2.5 block text-[15px]">Preset Size</label>
//         <div className="relative" ref={selectRef}>
//           <button
//             type="button"
//             aria-haspopup="listbox"
//             aria-expanded={open}
//             aria-labelledby="preset-size-label"
//             onClick={() => setOpen((o) => !o)}
//             className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[#141414] px-4 py-3 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
//           >
//             <DeviceIcon />
//             <span className="flex min-w-0 flex-1 flex-col">
//               <span className="text-base font-medium leading-tight">{current ? current.label : 'Custom'}</span>
//               <span className="mt-0.5 text-[11px] text-slate-500">({doc.width} × {doc.height})</span>
//             </span>
//             <ChevronIcon open={open} />
//           </button>

//           {open && (
//             <ul
//               role="listbox"
//               aria-labelledby="preset-size-label"
//               className="absolute inset-x-0 top-[calc(100%+6px)] z-20 m-0 max-h-72 list-none overflow-y-auto rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-1.5 shadow-2xl shadow-black/50"
//             >
//               {PAGE_SIZES.map((s) => {
//                 const on = doc.width === s.w && doc.height === s.h;
//                 return (
//                   <li key={s.label} role="option" aria-selected={on}>
//                     <button
//                       type="button"
//                       onClick={() => { setW(s.w); setH(s.h); api.resizePage(s.w, s.h); setOpen(false); }}
//                       className={
//                         'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white transition-colors hover:bg-neutral-800 ' +
//                         (on ? 'bg-[#1f2b30]' : 'bg-transparent')
//                       }
//                     >
//                       <DeviceIcon />
//                       <span className="flex min-w-0 flex-1 flex-col">
//                         <span className="text-base font-medium leading-tight">{s.label}</span>
//                         <span className="mt-0.5 text-[11px] text-slate-500">({s.w} × {s.h})</span>
//                       </span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         <hr className="my-6 border-0 border-t border-neutral-800" />

//         <h3 className="mb-[18px] text-lg font-semibold">Custom Dimensions</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="page-width" className="mb-2 block text-[15px]">
//               Width <span className="text-xs text-neutral-400">(px)</span>
//             </label>
//             <input
//               id="page-width" type="number" min={1} value={w}
//               onChange={(e) => setW(Number(e.target.value))}
//               className={`box-border w-full rounded-xl border-0 bg-[#141414] px-3.5 py-2.5 text-[15px] text-white focus-visible:outline-2 focus-visible:outline-cyan-600 ${noSpin}`}
//             />
//           </div>
//           <div>
//             <label htmlFor="page-height" className="mb-2 block text-[15px]">
//               Height <span className="text-xs text-neutral-400">(px)</span>
//             </label>
//             <input
//               id="page-height" type="number" min={1} value={h}
//               onChange={(e) => setH(Number(e.target.value))}
//               className={`box-border w-full rounded-xl border-0 bg-[#141414] px-3.5 py-2.5 text-[15px] text-white focus-visible:outline-2 focus-visible:outline-cyan-600 ${noSpin}`}
//             />
//           </div>
//         </div>

//         <div className="mt-7 flex items-center gap-2.5">
//           <button
//             onClick={() => api.resizePage(w, h)}
//             className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-cyan-600 px-[18px] py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
//           >
//             Apply Dimensions
//           </button>
//           {/* <button
//             title="Extend page by 500px"
//             onClick={() => { api.extendPage(500); setH(doc.height + 500); }}
//             className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2.5 text-[15px] font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
//           >
//             <Icon name="plus" /> 500px
//           </button> */}
//         </div>
//       </div>

//       <Section title="Background colour">
//         <div className="ie-bgs">
//           {SOLID_BGS.map((c) => <button key={c} className="ie-sw big" style={{ background: c }} onClick={() => api.setBg({ type: 'solid', c1: c })} title={c} />)}
//         </div>
//         <Color label="Custom colour" value={bg.c1} swatches={false} onChange={(c) => api.setBg({ type: 'solid', c1: c })} />
//       </Section>
//       <Section title="Gradient">
//         <div className="ie-bgs">
//           {GRADIENTS.map(([a, b]) => <button key={a + b} className="ie-sw big" style={{ background: `linear-gradient(${a},${b})` }} onClick={() => api.setBg({ type: 'gradient', c1: a, c2: b })} />)}
//         </div>
//         {bg.type === 'gradient' && (
//           <div className="ie-two">
//             <Color label="Top" value={bg.c1} swatches={false} onChange={(c) => api.setBg({ ...bg, c1: c })} />
//             <Color label="Bottom" value={bg.c2} swatches={false} onChange={(c) => api.setBg({ ...bg, c2: c })} />
//           </div>
//         )}
//       </Section>
//       <Section title="Background image">
//         <label className="ie-btn block"><Icon name="upload" /> Upload image<input type="file" accept="image/*" hidden onChange={upload} /></label>
//         <p className="ie-hint">Or use the Images tab, then press “Use as background” on a photo.</p>
//       </Section>
//     </div>
//   );
// }