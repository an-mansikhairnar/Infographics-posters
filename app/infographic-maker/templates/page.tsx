// 'use client';
// import { useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft, Plus, Search, SearchX, X } from 'lucide-react';
// import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/infographic/templates';
// import { newId } from '@/lib/infographic/storage';
// import { writeDraft } from '@/lib/infographic/draft';
// import type { Template } from '@/lib/infographic/types';
// import Preview from '@/app/component/infographic/Preview';

// const PAGE_STEP = 24; // templates shown per "Show more"
// const DASHBOARD_ROUTE = '/infographic-maker';

// export default function TemplatesGallery() {
//   const router = useRouter();
//   const [q, setQ] = useState('');
//   const [cat, setCat] = useState('All');
//   const [visible, setVisible] = useState(PAGE_STEP);
//   const [error, setError] = useState<string | null>(null);

//   const filtered = useMemo(() => {
//     const term = q.trim().toLowerCase();
//     return TEMPLATES.filter((t) => {
//       const inCat = cat === 'All' || t.category === cat;
//       const inSearch = !term || t.name.toLowerCase().includes(term) || String(t.category ?? '').toLowerCase().includes(term);
//       return inCat && inSearch;
//     });
//   }, [q, cat]);

//   const shown = filtered.slice(0, visible);
//   const hasFilters = q.trim() !== '' || cat !== 'All';

//   function changeSearch(value: string) {
//     setQ(value);
//     setVisible(PAGE_STEP);
//   }
//   function changeCategory(value: string) {
//     setCat(value);
//     setVisible(PAGE_STEP);
//   }
//   function clearFilters() {
//     setQ('');
//     setCat('All');
//     setVisible(PAGE_STEP);
//   }

//   // Same flow as before: the design lives in a local draft until the user clicks Save in the editor.
//   function openTemplate(tpl: Template) {
//     try {
//       const id = newId();
//       writeDraft({
//         id,
//         name: tpl.name,
//         width: tpl.width,
//         height: tpl.height,
//         bg: tpl.bg,
//         templateId: tpl.id,
//         data: null,
//         thumb: null,
//       });
//       router.push(`/infographic-maker/editor/${id}`);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Could not create your design.');
//     }
//   }

//   return (
//     <main className="min-h-screen w-full bg-[#050505] font-sans">
//       {/* ---- Sticky toolbar ---- */}
//       <div className="sticky top-0 z-20 border-b border-white/5 bg-[#050505]/85 backdrop-blur">
//         <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between gap-3">
//             <div className="flex min-w-0 items-center gap-3">
//               {/* <button
//                 type="button"
//                 onClick={() => router.push(DASHBOARD_ROUTE)}
//                 aria-label="Back to dashboard"
//                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1c1c1e] text-zinc-300 transition hover:bg-[#2a2a2d] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
//                 <ArrowLeft size={16} />
//               </button> */}
//               <div className="min-w-0">
//                 <p className="text-[10px] font-medium uppercase tracking-wide text-cyan-500 sm:text-[11px]">Ready made templates</p>
//                 <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">Start polished, finish faster</h1>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => router.push(DASHBOARD_ROUTE)}
//               className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-300 sm:inline-flex">
//               <Plus size={14} /> Start blank
//             </button>
//           </div>

