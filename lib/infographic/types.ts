import type { Canvas, FabricObject, StaticCanvas } from 'fabric';

export type FabricApi = typeof import('fabric');
export type FabricCanvas = Canvas;
export type AnyFabricCanvas = Canvas | StaticCanvas;
export type InfographicObject = FabricObject & {
  chartData?: ChartDatum[];
  chartStyle?: { textColor?: string; fontFamily?: string };
  chartType?: string;
  fx?: ImageEffects;
  locked?: boolean;
};

export type Background =
  | { type: 'solid'; c1: string }
  | { type: 'gradient'; c1: string; c2: string };

export type ChartDatum = {
  id?: string;
  label: string;
  value: number;
  color: string;
};

export type ChartOptions = {
  chartType?: string;
  data?: ChartDatum[];
  width?: number;
  height?: number;
  textColor?: string;
  fontFamily?: string;
  left?: number;
  top?: number;
};

export type ImageEffects = {
  grayscale?: boolean;
  sepia?: boolean;
  invert?: boolean;
  brightness?: number;
  contrast?: number;
  blur?: number;
};

export type ObjectDescriptor = {
  type: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  text?: string;
  icon?: string;
  size?: number;
  src?: string;
  maxWidth?: number;
  chartType?: string;
  data?: ChartDatum[];
  chartStyle?: { fontFamily?: string; textColor?: string };
  objects?: ObjectDescriptor[];
  fontFamily?: string;
  shadow?: object;
  [key: string]: unknown;
};

export type Template = {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  bg: Background;
  objects: ObjectDescriptor[];
};

export type DesignDocument = {
  name: string;
  width: number;
  height: number;
};

export type DesignRecord = DesignDocument & {
  id: string;
  bg: Background;
  templateId: string | null;
  data: unknown;
  objects?: ObjectDescriptor[];
  thumb: string | null;
  createdAt: number;
  updatedAt: number;
};

export type DesignInput = Omit<DesignRecord, 'createdAt' | 'updatedAt'> &
  Partial<Pick<DesignRecord, 'createdAt' | 'updatedAt'>>;

export type AssetRecord = {
  id: string;
  src: string;
};

export type FontSource = {
  fontFamily?: string;
  chartStyle?: { fontFamily?: string };
  objects?: FontSource[];
};
