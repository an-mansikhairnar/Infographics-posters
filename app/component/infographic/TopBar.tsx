// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { Icon, IconBtn } from './ui';
// import type { EditorApi, EditorDocument, EditorStatus } from './interfaces';

// type TopBarProps = {
//   api: EditorApi;
//   doc: EditorDocument;
//   zoom: number;
//   status: EditorStatus;
//   flags: { undo: boolean; redo: boolean };
//   handleListClick: () => void;
//   isPublishing: boolean;
// };

// const EXPORTS = [
//   ['png', 'PNG · standard', 'Original size'],
//   // ['png2', 'PNG · high resolution', '2× size, best for print'],
//   ['jpg', 'JPG', '2× size, smaller file'],
//   // ['pdf', 'PDF · single page', 'One long page'], ['pdfa4', 'PDF · A4 pages', 'Long design split across pages'],
//   // ['svg', 'SVG', 'Vector, editable elsewhere'], ['json', 'Design file (JSON)', 'Backup or reuse as a template'],
// ];

// export default function TopBar({ api, doc, zoom, status, flags ,handleListClick,isPublishing}: Readonly<TopBarProps>) {
//   const [menu, setMenu] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const h = (e: MouseEvent) => {
//       if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) setMenu(false);
//     };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);
//   // const label: Record<EditorStatus, string> = { saved: 'All changes saved', saving: 'Saving…', dirty: 'Unsaved changes', error: 'Not saved' };
//   const label: Record<EditorStatus, string> = {
//     saved: '✓ All changes saved',
//     saving: 'Saving your changes…',
//     dirty: 'You have unsaved changes',
//     error: 'Unable to save changes',
//   };
//   return (
//     <header className="ie-top">
//       <button className="ie-back" onClick={() => api.leave()}>
//         <Icon name="back" /> Designs
//       </button>
//       <input className="ie-name" value={doc.name} onChange={(e) => api.setName(e.target.value)} aria-label="Design name" />
//       <span className={'ie-status ' + status}>{label[status]}</span>
//       <div className="ie-spacer" />
//       <IconBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!flags.undo} onClick={() => api.undo()} />
//       <IconBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!flags.redo} onClick={() => api.redo()} />
//       <div className="ie-sep" />
//       <IconBtn icon="minus" title="Zoom out" onClick={() => api.setZoom(zoom - 0.1)} />
//       <button className="ie-zoom" title="Fit to width" onClick={() => api.fit()}>
//         {Math.round(zoom * 100)}%
//       </button>
//       <IconBtn icon="plus" title="Zoom in" onClick={() => api.setZoom(zoom + 0.1)} />
//       <div className="ie-sep" />
//       <button className="ie-btn" onClick={() => api.extendPage(500)} title="Make the page 500px taller">
//         <Icon name="plus" /> Add 500px height
//       </button>
//       <button
//         className="ie-btn"
//         onClick={() => {
//           void api.saveNow();
//           api.say('Saved');
//         }}>
//         <Icon name="save" /> Save
//       </button>
//       <div className="ie-menu" ref={ref}>
//         <button className="ie-btn primary" onClick={() => setMenu(!menu)}>
//           <Icon name="download" /> Export
//         </button>
//         {menu && (
//           <div className="ie-pop">
//             {EXPORTS.map(([k, t, d]) => (
//               <button
//                 key={k}
//                 onClick={() => {
//                   setMenu(false);
//                   void api.exportAs(k);
//                 }}>
//                 <b>{t}</b>
//                 <span>{d}</span>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <button className="ie-btn" onClick={handleListClick} disabled={isPublishing}>
//         {isPublishing ? 'Preparing design…' : 'Submit design'}
//       </button>
//     </header>
//   );
// }

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
  handleListClick: () => void;
  isPublishing: boolean;
};

const EXPORTS = [
  ['png', 'PNG · standard', 'Original size'],
  // ['png2', 'PNG · high resolution', '2× size, best for print'],
  ['jpg', 'JPG', '2× size, smaller file'],
  // ['pdf', 'PDF · single page', 'One long page'], ['pdfa4', 'PDF · A4 pages', 'Long design split across pages'],
  // ['svg', 'SVG', 'Vector, editable elsewhere'], ['json', 'Design file (JSON)', 'Backup or reuse as a template'],
];

const PUBLISH_STEPS = [
  ['Pay the one-time $30 fee', 'Secure checkout with PayPal.'],
  ['Add your details', 'Title, category, description and email.'],
  ['We review and publish', 'Your infographic goes live within 2 business days.'],
];

const PUBLISH_BENEFITS = ['SEO-friendly author link', 'Traffic to your site', 'Brand promotion'];

const PUBLISH_RULES = [
  'No porn, gambling, nudity or obscene images',
  'Use a short, creative title',
  'Write a description of about 100 words that explains the idea',
];

