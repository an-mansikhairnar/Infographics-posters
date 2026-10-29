'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Canvas, FabricObject, Group } from 'fabric';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CUSTOM_PROPS, FONTS, MAX_PAGE_HEIGHT } from '@/lib/infographic/constants';
import { assertDesignEditScope } from '@/lib/infographic/designEditGuard';
import type { ChatOperation } from '@/lib/infographic/designEditOperations';
import { resolveEditConversation } from '@/lib/infographic/designEditConversation';
import { THEMES } from '@/lib/infographic/aiCompiler';
import { applyBackground, applyFx, applyLock, buildTemplate, createObject } from '@/lib/infographic/factory';
import { buildChart } from '@/lib/infographic/charts';
import { collectFonts, ensureFonts, injectFonts } from '@/lib/infographic/fonts';
import { getTemplate } from '@/lib/infographic/templates';
import { getDesign, saveDesign } from '@/lib/infographic/storage';
import * as X from '@/lib/infographic/export';
import type { FabricApi } from '@/lib/infographic/types';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import DesignChat, { DesignChatButton, type ChatMessage } from './DesignChat';
import type { EditorApi, EditorDocument, EditorStatus, InfographicObject } from './interfaces';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const initialDocument: EditorDocument = { name: 'Untitled infographic', width: 800, height: 2000, bg: { type: 'solid', c1: '#FFFFFF' } };

type EditorFlags = { undo: boolean; redo: boolean };
type HistoryState = { stack: string[]; idx: number; lock: boolean };
type EditorMetadata = { loaded?: boolean; templateId?: string | null };
const ARROW_NUDGES: Record<string, readonly [number, number]> = {
  arrowleft: [-1, 0],
  arrowright: [1, 0],
  arrowup: [0, -1],
  arrowdown: [0, 1],
};

