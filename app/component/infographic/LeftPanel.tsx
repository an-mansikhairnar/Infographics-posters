'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ICONS } from '@/lib/infographic/icons';
import { CHART_TYPES, sampleData } from '@/lib/infographic/charts';
import { TEMPLATES } from '@/lib/infographic/templates';
import { addAsset, deleteAsset, listAssets, newId } from '@/lib/infographic/storage';
import { fileToDataURL } from '@/lib/infographic/export';
import type { Template } from '@/lib/infographic/types';
import Preview from './Preview';
import PagePanel from './PagePanel';
import { Icon, Section } from './ui';
import type { PanelProps, UploadedAsset } from './interfaces';

const TABS = [['templates', 'template', 'Templates'], ['text', 'text', 'Text'], ['elements', 'shapes', 'Elements'], ['charts', 'chart', 'Charts'], ['images', 'image', 'Images'], ['page', 'page', 'Page']] as const;
type ApiProps = Pick<PanelProps, 'api'>;
const isDarkNeutral = (c:any) => !c || /^#(0f172a|0{3,6}|111|1e293b|171717)$/i.test(c);

const TEXT_PRESETS = [
  { label: 'Heading', text: 'Add a heading', fontSize: 56, fontWeight: '700', fontFamily: 'Poppins', width: 600 },
  { label: 'Subheading', text: 'Add a subheading', fontSize: 34, fontWeight: '700', fontFamily: 'Inter', width: 500 },
  { label: 'Body text', text: 'Add a little bit of body text that explains your point.', fontSize: 20, fontFamily: 'Inter', width: 420, lineHeight: 1.4 },
  { label: 'Caption', text: 'Source or small note', fontSize: 14, fontFamily: 'Inter', fill: '#64748B', width: 260 },
  { label: 'Elegant title', text: 'Elegant title', fontSize: 52, fontFamily: 'Playfair Display', fontWeight: '700', width: 560 },
  { label: 'Bold condensed', text: 'BIG IMPACT', fontSize: 64, fontFamily: 'Bebas Neue', charSpacing: 80, width: 520 },
  { label: 'Handwritten', text: 'Handwritten note', fontSize: 44, fontFamily: 'Caveat', fontWeight: '700', width: 480 },
  { label: 'Script', text: 'Script style', fontSize: 46, fontFamily: 'Pacifico', width: 480, fill: '#EC4899' },
  { label: 'Big number', text: '85%', fontSize: 110, fontFamily: 'Poppins', fontWeight: '700', fill: '#2F5BFF', width: 360, textAlign: 'center' },
];

const SHAPES = [
  { k: 'Rectangle', d: { type: 'rect', width: 240, height: 140 }, svg: <rect x="3" y="6" width="18" height="12" /> },
  { k: 'Rounded', d: { type: 'rect', width: 240, height: 140, rx: 28, ry: 28 }, svg: <rect x="3" y="6" width="18" height="12" rx="4" /> },
  { k: 'Circle', d: { type: 'circle', radius: 70 }, svg: <circle cx="12" cy="12" r="8" /> },
  { k: 'Triangle', d: { type: 'triangle' }, svg: <path d="M12 4l9 16H3z" /> },
  { k: 'Star', d: { type: 'star' }, svg: <path d="M12 3l2.7 6 6.3.6-4.8 4.3 1.5 6.3L12 17l-5.7 3.2 1.5-6.3L3 9.6 9.3 9z" /> },
  { k: 'Divider', d: { type: 'rect', width: 400, height: 4, fill: '#CBD5E1', rx: 2, ry: 2, name: 'divider' }, svg: <rect x="2" y="11" width="20" height="2" /> },
  { k: 'Thick bar', d: { type: 'rect', width: 400, height: 16, fill: '#2F5BFF', rx: 8, ry: 8 }, svg: <rect x="2" y="9" width="20" height="6" rx="3" /> },
  { k: 'Pill', d: { type: 'rect', width: 180, height: 56, rx: 28, ry: 28 }, svg: <rect x="2" y="8" width="20" height="8" rx="4" /> },
];

