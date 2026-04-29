"use client";

import React from "react";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
type AlertType = "patient" | "system";

interface AlertCard {
  id: number;
  type: AlertType;
  name: string;
  issue: string;
  time: string;
  location: string;
  avatar?: string;
  initials?: string;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const ALERT_CARDS: AlertCard[] = [
  {
    id: 1,
    type: "patient",
    name: "Mr. Hassan Ahmad",
    issue: "Irregular Heart Rate detected",
    time: "10 mins ago",
    location: "Room 204",
    avatar: "/avatars/hassan.jpg",
  },
  {
    id: 2,
    type: "system",
    name: "System Alert",
    issue: "Wing B Temperature Sensor Offline",
    time: "2 hours ago",
    location: "Maintenance",
  },
  {
    id: 3,
    type: "patient",
    name: "Mrs. Siti Aminah",
    issue: "Missed morning medication",
    time: "1 hour ago",
    location: "Room 112",
    avatar: "/avatars/siti.jpg",
  },
  {
    id: 4,
    type: "patient",
    name: "Mr. Budi Santoso",
    issue: "Blood pressure critically high",
    time: "30 mins ago",
    location: "Room 305",
    avatar: "/avatars/budi.jpg",
  },
  {
    id: 5,
    type: "system",
    name: "System Alert",
    issue: "Wing A Nurse Call Button Unresponsive",
    time: "45 mins ago",
    location: "Maintenance",
  },
  {
    id: 6,
    type: "patient",
    name: "Mrs. Eleanor Vance",
    issue: "Fall risk — restraint not applied",
    time: "15 mins ago",
    location: "Room 204",
    avatar: "/avatars/eleanor.jpg",
  },
  {
    id: 7,
    type: "patient",
    name: "Mr. Arthur Pendelton",
    issue: "Glucose level below threshold",
    time: "5 mins ago",
    location: "Room 206",
    avatar: "/avatars/arthur.jpg",
  },
  {
    id: 8,
    type: "system",
    name: "System Alert",
    issue: "Emergency Exit Door Left Open",
    time: "3 hours ago",
    location: "Maintenance",
  },
  {
    id: 9,
    type: "patient",
    name: "Mrs. Margaret Reed",
    issue: "Wandering detected outside ward",
    time: "20 mins ago",
    location: "Room 210",
    initials: "MR",
  },
];

// ── Alert type config ──────────────────────────────────────────────────────────
const alertConfig: Record<
  AlertType,
  { cardBg: string; issuColor: string; iconBg: string; iconColor: string }
> = {
  patient: {
    cardBg: "bg-error-container/30 border-error/15",
    issuColor: "text-error",
    iconBg: "bg-error-container",
    iconColor: "text-error",
  },
  system: {
    cardBg: "bg-surface-container border-outline-variant",
    issuColor: "text-primary",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 flex-1 min-w-0 ${
        highlight
          ? "bg-error-container/40 border-error/20"
          : "bg-surface-container-lowest border-outline-variant"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold font-label px-2.5 py-1 rounded-full ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-on-surface-variant font-body">{label}</p>
        <p
          className={`text-3xl font-bold font-headline mt-0.5 ${
            highlight ? "text-error" : "text-on-surface"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({
  src,
  initials,
  name,
  type,
}: {
  src?: string;
  initials?: string;
  name: string;
  type: AlertType;
}) {
  const [imgError, setImgError] = React.useState(false);
  const cfg = alertConfig[type];

  const fallback =
    initials ||
    name
      .replace(/^(Mr\.|Mrs\.|Ms\.)\s*/i, "")
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (type === "system") {
    return (
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}
      >
        <WifiOffOutlinedIcon style={{ fontSize: 20 }} />
      </div>
    );
  }

  if (!src || imgError) {
    return (
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}
      >
        <span className={`text-xs font-bold font-headline ${cfg.iconColor}`}>
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-outline-variant">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

// ── Alert Card ─────────────────────────────────────────────────────────────────
function AlertCardItem({ card }: { card: AlertCard }) {
  const cfg = alertConfig[card.type];

  return (
    <div
      className={`flex flex-col gap-2.5 p-4 rounded-2xl border transition-all ${cfg.cardBg}`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={card.avatar}
          initials={card.initials}
          name={card.name}
          type={card.type}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold font-headline text-on-surface leading-tight truncate">
            {card.name}
          </span>
          <span className={`text-xs font-semibold font-body mt-0.5 leading-snug ${cfg.issuColor}`}>
            {card.issue}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-on-surface-variant">
        <AccessTimeOutlinedIcon style={{ fontSize: 12 }} />
        <span className="text-[11px] font-body">
          {card.time} &middot; {card.location}
        </span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* ── Top Header ── */}
      <div className="flex items-start justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Selamat pagi, Administrator. Berikut ringkasan fasilitas panti hari ini.
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="relative">
            <SearchOutlinedIcon
              fontSize="small"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
            <input
              type="search"
              placeholder="Cari lansia, staf..."
              className="bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-2 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors w-52"
            />
          </div>

          {/* Notif bell */}
          <div className="relative">
            <button className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <NotificationsOutlinedIcon fontSize="small" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </div>

          {/* Avatar */}
          <button className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors overflow-hidden">
            <AccountCircleOutlinedIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4">
        <StatCard
          icon={<DirectionsWalkOutlinedIcon style={{ fontSize: 20 }} />}
          iconBg="bg-secondary-container"
          iconColor="text-secondary"
          badge="+2 minggu ini"
          badgeColor="bg-surface-container text-on-surface-variant"
          label="Total Lansia"
          value="142"
        />
        <StatCard
          icon={<MedicalServicesOutlinedIcon style={{ fontSize: 20 }} />}
          iconBg="bg-primary-fixed"
          iconColor="text-primary"
          badge="Optimal"
          badgeColor="bg-primary-fixed text-primary"
          label="Perawat Bertugas"
          value={
            <span>
              36
              <span className="text-lg text-on-surface-variant font-body font-normal">
                /40
              </span>
            </span>
          }
        />
        <StatCard
          icon={<WarningAmberOutlinedIcon style={{ fontSize: 20 }} />}
          iconBg="bg-error-container"
          iconColor="text-error"
          badge="Butuh Tindakan"
          badgeColor="bg-error text-on-error"
          label="Peringatan Kesehatan Aktif"
          value="3"
          highlight
        />
        <StatCard
          icon={<CalendarMonthOutlinedIcon style={{ fontSize: 20 }} />}
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
          badge="Hari ini"
          badgeColor="bg-tertiary-fixed text-tertiary"
          label="Jadwal Pemeriksaan"
          value="12"
        />
      </div>

      {/* ── Perlu Perhatian Segera ── */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-headline text-on-surface">
            Perlu Perhatian Segera
          </h2>
          <button className="text-sm font-semibold font-body text-primary hover:underline transition-all">
            Lihat Semua
          </button>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3">
          {ALERT_CARDS.map((card) => (
            <AlertCardItem key={card.id} card={card} />
          ))}
        </div>

        {/* Acknowledge All */}
        <button className="w-full mt-2 py-3.5 rounded-2xl border border-outline-variant bg-surface-container-lowest text-sm font-semibold font-body text-on-surface hover:bg-surface-container transition-colors">
          Acknowledge All
        </button>
      </div>
    </div>
  );
}