//           {/* Search */}
//           <div className="relative mt-4">
//             <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
//             <input
//               type="search"
//               value={q}
//               onChange={(e) => changeSearch(e.target.value)}
//               placeholder="Search templates"
//               aria-label="Search templates"
//               className="w-full rounded-xl bg-[#1c1c1e] py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-white/5 transition focus:ring-cyan-500/60 [&::-webkit-search-cancel-button]:hidden"
//             />
//             {q && (
//               <button
//                 type="button"
//                 onClick={() => changeSearch('')}
//                 aria-label="Clear search"
//                 className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* Categories (scrolls sideways on small screens) */}
//           <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             <div role="tablist" aria-label="Template categories" className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
//               {TEMPLATE_CATEGORIES.map((c) => (
//                 <button
//                   key={c}
//                   role="tab"
//                   type="button"
//                   aria-selected={cat === c}
//                   onClick={() => changeCategory(c)}
//                   className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition ${
//                     cat === c ? 'bg-cyan-500 font-semibold text-white' : 'bg-[#1c1c1e] text-zinc-400 hover:text-white'
//                   }`}>
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ---- Results ---- */}
//       <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <p className="text-xs text-zinc-500" aria-live="polite">
//             {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
//           </p>
//           {hasFilters && (
//             <button type="button" onClick={clearFilters} className="text-xs text-cyan-400 transition hover:text-cyan-300">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {error && (
//           <p role="alert" className="mt-3 text-sm text-red-400">
//             {error}
//           </p>
//         )}

