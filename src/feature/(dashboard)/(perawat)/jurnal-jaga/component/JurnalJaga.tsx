"use client";

import React, { useState } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Lansia {
  id: number;
  name: string;
  room: string;
  condition: string;
  avatar?: string;
  initials?: string;
  shift: string;
  vital: { td: string; nadi: string; suhu: string };
  naratifPlaceholder: string;
}

interface ObservasiKategori {
  label: string;
  options: { label: string; variant: "normal" | "warning" }[];
}

// ── Static Data ────────────────────────────────────────────────────────────────
const LANSIA_LIST: Lansia[] = [
  {
    id: 1,
    name: "Evelyn Harper",
    room: "Room 204",
    condition: "Risiko Jatuh",
    initials: "EH",
    shift: "Shift Siang",
    vital: { td: "120/80", nadi: "72", suhu: "37°C" },
    naratifPlaceholder:
      "Evelyn melewati siang dengan tenang. Berpartisipasi dalam terapi musik kelompok. Menghabiskan 50% porsi makan siang...",
  },
  {
    id: 2,
    name: "Arthur Pendelton",
    room: "Room 206",
    condition: "Diabetes",
    initials: "AP",
    shift: "Shift Pagi",
    vital: { td: "130/85", nadi: "80", suhu: "36.8°C" },
    naratifPlaceholder:
      "Arthur mengeluhkan sedikit pusing di pagi hari. Gula darah terpantau 210 mg/dL sebelum sarapan. Sudah diberikan insulin sesuai jadwal...",
  },
  {
    id: 3,
    name: "Margaret Reed",
    room: "Room 210",
    condition: "Demensia",
    initials: "MR",
    shift: "Shift Malam",
    vital: { td: "118/76", nadi: "68", suhu: "36.5°C" },
    naratifPlaceholder:
      "Margaret tampak kebingungan di sore hari. Sempat tidak mengenali perawat jaga. Diberikan pendampingan intensif selama 30 menit...",
  },
];

