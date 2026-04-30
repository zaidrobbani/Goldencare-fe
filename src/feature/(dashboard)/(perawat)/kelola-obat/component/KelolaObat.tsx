"use client";

import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useTambahObat } from "@/repository/obat/query";
import { useGetLansiaByPengurus } from "@/repository/lansia/query";
import { useToast } from "@/shared/Toast/ToastProvider";
import { JadwalObatItem, Shift } from "@/repository/obat/dto";
import DropDown from "@/shared/DropDown/DropDown";

// ── Types ──────────────────────────────────────────────────────────────────────
type StatusType = "TERLEWAT" | "DIJADWALKAN" | "DIBERIKAN" | "PENDING";

interface ObatItem {
  id: number;
  patientName: string;
  patientAvatar: string;
  room: string;
  drug: string;
  dose: string;
  route: string;
  status: StatusType;
  scheduledTime?: string;
  givenTime?: string;
}

interface JadwalGroup {
  id: string;
  label: string;
  timeRange: string;
  icon: "pagi" | "siang" | "sore";
  items: ObatItem[];
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const JADWAL_DATA: JadwalGroup[] = [
  {
    id: "pagi",
    label: "Jadwal Pagi",
    timeRange: "8:00 AM – 10:00 AM",
    icon: "pagi",
    items: [
      {
        id: 1,
        patientName: "Eleanor Vance",
        patientAvatar: "/avatars/eleanor.jpg",
        room: "Room 204",
        drug: "Lisinopril (Zestril)",
        dose: "10mg",
        route: "Oral",
        status: "TERLEWAT",
      },
      {
        id: 2,
        patientName: "Arthur Pendelton",
        patientAvatar: "/avatars/arthur.jpg",
        room: "Room 112",
        drug: "Metformin",
        dose: "500mg",
        route: "With Food",
        status: "DIJADWALKAN",
        scheduledTime: "9:30 AM",
      },
      {
        id: 3,
        patientName: "Maria Consuelo",
        patientAvatar: "/avatars/maria.jpg",
        room: "Room 301",
        drug: "Atorvastatin",
        dose: "20mg",
        route: "Oral",
        status: "DIBERIKAN",
        givenTime: "8:15 AM",
      },
    ],
  },
  {
    id: "siang",
    label: "Jadwal Siang",
    timeRange: "12:00 PM – 2:00 PM",
    icon: "siang",
    items: [
      {
        id: 4,
        patientName: "Eleanor Vance",
        patientAvatar: "/avatars/eleanor.jpg",
        room: "Room 204",
        drug: "Albuterol Inhaler",
        dose: "2 Puffs",
        route: "As needed",
        status: "PENDING",
        scheduledTime: "1:00 PM",
      },
      {
        id: 5,
        patientName: "Budi Santoso",
        patientAvatar: "/avatars/budi.jpg",
        room: "Room 105",
        drug: "Amlodipine",
        dose: "5mg",
        route: "Oral",
        status: "PENDING",
        scheduledTime: "1:30 PM",
      },
    ],
  },
];


const RUTE_OPTIONS = ["Oral", "Inhaler", "Injeksi", "Topikal", "Sublingual", "With Food"];

// ── Status Config ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  StatusType,
  { label: string; containerClass: string; indicatorEl: React.ReactNode }
> = {
  TERLEWAT: {
    label: "TERLEWAT",
    containerClass: "bg-error-container/40 border-error/20",
    indicatorEl: (
      <div className="flex items-center gap-1 bg-error-container text-error text-[10px] font-bold font-label px-2 py-1 rounded-full shrink-0">
        <WarningAmberOutlinedIcon style={{ fontSize: 12 }} />
        TERLEWAT
      </div>
    ),
  },
  DIJADWALKAN: {
    label: "DIJADWALKAN",
    containerClass: "bg-surface-container-lowest border-outline-variant",
    indicatorEl: null, // time shown separately
  },
  DIBERIKAN: {
    label: "DIBERIKAN",
    containerClass: "bg-surface-container-lowest border-outline-variant",
    indicatorEl: (
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
        <CheckCircleOutlinedIcon style={{ fontSize: 18 }} className="text-on-primary" />
      </div>
    ),
  },
  PENDING: {
    label: "PENDING",
    containerClass: "bg-surface-container-lowest border-outline-variant",
    indicatorEl: <div className="w-8 h-8 rounded-full border-2 border-outline-variant shrink-0" />,
  },
};

// ── Avatar Placeholder ─────────────────────────────────────────────────────────
function Avatar({ src, name, size = 44 }: { src: string; name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials on error
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector(".initials-fallback")) {
            const span = document.createElement("span");
            span.className =
              "initials-fallback text-xs font-bold font-headline text-on-surface-variant";
            span.textContent = initials;
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}

// ── Obat Card ──────────────────────────────────────────────────────────────────
function ObatCard({ item }: { item: ObatItem }) {
  const cfg = statusConfig[item.status];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${cfg.containerClass}`}
    >
      <Avatar src={item.patientAvatar} name={item.patientName} size={44} />

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold font-headline text-on-surface truncate">
            {item.patientName}
          </span>
          <span className="text-[10px] font-medium font-label text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full shrink-0">
            {item.room}
          </span>
        </div>
        <span className="text-xs text-on-surface-variant font-body mt-0.5 truncate">
          {item.drug}&nbsp;&middot;&nbsp;{item.dose}&nbsp;&middot;&nbsp;{item.route}
        </span>
        {item.status === "DIBERIKAN" && item.givenTime && (
          <span className="text-[11px] text-primary font-body mt-0.5">
            Diberikan {item.givenTime}
          </span>
        )}
      </div>

      {/* Right indicator */}
      <div className="flex items-center gap-2 shrink-0">
        {item.status === "DIJADWALKAN" && item.scheduledTime && (
          <span className="text-sm font-bold font-headline text-on-surface">
            {item.scheduledTime}
          </span>
        )}
        {item.status === "PENDING" && item.scheduledTime && (
          <span className="text-sm font-bold font-headline text-on-surface-variant">
            {item.scheduledTime}
          </span>
        )}
        {cfg.indicatorEl}
        {/* Delete icon — kosmetik */}
        {item.status === "TERLEWAT" && (
          <button className="text-on-surface-variant hover:text-error transition-colors p-1">
            <DeleteOutlineOutlinedIcon style={{ fontSize: 18 }} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Timeline Group ─────────────────────────────────────────────────────────────
function JadwalSection({ group }: { group: JadwalGroup }) {
  return (
    <div className="flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0 z-10" />
        <div className="w-0.5 bg-primary/30 flex-1 mt-1" style={{ minHeight: 16 }} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 pb-6 min-w-0">
        {/* Group header */}
        <div className="flex items-center gap-3">
          <WbSunnyOutlinedIcon
            fontSize="small"
            className={
              group.icon === "pagi"
                ? "text-tertiary"
                : group.icon === "siang"
                  ? "text-tertiary-fixed-dim"
                  : "text-outline"
            }
          />
          <span className="text-base font-bold font-headline text-on-surface">{group.label}</span>
          <span className="text-xs text-on-surface-variant font-body bg-surface-container px-2.5 py-1 rounded-full">
            {group.timeRange}
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-2.5">
          {group.items.map((item) => (
            <ObatCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quick Add Panel ────────────────────────────────────────────────────────────
function QuickAddPanel() {
  const { mutate: tambah, isPending } = useTambahObat();
  const { data: lansiaList = [], isLoading: lansiaLoading } = useGetLansiaByPengurus();
  const { success: showSuccess, error: showError } = useToast();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [lansiaId, setLansiaId] = useState("");
  const [namaObat, setNamaObat] = useState("");
  const [dosis, setDosis] = useState("");
  const [caraPemberian, setCaraPemberian] = useState("Oral");
  const [jadwals, setJadwals] = useState<JadwalObatItem[]>([{ shift: "Pagi", jam: "08:00" }]);

  const RUTE_OPTIONS = ["Oral", "Inhaler", "Injeksi", "Topikal", "Sublingual", "With Food"];
  const SHIFT_LIST: Shift[] = ["Pagi", "Siang", "Sore"];

  const DEFAULT_JAM: Record<Shift, string> = {
    Pagi: "08:00",
    Siang: "12:00",
    Sore: "17:00",
  };

  // ── Toggle shift ─────────────────────────────────────────────────────────────
  function toggleShift(shift: Shift) {
    const exists = jadwals.find((j) => j.shift === shift);
    if (exists) {
      setJadwals((prev) => prev.filter((j) => j.shift !== shift));
    } else {
      setJadwals((prev) => [...prev, { shift, jam: DEFAULT_JAM[shift] }]);
    }
  }

  function resetForm() {
    setLansiaId("");
    setNamaObat("");
    setDosis("");
    setCaraPemberian("Oral");
    setJadwals([{ shift: "Pagi", jam: "08:00" }]);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  function handleSubmit() {
    if (!lansiaId || !namaObat || !dosis || !caraPemberian) {
      showError("Semua field wajib diisi");
      return;
    }
    if (jadwals.length === 0) {
      showError("Pilih minimal satu jadwal shift");
      return;
    }

    tambah(
      {
        lansia_id: lansiaId,
        nama_obat: namaObat,
        dosis,
        cara_pemberian: caraPemberian,
        keterangan: "",
        jadwals,
      },
      {
        onSuccess: (result) => {
          if (!result.success) {
            showError(result.error || "Gagal menambahkan obat");
            return;
          }
          showSuccess("Obat berhasil ditambahkan");
          resetForm();
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            error?.message ??
            "Gagal menambahkan obat";
          showError(message);
        },
      }
    );
  }

  return (
    <div className="w-60 shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
          <MedicationOutlinedIcon style={{ fontSize: 18 }} className="text-primary" />
        </div>
        <h2 className="text-sm font-bold font-headline text-on-surface leading-snug">
          Tambah Jadwal Obat Cepat
        </h2>
      </div>

      {/* Lansia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium font-body text-on-surface-variant">Lansia</label>
        <div className="relative">
          <DropDown<string>
            placeholder="Pilih lansia..."
            value={lansiaId}
            onChange={setLansiaId}
            options={lansiaList.map((l) => ({ value: l.id, label: l.nama }))}
            disabled={isPending || lansiaLoading}
            label=""
          />
        </div>
      </div>

      {/* Nama Obat */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium font-body text-on-surface-variant">Nama Obat</label>
        <input
          type="text"
          placeholder="e.g., Amoxicillin"
          value={namaObat}
          onChange={(e) => setNamaObat(e.target.value)}
          disabled={isPending}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
      </div>

      {/* Dosis + Cara Pemberian */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <label className="text-xs font-medium font-body text-on-surface-variant">Dosis</label>
          <input
            type="text"
            placeholder="e.g., 250mg"
            value={dosis}
            onChange={(e) => setDosis(e.target.value)}
            disabled={isPending}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-1.5 w-20 shrink-0">
          <label className="text-xs font-medium font-body text-on-surface-variant">Pemberian</label>
          <div className="relative">
            <select
              value={caraPemberian}
              onChange={(e) => setCaraPemberian(e.target.value)}
              disabled={isPending}
              className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-xl px-2 py-2.5 text-xs font-body pr-5 focus:outline-none focus:border-primary transition-colors cursor-pointer text-on-surface disabled:opacity-50"
            >
              {RUTE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              className="absolute right-1 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              style={{ fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      {/* Schedule Window */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium font-body text-on-surface-variant">
          Schedule Window
        </label>
        <div className="flex flex-wrap gap-2">
          {SHIFT_LIST.map((shift) => {
            const active = jadwals.some((j) => j.shift === shift);
            return (
              <button
                key={shift}
                type="button"
                onClick={() => toggleShift(shift)}
                disabled={isPending}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-colors disabled:opacity-50 ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {shift}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-on-primary-fixed-variant cursor-pointer text-on-primary-container font-semibold text-sm font-body py-3 rounded-2xl hover:opacity-90 active:opacity-80 transition-opacity leading-snug disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Menyimpan..." : "Konfirmasi & Tambahkan Jadwal"}
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function KelolaObat() {
  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-on-surface-variant font-body flex items-center gap-1.5">
            <CalendarTodayOutlinedIcon style={{ fontSize: 14 }} />
            Daftar Periksa Harian &middot; Kamis, 24 Okt
          </p>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight mt-0.5">
            Kelola Obat
          </h1>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-sm font-body px-4 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm shrink-0"
        >
          <AddOutlinedIcon fontSize="small" />
          Tambah Obat Baru
        </button>
      </div>

      {/* Body */}
      <div className="flex gap-5 items-start">
        {/* Left — Timeline */}
        <div className="flex-1 min-w-0 flex flex-col">
          {JADWAL_DATA.map((group) => (
            <JadwalSection key={group.id} group={group} />
          ))}
        </div>

        {/* Right — Quick Add */}
        <QuickAddPanel />
      </div>
    </div>
  );
}