//         {filtered.length > 0 ? (
//           <>
//             <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
//               {shown.map((t) => (
//                 <button
//                   key={t.id}
//                   type="button"
//                   onClick={() => openTemplate(t)}
//                   className="group flex flex-col overflow-hidden rounded-xl bg-[#1c1c1e] text-left transition hover:ring-2 hover:ring-cyan-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
//                   <div className="flex items-start justify-center overflow-hidden bg-zinc-900">
//                     <Preview tpl={t} width={220} />
//                   </div>
//                   <div className="flex items-center justify-between gap-2 px-3 py-3">
//                     <div className="min-w-0">
//                       <b className="block truncate text-xs font-medium text-white">{t.name}</b>
//                       <span className="block truncate text-[10px] text-zinc-500">
//                         {t.width}×{t.height}
//                       </span>
//                     </div>
//                     <span className="shrink-0 text-[11px] font-medium text-cyan-400 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
//                       Use →
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {filtered.length > visible && (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   type="button"
//                   onClick={() => setVisible((v) => v + PAGE_STEP)}
//                   className="rounded-full border border-white/10 px-6 py-2.5 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-300">
//                   Show more ({filtered.length - visible} left)
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="mt-16 flex flex-col items-center text-center">
//             <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c1c1e] text-zinc-500">
//               <SearchX size={22} />
//             </span>
//             <h2 className="mt-4 text-base font-medium text-white">No templates found</h2>
//             <p className="mt-1 max-w-xs text-xs text-zinc-500">Try a different keyword or category, or start from a blank canvas.</p>
//             <div className="mt-5 flex gap-2">
//               <button
//                 type="button"
//                 onClick={clearFilters}
//                 className="rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-400">
//                 Clear filters
//               </button>
//               <button
//                 type="button"
//                 onClick={() => router.push(DASHBOARD_ROUTE)}
//                 className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-300">
//                 Start blank
//               </button>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, SearchX, X } from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/infographic/templates';
import { newId } from '@/lib/infographic/storage';
import { writeDraft } from '@/lib/infographic/draft';
import type { Template } from '@/lib/infographic/types';
import Preview from '@/app/component/infographic/Preview';

const PAGE_STEP = 24; // templates shown per "Show more"
const DASHBOARD_ROUTE = '/infographic-maker/dashboard';

/**
 * Fixed-ratio frame. The template fills the frame's width and is aligned to the top,
 * so it stays large and readable; anything taller than the frame fades out at the bottom.
 */
function TemplateThumb({ tpl }: { tpl: Template }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameW, setFrameW] = useState(0);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrameW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const PAD = 12;
  const previewWidth = Math.max(Math.floor(frameW - PAD * 2), 0);

  return (
    <div ref={frameRef} className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
      {previewWidth > 0 && (
        <div
          className="absolute left-1/2 overflow-hidden rounded-[4px] shadow-lg shadow-black/40"
          style={{ width: previewWidth, top: PAD, transform: 'translateX(-50%)' }}>
          <Preview tpl={tpl} width={previewWidth} />
        </div>
      )}
      {/* soft fade where the template continues below the frame */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent" />
    </div>
  );
}

export default function TemplatesGallery() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [visible, setVisible] = useState(PAGE_STEP);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const inCat = cat === 'All' || t.category === cat;
      const inSearch =
        !term ||
        t.name.toLowerCase().includes(term) ||
        String(t.category ?? '')
          .toLowerCase()
          .includes(term);
      return inCat && inSearch;
    });
  }, [q, cat]);

  const shown = filtered.slice(0, visible);
  const hasFilters = q.trim() !== '' || cat !== 'All';

  function changeSearch(value: string) {
    setQ(value);
    setVisible(PAGE_STEP);
  }
  function changeCategory(value: string) {
    setCat(value);
    setVisible(PAGE_STEP);
  }
  function clearFilters() {
    setQ('');
    setCat('All');
    setVisible(PAGE_STEP);
  }

  // Same flow as before: the design lives in a local draft until the user clicks Save in the editor.
  function openTemplate(tpl: Template) {
    try {
      const id = newId();
      writeDraft({
        id,
        name: tpl.name,
        width: tpl.width,
        height: tpl.height,
        bg: tpl.bg,
        templateId: tpl.id,
        data: null,
        thumb: null,
      });
      router.push(`/infographic-maker/editor/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your design.');
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] font-sans">
      {/* ---- Sticky toolbar ---- */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/85 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {/* <button
                type="button"
                onClick={() => router.push(DASHBOARD_ROUTE)}
                aria-label="Back to dashboard"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1c1c1e] text-zinc-300 transition hover:bg-[#2a2a2d] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
                <ArrowLeft size={16} />
              </button> */}
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide inter-text text-[#0092b8] sm:text-[13px]">
                  Ready made templates
                </p>
                <h1 className="truncate text-xl font-semibold text-white inter-text sm:text-[28px]">Start polished, finish faster</h1>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search templates"
              aria-label="Search templates"
              className="w-full rounded-xl bg-[#1c1c1e] py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none border-0 shadow-none ring-0 transition focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                onClick={() => changeSearch('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories (scrolls sideways on small screens) */}
          <div className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Template categories" className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
              {TEMPLATE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  type="button"
                  aria-selected={cat === c}
                  onClick={() => changeCategory(c)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition ${
                    cat === c ? 'bg-[#0092b8] font-semibold text-white' : 'bg-[#1c1c1e] text-zinc-400 hover:text-white'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Results ---- */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
          </p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="text-xs text-[#0092b8] transition inter-text hover:text-cyan-300">
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {filtered.length > 0 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {shown.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => openTemplate(t)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-[#1c1c1e] text-left transition hover:ring-2 hover:ring-cyan-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
                  <TemplateThumb tpl={t} />
                  <div className="flex items-center justify-between gap-2 px-3 py-3">
                    <div className="min-w-0">
                      <b className="block truncate text-xs font-medium inter-text text-white">{t.name}</b>
                      <span className="block truncate text-[10px] inter-text text-zinc-500">
                        {t.width}×{t.height}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-cyan-400 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                      Use →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length > visible && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_STEP)}
                  className="rounded-full inter-text border border-white/10 px-6 py-2.5 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-300">
                  Show more ({filtered.length - visible} left)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c1c1e] text-zinc-500">
              <SearchX size={22} />
            </span>
            <h2 className="mt-4 text-base font-medium inter-text text-white">No templates found</h2>
            <p className="mt-1 max-w-xs text-xs inter-text text-zinc-500">
              Try a different keyword or category, or start from a blank canvas.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full bg-[#0092b8] inter-text px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-400">
                Clear filters
              </button>
              <button
                type="button"
                onClick={() => router.push(DASHBOARD_ROUTE, { scroll: true })}
                className="rounded-full inter-text border border-white/10 px-5 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-300">
                Start blank
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
