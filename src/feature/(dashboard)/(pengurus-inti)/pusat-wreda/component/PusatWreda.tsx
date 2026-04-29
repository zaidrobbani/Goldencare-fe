"use client";

import React, { useState, useMemo } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
type Status = "Stabil" | "Observasi" | "Tinjauan Medis" | "Kritis";
type Blok = "Blok A" | "Blok B";
type FilterTab = "All Lansia" | "Prioritas Tinggi" | "Blok A" | "Blok B";

interface Lansia {
  id: number;
  name: string;
  patientId: string;
  room: string;
  blok: Blok;
  lantai: string;
  status: Status;
  avatar?: string;
  initials?: string;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const LANSIA_DATA: Lansia[] = [
  {
    id: 1,
    name: "Eleanor Vance",
    patientId: "RK-2938",
    room: "Room 104",
    blok: "Blok A",
    lantai: "Lantai Dasar",
    status: "Stabil",
    avatar: "/avatars/eleanor.jpg",
  },
  {
    id: 2,
    name: "Arthur Pendelton",
    patientId: "RK-2941",
    room: "Room 212",
    blok: "Blok B",
    lantai: "Lantai Dua",
    status: "Observasi",
    avatar: "/avatars/arthur.jpg",
  },
  {
    id: 3,
    name: "Margaret Chen",
    patientId: "RK-2855",
    room: "Room 108",
    blok: "Blok A",
    lantai: "Lantai Dasar",
    status: "Tinjauan Medis",
    avatar: "/avatars/margaret.jpg",
  },
  {
    id: 4,
    name: "Harold Thompson",
    patientId: "RK-3012",
    room: "Room 305",
    blok: "Blok B",
    lantai: "Lantai Dua",
    status: "Stabil",
    initials: "HT",
  },
  {
    id: 5,
    name: "Siti Rahayu",
    patientId: "RK-2767",
    room: "Room 101",
    blok: "Blok A",
    lantai: "Lantai Dasar",
    status: "Kritis",
    avatar: "/avatars/siti.jpg",
  },
  {
    id: 6,
    name: "Budi Santoso",
    patientId: "RK-2890",
    room: "Room 218",
    blok: "Blok B",
    lantai: "Lantai Dua",
    status: "Stabil",
    avatar: "/avatars/budi.jpg",
  },
  {
    id: 7,
    name: "Maria Consuelo",
    patientId: "RK-3045",
    room: "Room 115",
    blok: "Blok A",
    lantai: "Lantai Satu",
    status: "Observasi",
    avatar: "/avatars/maria.jpg",
  },
  {
    id: 8,
    name: "Hendra Kusuma",
    patientId: "RK-3078",
    room: "Room 301",
    blok: "Blok B",
    lantai: "Lantai Tiga",
    status: "Tinjauan Medis",
    initials: "HK",
  },
];

// ── Status Config ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  Status,
  { badge: string; dot: string; leftBar: boolean; icon?: React.ReactNode }
> = {
  Stabil: {
    badge: "bg-primary-fixed text-primary",
    dot: "bg-primary",
    leftBar: false,
  },
  Observasi: {
    badge: "bg-secondary-container text-secondary",
    dot: "bg-secondary",
    leftBar: false,
  },
  "Tinjauan Medis": {
    badge: "bg-error-container text-error",
    dot: "bg-error",
    leftBar: true,
    icon: <WarningAmberOutlinedIcon style={{ fontSize: 13 }} />,
  },
  Kritis: {
    badge: "bg-error text-on-error",
    dot: "bg-error",
    leftBar: true,
    icon: <WarningAmberOutlinedIcon style={{ fontSize: 13 }} />,
  },
};

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ lansia }: { lansia: Lansia }) {
  const [imgError, setImgError] = React.useState(false);
  const fallback =
    lansia.initials ||
    lansia.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (!lansia.avatar || imgError) {
    return (
      <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
        <span className="text-xs font-bold font-headline text-on-surface-variant">
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lansia.avatar}
        alt={lansia.name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4 flex-1 min-w-0">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-on-surface-variant font-body">{label}</p>
        <p className="text-2xl font-bold font-headline text-on-surface mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TABS: FilterTab[] = ["All Lansia", "Prioritas Tinggi", "Blok A", "Blok B"];

export default function PusatWreda() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Lansia");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let data = LANSIA_DATA;

    // Filter by tab
    if (activeTab === "Blok A") {
      data = data.filter((l) => l.blok === "Blok A");
    } else if (activeTab === "Blok B") {
      data = data.filter((l) => l.blok === "Blok B");
    } else if (activeTab === "Prioritas Tinggi") {
      data = data.filter(
        (l) => l.status === "Tinjauan Medis" || l.status === "Kritis"
      );
    }

    // Filter by search (name, room, blok)
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.room.toLowerCase().includes(q) ||
          l.blok.toLowerCase().includes(q) ||
          l.patientId.toLowerCase().includes(q)
      );
    }

    return data;
  }, [activeTab, search]);

  // Stat counts
  const totalLansia = LANSIA_DATA.length;
  const perluPerhatian = LANSIA_DATA.filter(
    (l) => l.status === "Tinjauan Medis" || l.status === "Kritis"
  ).length;
  const pemeriksaanHariIni = 15; // hardcode

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold font-body text-primary">Profil Lansia</p>
          <p className="text-sm text-on-surface-variant font-body mt-0.5 max-w-sm">
            Kelola data lansia, tinjau status kesehatan terkini, dan akses rencana asuhan perawatan.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="relative">
            <SearchOutlinedIcon
              fontSize="small"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
            <input
              type="search"
              placeholder="Cari lansia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-2 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors w-48"
            />
          </div>

          {/* Tambah Lansia */}
          <button className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-sm font-body px-4 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm">
            <PersonAddOutlinedIcon fontSize="small" />
            Tambah Lansia Baru
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4">
        <StatCard
          icon={<GroupsOutlinedIcon style={{ fontSize: 22 }} />}
          iconBg="bg-surface-container-high"
          iconColor="text-on-surface-variant"
          label="Total Lansia"
          value={totalLansia}
        />
        <StatCard
          icon={<MedicalServicesOutlinedIcon style={{ fontSize: 22 }} />}
          iconBg="bg-secondary-container"
          iconColor="text-secondary"
          label="Perlu Perhatian"
          value={perluPerhatian}
        />
        <StatCard
          icon={<CalendarMonthOutlinedIcon style={{ fontSize: 22 }} />}
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
          label="Pemeriksaan Hari Ini"
          value={pemeriksaanHariIni}
        />
      </div>

      {/* ── Table Section ── */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 flex flex-col gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-body transition-all ${
                activeTab === tab
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_2rem] gap-4 px-3 items-center">
          <span className="text-xs font-semibold font-body text-on-surface-variant">Foto</span>
          <span className="text-xs font-semibold font-body text-on-surface-variant">Nama Lansia</span>
          <span className="text-xs font-semibold font-body text-on-surface-variant">Lokasi</span>
          <span className="text-xs font-semibold font-body text-on-surface-variant">Status Saat Ini</span>
          <span />
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant" />

        {/* Table Rows */}
        <div className="flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-on-surface-variant font-body">
              Tidak ada data lansia yang ditemukan.
            </div>
          ) : (
            filtered.map((lansia) => {
              const cfg = statusConfig[lansia.status];
              const isPriority = cfg.leftBar;

              return (
                <div
                  key={lansia.id}
                  className={`relative grid grid-cols-[2.5rem_1fr_1fr_1fr_2rem] gap-4 px-3 py-3 rounded-2xl items-center transition-colors hover:bg-surface-container cursor-pointer overflow-hidden ${
                    isPriority ? "bg-error-container/10" : ""
                  }`}
                >
                  {/* Left priority bar */}
                  {isPriority && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-error rounded-full" />
                  )}

                  {/* Avatar */}
                  <Avatar lansia={lansia} />

                  {/* Name + ID */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold font-headline text-on-surface truncate">
                      {lansia.name}
                    </span>
                    <span className="text-xs text-on-surface-variant font-body">
                      ID: {lansia.patientId}
                    </span>
                  </div>

                  {/* Lokasi */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-body text-on-surface truncate">
                      {lansia.room}
                    </span>
                    <span className="text-xs text-on-surface-variant font-body">
                      {lansia.blok} &middot; {lansia.lantai}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold font-label px-3 py-1.5 rounded-full ${cfg.badge}`}
                    >
                      {cfg.icon ? (
                        cfg.icon
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`}
                        />
                      )}
                      {lansia.status}
                    </span>
                  </div>

                  {/* Chevron */}
                  <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
                    <ChevronRightOutlinedIcon fontSize="small" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}