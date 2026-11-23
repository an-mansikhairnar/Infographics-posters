'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AlertCircle, ArrowUp, Check, Copy, LayoutGrid, Loader2, Move, Plus, Sparkles, Trash2 } from 'lucide-react';
import { PAGE_SIZES } from '@/lib/infographic/constants';
import { deleteDesign, duplicateDesign, listDesigns, newId } from '@/lib/infographic/storage';
import { writeDraft } from '@/lib/infographic/draft';
import { compileBackendToTemplate } from '@/lib/infographic/aiCompiler';
import type { Background, DesignRecord } from '@/lib/infographic/types';
import ArrowRight from '@/public/assets/ArrowRight.svg';

/* ---------- Config ---------- */
const SUGGESTIONS = [
  '5 Morning Habits for High Productivity and Focus',
  'Remote Work vs Office Work: Pros, Cons and Stats',
  'Global Smartphone Market Share & Trends this Year',
  'Step-by-Step Guide to Launching a Tech Startup',
];

type TabId = 'ai' | 'blank' | 'template';

const TABS = [
  { id: 'ai', title: 'Generate with AI', subtitle: 'Describe what you need', Icon: Sparkles },
  { id: 'blank', title: 'Start blank', subtitle: 'Choose a canvas size', Icon: Plus },
  { id: 'template', title: 'Use a template', subtitle: 'Customize a ready design', Icon: LayoutGrid },
] as const;

function shapeClassFor(w: number, h: number) {
  const r = w / h;
  if (r > 1.2) return 'h-2.5 w-4'; // landscape
  if (r >= 0.9) return 'h-3 w-3'; // square
  if (r < 0.6) return 'h-4 w-2'; // tall (story)
  return 'h-4 w-2.5'; // portrait
}

/* ---------- Small shared pieces ---------- */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] inter-text font-medium uppercase text-[#0092B8] sm:text-[13px]">{children}</p>
);
const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-2 text-xl inter-text font-semibold text-white sm:text-[28px]">{children}</h2>
);
const PrimaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="inline-flex items-center gap-2 rounded-full bg-[#16C4E5] inter-text px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]"
    {...props}>
    {children}
  </button>
);

