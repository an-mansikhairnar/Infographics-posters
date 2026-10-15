'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/infographic/templates';
import { PAGE_SIZES } from '@/lib/infographic/constants';
import { deleteDesign, duplicateDesign, listDesigns, newId, saveDesign } from '@/lib/infographic/storage';
import type { Background, DesignRecord, Template } from '@/lib/infographic/types';
import Preview from './Preview';
import { Icon } from './ui';
import { Sparkles } from 'lucide-react';
import {  ThemeKey, compileBackendToTemplate } from '@/lib/infographic/aiCompiler';
import AiInfographicModal from './AiGenerateModal';
export default function Gallery() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const [designs, setDesigns] = useState<DesignRecord[]>([]);
  const [cat, setCat] = useState('All');
  const [size, setSize] = useState(PAGE_SIZES[1]);
  const [custom, setCustom] = useState({ w: '800', h: '2000' });
  const [useCustom, setUseCustom] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [busyDesignId, setBusyDesignId] = useState<string | null>(null);
    const [showAiModal, setShowAiModal] = useState(false);
      const [aiPrompt, setAiPrompt] = useState('');
      const [aiTheme, setAiTheme] = useState<ThemeKey>('editorialGold');
      const [aiLoading, setAiLoading] = useState(false);
      const [aiError, setAiError] = useState<string | null>(null);

      const SUGGESTIONS = [
        '5 Morning Habits for High Productivity and Focus',
        'Remote Work vs Office Work: Pros, Cons and Stats',
        'Global Smartphone Market Share & Trends this Year',
        'Step-by-Step Guide to Launching a Tech Startup',
      ];

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
    return () => { cancelled = true; };
  }, [userId]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login?callbackUrl=%2Finfographic-maker');
  }, [router, status]);

  const open = (id: string) => router.push(`/infographic-maker/editor/${id}`);

  async function create(tpl: Template | null) {
    if (!userId) return;
    try {
      const id = newId();
      const blankBackground: Background = { type: 'solid', c1: '#FFFFFF' };
      const base = tpl
        ? { name: tpl.name, width: tpl.width, height: tpl.height, bg: tpl.bg, templateId: tpl.id }
        : { name: 'Untitled infographic', ...(useCustom ? { width: Number(custom.w) || 800, height: Number(custom.h) || 2000 } : { width: size.w, height: size.h }), bg: blankBackground, templateId: null };
      await saveDesign({ id, ...base, data: null, thumb: null });
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

            const saved = await saveDesign({
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

            setDesigns((current) => [saved, ...current.filter((design) => design.id !== saved.id)]);
            setShowAiModal(false);
            open(id);
          } catch (err: unknown) {
            setAiError((err as Error).message || 'Something went wrong. Please try again.');
          } finally {
            setAiLoading(false);
          }
        }

  const templates = useMemo(() => TEMPLATES.filter((t) => cat === 'All' || t.category === cat), [cat]);

  if (status === 'loading') {
    return <div className="ie-boot">Loading your designs…</div>;
  }
  if (!userId) return <div className="ie-boot">Redirecting to sign in…</div>;

  return (
    <div className="ie-gallery">
      {/* <header className="ie-g-head">
        <div className="ie-logo"><Icon name="logo" size={22} /> Infographic Studio</div>
        <input className="ie-g-search" placeholder="Search templates" value={q} onChange={(e) => setQ(e.target.value)} />
      </header> */}

      <section className="ie-hero">
        <div>
          <h1>Design an infographic that explains itself</h1>
          {/* <p>Choose your layout, pick a template, or start completely from scratch. Build self-explanatory infographics exactly how you want.</p> */}
          <p>Choose your layout, pick a template, or start completely from scratch. Build self-explanatory infographics exactly how you want.</p>
        </div>
        <div className="ie-blank">
          <h3>Blank design</h3>
          <div className="ie-sizes">
            {PAGE_SIZES.map((s) => (
              <button key={s.label} className={'ie-chip' + (!useCustom && size === s ? ' on' : '')} onClick={() => { setUseCustom(false); setSize(s); }}>
                {s.label} <small>{s.w}×{s.h}</small>
              </button>
            ))}
            <button className={'ie-chip' + (useCustom ? ' on' : '')} onClick={() => setUseCustom(true)}>Custom</button>
          </div>
          {useCustom && (
            <div className="ie-custom">
              <input type="number" value={custom.w} onChange={(e) => setCustom({ ...custom, w: e.target.value })} />{' × '}
              <input type="number" value={custom.h} onChange={(e) => setCustom({ ...custom, h: e.target.value })} />{' px'}
            </div>
          )}
          {/* <button className="ie-btn primary" onClick={() => create(null)}><Icon name="plus" /> Create blank</button> */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button className="ie-btn" onClick={() => create(null)}>
            <Icon name="plus" /> Design Manually
          </button>
          <button
            className="ie-btn primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowAiModal(true)}
          >
            <Sparkles size={16} /> Design with AI
          </button>
        </div>
        </div>
      </section>

      <section className="ie-block">
        <div className="ie-block-head">
          <h2>Templates</h2>
          <div className="ie-cats">{TEMPLATE_CATEGORIES.map((c) => <button key={c} className={'ie-chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
        </div>
        <div className="ie-grid">
          {templates.map((t) => (
            <button key={t.id} className="ie-card" onClick={() => create(t)}>
              <div className="ie-card-img"><Preview tpl={t} width={220} /></div>
              <div className="ie-card-meta"><b>{t.name}</b><span>{t.width}×{t.height}</span></div>
            </button>
          ))}
          {!templates.length && <p className="ie-empty">No templates match your search.</p>}
        </div>
      </section>

      <section className="ie-block">
        <div className="ie-block-head"><h2>Your designs</h2></div>
        {galleryError && <p className="ie-empty" role="alert">{galleryError}</p>}
        {!designs.length && !galleryError && <p className="ie-empty">Nothing here yet. Pick a template or create a blank design to get started.</p>}
        <div className="ie-grid">
          {designs.map((d) => (
            <div key={d.id} className="ie-card static">
              <button className="ie-card-img" onClick={() => open(d.id)}>
                {d.thumb ? <Image src={d.thumb} alt={d.name} width={d.width} height={d.height} unoptimized /> : <div className="ie-noimg">Not edited yet</div>}
              </button>
              <div className="ie-card-meta">
                <div><b>{d.name}</b><span>{d.width}×{d.height} · {new Date(d.updatedAt).toLocaleDateString()}</span></div>
                <div className="ie-row">
                  <button className="ie-ibtn" title="Duplicate" aria-label={`Copy ${d.name}`} disabled={busyDesignId !== null} onClick={() => void duplicate(d.id)}><Icon name="copy" /></button>
                  <button className="ie-ibtn" title="Delete" aria-label={`Delete ${d.name}`} disabled={busyDesignId !== null} onClick={() => void remove(d.id, d.name)}><Icon name="trash" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AiInfographicModal
        open={showAiModal}
        onClose={() => setShowAiModal(false)}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        error={aiError}
        loading={aiLoading}
        onGenerate={generateWithAi}
        suggestions={SUGGESTIONS}
      />
    </div>
  );
}
