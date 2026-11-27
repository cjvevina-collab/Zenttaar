import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pipette } from 'lucide-react';

interface ColorPickerFieldProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function normalizeHex(input: string): string | null {
  const clean = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `#${clean.toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const expanded = clean
      .split('')
      .map((c) => c + c)
      .join('');
    return `#${expanded.toUpperCase()}`;
  }
  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const norm = normalizeHex(hex) || '#141418';
  const num = parseInt(norm.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (h >= 0 && h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h >= 60 && h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h >= 120 && h < 180) [rp, gp, bp] = [0, c, x];
  else if (h >= 180 && h < 240) [rp, gp, bp] = [0, x, c];
  else if (h >= 240 && h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  return `#${toHex(rp)}${toHex(gp)}${toHex(bp)}`;
}

export function describeColorName(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, v } = rgbToHsv(r, g, b);

  if (v < 15) return 'Obsidian Black';
  if (s < 12) {
    if (v > 88) return 'Pure Ivory White';
    if (v > 65) return 'Heather Silver';
    if (v > 38) return 'Storm Grey';
    return 'Charcoal Graphite';
  }

  const tone = v < 40 ? 'Deep ' : v > 80 && s < 45 ? 'Soft ' : '';
  if (h < 15 || h >= 345) return `${tone}Crimson Red`;
  if (h < 35) return v < 45 ? 'Espresso Brown' : `${tone}Burnt Orange`;
  if (h < 55) return `${tone}Amber Gold`;
  if (h < 78) return `${tone}Olive Moss`;
  if (h < 155) return `${tone}Emerald Green`;
  if (h < 190) return `${tone}Teal Cyan`;
  if (h < 250) return `${tone}Royal Blue`;
  if (h < 285) return `${tone}Indigo Violet`;
  if (h < 325) return `${tone}Plum Magenta`;
  return `${tone}Rose Burgundy`;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  value,
  onChange,
  label = 'Custom Dye Color (Pick Any Shade)',
}) => {
  const safeHex = normalizeHex(value) || '#141418';
  const initialRgb = hexToRgb(safeHex);
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);

  const [hsv, setHsv] = useState(initialHsv);
  const hsvRef = useRef(initialHsv);
  const svBoxRef = useRef<HTMLDivElement | null>(null);
  const hueBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const norm = normalizeHex(value);
    if (!norm) return;
    const currentHex = hsvToHex(hsvRef.current.h, hsvRef.current.s, hsvRef.current.v);
    if (norm === currentHex) return;
    const { r, g, b } = hexToRgb(norm);
    const nextHsv = rgbToHsv(r, g, b);
    const next = {
      h: nextHsv.s === 0 ? hsvRef.current.h : nextHsv.h,
      s: nextHsv.s,
      v: nextHsv.v,
    };
    hsvRef.current = next;
    setHsv(next);
  }, [value]);

  const updateFromSvPointer = useCallback(
    (clientX: number, clientY: number) => {
      const box = svBoxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const v = clamp((1 - (clientY - rect.top) / rect.height) * 100, 0, 100);
      const next = { ...hsvRef.current, s, v };
      hsvRef.current = next;
      const nextHex = hsvToHex(next.h, next.s, next.v);
      setHsv(next);
      onChange(nextHex);
    },
    [onChange]
  );

  const updateFromHuePointer = useCallback(
    (clientX: number) => {
      const bar = hueBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      if (rect.width === 0) return;
      const h = clamp(((clientX - rect.left) / rect.width) * 360, 0, 359.9);
      const next = { ...hsvRef.current, h };
      hsvRef.current = next;
      const nextHex = hsvToHex(next.h, next.s, next.v);
      setHsv(next);
      onChange(nextHex);
    },
    [onChange]
  );

  const startSvDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromSvPointer(e.clientX, e.clientY);
  };

  const moveSvDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromSvPointer(e.clientX, e.clientY);
  };

  const startHueDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromHuePointer(e.clientX);
  };

  const moveHueDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromHuePointer(e.clientX);
  };

  const handleNativeColorChange = (raw: string) => {
    const norm = normalizeHex(raw);
    if (!norm) return;
    const { r, g, b } = hexToRgb(norm);
    const parsed = rgbToHsv(r, g, b);
    const next = {
      h: parsed.s === 0 ? hsvRef.current.h : parsed.h,
      s: parsed.s,
      v: parsed.v,
    };
    hsvRef.current = next;
    setHsv(next);
    onChange(norm);
  };

  const pureHueColor = hsvToHex(hsv.h, 100, 100);
  const colorLabel = describeColorName(safeHex);

  return (
    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/90 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
        <div className="inline-flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5">
          <span
            className="h-4 w-7 rounded border border-white/35 shadow-inner shrink-0"
            style={{ backgroundColor: safeHex }}
          />
          <span className="text-xs font-semibold text-white">{colorLabel}</span>
        </div>
      </div>

      {/* 2D Saturation / Brightness Spectrum Area */}
      <div
        ref={svBoxRef}
        onPointerDown={startSvDrag}
        onPointerMove={moveSvDrag}
        role="slider"
        aria-label="Color saturation and brightness picker"
        aria-valuetext={colorLabel}
        tabIndex={0}
        className="relative h-36 w-full cursor-crosshair select-none overflow-hidden rounded-lg border border-zinc-700/80 touch-none"
        style={{ backgroundColor: pureHueColor }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.8)]"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: safeHex,
          }}
        />
      </div>

      {/* Full Rainbow Hue Bar */}
      <div
        ref={hueBarRef}
        onPointerDown={startHueDrag}
        onPointerMove={moveHueDrag}
        role="slider"
        aria-label="Color hue slider"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        tabIndex={0}
        className="relative h-4 w-full cursor-ew-resize select-none rounded-full border border-zinc-700/80 touch-none"
        style={{
          background:
            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: pureHueColor }}
        />
      </div>

      {/* Visual Selected Color Preview + System Color Wheel / Eyedropper */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <span
            className="h-9 w-14 rounded-lg border border-white/30 shadow-md shrink-0"
            style={{ backgroundColor: safeHex }}
            aria-label={`Selected color preview: ${colorLabel}`}
          />
          <div className="text-xs">
            <div className="font-semibold text-white">Chosen Garment Color</div>
            <div className="text-zinc-400">{colorLabel}</div>
          </div>
        </div>

        <label
          title="Open system color wheel or eyedropper"
          className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 text-xs font-medium text-zinc-200 hover:border-amber-500 transition-colors cursor-pointer shrink-0"
        >
          <Pipette className="h-3.5 w-3.5 text-amber-400" />
          <span>Choose Color</span>
          <input
            type="color"
            value={safeHex}
            onChange={(e) => handleNativeColorChange(e.target.value)}
            aria-label="System color picker"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
};
