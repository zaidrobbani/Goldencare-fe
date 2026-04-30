'use client'
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useEffect, useRef, useState } from "react";
// ── Dropdown Component ─────────────────────────────────────────────────────────
interface DropdownProps<T extends string> {
  label: string;
  placeholder: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (val: T) => void;
  disabled?: boolean;
}

export default function Dropdown<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold font-body text-on-surface">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center justify-between bg-surface-container-low border rounded-xl px-4 py-3 text-sm font-body transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            open ? "border-primary" : "border-outline-variant"
          }`}
        >
          <span className={selected ? "text-on-surface" : "text-outline"}>
            {selected ? selected.label : placeholder}
          </span>
          <KeyboardArrowDownOutlinedIcon
            style={{ fontSize: 18 }}
            className={`text-outline transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown panel — smooth slide down */}
        <div
          className={`absolute z-50 left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-y-auto max-h-52 shadow-lg transition-all duration-200 origin-top ${
            open
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors cursor-pointer ${
                opt.value === value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}