const t = (text: string, left: number, top: number, width: number, fontSize: number, fill: string, x: Record<string, unknown> = {}) => ({ type: 'text', text, left, top, width, fontSize, fill, fontFamily: 'Poppins', ...x });
const BLOCKS = [
  { k: 'Stat card', d: { type: 'group', name: 'stat card', objects: [{ type: 'rect', left: 0, top: 0, width: 240, height: 150, fill: '#EFF6FF', rx: 18, ry: 18 }, t('72%', 0, 22, 240, 56, '#2F5BFF', { fontWeight: '700', textAlign: 'center' }), t('of people agree', 0, 98, 240, 16, '#475569', { textAlign: 'center', fontFamily: 'Inter' })] } },
  { k: 'Step badge', d: { type: 'group', name: 'step', objects: [{ type: 'circle', left: 0, top: 0, radius: 32, fill: '#2F5BFF' }, t('1', 0, 14, 64, 34, '#FFFFFF', { textAlign: 'center', fontWeight: '700' })] } },
  { k: 'Callout', d: { type: 'group', name: 'callout', objects: [{ type: 'rect', left: 0, top: 0, width: 420, height: 120, fill: '#FEF3C7', rx: 16, ry: 16 }, { type: 'rect', left: 0, top: 0, width: 10, height: 120, fill: '#F59E0B', rx: 5, ry: 5 }, t('Did you know?', 30, 18, 370, 22, '#92400E', { fontWeight: '700' }), t('Add a surprising fact here.', 30, 56, 370, 17, '#78350F', { fontFamily: 'Inter' })] } },
  { k: 'Progress', d: { type: 'group', name: 'progress', objects: [{ type: 'rect', left: 0, top: 0, width: 400, height: 22, fill: '#E2E8F0', rx: 11, ry: 11 }, { type: 'rect', left: 0, top: 0, width: 280, height: 22, fill: '#10B981', rx: 11, ry: 11 }, t('70% complete', 0, 32, 400, 16, '#475569', { fontFamily: 'Inter' })] } },
  { k: 'Quote', d: { type: 'group', name: 'quote', objects: [t('“', 0, -30, 80, 120, '#2F5BFF', { fontFamily: 'Playfair Display', fontWeight: '700' }), t('Good design is as little design as possible.', 0, 60, 420, 30, '#0F172A', { fontFamily: 'Playfair Display', lineHeight: 1.25 }), t('Dieter Rams', 0, 160, 420, 16, '#64748B', { fontFamily: 'Inter' })] } },
];

const CHART_PREVIEW: Record<string, Template> = Object.fromEntries(CHART_TYPES.map((c) => [c.key, {
  id: `chart-${c.key}`, name: c.label, category: 'Charts',
  width: 420, height: 260, bg: { type: 'solid', c1: '#FFFFFF' },
  objects: [{ type: 'chart', chartType: c.key, left: 10, top: 10, width: 400, height: 240, data: sampleData(4) }],
}])) as Record<string, Template>;

