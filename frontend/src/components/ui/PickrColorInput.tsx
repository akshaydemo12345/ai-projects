import { useEffect, useRef } from "react";
import Pickr from "@simonwep/pickr";
import "@simonwep/pickr/dist/themes/monolith.min.css";

interface PickrColorInputProps {
  value: string;
  onChange: (color: string, isFinal?: boolean) => void;
  className?: string;
}

// Normalize any hex string to a valid 6-character hex (#RRGGBB)
const toHex6 = (hex: string): string => {
  if (!hex) return '#000000';
  // Strip alpha channel from 8-char hex (e.g. #RRGGBBFF → #RRGGBB)
  if (hex.startsWith('#') && hex.length === 9) return hex.slice(0, 7);
  if (hex.startsWith('#') && hex.length === 7) return hex;
  if (hex.startsWith('#') && hex.length === 4) {
    const [, r, g, b] = hex;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return hex.length === 6 ? `#${hex}` : '#000000';
};

export const PickrColorInput = ({ value, onChange, className = "" }: PickrColorInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pickrRef = useRef<Pickr | null>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const pickr = Pickr.create({
      el: containerRef.current,
      theme: "monolith",
      default: toHex6(value) || "#7c3aed",
      useAsButton: true,
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: true,
          input: true,
          save: true,
        },
      },
    });

    // Live update as user drags the color picker (real-time preview)
    pickr.on("change", (color: Pickr.HSVaColor) => {
      const hex = toHex6(color.toHEXA().toString());
      isUpdatingRef.current = true;
      onChange(hex, false);
      setTimeout(() => { isUpdatingRef.current = false; }, 0);
    });

    // Also fire on Save click (closes the picker)
    pickr.on("save", (color: Pickr.HSVaColor) => {
      const hex = toHex6(color.toHEXA().toString());
      isUpdatingRef.current = true;
      onChange(hex, true);
      pickr.hide();
      setTimeout(() => { isUpdatingRef.current = false; }, 0);
    });

    pickrRef.current = pickr;

    return () => {
      pickr.destroyAndRemove();
      pickrRef.current = null;
    };
  }, []); // intentionally empty — only init once

  // Sync external value changes to Pickr
  useEffect(() => {
    if (pickrRef.current && !isUpdatingRef.current && value) {
      try {
        pickrRef.current.setColor(toHex6(value), true);
      } catch {
        // ignore invalid color strings
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`h-6 w-6 rounded cursor-pointer flex-shrink-0 border border-border/40 shadow-sm ${className}`}
      style={{ backgroundColor: toHex6(value) }}
      title={value}
    />
  );
};

export default PickrColorInput;
