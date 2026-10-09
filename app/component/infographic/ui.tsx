'use client';
import type { ReactNode } from 'react';
import { PALETTE } from '@/lib/infographic/constants';

const P = {
  back: 'M15 18l-6-6 6-6', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3', redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3',
  text: 'M4 7V4h16v3M9 20h6M12 4v16', shapes: 'M4 4h7v7H4zM17 13a4 4 0 100 8 4 4 0 000-8z', chart: 'M4 20V10M10 20V4M16 20v-8M2 20h20',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8.5 8.5h.01', template: 'M3 3h18v6H3zM3 13h8v8H3zM15 13h6v8h-6z',
  page: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6', trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6',
  copy: 'M9 9h11v11H9zM5 15V4h11', lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4', unlock: 'M5 11h14v10H5zM8 11V7a4 4 0 017.5-2',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeoff: 'M3 3l18 18M10.6 6.1A10 10 0 0112 6c7 0 11 6 11 6a17 17 0 01-3 3.5M6.3 6.3C3.3 8.2 1 12 1 12s4 7 11 7a10 10 0 004-.8',
  up: 'M12 19V5M5 12l7-7 7 7', down: 'M12 5v14M5 12l7 7 7-7', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
  download: 'M12 3v12M6 11l6 6 6-6M4 21h16', bold: 'M7 4h6a4 4 0 010 8H7zM7 12h7a4 4 0 010 8H7z', italic: 'M19 4h-9M14 20H5M15 4L9 20',
  underline: 'M6 4v7a6 6 0 0012 0V4M4 21h16', strike: 'M4 12h16M16 6.5C15 5 13.5 4.5 12 4.5c-2.5 0-4 1.2-4 3 0 4 8 2.5 8 7 0 1.8-1.7 3-4 3-2 0-3.7-.8-4.5-2.5',
  alignLeft: 'M3 6h18M3 12h12M3 18h16', alignCenter: 'M3 6h18M6 12h12M4 18h16', alignRight: 'M3 6h18M9 12h12M5 18h16', justify: 'M3 6h18M3 12h18M3 18h18',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', group: 'M3 3h8v8H3zM13 13h8v8h-8z', search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5',
  upload: 'M12 15V3M6 9l6-6 6 6M4 21h16', flip: 'M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z', save: 'M5 3h11l3 3v15H5zM8 3v6h7V3M8 21v-7h8v7',
  close: 'M6 6l12 12M18 6L6 18', check: 'M5 12l5 5 9-10', toFront: 'M5 4h14M12 20V8M6 14l6-6 6 6', toBack: 'M5 20h14M12 4v12M6 10l6 6 6-6',
  logo: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', hAlignL: 'M4 3v18M8 7h12v4H8zM8 14h7v4H8z', hAlignC: 'M12 3v18M5 7h14v4H5zM8 14h8v4H8z',
  hAlignR: 'M20 3v18M4 7h12v4H4zM9 14h7v4H9z', vAlignT: 'M3 4h18M7 8v12h4V8zM14 8v7h4V8z', vAlignM: 'M3 12h18M7 5h4v14H7zM14 8h4v8h-4z',
  vAlignB: 'M3 20h18M7 4v12h4V4zM14 9v7h4V9z', more: 'M5 12h.01M12 12h.01M19 12h.01',
};

export type IconName = keyof typeof P;

type IconProps = {
  name: IconName;
  size?: number;
};

type IconBtnProps = Omit<IconProps, 'name'> & {
  icon: IconName;
  title: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

type ColorProps = {
  label?: string;
  value?: string | null;
  onChange: (value: string) => void;
  none?: boolean;
  swatches?: boolean;
};

type RangeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
};

type SectionProps = {
  title: string;
  children: ReactNode;
};

export function Icon({ name, size = 18 }: Readonly<IconProps>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name] || ''} />
    </svg>
  );
}

export function IconBtn({ icon, title, active, onClick, disabled, size = 18, label }: Readonly<IconBtnProps>) {
  return (
    <button type="button" className={'ie-ibtn' + (active ? ' on' : '')} title={title} aria-label={title} onClick={onClick} disabled={disabled}>
      <Icon name={icon} size={size} />{label && <span>{label}</span>}
    </button>
  );
}

const isHex = (v: string | null | undefined): boolean => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
function toHex(v: string | null | undefined) {
  if (typeof v === 'string' && isHex(v)) return v;
  if (typeof v === 'string' && /^#[0-9a-f]{3}$/i.test(v)) return '#' + v.slice(1).split('').map((c) => c + c).join('');
  const m = typeof v === 'string' ? /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(v) : null;
  return m ? '#' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join('') : '#000000';
}

export function Color({ label, value, onChange, none = false, swatches = true }: Readonly<ColorProps>) {
  const hex = toHex(value);
  const empty = !value || value === 'transparent' || value === 'rgba(0,0,0,0)';
  return (
    <div className="ie-field">
      {label && <label>{label}</label>}
      <div className="ie-color">
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={empty ? 'none' : hex} onChange={(e) => isHex(e.target.value) && onChange(e.target.value)} spellCheck={false} />
        {none && <button type="button" className={'ie-chip' + (empty ? ' on' : '')} onClick={() => onChange('transparent')}>None</button>}
      </div>
      {swatches && (
        <div className="ie-swatches">
          {PALETTE.map((c) => <button key={c} type="button" className="ie-sw" style={{ background: c }} title={c} onClick={() => onChange(c)} />)}
        </div>
      )}
    </div>
  );
}

export function Range({ label, value, min, max, step = 1, onChange, unit = '' }: Readonly<RangeProps>) {
  return (
    <div className="ie-field">
      <label>{label}<b>{Math.round(value * 100) / 100}{unit}</b></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

export function Section({ title, children }: Readonly<SectionProps>) {
  return <div className="ie-sec"><h4>{title}</h4>{children}</div>;
}
