"use client";

import React, { useState, useMemo } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CoffeeOutlinedIcon from "@mui/icons-material/CoffeeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
type StafStatus = "Sedang Bertugas" | "Sedang Istirahat" | "Libur";
type FilterTab = "Semua Staf" | "Sedang Bertugas" | "Sedang Istirahat" | "Libur";

interface Staf {
  id: number;
  name: string;
  role: string;
  status: StafStatus;
  jadwal: string;
  areaTugas: string;
  avatar?: string;
  initials: string;
  istirahatSisa?: string;
  teamInitials: string[];
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const STAF_DATA: Staf[] = [
  {
    id: 1,
    name: "Siti Rahma",
    role: "Senior Pramurukti",
    status: "Sedang Bertugas",
    jadwal: "06:00 - 14:00",
    areaTugas: "Blok A, Room 102",
    initials: "SR",
    teamInitials: ["BK", "MR"],
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Junior Pramurukti",
    status: "Sedang Istirahat",
    jadwal: "14:00 - 22:00",
    areaTugas: "Blok B, Room 103",
    initials: "BS",
    istirahatSisa: "15m left",
    teamInitials: ["SR"],
  },
  {
    id: 3,
    name: "Dewi Lestari",
    role: "Senior Pramurukti",
    status: "Sedang Bertugas",
    jadwal: "06:00 - 14:00",
    areaTugas: "Blok A, Room 201",
    initials: "DL",
    teamInitials: ["HK", "AN"],
  },
  {
    id: 4,
    name: "Hendra Kusuma",
    role: "Pramurukti",
    status: "Libur",
    jadwal: "22:00 - 06:00",
    areaTugas: "Blok B, Room 305",
    initials: "HK",
    teamInitials: ["DL"],
  },
  {
    id: 5,
    name: "Ani Nursyam",
    role: "Junior Pramurukti",
    status: "Sedang Bertugas",
    jadwal: "14:00 - 22:00",
    areaTugas: "Blok A, Room 108",
    initials: "AN",
    teamInitials: ["SR", "DL"],
  },
  {
    id: 6,
    name: "Rudi Hartono",
    role: "Senior Pramurukti",
    status: "Sedang Istirahat",
    jadwal: "06:00 - 14:00",
    areaTugas: "Blok B, Room 210",
    initials: "RH",
    istirahatSisa: "30m left",
    teamInitials: ["BS"],
  },
];

// ── Config ─────────────────────────────────────────────────────────────────────
const statusDotConfig: Record<StafStatus, string> = {
  "Sedang Bertugas": "bg-primary",
  "Sedang Istirahat": "bg-tertiary",
  Libur: "bg-outline",
};

const TAB_COUNTS: Record<FilterTab, number> = {
  "Semua Staf": STAF_DATA.length,
  "Sedang Bertugas": STAF_DATA.filter((s) => s.status === "Sedang Bertugas").length,
  "Sedang Istirahat": STAF_DATA.filter((s) => s.status === "Sedang Istirahat").length,
  Libur: STAF_DATA.filter((s) => s.status === "Libur").length,
};

// ── Mini Avatar ────────────────────────────────────────────────────────────────
function MiniAvatar({ initials, index }: { initials: string; index: number }) {
  return (
    <div
      className="w-7 h-7 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center shrink-0"
      style={{ marginLeft: index === 0 ? 0 : -8, zIndex: 10 - index }}
    >
      <span className="text-[9px] font-bold font-headline text-on-surface-variant">
        {initials}
      </span>
    </div>
  );
}

// ── Staf Card ──────────────────────────────────────────────────────────────────
function StafCard({ staf }: { staf: Staf }) {
  const dot = statusDotConfig[staf.status];
  const isIstirahat = staf.status === "Sedang Istirahat";
  const isLibur = staf.status === "Libur";

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-2xl border bg-surface-container-lowest ${
        isLibur ? "border-outline-variant opacity-70" : "border-outline-variant"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar with status dot */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center">
              <span className="text-sm font-bold font-headline text-on-surface-variant">
                {staf.initials}
              </span>
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container-lowest ${dot}`}
            />
          </div>

          <div>
            <p className="text-sm font-bold font-headline text-on-surface leading-tight">
              {staf.name}
            </p>
            <p className="text-xs text-on-surface-variant font-body mt-0.5">
              {staf.role}
            </p>
          </div>
        </div>

        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1 shrink-0">
          <MoreVertOutlinedIcon fontSize="small" />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <AccessTimeOutlinedIcon style={{ fontSize: 14 }} />
            <span className="text-xs font-body">Jadwal Jaga</span>
          </div>
          <span className="text-xs font-bold font-headline text-on-surface">
            {staf.jadwal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <LocationOnOutlinedIcon style={{ fontSize: 14 }} />
            <span className="text-xs font-body">Area Tugas</span>
          </div>
          <span className="text-xs font-bold font-headline text-on-surface text-right">
            {staf.areaTugas}
          </span>
        </div>

        {/* Istirahat badge */}
        {isIstirahat && staf.istirahatSisa && (
          <div className="flex items-center gap-1.5 text-tertiary mt-0.5">
            <CoffeeOutlinedIcon style={{ fontSize: 14 }} />
            <span className="text-xs font-semibold font-body">
              Istirahat ({staf.istirahatSisa})
            </span>
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1 border-t border-outline-variant">
        {/* Team avatars */}
        <div className="flex items-center">
          {staf.teamInitials.map((ini, i) => (
            <MiniAvatar key={ini + i} initials={ini} index={i} />
          ))}
        </div>

        <button className="text-xs font-semibold font-body text-primary hover:underline transition-all flex items-center gap-1">
          <ListAltOutlinedIcon style={{ fontSize: 14 }} />
          Lihat Daftar Tugas
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TABS: FilterTab[] = [
  "Semua Staf",
  "Sedang Bertugas",
  "Sedang Istirahat",
  "Libur",
];

export default function PusatPengurus() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua Staf");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let data = STAF_DATA;
    if (activeTab !== "Semua Staf") {
      data = data.filter((s) => s.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.areaTugas.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q)
      );
    }
    return data;
  }, [activeTab, search]);

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
            Ringkasan Staf Pramurukti
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1 max-w-sm">
            Kelola staf pramurukti, pantau jadwal jaga saat ini, dan alokasikan tugas di seluruh area panti
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <SearchOutlinedIcon
              fontSize="small"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
            <input
              type="search"
              placeholder="Cari staf..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-2 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors w-48"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-sm font-body px-4 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm">
            <AddOutlinedIcon fontSize="small" />
            Tambah Staf Baru
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex gap-5 items-start">
        {/* Left — Staf List */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold font-body transition-all ${
                  activeTab === tab
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {tab} ({TAB_COUNTS[tab]})
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-on-surface-variant font-body">
              Tidak ada staf yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((staf) => (
                <StafCard key={staf.id} staf={staf} />
              ))}
            </div>
          )}
        </div>

        {/* Right — Panels */}
        <div className="w-[240px] shrink-0 flex flex-col gap-4">
          {/* Jadwal Hari Ini */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-headline text-on-surface leading-tight">
                Jadwal Hari Ini
              </h2>
              <CalendarMonthOutlinedIcon
                fontSize="small"
                className="text-on-surface-variant"
              />
            </div>

            <div className="flex flex-col gap-3">
              {/* Shift Pagi — active */}
              <div className="flex gap-2.5 items-start">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-0.5 bg-outline-variant flex-1 mt-1" style={{ minHeight: 40 }} />
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-2 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-headline text-on-surface">Shift Pagi</span>
                    <span className="text-[10px] font-body text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">06:00 - 14:00</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-body">8 Staf Aktif &middot; 2 Siaga</p>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>

              {/* Shift Siang — active */}
              <div className="flex gap-2.5 items-start">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-0.5 bg-outline-variant flex-1 mt-1" style={{ minHeight: 40 }} />
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-2 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-headline text-on-surface">Shift Siang</span>
                    <span className="text-[10px] font-body text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">14:00 - 22:00</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-body">10 Staf Terjadwal &middot; 1 Absen</p>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>

              {/* Shift Malam — upcoming */}
              <div className="flex gap-2.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-outline-variant shrink-0 ml-0" />
                <div className="flex-1 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold font-body text-on-surface-variant">Shift Malam</span>
                  <span className="text-[10px] font-body text-on-surface-variant">22:00 - 06:00</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-outline-variant text-xs font-semibold font-body text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5">
              <SettingsOutlinedIcon style={{ fontSize: 14 }} />
              Atur Rotasi Jaga
            </button>
          </div>

          {/* Perlu Perhatian Segera */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ListAltOutlinedIcon fontSize="small" className="text-on-surface-variant" />
              <h2 className="text-sm font-bold font-headline text-on-surface">
                Perlu Perhatian Segera
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {/* Alert 1 */}
              <div className="flex gap-2.5 p-3 rounded-xl bg-error-container/30 border border-error/15">
                <WarningAmberOutlinedIcon
                  style={{ fontSize: 16 }}
                  className="text-error shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold font-headline text-error leading-tight">
                    Kekurangan Staf: Blok A
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-body mt-0.5 leading-snug">
                    Membutuhkan 1 tambahan pramurukti untuk shift siang.
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex gap-2.5 p-3 rounded-xl bg-tertiary-fixed/40 border border-tertiary/20">
                <WarningAmberOutlinedIcon
                  style={{ fontSize: 16 }}
                  className="text-tertiary shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold font-headline text-tertiary leading-tight">
                    Perpanjangan Izin
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-body mt-0.5 leading-snug">
                    Hendra Kusuma belum konfirmasi jadwal kembali.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}