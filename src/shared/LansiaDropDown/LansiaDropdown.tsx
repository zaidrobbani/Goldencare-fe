"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface LansiaItem {
  id: string;
  nama: string;
  status: string;
  foto_url?: string;
}

interface LansiaDropdownProps {
  lansiaList: LansiaItem[];
  selectedId: string;
  onChange: (id: string) => void;
  isLoading: boolean;
}

// ── Status badge config ────────────────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Stabil: {
    bg: "bg-primary-fixed",
    text: "text-primary",
    dot: "bg-primary",
  },
  Observasi: {
    bg: "bg-secondary-container",
    text: "text-secondary",
    dot: "bg-secondary",
  },
  "Tinjauan Medis": {
    bg: "bg-error-container",
    text: "text-error",
    dot: "bg-error",
  },
  Kritis: {
    bg: "bg-error",
    text: "text-on-error",
    dot: "bg-on-error",
  },
};

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? {
    bg: "bg-surface-container",
    text: "text-on-surface-variant",
    dot: "bg-outline",
  };

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ nama, fotoUrl }: { nama: string; fotoUrl?: string }) {
  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (fotoUrl) {
    return (
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-outline-variant">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fotoUrl} alt={nama} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-on-surface-variant border border-outline-variant">
      {fotoUrl ? (
        <AccountCircleOutlinedIcon fontSize="small" />
      ) : (
        <span className="text-[10px] font-bold font-headline">{initials}</span>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LansiaDropdown({
  lansiaList,
  selectedId,
  onChange,
  isLoading,
}: LansiaDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selected = lansiaList.find((l) => l.id === selectedId);

  // ── Animate open/close ───────────────────────────────────────────────────────
  useEffect(() => {
    const list = listRef.current;
    const arrow = arrowRef.current;
    if (!list) return;

    if (isOpen) {
      gsap.fromTo(
        list,
        { autoAlpha: 0, y: -8, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
        }
      );
      gsap.to(arrow, { rotation: 180, duration: 0.22, ease: "power2.out" });
    } else {
      gsap.to(list, {
        autoAlpha: 0,
        y: -8,
        scale: 0.97,
        duration: 0.18,
        ease: "power2.in",
      });
      gsap.to(arrow, { rotation: 0, duration: 0.18, ease: "power2.in" });
    }
  }, [isOpen]);

  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      {/* ── Trigger ── */}
      <div
        ref={triggerRef}
        onClick={() => !isLoading && setIsOpen((v) => !v)}
        className={`flex items-center gap-2 bg-surface-container rounded-2xl px-3 py-2 border border-outline-variant transition-colors select-none ${
          isLoading
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:bg-surface-container-high"
        }`}
      >
        <Avatar nama={selected?.nama ?? "?"} fotoUrl={selected?.foto_url} />

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold font-headline text-on-surface leading-tight truncate">
            {isLoading ? "Memuat..." : (selected?.nama ?? "Pilih Lansia")}
          </span>
          {selected ? (
            <span
              className={`text-[10px] font-bold font-label px-2 py-0.5 rounded-full self-start mt-0.5 ${getStatusConfig(selected.status).bg} ${getStatusConfig(selected.status).text}`}
            >
              {selected.status}
            </span>
          ) : (
            <span className="text-xs text-on-surface-variant font-body">Belum dipilih</span>
          )}
        </div>

        <KeyboardArrowDownIcon
          ref={arrowRef}
          fontSize="small"
          className="text-on-surface-variant ml-1 shrink-0"
          style={{ transformOrigin: "center" }}
        />
      </div>

      {/* ── Dropdown list ── */}
      <div
        ref={listRef}
        style={{ visibility: "hidden", opacity: 0 }}
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-outline-variant">
          <p className="text-xs font-semibold font-body text-on-surface-variant">
            Pilih Lansia
          </p>
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto flex flex-col py-1.5">
          {lansiaList.length === 0 ? (
            <p className="text-xs text-on-surface-variant font-body text-center py-6">
              Tidak ada data lansia.
            </p>
          ) : (
            lansiaList.map((lansia) => {
              const cfg = getStatusConfig(lansia.status);
              const isSelected = lansia.id === selectedId;

              return (
                <button
                  key={lansia.id}
                  type="button"
                  onClick={() => handleSelect(lansia.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-container ${
                    isSelected ? "bg-surface-container" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar nama={lansia.nama} fotoUrl={lansia.foto_url} />

                  {/* Info */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className={`text-sm font-semibold font-headline truncate ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {lansia.nama}
                    </span>

                    {/* Status badge */}
                    <span
                      className={`text-[10px] font-bold font-label px-2 py-0.5 rounded-full self-start mt-0.5 ${cfg.bg} ${cfg.text}`}
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${cfg.dot}`}
                      />
                      {lansia.status}
                    </span>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}