const OBSERVASI_KATEGORI: ObservasiKategori[] = [
  {
    label: "Suasana Hati",
    options: [
      { label: "Tenang", variant: "normal" },
      { label: "Gelisah", variant: "normal" },
      { label: "Lesu", variant: "normal" },
    ],
  },
  {
    label: "Nafsu Makan",
    options: [
      { label: "Baik", variant: "normal" },
      { label: "Sedang", variant: "normal" },
      { label: "Buruk", variant: "warning" },
    ],
  },
  {
    label: "Aktivitas",
    options: [
      { label: "Aktif", variant: "normal" },
      { label: "Istirahat", variant: "normal" },
    ],
  },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({
  src,
  initials,
  name,
  size = 44,
  rounded = "rounded-xl",
}: {
  src?: string;
  initials?: string;
  name: string;
  size?: number;
  rounded?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const fallback =
    initials ||
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (!src || imgError) {
    return (
      <div
        className={`${rounded} bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs font-bold font-headline text-on-surface-variant">
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${rounded} overflow-hidden border border-outline-variant shrink-0`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

// ── Pill Button ───────────────────────────────────────────────────────────────
function Pill({
  label,
  variant,
  active,
  onClick,
}: {
  label: string;
  variant: "normal" | "warning";
  active: boolean;
  onClick: () => void;
}) {
  const base = "px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-all cursor-pointer select-none border";

  if (variant === "warning") {
    return active
      ? (
        <button
          onClick={onClick}
          className={`${base} bg-error-container text-error border-error/30 flex items-center gap-1`}
        >
          <span className="text-error" style={{ fontSize: 10 }}>▲</span>
          {label}
        </button>
      )
      : (
        <button
          onClick={onClick}
          className={`${base} bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high`}
        >
          {label}
        </button>
      );
  }

  return active ? (
    <button
      onClick={onClick}
      className={`${base} bg-primary text-on-primary border-primary`}
    >
      {label}
    </button>
  ) : (
    <button
      onClick={onClick}
      className={`${base} bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high`}
    >
      {label}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function JurnalJaga() {
  const [selectedId, setSelectedId] = useState<number>(1);
  // observasi: { [kategoriLabel]: selectedOptionLabel | null }
  const [observasi, setObservasi] = useState<Record<string, string | null>>({
    "Suasana Hati": "Tenang",
    "Nafsu Makan": "Buruk",
    "Aktivitas": "Aktif",
  });
  const [naratif, setNaratif] = useState("");

  const selected = LANSIA_LIST.find((l) => l.id === selectedId)!;

  const togglePill = (kategori: string, option: string) => {
    setObservasi((prev) => ({
      ...prev,
      [kategori]: prev[kategori] === option ? null : option,
    }));
  };

  // Get current time string
  const now = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex gap-0 min-h-screen bg-surface">
      {/* ── Left: Daftar Lansia ── */}
      <div className="w-[248px] shrink-0 flex flex-col gap-3 p-6 border-r border-outline-variant">
        <div className="mb-2">
          <h2 className="text-xl font-bold font-headline text-on-surface">Daftar Lansia</h2>
          <p className="text-xs text-on-surface-variant font-body mt-0.5">
            Pilih lansia untuk menulis catatan jaga.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {LANSIA_LIST.map((lansia) => {
            const isActive = lansia.id === selectedId;
            return (
              <button
                key={lansia.id}
                onClick={() => {
                  setSelectedId(lansia.id);
                  setNaratif("");
                  setObservasi({
                    "Suasana Hati": null,
                    "Nafsu Makan": null,
                    "Aktivitas": null,
                  });
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all w-full ${
                  isActive
                    ? "bg-surface-container border border-primary/30 shadow-sm"
                    : "bg-surface-container-lowest border border-outline-variant hover:bg-surface-container"
                }`}
              >
                <Avatar
                  src={lansia.avatar}
                  initials={lansia.initials}
                  name={lansia.name}
                  size={44}
                  rounded={isActive ? "rounded-xl ring-2 ring-primary" : "rounded-xl"}
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm font-bold font-headline truncate leading-tight ${
                      isActive ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {lansia.name}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-body truncate mt-0.5">
                    {lansia.room} &middot; {lansia.condition}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: Entry Panel ── */}
      <div className="flex-1 min-w-0 flex flex-col p-8 gap-5">
        {/* Entry Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">
              Entri Catatan Jaga
            </h1>
            <p className="text-sm text-on-surface-variant font-body mt-0.5">
              Menulis catatan untuk {selected.name} &middot; {selected.shift}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant">
            <AccessTimeOutlinedIcon style={{ fontSize: 14 }} className="text-primary" />
            <span className="text-xs font-semibold font-body text-on-surface">{timeStr} PM</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm p-6 flex flex-col gap-6">

          {/* Observasi Cepat */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ChatBubbleOutlineOutlinedIcon fontSize="small" className="text-on-surface-variant" />
              <span className="text-sm font-bold font-headline text-on-surface">Observasi Cepat</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {OBSERVASI_KATEGORI.map((kat) => (
                <div key={kat.label} className="flex flex-col gap-2">
                  <span className="text-xs font-medium font-body text-on-surface-variant">
                    {kat.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {kat.options.map((opt) => (
                      <Pill
                        key={opt.label}
                        label={opt.label}
                        variant={opt.variant}
                        active={observasi[kat.label] === opt.label}
                        onClick={() => togglePill(kat.label, opt.label)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tanda Vital */}
          <div className="flex items-center justify-between bg-surface-container rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <FavoriteOutlinedIcon style={{ fontSize: 16 }} className="text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold font-headline text-on-surface block">
                  Tanda Vital Tercatat
                </span>
                <span className="text-xs text-on-surface-variant font-body">
                  TD: {selected.vital.td} &middot; Nadi: {selected.vital.nadi} &middot; Suhu: {selected.vital.suhu}
                </span>
              </div>
            </div>
            <button className="text-sm font-semibold font-body text-primary hover:underline transition-all">
              Edit
            </button>
          </div>

          {/* Catatan Naratif */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium font-body text-on-surface-variant">
              Catatan Naratif Detail
            </label>
            <div className="relative">
              <textarea
                rows={5}
                value={naratif}
                onChange={(e) => setNaratif(e.target.value)}
                placeholder={selected.naratifPlaceholder}
                className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none pb-10"
              />
              {/* Toolbar icons — kosmetik */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-outline">
                <button
                  type="button"
                  className="hover:text-on-surface-variant transition-colors p-1"
                >
                  <ImageOutlinedIcon style={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  className="hover:text-on-surface-variant transition-colors p-1"
                >
                  <MicNoneOutlinedIcon style={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-1">
          <button
            type="button"
            className="text-sm font-semibold font-body text-on-surface-variant hover:text-on-surface transition-colors px-2"
          >
            Simpan Draf
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-primary-container text-on-primary-container font-semibold text-sm font-body px-5 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Kirim Operan Jaga
            <ArrowForwardIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}