/* ---------- Tab bar ---------- */
// function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
//   return (
//     <div role="tablist" className="grid grid-cols-3 gap-1 bg-[#262626] p-2 sm:p-3">
//       {TABS.map(({ id, title, subtitle, Icon }) => {
//         const isActive = active === id;
//         return (
//           <button
//             key={id}
//             role="tab"
//             type="button"
//             aria-selected={isActive}
//             onClick={() => onChange(id)}
//             className="flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-center transition hover:bg-white/5 sm:flex-row sm:gap-3 sm:px-3 sm:text-left">
//             <span
//               className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
//                 isActive ? 'bg-[#0092B8] text-white' : 'bg-[#171717] text-[#617182]'
//               }`}>
//               <Icon size={16} />
//             </span>
//             <span className="min-w-0">
//               <span
//                 className={`block text-[11px] inter-text font-semibold leading-tight sm:text-[15px] ${isActive ? 'text-[#0092B8]' : 'text-[#FFFFFF]'}`}>
//                 {title}
//               </span>
//               <span
//                 className={`mt-0.5 hidden text-[12px] font-normal inter-text sm:block ${isActive ? 'text-[#0092B8]' : 'text-[#8C9CAE]'}`}>
//                 {subtitle}
//               </span>
//             </span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }
function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <div role="tablist" className="grid h-full grid-cols-3 items-stretch gap-1 bg-[#262626] p-2 sm:gap-2 sm:px-4 sm:py-3">
      {TABS.map(({ id, title, subtitle, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className="flex h-full min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-center transition hover:bg-white/5 sm:flex-row sm:justify-start sm:gap-3 sm:px-3 sm:text-left">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
                isActive ? 'bg-[#0092B8] text-white' : 'bg-[#171717] text-[#617182]'
              }`}>
              <Icon size={16} />
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate text-[11px] inter-text font-semibold leading-tight sm:text-[15px] ${
                  isActive ? 'text-[#0092B8]' : 'text-[#FFFFFF]'
                }`}>
                {title}
              </span>
              <span
                className={`mt-0.5 hidden truncate text-[12px] font-normal inter-text sm:block ${
                  isActive ? 'text-[#0092B8]' : 'text-[#8C9CAE]'
                }`}>
                {subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
/* ---------- AI panel (functionality from AiGenerateModal, now inline) ---------- */
interface AIPanelProps {
  prompt: string;
  setPrompt: (v: string) => void;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

function AIPanel({ prompt, setPrompt, loading, error, onGenerate }: AIPanelProps) {
  const canSubmit = !loading && prompt.trim().length > 0;

  return (
    <div>
      <Eyebrow>AI infographic maker</Eyebrow>
      <Heading>What should we visualize?</Heading>

      <div className="relative mt-5 rounded-xl bg-[#0A0A0A]">
        <textarea
          value={prompt}
          disabled={loading}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (canSubmit) onGenerate();
            }
          }}
          rows={3}
          placeholder="Create a clear infographic about..."
          style={{
            outline: 'none',
            boxShadow: 'none',
            border: 'none',
            WebkitAppearance: 'none',
          }}
          className="block w-full resize-none rounded-xl inter-text bg-transparent px-4 py-4 pr-14 text-[18px] text-white placeholder-[#0A0A0A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canSubmit}
          aria-label="Generate infographic"
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0092B8] text-white transition hover:bg-cyan-500 disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
        </button>
      </div>

      {loading && <p className="mt-3 text-xs text-zinc-400">Generating your infographic…</p>}

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
          <AlertCircle size={15} className="mt-px shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick ideas */}
      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8C9CAE]">Quick ideas</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => setPrompt(item)}
              className="rounded-lg border border-white/10 bg-[#0b0b0c] px-2.5 py-1 text-left text-[11px] text-[#8C9CAE] transition hover:border-[#0092b8] hover:text-[#0092b8] disabled:opacity-50">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Blank panel ---------- */
interface BlankPanelProps {
  selected: string; // a PAGE_SIZES label, or 'custom'
  setSelected: (v: string) => void;
  custom: { w: string; h: string };
  setCustom: (v: { w: string; h: string }) => void;
  onDesignManually: () => void;
}

function BlankPanel({ selected, setSelected, custom, setCustom, onDesignManually }: BlankPanelProps) {
  const isCustom = selected === 'custom';

  return (
    <div>
      <Eyebrow>Start with a predefined size or set your own custom size</Eyebrow>
      <Heading>Choose your canvas</Heading>

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {PAGE_SIZES.map((s) => {
          const active = selected === s.label;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => setSelected(s.label)}
              aria-pressed={active}
              className={`relative flex flex-col items-start gap-2 rounded-lg border bg-[#0A0A0A] p-3 text-left transition ${
                active ? 'border-[#05B9DF]' : 'border-[#202020] hover:border-white/15'
              }`}>
              <span className={`rounded-[2px] border border-cyan-500 ${shapeClassFor(s.w, s.h)}`} />
              <span>
                <span className="block text-[15px] font-medium inter-text text-[#D4D4D4]">{s.label}</span>
                <span className="mt-0.5 block font-normal inter-text text-[11px] text-[#8C9CB0]">
                  {s.w} × {s.h}
                </span>
              </span>
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#05B9DF]">
                  <Check size={12} strokeWidth={3} color="#000000" className="!text-black" />
                </span>
              )}
            </button>
          );
        })}

        {/* Custom */}
        <button
          type="button"
          onClick={() => setSelected('custom')}
          aria-pressed={isCustom}
          className={`relative flex flex-col items-start gap-2 rounded-lg border bg-[#0A0A0A] p-3 text-left transition ${
            isCustom ? 'border-[#05B9DF]' : 'border-[#202020] hover:border-white/15'
          }`}>
          <Move size={16} className="text-[#16C4E5]" />
          <span>
            <span className="block text-[15px] inter-text font-medium text-[#D4D4D4]">Custom</span>
            <span className="mt-0.5 block font-normal text-[11px] inter-text text-[#8C9CB0]">Set your own width &amp; height</span>
          </span>
        </button>
      </div>

      {isCustom && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#8C9CB0]">
          <label className="flex items-center gap-2">
            Width
            <input
              type="number"
              min={100}
              max={5000}
              value={custom.w}
              onChange={(e) => setCustom({ ...custom, w: e.target.value })}
              className="w-24 rounded-md bg-[#0A0A0A] px-2 py-1.5 text-white !outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none"
              // className="w-24 rounded-md bg-[#0A0A0A] px-2 py-1.5 text-white outline-none focus:ring-1 focus:ring-[#05B9DF]"
            />
          </label>
          <label className="flex items-center gap-2">
            Height
            <input
              type="number"
              min={100}
              max={5000}
              value={custom.h}
              onChange={(e) => setCustom({ ...custom, h: e.target.value })}
              className="w-24 rounded-md bg-[#0A0A0A] px-2 py-1.5 text-white !outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none"
              // className="w-24 rounded-md bg-[#0A0A0A] px-2 py-1.5 text-white outline-none focus:ring-1 focus:ring-[#05B9DF]"
            />
          </label>
          <span>px</span>
        </div>
      )}

      <div className="mt-6">
        <PrimaryButton onClick={onDesignManually}>
          Design manually <Image src={ArrowRight} alt="" aria-hidden="true" className="h-[12px] w-[12px] sm:h-[16px] sm:w-[16px]" />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Template panel ---------- */
