
'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './ui';
import type { EditorApi, EditorDocument, EditorStatus } from './interfaces';

type TopBarProps = {
  api: EditorApi;
  doc: EditorDocument;
  status: EditorStatus;
  handleListClick: () => void;
  isPublishing: boolean;
  checkUserSession: () => boolean;
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

export default function TopBar({ api, doc, status, handleListClick, isPublishing, checkUserSession }: Readonly<TopBarProps>) {
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
    new: 'Not saved yet',
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
      <button className="ie-back inter-text font-semibold" onClick={() => api.leave()}>
        <Icon name="back" /> Back
      </button>
      <input className="ie-name inter-text" value={doc.name} onChange={(e) => api.setName(e.target.value)} aria-label="Design name" />

      <span className={'ie-status ' + status}>{label[status]}</span>
      <div className="ie-spacer" />

      <button
        className="ie-btn primary inter-text font-semibold text-[14px]"
        onClick={() => void api.saveNow()}
        disabled={status === 'saving'}>
        <Icon name="save" /> {status === 'saving' ? 'Saving…' : 'Save'}
      </button>

      <div className="ie-menu" ref={ref}>
        <button
          className="ie-btn inter-text font-semibold text-[14px]"
          onClick={() => {
            const userLoggedIn = checkUserSession();
            if (userLoggedIn) {
              setMenu(!menu);
            }
          }}
          aria-haspopup="menu"
          aria-expanded={menu}>
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
          className="ie-btn primary publish inline-flex inter-text items-center gap-2"
          onClick={() => setPublishMenu(!publishMenu)}
          disabled={isPublishing}
          aria-haspopup="dialog"
          aria-expanded={publishMenu}
          title="Submit this design to be published on Infographics Posters">
          {isPublishing ? (
            <>
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-600/30 border-t-sky-600 motion-reduce:animate-none"
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
              <span className="ie-badge inter-text">$30</span>
            </>
          )}
        </button>

        {publishMenu && !isPublishing && (
          <div
            role="dialog"
            aria-label="Publish your design"
            className="ie-publish absolute right-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-24px)] rounded-2xl p-4 text-left">
            <h3 className="mb-1 text-[15px] font-bold leading-snug text-white">Publish this design on Infographics Posters</h3>
            <p className="mb-3 text-[12.5px] leading-relaxed text-zinc-400">
              Turn this design into a live infographic poster. Your current design is attached automatically, so there is nothing to upload.
            </p>

            <ol className="mb-4 space-y-2.5">
              {PUBLISH_STEPS.map(([t, d], i) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-600 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="flex flex-col">
                    <b className="text-[13px] text-white">{t}</b>
                    <span className="text-xs text-zinc-400">{d}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mb-1.5 text-xs font-bold text-white">What you get</div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {PUBLISH_BENEFITS.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-400">
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
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