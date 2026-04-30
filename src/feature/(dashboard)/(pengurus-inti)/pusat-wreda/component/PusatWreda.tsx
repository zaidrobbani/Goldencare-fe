"use client";

import React, { useState, useMemo } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TambahLansiaModal from "./TambahLansiaModal";
import { useGetLansiaByPengelola } from "@/repository/lansia/query";
import type { LansiaItem } from "@/repository/lansia/dto";
import {useGetDashboardLansia} from "@/repository/lansia/query";

// ── Types ──────────────────────────────────────────────────────────────────────
type FilterTab = "All Lansia" | "Laki-laki" | "Perempuan";

// ── Status Config ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { badge: string; dot: string; leftBar: boolean; icon?: React.ReactNode }
> = {
  aktif: {
    badge: "bg-primary-fixed text-primary",
    dot: "bg-primary",
    leftBar: false,
  },
  observasi: {
    badge: "bg-secondary-container text-secondary",
    dot: "bg-secondary",
    leftBar: false,
  },
  "tinjauan medis": {
    badge: "bg-error-container text-error",
    dot: "bg-error",
    leftBar: true,
    icon: <WarningAmberOutlinedIcon style={{ fontSize: 13 }} />,
  },
  kritis: {
    badge: "bg-error text-on-error",
    dot: "bg-error",
    leftBar: true,
    icon: <WarningAmberOutlinedIcon style={{ fontSize: 13 }} />,
  },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status.toLowerCase()] ?? {
      badge: "bg-surface-container text-on-surface-variant",
      dot: "bg-outline",
      leftBar: false,
    }
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ lansia }: { lansia: LansiaItem }) {
  const [imgError, setImgError] = React.useState(false);
  const fallback = lansia.nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (!lansia.foto_url || imgError) {
    return (
      <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
        <span className="text-xs font-bold font-headline text-on-surface-variant">{fallback}</span>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lansia.foto_url}
        alt={lansia.nama}
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
        <p className="text-2xl font-bold font-headline text-on-surface mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_2rem] gap-4 px-3 py-3 rounded-2xl items-center animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-32 rounded-full bg-surface-container-high" />
        <div className="h-2.5 w-20 rounded-full bg-surface-container" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-24 rounded-full bg-surface-container-high" />
        <div className="h-2.5 w-16 rounded-full bg-surface-container" />
      </div>
      <div className="h-6 w-20 rounded-full bg-surface-container-high" />
      <div className="w-4 h-4 rounded bg-surface-container" />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTanggalLahir(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TABS: FilterTab[] = ["All Lansia", "Laki-laki", "Perempuan"];

export default function PusatWreda() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Lansia");
  const [search, setSearch] = useState("");
  const [showTambahModal, setShowTambahModal] = useState(false);

  const { data: lansiaData = [], isLoading, isError } = useGetLansiaByPengelola();

  const {data: dashboardData} = useGetDashboardLansia();

  const filtered = useMemo(() => {
    let data = lansiaData;

    if (activeTab === "Laki-laki") {
      data = data.filter((l) => l.jenis_kelamin === "L");
    } else if (activeTab === "Perempuan") {
      data = data.filter((l) => l.jenis_kelamin === "P");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.nama.toLowerCase().includes(q) ||
          l.nik.includes(q) ||
          l.alamat_asal.toLowerCase().includes(q) ||
          l.status.toLowerCase().includes(q)
      );
    }

    return data;
  }, [activeTab, search, lansiaData]);

 
  const perluPerhatian = dashboardData?.perlu_perhatian ?? lansiaData.filter((l) => l.status.toLowerCase() !== "aktif").length;

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
          <button
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-sm font-body px-4 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm cursor-pointer"
            onClick={() => setShowTambahModal(true)}
          >
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
          value={isLoading ? "—" : lansiaData.length}
        />
        <StatCard
          icon={<MedicalServicesOutlinedIcon style={{ fontSize: 22 }} />}
          iconBg="bg-secondary-container"
          iconColor="text-secondary"
          label="Perlu Perhatian"
          value={isLoading ? "—" : perluPerhatian}
        />
        <StatCard
          icon={<CalendarMonthOutlinedIcon style={{ fontSize: 22 }} />}
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
          label="Pemeriksaan Hari Ini"
          value={isLoading ? "—" : dashboardData?.pemeriksaan_hari_ini ?? "—"}
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
          <span className="text-xs font-semibold font-body text-on-surface-variant">
            Nama Lansia
          </span>
          <span className="text-xs font-semibold font-body text-on-surface-variant">Info</span>
          <span className="text-xs font-semibold font-body text-on-surface-variant">Status</span>
          <span />
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant" />

        {/* Table Rows */}
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : isError ? (
            <div className="text-center py-10 text-sm text-error font-body">
              Gagal memuat data lansia. Coba refresh halaman.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-on-surface-variant font-body">
              Tidak ada data lansia yang ditemukan.
            </div>
          ) : (
            filtered.map((lansia) => {
              const cfg = getStatusConfig(lansia.status);
              return (
                <div
                  key={lansia.id}
                  className={`relative grid grid-cols-[2.5rem_1fr_1fr_1fr_2rem] gap-4 px-3 py-3 rounded-2xl items-center transition-colors hover:bg-surface-container cursor-pointer overflow-hidden ${
                    cfg.leftBar ? "bg-error-container/10" : ""
                  }`}
                >
                  {cfg.leftBar && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-error rounded-full" />
                  )}

                  <Avatar lansia={lansia} />

                  {/* Nama + NIK */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold font-headline text-on-surface truncate">
                      {lansia.nama}
                    </span>
                    <span className="text-xs text-on-surface-variant font-body">
                      NIK: {lansia.nik}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-body text-on-surface truncate capitalize">
                      {lansia.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} · Gol.{" "}
                      {lansia.golongan_darah}
                    </span>
                    <span className="text-xs text-on-surface-variant font-body">
                      {formatTanggalLahir(lansia.tanggal_lahir)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold font-label px-3 py-1.5 rounded-full capitalize ${cfg.badge}`}
                    >
                      {cfg.icon ? (
                        cfg.icon
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
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

      {/* Modal */}
      <TambahLansiaModal isOpen={showTambahModal} onClose={() => setShowTambahModal(false)} />
    </div>
  );
}
