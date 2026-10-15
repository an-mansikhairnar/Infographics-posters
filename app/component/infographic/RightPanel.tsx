'use client';
import { useMemo, useState } from 'react';
import { FONTS, CHART_COLORS } from '@/lib/infographic/constants';
import { CHART_TYPES } from '@/lib/infographic/charts';
import PagePanel from './PagePanel';
import { newId } from '@/lib/infographic/storage';
import { Color, Icon, IconBtn, Range, Section } from './ui';
import type { ChartDatum } from '@/lib/infographic/types';
import type { EditorApi, EditorDocument, InfographicObject } from './interfaces';
import type { IconName } from './ui';

type RightPanelProps = Readonly<{
  api: EditorApi;
  doc: EditorDocument;
  selection: InfographicObject[];
  tick: number;
}>;

type PropsPanelProps = Readonly<{
  api: EditorApi;
  o: InfographicObject;
  multi: boolean;
}>;

type LayerPanelProps = Readonly<{
  api: EditorApi;
  selection: InfographicObject[];
  tick: number;
}>;

const typeOf = (o: InfographicObject) => (o.type || '').toLowerCase();
const isText = (o: InfographicObject) => /text/.test(typeOf(o));
const isImage = (o: InfographicObject) => /image/.test(typeOf(o));
const isChart = (o: InfographicObject) => o.name === 'chart';
const isGroup = (o: InfographicObject) => typeOf(o) === 'group' && !isChart(o);

export default function RightPanel({ api, doc, selection, tick }: RightPanelProps) {
  const [tab, setTab] = useState('design');
  const o = selection[0];
  let content;
  // if (tab === 'layers') content = <Layers api={api} selection={selection} tick={tick} />;
  // else if (o) content = <Props api={api} o={o} multi={selection.length > 1} />;
  // else content = <PagePanel key={doc.width + 'x' + doc.height} api={api} doc={doc} />;
   if (tab === 'layers') {
    content = <Layers api={api} selection={selection} tick={tick} />;
  } else if (o) {
    content = <Props api={api} o={o} multi={selection.length > 1} />;
  } else {
    content = (
      <div className="ie-empty">
        <p>Select an element to edit its properties.</p>
      </div>
    );
  }
  return (
    <aside className="ie-right">
      <div className="ie-tabs">
        <button className={tab === 'design' ? 'on' : ''} onClick={() => setTab('design')}>{o ? 'Properties' : 'Page'}</button>
        <button className={tab === 'layers' ? 'on' : ''} onClick={() => setTab('layers')}><Icon name="layers" size={15} /> Layers</button>
      </div>
      <div className="ie-rbody">
        {content}
      </div>
    </aside>
  );
}