export default function Editor({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const hostRef = useRef<HTMLDivElement>(null!),
    scrollRef = useRef<HTMLElement>(null!),
    canvasRef = useRef<Canvas>(null!),
    Fref = useRef<FabricApi>(null!),
    editingGroupRef = useRef<Group | null>(null);
  const docRef = useRef<EditorDocument>(initialDocument);
  const zoomRef = useRef(1),
    metaRef = useRef<EditorMetadata>({}),
    clipRef = useRef<FabricObject | null>(null);
  const hist = useRef<HistoryState>({ stack: [], idx: -1, lock: false });
  const timers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const chatBaselineRef = useRef<{ token: string; signature: string } | null>(null);
  const apiRef = useRef<EditorApi | null>(null);

  const [ready, setReady] = useState(false);
  const [canvasState, setCanvasState] = useState<Canvas | null>(null);
  const [doc, setDocState] = useState<EditorDocument>(initialDocument);
  const [zoom, setZoomState] = useState(1);
  const [selection, setSelection] = useState<InfographicObject[]>([]);
  const [tick, setTick] = useState(0);
  const [status, setStatus] = useState<EditorStatus>('saved');
  const [flags, setFlags] = useState<EditorFlags>({ undo: false, redo: false });
  const [toast, setToast] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const say = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToast(null), 3200);
  }, []);
  const setDoc = useCallback((patch: Partial<EditorDocument>) => {
    docRef.current = { ...docRef.current, ...patch };
    setDocState(docRef.current);
  }, []);
  const sync = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    setSelection(c.getActiveObjects() as InfographicObject[]);
    setTick((t) => t + 1);
  }, []);
  const exitBlockEditing = useCallback(
    (selectGroup = false) => {
      const group = editingGroupRef.current;
      const canvas = canvasRef.current;
      if (!group || !canvas) return;
      editingGroupRef.current = null;
      group.set({ interactive: false, subTargetCheck: false });
      if (selectGroup) canvas.setActiveObject(group);
      canvas.requestRenderAll();
      sync();
    },
    [sync]
  );
  const serializeCanvas = useCallback(() => {
    const group = editingGroupRef.current;
    group?.set({ interactive: false, subTargetCheck: false });
    try {
      return canvasRef.current.toObject(CUSTOM_PROPS);
    } finally {
      group?.set({ interactive: true, subTargetCheck: true });
    }
  }, []);

  /* ---------- sizing / zoom / background ---------- */
  const layout = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const z = zoomRef.current,
      { width, height, bg } = docRef.current;
    c.setZoom(z);
    c.setDimensions({ width: width * z, height: height * z });
    applyBackground(Fref.current, c, bg, height);
  }, []);
  const setZoom = useCallback(
    (z: number) => {
      zoomRef.current = clamp(z, 0.1, 3);
      setZoomState(zoomRef.current);
      layout();
    },
    [layout]
  );
  const fit = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    setZoom(Math.min(1, (sc.clientWidth - 96) / docRef.current.width));
  }, [setZoom]);

  /* ---------- history + autosave ---------- */
  const snapshot = () => {
    const { width, height, bg } = docRef.current;
    return JSON.stringify({ doc: { width, height, bg }, data: serializeCanvas() });
  };
  const doSave = useCallback(async () => {
    const c = canvasRef.current;
    if (!c || !metaRef.current.loaded || !userId) return;
    setStatus('saving');
    try {
      const d = docRef.current;
      const thumb = X.toDataURL(c, d, zoomRef.current, { format: 'jpeg', scale: 300 / d.width, quality: 0.6, keepSelection: true });
      await saveDesign({
        id,
        name: d.name,
        width: d.width,
        height: d.height,
        bg: d.bg,
        templateId: metaRef.current.templateId || null,
        data: serializeCanvas(),
        thumb,
      });
      setStatus('saved');
    } catch (error) {
      setStatus('error');
      say(error instanceof Error ? error.message : 'Could not save your design. Please try again.');
    }
  }, [id, say, serializeCanvas, userId]);
  const scheduleSave = useCallback(() => {
    setStatus('dirty');
    clearTimeout(timers.current.save);
    timers.current.save = setTimeout(doSave, 1200);
  }, [doSave]);
  const commit = useCallback(
    (immediate = false) => {
      clearTimeout(timers.current.commit);
      const run = () => {
        const h = hist.current;
        if (h.lock || !canvasRef.current) return;
        const snap = snapshot();
        if (h.stack[h.idx] === snap) return;
        h.stack = h.stack.slice(0, h.idx + 1);
        h.stack.push(snap);
        if (h.stack.length > 60) h.stack.shift();
        h.idx = h.stack.length - 1;
        setFlags({ undo: h.idx > 0, redo: false });
        scheduleSave();
      };
      if (immediate) run();
      else timers.current.commit = setTimeout(run, 250);
    },
    [scheduleSave]
  );

  const restore = useCallback(
    async (snap: string) => {
      const h = hist.current,
        c = canvasRef.current;
      exitBlockEditing();
      h.lock = true;
      try {
        const { doc: d, data } = JSON.parse(snap);
        await ensureFonts(collectFonts(data));
        await c.loadFromJSON(data);
        c.getObjects().forEach((object) => applyLock(object as InfographicObject));
        setDoc(d);
        layout();
        c.discardActiveObject();
        c.requestRenderAll();
      } finally {
        h.lock = false;
      }
      setFlags({ undo: h.idx > 0, redo: h.idx < h.stack.length - 1 });
      sync();
      scheduleSave();
    },
    [exitBlockEditing, layout, setDoc, sync, scheduleSave]
  );

  /* ---------- init ---------- */
  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!userId) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const host = hostRef.current;
    const scrollContainer = scrollRef.current;
    const timerRefs = timers;
    let dead = false,
      canvas: Canvas | undefined;
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(zoomRef.current * (e.deltaY < 0 ? 1.08 : 0.92));
      }
    };
    const clearWorkspaceSelection = (event: MouseEvent) => {
      const target = event.target;
      if (target === scrollContainer || (target instanceof Element && target.classList.contains('ie-stage'))) {
        canvas?.discardActiveObject();
        canvas?.requestRenderAll();
      }
    };
    scrollContainer.addEventListener('mousedown', clearWorkspaceSelection);
    (async () => {
      injectFonts();
      const F = await import('fabric');
      if (dead) return;
      Fref.current = F;
      const rec = await getDesign(id);
      if (!rec) {
        router.replace('/infographic-maker');
        return;
      }
      if (dead) return;
      metaRef.current = { templateId: rec.templateId };
      docRef.current = { name: rec.name, width: rec.width, height: rec.height, bg: rec.bg || { type: 'solid', c1: '#FFFFFF' } };
      setDocState(docRef.current);

      const el = document.createElement('canvas');
      host.appendChild(el);
      canvas = new F.Canvas(el, { preserveObjectStacking: true, backgroundColor: '#fff', width: rec.width, height: rec.height });
      canvasRef.current = canvas;
      setCanvasState(canvas);

      const style = (o: FabricObject) =>
        o.set({
          cornerStyle: 'circle',
          cornerColor: '#ffffff',
          cornerStrokeColor: '#2F5BFF',
          borderColor: '#2F5BFF',
          transparentCorners: false,
          cornerSize: 11,
          borderScaleFactor: 1.6,
          padding: 2,
        });
      canvas.on('object:added', (e) => {
        if (e.target) style(e.target);
        commit();
      });
      canvas.on('object:removed', () => commit());
      canvas.on('object:modified', () => {
        commit();
        sync();
      });
      const onSelectionChange = () => {
        const group = editingGroupRef.current;
        const selected = canvas?.getActiveObjects() || [];
        if (group && (!selected.length || selected.some((object) => object !== group && !group.contains(object, true)))) {
          exitBlockEditing();
        }
        sync();
      };
      canvas.on('selection:created', onSelectionChange);
      canvas.on('selection:updated', onSelectionChange);
      canvas.on('selection:cleared', onSelectionChange);
      canvas.on('text:changed', () => commit());
      canvas.on('mouse:dblclick', ({ target }) => {
        if (!(target instanceof F.Group) || (target as InfographicObject).name === 'chart') return;
        editingGroupRef.current = target;
        target.set({ interactive: true, subTargetCheck: true });
        canvasRef.current.setActiveObject(target);
        canvasRef.current.requestRenderAll();
        say('Block opened. Drag its parts to move them; press Esc to finish.');
      });
      hist.current.lock = true;
      if (rec.data) {
        await ensureFonts(collectFonts(rec.data));
        await canvas.loadFromJSON(rec.data);
        canvas.getObjects().forEach((object) => applyLock(object as InfographicObject));
      } else if (rec.templateId && getTemplate(rec.templateId)) {
        const t = getTemplate(rec.templateId);
        if (t) {
          await ensureFonts(
            t.objects
              .map((o) => o.fontFamily)
              .filter((font): font is string => Boolean(font))
              .concat(['Inter', 'Poppins', 'Playfair Display'])
          );
          await buildTemplate(F, canvas, t);
        }
        } else if (rec.objects && rec.objects.length) {
        await ensureFonts(
          rec.objects
            .map((o) => o.fontFamily)
            .filter((font): font is string => Boolean(font))
            .concat(['Inter', 'Poppins', 'Playfair Display'])
        );
        for (const obj of rec.objects) {
          canvas.add(await createObject(F, obj));
        }
      }
      if (dead) return;
      canvas.getObjects().forEach(style);
      hist.current.lock = false;
      metaRef.current.loaded = true;
      fit();
      hist.current.stack = [snapshot()];
      hist.current.idx = 0;
      if (!rec.data) void doSave();
      setReady(true);

      // ctrl/cmd + wheel zoom
      scrollContainer.addEventListener('wheel', wheel, { passive: false });
    })().catch((e) => {
      console.error(e);
      say('Editor failed to load: ' + (e instanceof Error ? e.message : String(e)));
    });

    const flush = () => {
      if (metaRef.current.loaded) void doSave();
    };
    window.addEventListener('pagehide', flush);
    return () => {
      dead = true;
      editingGroupRef.current = null;
      window.removeEventListener('pagehide', flush);
      scrollContainer.removeEventListener('mousedown', clearWorkspaceSelection);
      scrollContainer.removeEventListener('wheel', wheel);
      Object.values(timerRefs.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
      canvas?.dispose().catch((error) => console.error('Canvas cleanup failed:', error));
      host.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authStatus, userId, router]);

  /* ---------- API used by the panels ---------- */
  const isText = (o: InfographicObject) => /text/i.test(o.type || '');
  const active = (): InfographicObject[] => canvasRef.current.getActiveObjects() as InfographicObject[];
  const fire = (o: InfographicObject | undefined) => {
    if (!o) return;
    canvasRef.current.fire('object:modified', { target: o });
  };

  const placeCenter = (o: FabricObject) => {
    const d = docRef.current,
      z = zoomRef.current;
    const hr = hostRef.current.getBoundingClientRect(),
      sr = scrollRef.current.getBoundingClientRect();
    const x = clamp((sr.left + sr.width / 2 - hr.left) / z, 0, d.width),
      y = clamp((sr.top + sr.height / 2 - hr.top) / z, 0, d.height);
    o.set({
      left: clamp(x - o.getScaledWidth() / 2, 0, Math.max(0, d.width - 20)),
      top: clamp(y - o.getScaledHeight() / 2, 0, Math.max(0, d.height - 20)),
    });
  };

  const api: EditorApi = {
    get canvas() {
      return canvasState;
    },
    say,
    async addObject(desc) {
      const F = Fref.current,
        c = canvasRef.current;
      await ensureFonts([desc.fontFamily, desc.chartStyle?.fontFamily].filter((font): font is string => Boolean(font)));
      const o = await createObject(F, desc);
      placeCenter(o);
      c.add(o);
      c.setActiveObject(o);
      c.requestRenderAll();
      sync();
      return o as InfographicObject;
    },
    async addImage(url) {
      try {
        return await api.addObject({ type: 'image', src: url, maxWidth: docRef.current.width * 0.7, name: 'image' });
      } catch {
        say('That image could not be loaded.');
      }
    },
    // async setBgImage(url) {
    //   try {
    //     const F = Fref.current,
    //       c = canvasRef.current,
    //       d = docRef.current;
    //     const prev = c.getObjects().find((o) => (o as InfographicObject).name === 'background-image');
    //     if (prev) c.remove(prev);
    //     const img = await F.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    //     const s = Math.max(d.width / img.width, d.height / img.height);
    //     img.set({ name: 'background-image', scaleX: s, scaleY: s, left: 0, top: 0, locked: true });
    //     applyLock(img);
    //     c.add(img);
    //     c.sendObjectToBack(img);
    //     c.requestRenderAll();
    //     sync();
    //   } catch {
    //     say('That image could not be loaded.');
    //   }
    // },
    async setBgImage(url) {
  try {
    const F = Fref.current;
    const c = canvasRef.current;
    const d = docRef.current;

    if (!F || !c || !d) return;

    // Remove existing background image
    const prev = c
      .getObjects()
      .find(
        (o) =>
          (o as InfographicObject).name === 'background-image'
      );

    if (prev) {
      c.remove(prev);
    }

    const img = await F.FabricImage.fromURL(url, {
      crossOrigin: 'anonymous',
    });

    const imageWidth = img.width || 1;
    const imageHeight = img.height || 1;

    // Scale image so it completely covers the page.
    const scale = Math.max(
      d.width / imageWidth,
      d.height / imageHeight
    );

    img.set({
      name: 'background-image',

      // Keep original aspect ratio
      scaleX: scale,
      scaleY: scale,

      // Center image on the page
      originX: 'center',
      originY: 'center',
      left: d.width / 2,
      top: d.height / 2,

      locked: true,
      selectable: false,
      evented: false,
    });

    applyLock(img);

    c.add(img);
    c.sendObjectToBack(img);

    img.setCoords();

    c.requestRenderAll();
    sync();
  } catch (error) {
    console.error('Background image error:', error);
    say('That image could not be loaded.');
  }
},
    update(props) {
      active().forEach((o) => {
        if (o.locked && !('locked' in props)) return;
        o.set(props);
        if (isText(o)) {
          if ('initDimensions' in o && typeof o.initDimensions === 'function') o.initDimensions();
        }
        o.dirty = true;
        o.setCoords();
      });
      canvasRef.current.requestRenderAll();
      fire(active()[0]);
      sync();
    },
    async setFont(name) {
      await ensureFonts([name]);
      api.update({ fontFamily: name });
    },
    setCase(upper) {
      active()
        .filter(isText)
        .forEach((o) => {
          const text = o.text || '';
          o.set('text', upper ? text.toUpperCase() : text.toLowerCase());
        });
      canvasRef.current.requestRenderAll();
      fire(active()[0]);
      sync();
    },
    setShadow(o, sh) {
      api.update({ shadow: sh ? new Fref.current.Shadow(sh) : null });
    },
    setFx(o, patch) {
      active()
        .filter((x) => /image/i.test(x.type))
        .forEach((x) => {
          x.fx = { ...x.fx, ...patch };
          if (x instanceof Fref.current.FabricImage) applyFx(Fref.current, x);
        });
      canvasRef.current.requestRenderAll();
      fire(o);
      sync();
    },
    // async updateChart(o, patch) {
    //   const F = Fref.current,
    //     c = canvasRef.current;
    //   const style = { ...o.chartStyle, ...patch.style };
    //   await ensureFonts(style.fontFamily ? [style.fontFamily] : []);
    //   const g = buildChart(F, {
    //     chartType: patch.chartType || o.chartType,
    //     data: patch.data || o.chartData,
    //     width: o.width * o.scaleX,
    //     height: o.height * o.scaleY,
    //     ...style,
    //   });
    //   g.set({ left: o.left, top: o.top, angle: o.angle, opacity: o.opacity });
    //   const i = c.getObjects().indexOf(o);
    //   c.remove(o);
    //   c.insertAt(i, g);
    //   c.setActiveObject(g);
    //   c.requestRenderAll();
    //   sync();
    // },
    async updateChart(o, patch) {
      const F = Fref.current;
      const c = canvasRef.current;

      // Preserve the current visual transform
      const left = o.left ?? 0;
      const top = o.top ?? 0;
      const scaleX = o.scaleX ?? 1;
      const scaleY = o.scaleY ?? 1;
      const angle = o.angle ?? 0;
      const opacity = o.opacity ?? 1;
      const flipX = o.flipX ?? false;
      const flipY = o.flipY ?? false;

      const style = {
        ...o.chartStyle,
        ...patch.style,
      };

      await ensureFonts(style.fontFamily ? [style.fontFamily] : []);

      // IMPORTANT:
      // Use the chart's original logical dimensions,
      // not width * scale.
      const chartWidth = o.chartWidth ?? o.width ?? 420;

      const chartHeight = o.chartHeight ?? o.height ?? 280;

      const g = buildChart(F, {
        chartType: patch.chartType ?? o.chartType,
        data: patch.data ?? o.chartData,
        width: chartWidth,
        height: chartHeight,
        ...style,
        left,
        top,
      });

      // Restore the exact visual transform
      g.set({
        left,
        top,
        scaleX,
        scaleY,
        angle,
        opacity,
        flipX,
        flipY,
      });

      g.setCoords();

      const i = c.getObjects().indexOf(o);

      c.remove(o);
      c.insertAt(i, g);

      c.setActiveObject(g);
      c.requestRenderAll();

      sync();
    },
    remove() {
      const c = canvasRef.current;
      const a = active().filter((o) => !o.locked);
      const group = editingGroupRef.current;
      const children = group ? a.filter((o) => o !== group && group.contains(o, true)) : [];
      if (group && children.length) {
        editingGroupRef.current = null;
        group.set({ interactive: false, subTargetCheck: false });
        c.discardActiveObject();
        group.remove(...children);
        if (group.isEmpty()) c.remove(group);
        else {
          editingGroupRef.current = group;
          group.set({ interactive: true, subTargetCheck: true });
          c.setActiveObject(group);
        }
        c.requestRenderAll();
        commit(true);
        sync();
        return;
      }
      if (group) exitBlockEditing();
      c.discardActiveObject();
      a.forEach((o) => c.remove(o));
      c.requestRenderAll();
      sync();
    },
    async duplicate() {
      const c = canvasRef.current,
        F = Fref.current,
        o = c.getActiveObject();
      if (!o) return;
      const cl = await o.clone(CUSTOM_PROPS);
      const position = o.getXY();
      cl.setXY(new F.Point(position.x + 24, position.y + 24));
      cl.set({ locked: false });
      c.discardActiveObject();
      if (cl instanceof F.ActiveSelection) {
        cl.canvas = c;
        cl.forEachObject((x) => c.add(x));
        cl.setCoords();
      } else c.add(cl);
      c.setActiveObject(cl);
      c.requestRenderAll();
      sync();
    },
    async copy() {
      const o = canvasRef.current?.getActiveObject();
      if (o) {
        const position = o.getXY();
        const clone = await o.clone(CUSTOM_PROPS);
        clone.setXY(new Fref.current.Point(position.x, position.y));
        clipRef.current = clone;
      }
    },
    async paste() {
      const c = canvasRef.current,
        F = Fref.current;
      if (!clipRef.current) return;
      const cl = await clipRef.current.clone(CUSTOM_PROPS);
      const position = cl.getXY();
      cl.setXY(new F.Point(position.x + 24, position.y + 24));
      clipRef.current = cl;
      c.discardActiveObject();
      if (cl instanceof F.ActiveSelection) {
        cl.canvas = c;
        cl.forEachObject((x) => c.add(x));
        cl.setCoords();
      } else c.add(cl);
      c.setActiveObject(cl);
      c.requestRenderAll();
      sync();
    },
    order(kind) {
      const c = canvasRef.current;
      const list = active()
        .slice()
        .sort((a, b) => c.getObjects().indexOf(a) - c.getObjects().indexOf(b));
      const fn = {
        front: (o: FabricObject) => c.bringObjectToFront(o),
        forward: (o: FabricObject) => c.bringObjectForward(o),
        backward: (o: FabricObject) => c.sendObjectBackwards(o),
        back: (o: FabricObject) => c.sendObjectToBack(o),
      }[kind];
      const ordered = kind === 'front' || kind === 'forward' ? list : [...list].reverse();
      ordered.forEach(fn);
      c.requestRenderAll();
      fire(list[0]);
      sync();
    },
    align(kind) {
      const o = canvasRef.current.getActiveObject(),
        d = docRef.current;
      if (!o) return;
      const w = o.getScaledWidth(),
        h = o.getScaledHeight();
      const p = {
        l: { left: 0 },
        c: { left: (d.width - w) / 2 },
        r: { left: d.width - w },
        t: { top: 0 },
        m: { top: (d.height - h) / 2 },
        b: { top: d.height - h },
      }[kind];
      o.set(p);
      o.setCoords();
      canvasRef.current.requestRenderAll();
      fire(o as InfographicObject);
      sync();
    },
    flip(axis) {
      active().forEach((o) => o.set(axis === 'x' ? 'flipX' : 'flipY', !(axis === 'x' ? o.flipX : o.flipY)));
      canvasRef.current.requestRenderAll();
      fire(active()[0]);
      sync();
    },
    toggleLock(o) {
      o.locked = !o.locked;
      applyLock(o);
      canvasRef.current.requestRenderAll();
      fire(o);
      sync();
    },
    toggleVisible(o) {
      o.visible = !o.visible;
      if (!o.visible) canvasRef.current.discardActiveObject();
      canvasRef.current.requestRenderAll();
      fire(o);
      sync();
    },
    select(o) {
      if (!o.visible) return;
      canvasRef.current.setActiveObject(o);
      canvasRef.current.requestRenderAll();
      sync();
    },
    removeObject(o) {
      canvasRef.current.remove(o);
      canvasRef.current.requestRenderAll();
      sync();
    },
    moveLayer(o, dir) {
      const c = canvasRef.current;
      if (dir > 0) c.bringObjectForward(o);
      else c.sendObjectBackwards(o);
      c.requestRenderAll();
      fire(o);
      sync();
    },
    group() {
      const c = canvasRef.current,
        F = Fref.current,
        sel = c.getActiveObject();
      if (!(sel instanceof F.ActiveSelection)) return;
      const objs = sel.getObjects();
      c.discardActiveObject();
      objs.forEach((o) => c.remove(o));
      const g = new F.Group(objs);
      c.add(g);
      c.setActiveObject(g);
      c.requestRenderAll();
      sync();
    },
    selectAll() {
      const c = canvasRef.current,
        F = Fref.current,
        os = c.getObjects().filter((o) => o.visible && !(o as InfographicObject).locked);
      if (os.length) {
        c.setActiveObject(os.length === 1 ? os[0] : new F.ActiveSelection(os, { canvas: c }));
        c.requestRenderAll();
        sync();
      }
    },
    nudge(dx, dy) {
      active().forEach((o) => {
        if (!o.locked) {
          o.set({ left: o.left + dx, top: o.top + dy });
          o.setCoords();
        }
      });
      canvasRef.current.requestRenderAll();
      commit();
    },
    deselect() {
      canvasRef.current.discardActiveObject();
      canvasRef.current.requestRenderAll();
      sync();
    },
    async undo() {
      const h = hist.current;
      commit(true);
      if (h.idx > 0) {
        h.idx--;
        await restore(h.stack[h.idx]);
      }
    },
    async redo() {
      const h = hist.current;
      if (h.idx < h.stack.length - 1) {
        h.idx++;
        await restore(h.stack[h.idx]);
      }
    },
    setName(name) {
      setDoc({ name });
      scheduleSave();
    },
    resizePage(w, h) {
      w = clamp(Math.round(+w || 800), 200, 4000);
      h = clamp(Math.round(+h || 800), 200, MAX_PAGE_HEIGHT);
      setDoc({ width: w, height: h });
      layout();
      commit(true);
    },
    extendPage(by) {
      api.resizePage(docRef.current.width, docRef.current.height + by);
    },
    setBg(bg) {
      setDoc({ bg });
      layout();
      commit(true);
    },
    async applyTemplate(tpl) {
      const c = canvasRef.current,
        F = Fref.current;
      if (c.getObjects().length && !confirm('Replace the current design with this template?')) return;
      const h = hist.current;
      h.lock = true;
      try {
        c.discardActiveObject();
        c.clear();
        await ensureFonts(
          tpl.objects
            .map((o) => o.fontFamily)
            .filter((font): font is string => Boolean(font))
            .concat(['Inter', 'Poppins', 'Playfair Display'])
        );
        setDoc({ width: tpl.width, height: tpl.height, bg: tpl.bg });
        layout();
        await buildTemplate(F, c, tpl);
        metaRef.current.templateId = tpl.id;
      } finally {
        h.lock = false;
      }
      commit(true);
      fit();
      sync();
    },
    async exportAs(kind) {
      const c = canvasRef.current,
        d = docRef.current,
        z = zoomRef.current;
      try {
        if (kind === 'png') await X.exportImage(c, d, z, 'png', 1);
        else if (kind === 'png2') await X.exportImage(c, d, z, 'png', 2);
        else if (kind === 'jpg') await X.exportImage(c, d, z, 'jpg', 2);
        else if (kind === 'pdf') await X.exportPDF(c, d, z, 'single');
        else if (kind === 'pdfa4') await X.exportPDF(c, d, z, 'a4');
        else if (kind === 'svg') X.exportSVG(c, d);
        else if (kind === 'json') X.exportJSON(serializeCanvas(), d);
        sync();
      } catch (e) {
        console.error(e);
        say('Export failed: ' + (e instanceof Error ? e.message : String(e)));
      }
    },
    async saveNow() {
      clearTimeout(timers.current.save);
      commit(true);
      await doSave();
    },
    async leave() {
      await api.saveNow();
      router.push('/infographic-maker');
    },
    setZoom,
    fit,
  };
  useEffect(() => {
    apiRef.current = api;
  });

  const sendDesignChatMessage = async (prompt: string, history: ChatMessage[]) => {
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL;
    if (!apiOrigin) throw new Error('The design assistant is not configured. Please contact support.');
    const c = canvasRef.current;
    if (!c) throw new Error('The editor is still loading. Please try again.');
    const conversation = resolveEditConversation(prompt, history);
    const scopePrompt = conversation.prompt;

    const signature = JSON.stringify({
      doc: { width: docRef.current.width, height: docRef.current.height, bg: docRef.current.bg },
      data: serializeCanvas(),
    });
    const revision = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    chatBaselineRef.current = { token: revision, signature };
    const canvasObjects = c.getObjects();
    const selectedObjects = new Set(c.getActiveObjects());
    const design = {
      name: docRef.current.name,
      width: docRef.current.width,
      height: docRef.current.height,
      background: docRef.current.bg.c1,
      objects: canvasObjects.map((object) => {
        const item = object as InfographicObject;
        return {
          type: item.type || 'object',
          name: item.name || '',
          text: typeof item.text === 'string' ? item.text.slice(0, 500) : '',
          fill: typeof item.fill === 'string' ? item.fill : '',
          fontSize: Number.isFinite(item.fontSize) ? item.fontSize : null,
          fontFamily: item.fontFamily || '',
          fontWeight: item.fontWeight || '',
          fontStyle: item.fontStyle || 'normal',
          underline: Boolean(item.underline),
          linethrough: Boolean(item.linethrough),
          textAlign: item.textAlign || '',
          opacity: Number.isFinite(item.opacity) ? item.opacity : 1,
          angle: Number.isFinite(item.angle) ? item.angle : 0,
          left: Number.isFinite(item.left) ? item.left : 0,
          top: Number.isFinite(item.top) ? item.top : 0,
          width: Number.isFinite(item.getScaledWidth()) ? item.getScaledWidth() : 0,
          height: Number.isFinite(item.getScaledHeight()) ? item.getScaledHeight() : 0,
          locked: Boolean(item.locked),
          selected: selectedObjects.has(object),
        };
      }),
    };
    const response = await fetch(`${apiOrigin.replace(/\/$/, '')}/api/ai/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: scopePrompt, history: conversation.history, design }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof result.error === 'string' ? result.error : 'The design assistant could not respond. Please try again.');
    }
    if (typeof result.inScope !== 'boolean' || typeof result.reply !== 'string' || !Array.isArray(result.operations)) {
      throw new Error('The design assistant returned an invalid response. Please try again.');
    }
    if (!result.inScope || result.operations.length === 0) {
      return { inScope: result.inScope, reply: result.reply, operations: [], preview: [], revision, scopePrompt };
    }
    if (result.operations.some((operation: unknown) => !operation || typeof operation !== 'object' || !('type' in operation))) {
      throw new Error('The assistant proposed invalid design changes. Nothing was changed.');
    }
    const operations = result.operations as ChatOperation[];
    const previewItems = operations.map((operation) => {
      if (operation.type === 'update_object') {
        const target = design.objects[operation.index];
        const label = target?.text || target?.name || `${target?.type || 'item'} ${operation.index + 1}`;
        const oldValues: Record<string, string | number | boolean> = {
          text: target?.text || '',
          fill: target?.fill || '',
          fontSize: target?.fontSize || 'default',
          fontFamily: target?.fontFamily || 'default',
          fontWeight: target?.fontWeight || 'default',
          fontStyle: target?.fontStyle || 'normal',
          underline: Boolean(target?.underline),
          linethrough: Boolean(target?.linethrough),
          textAlign: target?.textAlign || 'default',
          opacity: target?.opacity ?? 1,
          angle: target?.angle ?? 0,
          left: target?.left ?? 0,
          top: target?.top ?? 0,
        };
        const propertyNames: Record<string, string> = {
          text: 'Text',
          fill: 'Color',
          fontSize: 'Font size',
          fontFamily: 'Font',
          fontWeight: 'Font weight',
          fontStyle: 'Style',
          underline: 'Underline',
          linethrough: 'Strikethrough',
          textAlign: 'Alignment',
          opacity: 'Opacity',
          angle: 'Rotation',
          left: 'Left position',
          top: 'Top position',
        };
        const changes = Object.entries(operation.properties)
          .map(([key, value]) => {
            const before = oldValues[key] ?? 'default';
            const format = (item: string | number | boolean) => key === 'text' ? `“${item}”` : String(item);
            return `${propertyNames[key] || key}: ${format(before)} → ${format(String(value))}`;
          })
          .join(', ');
        return `“${label.slice(0, 60)}”: ${changes || 'no properties specified'}`;
      }
      if (operation.type === 'delete_object') {
        const target = design.objects[operation.index];
        return `Delete “${(target?.text || target?.name || `item ${operation.index + 1}`).slice(0, 60)}”`;
      }
      if (operation.type === 'scale_object') {
        const target = design.objects[operation.index];
        const label = target?.text || target?.name || `${target?.type || 'item'} ${operation.index + 1}`;
        return `Resize “${label.slice(0, 60)}” by ${Math.round((operation.factor - 1) * 100)}%`;
      }
      if (operation.type === 'add_text') return `Add text: “${operation.text.slice(0, 80)}”`;
      if (operation.type === 'set_background') return `Set page background to ${operation.color}`;
      if (operation.type === 'resize_page') return `Resize page to ${operation.width ?? design.width} × ${operation.height ?? design.height}`;
      if (operation.type === 'set_theme') return `Apply the ${THEMES[operation.theme].name} theme while keeping existing content and layout`;
      if (operation.type === 'apply_template') return `Replace the current design with the “${operation.templateId}” layout`;
      if (operation.type === 'arrange_objects') return `Arrange ${operation.indexes.length} objects into a ${operation.layout} layout`;
      if (operation.type === 'update_many') {
        const property = Object.entries(operation.properties).map(([key, value]) => `${key}: ${String(value)}`).join(', ');
        return `Change ${operation.indexes.length} selected items (${property})`;
      }
      throw new Error('The assistant proposed an unsupported design change. Nothing was changed.');
    });
    const preview = previewItems.length > 8
      ? [...previewItems.slice(0, 8), `…and ${previewItems.length - 8} more changes`]
      : previewItems;
    return { inScope: result.inScope, reply: result.reply, operations, preview, revision, scopePrompt };
  };

  const applyAIEditOperations = async (operations: ChatOperation[], prompt: string, revision: string) => {
    const c = canvasRef.current;
    const F = Fref.current;
    if (!c || !F) throw new Error('Could not apply the requested design changes.');
    const baseline = chatBaselineRef.current;
    if (!baseline || baseline.token !== revision) throw new Error('This preview has expired. Send your request again.');
    const currentSignature = JSON.stringify({
      doc: { width: docRef.current.width, height: docRef.current.height, bg: docRef.current.bg },
      data: serializeCanvas(),
    });
    if (baseline.signature !== currentSignature) throw new Error('The design changed while the assistant was preparing edits. Nothing was changed; please send the request again.');

    const expandedOperations = operations.flatMap((operation) =>
      operation.type === 'update_many'
        ? operation.indexes.map((index) => ({ type: 'update_object' as const, index, properties: operation.properties }))
        : [operation]
    );
    const objects = c.getObjects();
    const fontNames: string[] = [];
    const additions: FabricObject[] = [];
    const isHexColor = (value: string) => /^#[\da-f]{6}$/i.test(value);
    const isAvailableFont = (value: string) => FONTS.some(({ n }) => n === value);
    assertDesignEditScope(prompt, expandedOperations, objects as InfographicObject[], { userApproved: true });

    if (operations.some((operation) => operation.type === 'apply_template') && operations.length !== 1) {
      throw new Error('A template replacement cannot be combined with other design edits.');
    }
    const templateChange = operations.find((operation) => operation.type === 'apply_template');
    if (templateChange?.type === 'apply_template') {
      const template = getTemplate(templateChange.templateId);
      if (!template) throw new Error('The requested layout is not available.');
      hist.current.lock = true;
      try {
        c.discardActiveObject();
        c.clear();
        await ensureFonts(
          template.objects
            .map((object) => object.fontFamily)
            .filter((font): font is string => Boolean(font))
            .concat(['Inter', 'Poppins', 'Playfair Display'])
        );
        setDoc({ width: template.width, height: template.height, bg: template.bg });
        layout();
        await buildTemplate(F, c, template);
        metaRef.current.templateId = template.id;
      } finally {
        hist.current.lock = false;
      }
      commit(true);
      fit();
      sync();
      chatBaselineRef.current = null;
      say(`Applied the ${template.name} layout.`);
      return;
    }
    for (const operation of operations) {
      if (operation.type === 'scale_object') {
        if (!Number.isInteger(operation.index) || operation.index < 0 || operation.index >= objects.length) {
          throw new Error('The assistant referenced an item that no longer exists. Please try again.');
        }
        const target = objects[operation.index] as InfographicObject;
        if (target.locked) throw new Error('The assistant cannot edit locked design items.');
        if (!Number.isFinite(operation.factor) || operation.factor < 0.1 || operation.factor > 10) {
          throw new Error('The assistant returned an invalid item size.');
        }
        const scaledWidth = target.getScaledWidth() * operation.factor;
        const scaledHeight = target.getScaledHeight() * operation.factor;
        if (scaledWidth > docRef.current.width || scaledHeight > docRef.current.height) {
          throw new Error('The requested item size does not fit within the page.');
        }
      }
      if (operation.type === 'arrange_objects' &&
        (operation.indexes.length < 2 ||
          operation.indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= objects.length || (objects[index] as InfographicObject).locked) ||
          (operation.gap !== undefined && (!Number.isFinite(operation.gap) || operation.gap < 0 || operation.gap > 300)))) {
        throw new Error('The assistant returned an invalid section layout. Nothing was changed.');
      }
    }

    for (const operation of expandedOperations) {
      if (operation.type === 'update_object' || operation.type === 'delete_object') {
        if (!Number.isInteger(operation.index) || operation.index < 0 || operation.index >= objects.length) {
          throw new Error('The assistant referenced an item that no longer exists. Please try again.');
        }
        const target = objects[operation.index] as InfographicObject;
        if (target.locked) throw new Error('The assistant cannot edit locked design items.');
        if (operation.type === 'update_object') {
          const props = operation.properties;
          if (props.text !== undefined && (typeof props.text !== 'string' || props.text.length > 500)) throw new Error('The assistant returned invalid text.');
          if (props.text !== undefined && !/text/i.test(target.type || '')) throw new Error('Text edits can only be applied to text items.');
          if (props.fill !== undefined && !isHexColor(props.fill)) throw new Error('The assistant returned an invalid color.');
          if (props.fontSize !== undefined && (!Number.isFinite(props.fontSize) || props.fontSize < 8 || props.fontSize > 180)) throw new Error('The assistant returned an invalid font size.');
          if (props.opacity !== undefined && (!Number.isFinite(props.opacity) || props.opacity < 0 || props.opacity > 1)) throw new Error('The assistant returned an invalid opacity.');
          if (props.angle !== undefined && (!Number.isFinite(props.angle) || props.angle < -360 || props.angle > 360)) throw new Error('The assistant returned an invalid angle.');
          if ((props.left !== undefined && !Number.isFinite(props.left)) || (props.top !== undefined && !Number.isFinite(props.top))) {
            throw new Error('The assistant returned an invalid position.');
          }
          if (props.fontWeight !== undefined && !(typeof props.fontWeight === 'string' || (Number.isFinite(props.fontWeight) && props.fontWeight >= 100 && props.fontWeight <= 900))) {
            throw new Error('The assistant returned an invalid font weight.');
          }
          if (props.textAlign !== undefined && !['left', 'center', 'right', 'justify'].includes(props.textAlign)) {
            throw new Error('The assistant returned an invalid text alignment.');
          }
          if (props.fontFamily) {
            if (!isAvailableFont(props.fontFamily)) throw new Error('The assistant selected an unsupported font.');
            if (!/text/i.test(target.type || '')) throw new Error('Typography changes can only be applied to text items.');
            fontNames.push(props.fontFamily);
          }
          if ((props.fontSize !== undefined || props.fontWeight !== undefined || props.fontFamily !== undefined ||
            props.fontStyle !== undefined || props.underline !== undefined || props.linethrough !== undefined ||
            props.textAlign !== undefined) && !/text/i.test(target.type || '')) {
            throw new Error('Typography changes can only be applied to text items.');
          }
        }
      } else if (operation.type === 'add_text') {
        if (!operation.text.trim() || operation.text.length > 300) throw new Error('The assistant returned invalid text.');
        if (operation.fill && !isHexColor(operation.fill)) throw new Error('The assistant returned an invalid color.');
        if (operation.fontSize !== undefined && (!Number.isFinite(operation.fontSize) || operation.fontSize < 8 || operation.fontSize > 120)) throw new Error('The assistant returned an invalid font size.');
        if (operation.fontFamily) {
          if (!isAvailableFont(operation.fontFamily)) throw new Error('The assistant selected an unsupported font.');
          fontNames.push(operation.fontFamily);
        }
      } else if (operation.type === 'set_background' && !isHexColor(operation.color)) {
        throw new Error('The assistant returned an invalid background color.');
      } else if (operation.type === 'resize_page' &&
        ((operation.width !== undefined && (!Number.isFinite(operation.width) || operation.width < 200 || operation.width > 4000)) ||
          (operation.height !== undefined && (!Number.isFinite(operation.height) || operation.height < 200 || operation.height > MAX_PAGE_HEIGHT)) ||
          (operation.width === undefined && operation.height === undefined))) {
        throw new Error('The assistant returned invalid page dimensions.');
      } else if (operation.type === 'set_theme' && !(operation.theme in THEMES)) {
        throw new Error('The assistant selected an unsupported design theme.');
      }
    }

    await ensureFonts(fontNames);
    for (const operation of expandedOperations) {
      if (operation.type === 'add_text') {
        const object = await createObject(F, {
          type: 'text',
          text: operation.text,
          fontSize: clamp(operation.fontSize || 32, 8, 120),
          fill: operation.fill || '#0F172A',
          fontFamily: operation.fontFamily || 'Inter',
          width: Math.min(600, docRef.current.width - 40),
          name: 'AI text',
        });
        if (operation.left === undefined || operation.top === undefined) placeCenter(object);
        object.set({
          left: clamp(operation.left ?? object.left ?? 0, 0, docRef.current.width - 20),
          top: clamp(operation.top ?? object.top ?? 0, 0, docRef.current.height - 20),
        });
        additions.push(object);
      }
    }

    hist.current.lock = true;
    try {
      for (const operation of expandedOperations) {
        if (operation.type === 'update_object') {
          const target = objects[operation.index] as InfographicObject;
          const {
            text,
            fill,
            fontSize,
            fontFamily,
            fontWeight,
            textAlign,
            opacity,
            angle,
            left,
            top,
          } = operation.properties;
          const properties: Record<string, unknown> = {};
          if (text !== undefined) properties.text = text;
          if (fill !== undefined) properties.fill = fill;
          if (fontSize !== undefined) properties.fontSize = fontSize;
          if (fontFamily !== undefined) properties.fontFamily = fontFamily;
          if (fontWeight !== undefined) properties.fontWeight = fontWeight;
          if (operation.properties.fontStyle !== undefined) properties.fontStyle = operation.properties.fontStyle;
          if (operation.properties.underline !== undefined) properties.underline = operation.properties.underline;
          if (operation.properties.linethrough !== undefined) properties.linethrough = operation.properties.linethrough;
          if (textAlign !== undefined) properties.textAlign = textAlign;
          if (opacity !== undefined) properties.opacity = opacity;
          if (angle !== undefined) properties.angle = angle;
          if (left !== undefined) properties.left = clamp(left, 0, docRef.current.width - 20);
          if (top !== undefined) properties.top = clamp(top, 0, docRef.current.height - 20);
          target.set(properties);
          if (/text/i.test(target.type || '') && 'initDimensions' in target && typeof target.initDimensions === 'function') target.initDimensions();
          target.dirty = true;
          target.setCoords();
        } else if (operation.type === 'delete_object') {
          c.remove(objects[operation.index]);
        } else if (operation.type === 'set_background') {
          setDoc({ bg: { type: 'solid', c1: operation.color } });
          layout();
        } else if (operation.type === 'resize_page') {
          const width = operation.width ?? docRef.current.width;
          const height = operation.height ?? docRef.current.height;
          setDoc({ width, height });
          layout();
        } else if (operation.type === 'set_theme') {
          const theme = THEMES[operation.theme];
          const palette = theme.palette;
          let accentIndex = 0;
          const recolor = (object: FabricObject) => {
            const fill = object.fill;
            if (typeof fill === 'string' && /^#[\da-f]{6}$/i.test(fill)) {
              const rgb = fill.slice(1).match(/.{2}/g)?.map((part) => parseInt(part, 16)) || [0, 0, 0];
              const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
              const isTextObject = /text/i.test(object.type || '');
              if (isTextObject) {
                object.set('fill', luminance > 0.9 ? theme.darkBandText : luminance < 0.15 ? theme.textColor : luminance < 0.65 ? theme.mutedText : theme.primary);
              } else if (luminance > 0.94) {
                object.set('fill', theme.cardBg);
              } else if (luminance < 0.12) {
                object.set('fill', theme.darkBandBg);
              } else if (luminance < 0.35) {
                object.set('fill', theme.cardBorder);
              } else {
                object.set('fill', palette[accentIndex++ % palette.length]);
              }
            }
            const stroke = object.stroke;
            if (typeof stroke === 'string' && /^#[\da-f]{6}$/i.test(stroke)) {
              object.set('stroke', theme.primary);
            }
            if ('getObjects' in object && typeof object.getObjects === 'function') {
              object.getObjects().forEach(recolor);
            }
            object.dirty = true;
            object.setCoords();
          };
          objects.forEach(recolor);
          setDoc({ bg: { type: 'solid', c1: theme.bg } });
          layout();
        } else if (operation.type === 'scale_object') {
          const target = objects[operation.index];
          const scaledWidth = target.getScaledWidth() * operation.factor;
          const scaledHeight = target.getScaledHeight() * operation.factor;
          target.set({
            scaleX: (target.scaleX || 1) * operation.factor,
            scaleY: (target.scaleY || 1) * operation.factor,
            left: clamp(target.left || 0, 0, docRef.current.width - scaledWidth),
            top: clamp(target.top || 0, 0, docRef.current.height - scaledHeight),
          });
          target.dirty = true;
          target.setCoords();
        }
      }
      for (const operation of operations) {
        if (operation.type !== 'arrange_objects') continue;
        const arranged = operation.indexes.map((index) => objects[index]).sort((a, b) => {
          const primary = operation.layout === 'horizontal' ? a.left - b.left : a.top - b.top;
          return primary || objects.indexOf(a) - objects.indexOf(b);
        });
        const bounds = arranged.reduce(
          (box, object) => ({
            left: Math.min(box.left, object.left || 0),
            top: Math.min(box.top, object.top || 0),
            right: Math.max(box.right, (object.left || 0) + object.getScaledWidth()),
            bottom: Math.max(box.bottom, (object.top || 0) + object.getScaledHeight()),
          }),
          { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
        );
        const gap = operation.gap ?? 16;
        if (operation.layout === 'horizontal') {
          const totalWidth = arranged.reduce((total, object) => total + object.getScaledWidth(), 0) + gap * (arranged.length - 1);
          let left = clamp((bounds.left + bounds.right - totalWidth) / 2, 0, Math.max(0, docRef.current.width - totalWidth));
          const centerY = (bounds.top + bounds.bottom) / 2;
          arranged.forEach((object) => {
            object.set({
              left,
              top: clamp(centerY - object.getScaledHeight() / 2, 0, Math.max(0, docRef.current.height - object.getScaledHeight())),
            });
            left += object.getScaledWidth() + gap;
            object.setCoords();
          });
        } else if (operation.layout === 'vertical') {
          const totalHeight = arranged.reduce((total, object) => total + object.getScaledHeight(), 0) + gap * (arranged.length - 1);
          let top = clamp((bounds.top + bounds.bottom - totalHeight) / 2, 0, Math.max(0, docRef.current.height - totalHeight));
          const centerX = (bounds.left + bounds.right) / 2;
          arranged.forEach((object) => {
            object.set({
              left: clamp(centerX - object.getScaledWidth() / 2, 0, Math.max(0, docRef.current.width - object.getScaledWidth())),
              top,
            });
            top += object.getScaledHeight() + gap;
            object.setCoords();
          });
        } else {
          const columns = Math.ceil(Math.sqrt(arranged.length));
          const rows = Math.ceil(arranged.length / columns);
          const cellWidth = Math.max(...arranged.map((object) => object.getScaledWidth()));
          const cellHeight = Math.max(...arranged.map((object) => object.getScaledHeight()));
          const gridWidth = columns * cellWidth + (columns - 1) * gap;
          const gridHeight = rows * cellHeight + (rows - 1) * gap;
          const startX = clamp((bounds.left + bounds.right - gridWidth) / 2, 0, Math.max(0, docRef.current.width - gridWidth));
          const startY = clamp((bounds.top + bounds.bottom - gridHeight) / 2, 0, Math.max(0, docRef.current.height - gridHeight));
          arranged.forEach((object, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            object.set({
              left: startX + column * (cellWidth + gap) + (cellWidth - object.getScaledWidth()) / 2,
              top: startY + row * (cellHeight + gap) + (cellHeight - object.getScaledHeight()) / 2,
            });
            object.setCoords();
          });
        }
      }
      additions.forEach((object) => c.add(object));
      c.requestRenderAll();
    } finally {
      hist.current.lock = false;
    }
    sync();
    commit(true);
    chatBaselineRef.current = null;
    say('Design updated. You can undo this change at any time.');
  };

  /* ---------- keyboard shortcuts ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = apiRef.current;
      if (!a?.canvas) return;
      if (e.target instanceof Element && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if ((a.canvas.getActiveObject() as InfographicObject | undefined)?.isEditing) return;
      const key = e.key.toLowerCase();
      if (e.ctrlKey || e.metaKey) {
        const actions: Record<string, () => void> = {
          z: () => {
            if (e.shiftKey) void a.redo();
            else void a.undo();
          },
          y: () => {
            void a.redo();
          },
          c: () => {
            void a.copy();
          },
          v: () => {
            void a.paste();
          },
          d: () => {
            void a.duplicate();
          },
          a: () => {
            a.selectAll();
          },
          s: () => {
            void a.saveNow();
            a.say('Saved');
          },
        };
        const action = actions[key];
        if (action) {
          e.preventDefault();
          action();
          return;
        }
      }
      if (key === 'delete' || key === 'backspace') {
        e.preventDefault();
        a.remove();
      } else if (key === 'escape') {
        if (editingGroupRef.current) exitBlockEditing(true);
        else a.deselect();
      } else if (key.startsWith('arrow')) {
        e.preventDefault();
        const distance = e.shiftKey ? 10 : 1;
        const [dx, dy] = ARROW_NUDGES[key] || [0, 0];
        a.nudge(dx * distance, dy * distance);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exitBlockEditing]);

  if (authStatus !== 'authenticated' || !userId) {
    return <div className="ie-boot">Checking your account…</div>;
  }

  // Function to handle listing the custom infographic on the website
  const handleListOnWebsite = async () => {
    const canvas = canvasRef.current;
    const doc = docRef.current;
    if (!canvas) return;

    try {
      setIsPublishing(true);
      say('Preparing your infographic for submission...');

      const dataUrl = X.toDataURL(canvas, doc, zoomRef.current, {
        format: 'png',
        scale: 2,
      });

      const apiOrigin = process.env.NEXT_PUBLIC_API_URL;
      if (!apiOrigin) {
        throw new Error('NEXT_PUBLIC_API_URL is not configured.');
      }

      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'custom-infographic.png');

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client-infographics/temp-upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await uploadRes.json();

      if (!uploadRes.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to process image');
      }

      const imageUrl = new URL(data.imageUrl, apiOrigin).toString();
      router.push(`/submit-infographics?temp_image=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
      console.error('Could not prepare infographic for submission:', error);
      say(error instanceof Error ? error.message : 'Could not prepare infographic. Please try again.');
      setIsPublishing(false);
    }
  };
  return (
    <div className="ie-app">
      <TopBar api={api} doc={doc} zoom={zoom} status={status} flags={flags} handleListClick={handleListOnWebsite} isPublishing={isPublishing} />
      <div className="ie-body">
        <LeftPanel api={api} doc={doc} userId={userId} />
        <main className="ie-work" ref={scrollRef}>
          <div className="ie-stage">
            <div className="ie-sheet" ref={hostRef} style={{ width: doc.width * zoom, height: doc.height * zoom }} />
          </div>
          {!ready && <div className="ie-boot">Loading editor…</div>}
        </main>
        <RightPanel api={api} doc={doc} selection={selection} tick={tick} />
      </div>
      {ready && chatOpen ? (
        <DesignChat onSend={sendDesignChatMessage} onApply={applyAIEditOperations} onClose={() => setChatOpen(false)} />
      ) : ready ? (
        <DesignChatButton onClick={() => setChatOpen(true)} />
      ) : null}
      {toast && <div className="ie-toast">{toast}</div>}
    </div>
  );
}