function TemplatePanel({ onBrowseTemplates }: { onBrowseTemplates: () => void }) {
  return (
    <div>
      <Eyebrow>Ready made templates</Eyebrow>
      <Heading>Start polished, finish faster</Heading>
      <p className="mt-3 max-w-md inter-text font-normal text-xs text-[#8C9CAE] sm:text-[15px]">
        Pick a professionally designed layout and make every element yours.
      </p>
      <div className="mt-6">
        <PrimaryButton onClick={onBrowseTemplates}>
          Browse templates <Image src={ArrowRight} alt="" aria-hidden="true" className="h-[12px] w-[12px] sm:h-[16px] sm:w-[16px]" />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Screen ---------- */
export default function CreateDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // UI
  const [tab, setTab] = useState<TabId>('ai');

  // Designs
  const [designs, setDesigns] = useState<DesignRecord[]>([]);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [busyDesignId, setBusyDesignId] = useState<string | null>(null);

  // Blank canvas
  const [selectedSize, setSelectedSize] = useState<string>(PAGE_SIZES[1].label);
  const [custom, setCustom] = useState({ w: '800', h: '2000' });
  const useCustom = selectedSize === 'custom';

  // AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void listDesigns()
      .then((nextDesigns) => {
        if (cancelled) return;
        setDesigns(nextDesigns);
        setGalleryError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setGalleryError(error instanceof Error ? error.message : 'Could not load your designs.');
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const open = (id: string) => router.push(`/infographic-maker/editor/${id}`);
  const browseTemplates = () => router.push('/infographic-maker/templates');

  // New designs live only in a local draft until the user clicks Save in the editor.
  async function createBlank() {
    try {
      const id = newId();
      const blankBackground: Background = { type: 'solid', c1: '#FFFFFF' };
      const size = PAGE_SIZES.find((s) => s.label === selectedSize) ?? PAGE_SIZES[1];
      const base = {
        name: 'Untitled infographic',
        ...(useCustom ? { width: Number(custom.w) || 800, height: Number(custom.h) || 2000 } : { width: size.w, height: size.h }),
        bg: blankBackground,
        templateId: null,
      };
      writeDraft({ id, ...base, data: null, thumb: null });
      open(id);
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Could not create your design.');
    }
  }

  async function duplicate(id: string) {
    setBusyDesignId(id);
    setGalleryError(null);
    try {
      const copy = await duplicateDesign(id);
      if (!copy) throw new Error('This design could not be found.');
      setDesigns((current) => [copy, ...current]);
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Could not copy this design.');
    } finally {
      setBusyDesignId(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setBusyDesignId(id);
    setGalleryError(null);
    try {
      await deleteDesign(id);
      setDesigns((current) => current.filter((design) => design.id !== id));
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Could not delete this design.');
    } finally {
      setBusyDesignId(null);
    }
  }

  async function generateWithAi() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiPrompt }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate infographic');
      }

      const json = await res.json();
      if (!json.data) throw new Error('No data received from AI');

      const id = newId();
      const compiled = compileBackendToTemplate(json.data, id, json.data.theme);

      writeDraft({
        id,
        name: compiled.name,
        width: compiled.width,
        height: compiled.height,
        bg: compiled.bg,
        templateId: null,
        objects: compiled.objects,
        data: null,
        thumb: null,
      });

      open(id);
    } catch (err: unknown) {
      setAiError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  if (status === 'loading') {
    return <div className="ie-boot">Loading your designs…</div>;
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-16 pt-10 font-sans sm:px-6 sm:pt-14 lg:px-8">
      {/* ---- Create panel ---- */}
      <div className="mx-auto w-full max-w-[878px] overflow-hidden rounded-3xl border border-white/5 bg-[#1c1c1e]">
        {/* Tab bar */}
        {/* <div className="w-full sm:h-[104px]">
          <TabBar active={tab} onChange={setTab} />
        </div> */}

        {/* Tab bar */}
        <div className="w-full bg-[#262626] sm:h-[104px]">
          <TabBar active={tab} onChange={setTab} />
        </div>

        {/* Content section */}
        <div role="tabpanel" className="w-full bg-[#171717] px-5 py-[30px] sm:px-6">
          {tab === 'ai' && (
            <AIPanel prompt={aiPrompt} setPrompt={setAiPrompt} loading={aiLoading} error={aiError} onGenerate={generateWithAi} />
          )}

          {tab === 'blank' && (
            <BlankPanel
              selected={selectedSize}
              setSelected={setSelectedSize}
              custom={custom}
              setCustom={setCustom}
              onDesignManually={createBlank}
            />
          )}

          {tab === 'template' && <TemplatePanel onBrowseTemplates={browseTemplates} />}
        </div>
      </div>

      {/* ---- Your designs ---- */}
      {/* Drop this inside your component's return, replacing the old <section>.
    Needs: import Image from 'next/image'; import { Copy, Trash2 } from 'lucide-react'; */}
      <section className="mx-auto mt-12 w-full max-w-[1486px] sm:mt-16">
        <h2 className="inter-text text-lg font-semibold text-white sm:text-[28px]">Your designs</h2>

        {galleryError && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {galleryError}
          </p>
        )}

        {!userId && <p className="mt-4 text-sm text-zinc-500">Sign in and save a design to see it here.</p>}

        {userId && !designs.length && !galleryError && (
          <p className="mt-4 text-sm text-zinc-500">Nothing here yet. Pick a template or create a blank design, then click Save.</p>
        )}

        {/* 278 x 350 cards, 24px gap at full width; columns collapse on smaller screens */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {designs.map((d) => (
            <div
              key={d.id}
              className="group relative isolate aspect-[278/350] w-full transform-gpu overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10">
              {/* Thumbnail (opens design) */}
              <button
                type="button"
                onClick={() => open(d.id)}
                aria-label={`Open ${d.name}`}
                className="absolute inset-0 block h-full w-full">
                {d.thumb ? (
                  <Image
                    src={d.thumb}
                    alt={d.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 278px"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs text-zinc-500">Not edited yet</span>
                )}
              </button>

              {/* Top-right actions */}
              <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <button
                  type="button"
                  title="Duplicate"
                  aria-label={`Copy ${d.name}`}
                  disabled={busyDesignId !== null}
                  onClick={() => void duplicate(d.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-black disabled:opacity-50">
                  <Copy size={16} />
                </button>

                <button
                  type="button"
                  title="Delete"
                  aria-label={`Delete ${d.name}`}
                  disabled={busyDesignId !== null}
                  onClick={() => void remove(d.id, d.name)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-red-500 disabled:opacity-50">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Bottom dark fade + text: plain gradient, no blur, no mask (avoids the white edge line) */}
              <div className="pointer-events-none absolute -bottom-px -left-px -right-px z-10 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative flex flex-col gap-1 px-4 pb-4 pt-16">
                  <span className="self-end text-xs text-white/80">
                    {d.width} × {d.height}
                  </span>
                  <b className="truncate text-base font-semibold text-white">{d.name}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