function Props({ api, o, multi }: PropsPanelProps) {
  const text = isText(o), img = isImage(o), chart = isChart(o) && !multi, group = isGroup(o);
  const shape = !text && !img && !isChart(o) && !group;
  const bold = String(o.fontWeight) === 'bold' || Number(o.fontWeight || 0) >= 600;
  const set = api.update;

  return (
    <div>
      <div className="ie-actions">
        <IconBtn icon="copy" title="Duplicate (Ctrl+D)" onClick={api.duplicate} />
        {/* <IconBtn icon={o.locked ? 'lock' : 'unlock'} title={o.locked ? 'Unlock' : 'Lock'} active={o.locked} onClick={() => api.toggleLock(o)} /> */}
        {/* <IconBtn icon="flip" title="Flip horizontal" onClick={() => api.flip('x')} /> */}
        {multi && <IconBtn icon="group" title="Group" onClick={api.group} />}
        <IconBtn icon="trash" title="Delete" onClick={api.remove} />
      </div>
      {o.locked && <p className="ie-hint">This element is locked. Unlock it to edit.</p>}

      {text && (
        <Section title="Text">
          <div className="ie-field">
            <label htmlFor="object-font">Font</label>
            <select id="object-font" value={o.fontFamily} onChange={(e) => api.setFont(e.target.value)} style={{ fontFamily: o.fontFamily }}>
              {!FONTS.some((f) => f.n === o.fontFamily) && <option>{o.fontFamily}</option>}
              {FONTS.map((f) => <option key={f.n} value={f.n} style={{ fontFamily: f.n }}>{f.n}</option>)}
            </select>
          </div>
          <div className="ie-row">
            <div className="ie-stepper">
              <button onClick={() => set({ fontSize: Math.max(6, Math.round(o.fontSize || 28) - 2) })}><Icon name="minus" size={14} /></button>
              <input type="number" value={Math.round(o.fontSize || 28)} onChange={(e) => set({ fontSize: Math.max(6, +e.target.value || 6) })} />
              <button onClick={() => set({ fontSize: Math.round(o.fontSize || 28) + 2 })}><Icon name="plus" size={14} /></button>
            </div>
            <IconBtn icon="bold" title="Bold" active={bold} onClick={() => set({ fontWeight: bold ? '400' : '700' })} />
            <IconBtn icon="italic" title="Italic" active={o.fontStyle === 'italic'} onClick={() => set({ fontStyle: o.fontStyle === 'italic' ? 'normal' : 'italic' })} />
            <IconBtn icon="underline" title="Underline" active={o.underline} onClick={() => set({ underline: !o.underline })} />
            <IconBtn icon="strike" title="Strikethrough" active={o.linethrough} onClick={() => set({ linethrough: !o.linethrough })} />
          </div>
          <div className="ie-row">
            {([['left', 'alignLeft'], ['center', 'alignCenter'], ['right', 'alignRight'], ['justify', 'justify']] as const).map(([a, i]) => (
              <IconBtn key={a} icon={i} title={'Align ' + a} active={o.textAlign === a} onClick={() => set({ textAlign: a })} />
            ))}
            <button className="ie-chip" onClick={() => api.setCase(true)}>AA</button>
            <button className="ie-chip" onClick={() => api.setCase(false)}>aa</button>
          </div>
          <Color label="Text colour" value={typeof o.fill === 'string' ? o.fill : null} onChange={(c) => set({ fill: c })} />
          <Range label="Line height" value={o.lineHeight || 1.2} min={0.8} max={3} step={0.05} onChange={(v) => set({ lineHeight: v })} />
          <Range label="Letter spacing" value={o.charSpacing || 0} min={-100} max={1000} step={10} onChange={(v) => set({ charSpacing: v })} />
          <Color label="Highlight" value={o.textBackgroundColor} none swatches={false} onChange={(c) => set({ textBackgroundColor: c === 'transparent' ? '' : c })} />
          <Color label="Outline" value={typeof o.stroke === 'string' ? o.stroke : null} none swatches={false} onChange={(c) => set({ stroke: c === 'transparent' ? null : c, strokeWidth: c === 'transparent' ? 0 : Math.max(1, o.strokeWidth || 1), paintFirst: 'stroke' })} />
          {o.stroke && <Range label="Outline width" value={o.strokeWidth || 0} min={0} max={12} step={0.5} onChange={(v) => set({ strokeWidth: v })} />}
        </Section>
      )}

      {shape && (
        <Section title="Shape">
          <Color label="Fill" value={typeof o.fill === 'string' ? o.fill : null} none onChange={(c) => set({ fill: c })} />
          <Color label="Border" value={typeof o.stroke === 'string' ? o.stroke : null} none swatches={false} onChange={(c) => set({ stroke: c === 'transparent' ? null : c, strokeWidth: c === 'transparent' ? 0 : Math.max(2, o.strokeWidth || 2) })} />
          {o.stroke && <Range label="Border width" value={o.strokeWidth || 0} min={0} max={30} onChange={(v) => set({ strokeWidth: v })} />}
          {typeOf(o) === 'rect' && <Range label="Corner radius" value={o.rx || 0} min={0} max={150} onChange={(v) => set({ rx: v, ry: v })} />}
        </Section>
      )}

      {img && (
        <Section title="Image">
          <div className="ie-row">
            <button className="ie-btn" onClick={() => { const canvas = api.canvas; if (canvas) { o.scaleToWidth(canvas.getWidth() / canvas.getZoom()); o.set({ left: 0 }); api.update({}); } }}>Fit page width</button>
            <button className="ie-btn" onClick={() => api.setBgImage((o as import('fabric').FabricImage).getSrc())}>As background</button>
          </div>
          {/* {[['grayscale', 'Greyscale'], ['sepia', 'Sepia'], ['invert', 'Invert']].map(([k, l]) => (
            <label key={k} className="ie-check"><input type="checkbox" checked={!!o.fx?.[k]} onChange={(e) => api.setFx(o, { [k]: e.target.checked })} />{l}</label>
          ))} */}
          <Range label="Brightness" value={o.fx?.brightness || 0} min={-0.5} max={0.5} step={0.05} onChange={(v) => api.setFx(o, { brightness: v })} />
          <Range label="Contrast" value={o.fx?.contrast || 0} min={-0.5} max={0.5} step={0.05} onChange={(v) => api.setFx(o, { contrast: v })} />
          <Range label="Blur" value={o.fx?.blur || 0} min={0} max={0.5} step={0.02} onChange={(v) => api.setFx(o, { blur: v })} />
          <Range label="Corner radius" value={(o.clipPath as (typeof o.clipPath & { rx?: number }) | undefined)?.rx || 0} min={0} max={200} onChange={(v) => {
            void import('fabric').then((M) => {
              o.clipPath = new M.Rect({ width: o.width, height: o.height, rx: v / o.scaleX, ry: v / o.scaleY, originX: 'center', originY: 'center' });
              o.dirty = true;
              api.update({});
            }).catch((error: unknown) => {
              console.error(error);
              api.say('Could not update the image corners.');
            });
          }} />
        </Section>
      )}

      {chart && <ChartEditor api={api} o={o} />}

      <Section title="Effects">
        <Range label="Opacity" value={o.opacity ?? 1} min={0} max={1} step={0.01} onChange={(v) => set({ opacity: v })} />
        <Range label="Rotation" value={Math.round(o.angle || 0)} min={-180} max={180} unit="°" onChange={(v) => set({ angle: v })} />
        {/* <label className="ie-check"><input type="checkbox" checked={!!sh} onChange={(e) => api.setShadow(o, e.target.checked ? { color: 'rgba(15,23,42,0.35)', blur: 18, offsetX: 0, offsetY: 8 } : null)} />Drop shadow</label>
        {sh && (
          <>
            <Color label="Shadow colour" value={sh.color} swatches={false} onChange={(c) => api.setShadow(o, { ...sh, color: c })} />
            <Range label="Blur" value={sh.blur} min={0} max={60} onChange={(v) => api.setShadow(o, { ...sh, blur: v })} />
            <Range label="Offset Y" value={sh.offsetY} min={-40} max={40} onChange={(v) => api.setShadow(o, { ...sh, offsetY: v })} />
            <Range label="Offset X" value={sh.offsetX} min={-40} max={40} onChange={(v) => api.setShadow(o, { ...sh, offsetX: v })} />
          </>
        )} */}
      </Section>

      <Section title="Arrange">
        {/* <div className="ie-row wrap">
          {[['l', 'hAlignL', 'Align left'], ['c', 'hAlignC', 'Center horizontally'], ['r', 'hAlignR', 'Align right'], ['t', 'vAlignT', 'Align top'], ['m', 'vAlignM', 'Center vertically'], ['b', 'vAlignB', 'Align bottom']].map(([k, i, t]) => (
            <IconBtn key={k} icon={i} title={t} onClick={() => api.align(k)} />
          ))}
        </div> */}
        <div className="ie-row wrap">
          <IconBtn icon="toFront" title="Bring to front" onClick={() => api.order('front')} />
          <IconBtn icon="up" title="Bring forward" onClick={() => api.order('forward')} />
          <IconBtn icon="down" title="Send backward" onClick={() => api.order('backward')} />
          <IconBtn icon="toBack" title="Send to back" onClick={() => api.order('back')} />
        </div>
      </Section>
    </div>
  );
}

