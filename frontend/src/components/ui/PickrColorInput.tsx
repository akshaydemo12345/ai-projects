import { useEffect, useRef } from "react";
import Pickr from "@simonwep/pickr";
import "@simonwep/pickr/dist/themes/monolith.min.css";

interface PickrColorInputProps {
  value: string;
  onChange: (color: string, isFinal?: boolean) => void;
  className?: string;
}

// Normalize any hex string to a valid hex (#RRGGBB or #RRGGBBAA)
const toHexAny = (hex: string): string => {
  if (!hex) return '#000000';
  if (hex.startsWith('#') && (hex.length === 9 || hex.length === 7)) return hex;
  if (hex.startsWith('#') && hex.length === 5) { // #RGBA -> #RRGGBBAA
    const [, r, g, b, a] = hex;
    return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
  }
  if (hex.startsWith('#') && hex.length === 4) {
    const [, r, g, b] = hex;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return hex.length === 6 ? `#${hex}` : hex.length === 8 ? `#${hex}` : '#000000';
};

export const PickrColorInput = ({ value, onChange, className = "" }: PickrColorInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pickrRef = useRef<Pickr | null>(null);
  const isUpdatingRef = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const pickr = Pickr.create({
      el: containerRef.current,
      theme: "monolith",
      default: toHexAny(value) || "#7c3aed",
      useAsButton: true,
      components: {
        preview: true,
        opacity: true, // Enable opacity to support transparent backgrounds
        hue: true,
        interaction: {
          hex: true,
          input: true,
          save: true,
        },
      },
    });

    pickr.on("show", () => {
      isOpenRef.current = true;
    });

    pickr.on("hide", (instance: Pickr) => {
      isOpenRef.current = false;
      const color = instance.getColor();
      if (color) {
        const hex = toHexAny(color.toHEXA().toString());
        isUpdatingRef.current = true;
        onChange(hex, true);
        setTimeout(() => { isUpdatingRef.current = false; }, 0);
      }
    });

    // Live update as user drags the color picker (real-time preview)
    pickr.on("change", (color: Pickr.HSVaColor) => {
      const hex = toHexAny(color.toHEXA().toString());
      isUpdatingRef.current = true;
      onChange(hex, false);
      setTimeout(() => { isUpdatingRef.current = false; }, 0);
    });

    // Also fire on Save click (closes the picker)
    pickr.on("save", (color: Pickr.HSVaColor) => {
      const hex = toHexAny(color.toHEXA().toString());
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
    if (pickrRef.current && !isOpenRef.current && !isUpdatingRef.current && value) {
      try {
        pickrRef.current.setColor(toHexAny(value), true);
      } catch {
        // ignore invalid color strings
      }
    }
  }, [value]);

  return (
    <div className="flex items-center gap-1.5">
      <div
        ref={containerRef}
        className={`h-6 w-6 rounded cursor-pointer flex-shrink-0 border border-border/40 shadow-sm ${className}`}
        style={{ backgroundColor: toHexAny(value) }}
        title={value}
      />
    </div>
  );
};

export default PickrColorInput;