export default function LeftPanel({ api, doc, userId }: PanelProps & { userId: string }) {
  const [tab, setTab] = useState('templates');
  return (
    <aside className="ie-left">
      <nav className="ie-rail">
        {TABS.map(([k, icon, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon name={icon} size={20} /><span>{label}</span></button>
        ))}
      </nav>
      <div className="ie-drawer">
        {tab === 'templates' && <TemplatesTab api={api} />}
        {tab === 'text' && <TextTab api={api} />}
        {tab === 'elements' && <ElementsTab api={api} />}
        {tab === 'charts' && <ChartsTab api={api} />}
        {tab === 'images' && <ImagesTab api={api} userId={userId} />}
        {tab === 'page' && <PagePanel api={api} doc={doc} />}
      </div>
    </aside>
  );
}

function TemplatesTab({ api }: ApiProps) {
  return (
    <div>
      <h3 className="ie-title">Templates</h3>
      <p className="ie-hint">Applying a template replaces the current page.</p>
      <div className="ie-tgrid">
        {TEMPLATES.map((tpl) => (
          <button key={tpl.id} className="ie-tcard" onClick={() => api.applyTemplate(tpl)}>
            <Preview tpl={tpl} width={130} /><span>{tpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TextTab({ api }: ApiProps) {
  return (
    <div>
      <h3 className="ie-title">Text</h3>
      <div className="ie-list">
        {TEXT_PRESETS.map((p) => (
          <button key={p.label} className="ie-text-card" onClick={() => api.addObject({ type: 'text', ...p, name: 'text' })}
            style={{ fontFamily: `"${p.fontFamily}"`, fontWeight: p.fontWeight || 400, color: isDarkNeutral(p.fill) ? undefined : p.fill,  letterSpacing: p.charSpacing ? p.charSpacing / 1000 + 'em' : undefined, fontSize: Math.min(26, p.fontSize / 2.4 + 8) }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ElementsTab({ api }: ApiProps) {
  return (
    <div>
      <h3 className="ie-title">Elements</h3>
      <Section title="Shapes">
        <div className="ie-egrid">
          {SHAPES.map((s) => (
            <button key={s.k} title={s.k} onClick={() => api.addObject({ ...s.d, name: s.k.toLowerCase() })}>
              <svg viewBox="0 0 24 24" fill="#2F5BFF">{s.svg}</svg>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Icons">
        <div className="ie-egrid">
          {Object.entries(ICONS).map(([k, d]) => (
            <button key={k} title={k} onClick={() => api.addObject({ type: 'icon', icon: k })}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Blocks">
        <div className="ie-list">
          {BLOCKS.map((b) => <button key={b.k} className="ie-row-btn" onClick={() => api.addObject(b.d)}>{b.k}<small>group</small></button>)}
        </div>
        <p className="ie-hint">Double-click a block to edit its parts. Drag parts to move them, then press Esc when you’re done.</p>
      </Section>
    </div>
  );
}

function ChartsTab({ api }: ApiProps) {
  return (
    <div>
      <h3 className="ie-title">Charts</h3>
      <p className="ie-hint">Add a chart, then edit its data and colours on the right.</p>
      <div className="ie-list">
        {CHART_TYPES.map((c) => (
          <button key={c.key} className="ie-chart-card" onClick={() => api.addObject({ type: 'chart', chartType: c.key, width: 420, height: 270, data: sampleData(c.key === 'pie' || c.key === 'donut' ? 4 : 5) })}>
            <Preview tpl={CHART_PREVIEW[c.key]} width={240} /><span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ImagesTab({ api, userId }: ApiProps & { userId: string }) {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  useEffect(() => { listAssets(userId).then(setAssets); }, [userId]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = Array.from(input.files || []);
    const converted = await Promise.all(files.map(async (file) => {
      try {
        return { file, src: await fileToDataURL(file) };
      } catch {
        api.say('Could not read ' + file.name);
        return null;
      }
    }));
    const validImages = converted.filter((image): image is { file: File; src: string } => image !== null);
    const uploaded = await Promise.all(validImages.map(async ({ src }) => {
      try {
        return await addAsset(src, userId);
      } catch {
        api.say('Library is full, so this image will only be added to the page.');
        return { id: newId(), src };
      }
    }));
    setAssets((previous) => [...uploaded, ...previous]);
    await Promise.all(validImages.map(({ src }) => api.addImage(src)));
    input.value = '';
  }

  return (
    <div>
      <h3 className="ie-title">Images</h3>
      <label className="ie-drop"><Icon name="upload" size={22} /><b>Upload images</b><small>PNG, JPG, SVG, GIF</small>
        <input type="file" accept="image/*" multiple hidden onChange={upload} />
      </label>
      {!!assets.length && (
        <Section title="Your uploads">
          <div className="ie-igrid">
            {assets.map((a) => (
              <div key={a.id} className="ie-img">
                <button type="button" className="ie-img-preview" aria-label="Add image to page" onClick={() => api.addImage(a.src)}>
                  <Image src={a.src} alt="" width={320} height={180} unoptimized />
                </button>
                <div className="ie-img-acts">
                  <button title="Use as background" onClick={() => api.setBgImage(a.src)}><Icon name="page" size={14} /></button>
                  <button title="Remove from library" onClick={async () => { await deleteAsset(a.id, userId); setAssets((p) => p.filter((x) => x.id !== a.id)); }}><Icon name="close" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
