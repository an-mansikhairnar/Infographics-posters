import type { Canvas } from 'fabric';
import type { AssetRecord, Background, ChartDatum, DesignRecord, ImageEffects, InfographicObject as BaseInfographicObject, ObjectDescriptor, Template } from '@/lib/infographic/types';

export type InfographicObject = BaseInfographicObject & {
  chartData?: ChartDatum[];
  chartStyle?: { fontFamily?: string; textColor?: string };
  chartType?: string;
  chartWidth?: number;
  chartHeight?: number;
  fx?: ImageEffects;
  locked?: boolean;
  name?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  underline?: boolean;
  linethrough?: boolean;
  textAlign?: string;
  lineHeight?: number;
  charSpacing?: number;
  textBackgroundColor?: string;
  strokeWidth?: number;
  rx?: number;
  ry?: number;
  isEditing?: boolean;
};

export type EditorDocument = {
  name: string;
  width: number;
  height: number;
  bg: Background;
};

export type EditorStatus = 'saved' | 'saving' | 'dirty' | 'error';

export type EditorApi = {
  readonly canvas: Canvas | null;
  say(message: string): void;
  addObject(descriptor: ObjectDescriptor): Promise<InfographicObject>;
  addImage(url: string): Promise<InfographicObject | void>;
  setBgImage(url: string): Promise<void>;
  update(properties: Record<string, unknown>): void;
  setFont(name: string): Promise<void>;
  setCase(upper: boolean): void;
  setShadow(object: InfographicObject, shadow: NonNullable<InfographicObject['shadow']> | null): void;
  setFx(object: InfographicObject, patch: ImageEffects): void;
  updateChart(object: InfographicObject, patch: { chartType?: string; data?: ChartDatum[]; style?: { fontFamily?: string; textColor?: string } }): Promise<void>;
  remove(): void;
  duplicate(): Promise<void>;
  copy(): Promise<void>;
  paste(): Promise<void>;
  order(kind: 'front' | 'forward' | 'backward' | 'back'): void;
  align(kind: 'l' | 'c' | 'r' | 't' | 'm' | 'b'): void;
  flip(axis: 'x' | 'y'): void;
  toggleLock(object: InfographicObject): void;
  toggleVisible(object: InfographicObject): void;
  select(object: InfographicObject): void;
  removeObject(object: InfographicObject): void;
  moveLayer(object: InfographicObject, direction: number): void;
  group(): void;
  selectAll(): void;
  nudge(dx: number, dy: number): void;
  deselect(): void;
  undo(): Promise<void>;
  redo(): Promise<void>;
  setName(name: string): void;
  resizePage(width: number, height: number): void;
  extendPage(height: number): void;
  setBg(background: Background): void;
  applyTemplate(template: Template): Promise<void>;
  exportAs(kind: string): Promise<void>;
  saveNow(): Promise<void>;
  leave(): Promise<void>;
  setZoom(zoom: number): void;
  fit(): void;
};

export type PanelProps = Readonly<{
  api: EditorApi;
  doc: EditorDocument;
}>;

export type TemplatePreviewProps = Readonly<{
  tpl: Template;
  width?: number;
}>;

export type DesignCard = Pick<DesignRecord, 'id' | 'name' | 'width' | 'height' | 'thumb' | 'updatedAt'>;
export type UploadedAsset = AssetRecord;