export default function TopBar({ api, doc, zoom, status, flags, handleListClick, isPublishing }: Readonly<TopBarProps>) {
  const [menu, setMenu] = useState(false);
  const [publishMenu, setPublishMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (ref.current && !ref.current.contains(e.target)) setMenu(false);
      if (publishRef.current && !publishRef.current.contains(e.target)) setPublishMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setPublishMenu(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const label: Record<EditorStatus, string> = {
    saved: '✓ All changes saved',
    saving: 'Saving your changes…',
    dirty: 'You have unsaved changes',
    error: 'Unable to save changes',
  };

  const continueToSubmit = () => {
    setPublishMenu(false);
    handleListClick();
  };

  return (
    <header className="ie-top">
      <button className="ie-back" onClick={() => api.leave()}>
        <Icon name="back" /> Designs
      </button>
      <input className="ie-name" value={doc.name} onChange={(e) => api.setName(e.target.value)} aria-label="Design name" />
      <span className={'ie-status ' + status}>{label[status]}</span>
      <div className="ie-spacer" />
      <IconBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!flags.undo} onClick={() => api.undo()} />
      <IconBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!flags.redo} onClick={() => api.redo()} />
      <div className="ie-sep" />
      <IconBtn icon="minus" title="Zoom out" onClick={() => api.setZoom(zoom - 0.1)} />
      <button className="ie-zoom" title="Fit to width" onClick={() => api.fit()}>
        {Math.round(zoom * 100)}%
      </button>
      <IconBtn icon="plus" title="Zoom in" onClick={() => api.setZoom(zoom + 0.1)} />
      <div className="ie-sep" />
      <button className="ie-btn" onClick={() => api.extendPage(500)} title="Make the page 500px taller">
        <Icon name="plus" /> Add 500px height
      </button>
      <button
        className="ie-btn"
        onClick={() => {
          void api.saveNow();
          api.say('Saved');
        }}>
        <Icon name="save" /> Save
      </button>

      <div className="ie-menu" ref={ref}>
        <button className="ie-btn" onClick={() => setMenu(!menu)} aria-haspopup="menu" aria-expanded={menu}>
          <Icon name="download" /> Export
        </button>
        {menu && (
          <div className="ie-pop">
            {EXPORTS.map(([k, t, d]) => (
              <button
                key={k}
                onClick={() => {
                  setMenu(false);
                  void api.exportAs(k);
                }}>
                <b>{t}</b>
                <span>{d}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Publish: opens a short explainer before sending the user to the submit page */}
      <div className="ie-menu relative" ref={publishRef}>
        <button
          className="ie-btn primary inline-flex items-center gap-2"
          onClick={() => setPublishMenu(!publishMenu)}
          disabled={isPublishing}
          aria-haspopup="dialog"
          aria-expanded={publishMenu}
          title="Submit this design to be published on Infographics Posters">
          {isPublishing ? (
            <>
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white motion-reduce:animate-none"
                aria-hidden="true"
              />
              Preparing your design…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm5.9 7H13a14 14 0 0 0-1.2-4.6A6 6 0 0 1 15.9 9ZM10 4.1c.6.8 1.3 2.4 1.5 4.9h-3C8.7 6.5 9.4 4.9 10 4.1ZM8.2 4.4A14 14 0 0 0 7 9H4.1a6 6 0 0 1 4.1-4.6ZM4.1 11H7a14 14 0 0 0 1.2 4.6A6 6 0 0 1 4.1 11Zm5.9 4.9c-.6-.8-1.3-2.4-1.5-4.9h3c-.2 2.5-.9 4.1-1.5 4.9Zm1.8-.3A14 14 0 0 0 13 11h2.9a6 6 0 0 1-4.1 4.6Z" />
              </svg>
              Publish on site
              <span className="rounded-full bg-white/20 px-2 py-px text-[11px] font-bold">$30</span>
            </>
          )}
        </button>

        {publishMenu && !isPublishing && (
          <div
            role="dialog"
            aria-label="Publish your design"
            className="absolute right-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-24px)] rounded-xl border border-slate-300 bg-white p-4 text-left text-slate-900 shadow-2xl dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
            <h3 className="mb-1 text-[15px] font-bold leading-snug">Publish this design on Infographics Posters</h3>
            <p className="mb-3 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400">
              Turn this design into a live infographic poster. Your current design is attached automatically, so there is nothing to upload.
            </p>

            <ol className="mb-4 space-y-2.5">
              {PUBLISH_STEPS.map(([t, d], i) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-500 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="flex flex-col">
                    <b className="text-[13px]">{t}</b>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{d}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mb-1.5 text-xs font-bold">What you get</div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {PUBLISH_BENEFITS.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {b}
                </span>
              ))}
            </div>

            {/* <div className="mb-1.5 text-xs font-bold">Before you submit</div>
            <ul className="mb-4 list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {PUBLISH_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul> */}

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="ie-btn" onClick={() => setPublishMenu(false)}>
                Keep editing
              </button>
              <button type="button" className="ie-btn primary" onClick={continueToSubmit}>
                Continue to payment
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}