function ChartEditor({ api, o }: Pick<PropsPanelProps, 'api' | 'o'>) {
  const data = useMemo(
    () => (o.chartData || []).map((datum) => ({ ...datum, id: datum.id || newId() })),
    [o.chartData]
  );
  const upd = (i: number, patch: Partial<ChartDatum>) => api.updateChart(o, { data: data.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  return (
    <Section title="Chart">
      <div className="ie-row wrap">
        {CHART_TYPES.map((c) => <button key={c.key} className={'ie-chip' + (o.chartType === c.key ? ' on' : '')} onClick={() => api.updateChart(o, { chartType: c.key })}>{c.label}</button>)}
      </div>
      <div className="ie-data">
        {data.map((d, i) => (
          <div key={d.id} className="ie-data-row">
            <input type="color" value={d.color} onChange={(e) => upd(i, { color: e.target.value })} />
            <input type="text" value={d.label} onChange={(e) => upd(i, { label: e.target.value })} />
            <input type="number" value={d.value} onChange={(e) => upd(i, { value: +e.target.value })} />
            <button className="ie-ibtn" title="Remove" disabled={data.length < 2} onClick={() => api.updateChart(o, { data: data.filter((_, j) => j !== i) })}><Icon name="close" size={14} /></button>
          </div>
        ))}
      </div>
      <button className="ie-btn block" onClick={() => api.updateChart(o, { data: [...data, { label: 'New', value: 50, color: CHART_COLORS[data.length % CHART_COLORS.length] }] })}><Icon name="plus" /> Add row</button>
      <Color label="Label colour" value={o.chartStyle?.textColor || '#1E293B'} onChange={(c) => api.updateChart(o, { style: { textColor: c } })} />
      <div className="ie-field"><label htmlFor="chart-font">Label font</label>
        <select id="chart-font" value={o.chartStyle?.fontFamily || 'Inter'} onChange={(e) => api.updateChart(o, { style: { fontFamily: e.target.value } })}>
          {FONTS.map((f) => <option key={f.n}>{f.n}</option>)}
        </select>
      </div>
    </Section>
  );
}
const layerIds = new WeakMap<object, string>();
let layerCounter = 0;
function getLayerKey(o: object): string {
  let k = layerIds.get(o);
  if (!k) {
    k = `layer_${++layerCounter}`;
    layerIds.set(o, k);
  }
  return k;
}
function Layers({ api, selection, tick }: LayerPanelProps) {
  const c = api.canvas; if (!c) return null;
  const list = c.getObjects().slice().reverse() as InfographicObject[];
  const label = (o: InfographicObject) => {
    if (isText(o)) return (o.text || 'Text').slice(0, 24);
    if (o.name && o.name !== 'icon') return o.name;
    return typeOf(o) || 'object';
  };
  const ico = (o: InfographicObject): IconName => {
    if (isText(o)) return 'text';
    if (isImage(o)) return 'image';
    if (isChart(o)) return 'chart';
    if (typeOf(o) === 'group') return 'group';
    return 'shapes';
  };
  return (
    <div className="ie-layers" data-t={tick}>
      {!list.length && <p className="ie-empty">No elements yet.</p>}
      {list.map((o) => (
         <div key={getLayerKey(o)} className={'ie-layer' + (selection.includes(o) ? ' on' : '')}>
          <button type="button" className="ie-layer-select" onClick={() => api.select(o)}>
            <Icon name={ico(o)} size={15} /><span>{label(o)}</span>
          </button>
          <div className="ie-layer-acts">
            <button type="button" title="Move up" onClick={() => api.moveLayer(o, 1)}><Icon name="up" size={14} /></button>
            <button type="button" title="Move down" onClick={() => api.moveLayer(o, -1)}><Icon name="down" size={14} /></button>
            <button type="button" title={o.visible ? 'Hide' : 'Show'} onClick={() => api.toggleVisible(o)}><Icon name={o.visible ? 'eye' : 'eyeoff'} size={14} /></button>
            {/* <button title={o.locked ? 'Unlock' : 'Lock'} onClick={() => api.toggleLock(o)}><Icon name={o.locked ? 'lock' : 'unlock'} size={14} /></button> */}
            <button type="button" title="Delete" onClick={() => api.removeObject(o)}><Icon name="trash" size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
