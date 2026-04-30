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
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { useTambahObat, useGetJadwalHariIni, useChecklistObat } from "@/repository/obat/query";
import { useGetLansiaByPengurus } from "@/repository/lansia/query";
import { useToast } from "@/shared/Toast/ToastProvider";
import type { JadwalHariIniItem, JadwalObatItem, Shift } from "@/repository/obat/dto";
import DropDown from "@/shared/DropDown/DropDown";

// ── Status Config ──────────────────────────────────────────────────────────────
type StatusType = "terlewat" | "menunggu" | "diberikan";

const statusConfig: Record<
  StatusType,
  { containerClass: string }
> = {
  terlewat:  { containerClass: "bg-error-container/40 border-error/20" },
  menunggu:  { containerClass: "bg-surface-container-lowest border-outline-variant" },
  diberikan: { containerClass: "bg-surface-container-lowest border-outline-variant" },
};

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 44 }: { src: string; name: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div
      className="rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant"
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".initials-fallback")) {
              const span = document.createElement("span");
              span.className = "initials-fallback text-xs font-bold font-headline text-on-surface-variant";
              span.textContent = initials;
              parent.appendChild(span);
            }
          }}
        />
      ) : (
        <span className="text-xs font-bold font-headline text-on-surface-variant">{initials}</span>
      )}
    </div>
  );
}

// ── Obat Card ─────────────────────────────────────────────────────────────────
function ObatCard({
  item,
  isDone,
  onClickChecklist,
}: {
  item: JadwalHariIniItem;
  isDone: boolean;
  onClickChecklist: () => void;
}) {
  const effectiveStatus: StatusType = isDone
    ? "diberikan"
    : ((item.status_pemberian as StatusType) in statusConfig
        ? (item.status_pemberian as StatusType)
        : "menunggu");

  const cfg = statusConfig[effectiveStatus];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${cfg.containerClass}`}>
      <Avatar src={item.foto_lansia} name={item.nama_lansia} size={44} />

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold font-headline text-on-surface truncate">
            {item.nama_lansia}
          </span>
          <span className="text-[10px] font-medium font-label text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full shrink-0">
            {item.nomor_kamar !== "-" ? item.nomor_kamar : "—"}
          </span>
        </div>
        <span className="text-xs text-on-surface-variant font-body mt-0.5 truncate">
          {item.nama_obat}&nbsp;&middot;&nbsp;{item.dosis}&nbsp;&middot;&nbsp;{item.cara_pemberian}
        </span>
        {effectiveStatus === "diberikan" && item.diberikan_pada && (
          <span className="text-[11px] text-primary font-body mt-0.5">
            Diberikan {item.diberikan_pada}
          </span>
        )}
      </div>

      {/* Right indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold font-headline text-on-surface-variant">
          {item.jam.slice(0, 5)}
        </span>

        {effectiveStatus === "terlewat" && (
          <>
            <div className="flex items-center gap-1 bg-error-container text-error text-[10px] font-bold font-label px-2 py-1 rounded-full shrink-0">
              <WarningAmberOutlinedIcon style={{ fontSize: 12 }} />
              TERLEWAT
            </div>
            <button className="text-on-surface-variant hover:text-error transition-colors p-1">
              <DeleteOutlineOutlinedIcon style={{ fontSize: 18 }} />
            </button>
          </>
        )}

        {effectiveStatus === "menunggu" && (
          <button
            onClick={onClickChecklist}
            title="Catat pemberian obat"
            className="w-8 h-8 rounded-full border-2 border-outline-variant hover:border-primary hover:bg-primary-fixed/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          />
        )}

        {effectiveStatus === "diberikan" && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <CheckCircleOutlinedIcon style={{ fontSize: 18 }} className="text-on-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ObatCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-outline-variant animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-surface-container-high shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-32 rounded-full bg-surface-container-high" />
        <div className="h-2.5 w-48 rounded-full bg-surface-container" />
      </div>
      <div className="h-8 w-8 rounded-full bg-surface-container-high" />
    </div>
  );
}

// ── Timeline Section ───────────────────────────────────────────────────────────
const SHIFT_META: Record<Shift, { label: string; timeRange: string; iconColor: string }> = {
  Pagi:  { label: "Jadwal Pagi",  timeRange: "08:00 – 10:00", iconColor: "text-tertiary" },
  Siang: { label: "Jadwal Siang", timeRange: "12:00 – 14:00", iconColor: "text-tertiary-fixed-dim" },
  Sore:  { label: "Jadwal Sore",  timeRange: "17:00 – 20:00", iconColor: "text-outline" },
};

function JadwalSection({
  shift,
  items,
  isLoading,
  doneIds,
  onClickChecklist,
}: {
  shift: Shift;
  items: JadwalHariIniItem[];
  isLoading: boolean;
  doneIds: Set<string>;
  onClickChecklist: (item: JadwalHariIniItem) => void;
}) {
  const meta = SHIFT_META[shift];
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0 z-10" />
        <div className="w-0.5 bg-primary/30 flex-1 mt-1" style={{ minHeight: 16 }} />
      </div>
      <div className="flex flex-col gap-3 flex-1 pb-6 min-w-0">
        <div className="flex items-center gap-3">
          <WbSunnyOutlinedIcon fontSize="small" className={meta.iconColor} />
          <span className="text-base font-bold font-headline text-on-surface">{meta.label}</span>
          <span className="text-xs text-on-surface-variant font-body bg-surface-container px-2.5 py-1 rounded-full">
            {meta.timeRange}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {isLoading ? (
            <><ObatCardSkeleton /><ObatCardSkeleton /></>
          ) : items.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body px-4 py-3">
              <HourglassEmptyOutlinedIcon style={{ fontSize: 16 }} />
              Tidak ada jadwal obat untuk sesi ini
            </div>
          ) : (
            items.map((item) => (
              <ObatCard
                key={item.jadwal_obat_id}
                item={item}
                isDone={doneIds.has(item.jadwal_obat_id)}
                onClickChecklist={() => onClickChecklist(item)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Checklist Modal ────────────────────────────────────────────────────────────
function ChecklistModal({
  item,
  catatan,
  onCatatanChange,
  onSubmit,
  onClose,
  isPending,
}: {
  item: JadwalHariIniItem;
  catatan: string;
  onCatatanChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
              <AssignmentTurnedInOutlinedIcon style={{ fontSize: 20 }} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold font-headline text-on-surface leading-tight">
                Catat Pemberian Obat
              </h2>
              <p className="text-xs text-on-surface-variant font-body mt-0.5">
                {item.nama_lansia} &middot; {item.nama_obat} {item.dosis}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors shrink-0 disabled:opacity-50"
          >
            <CloseOutlinedIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Catatan input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium font-body text-on-surface-variant">
            Catatan <span className="text-error">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Contoh: Diberikan tepat waktu, lansia kooperatif"
            value={catatan}
            disabled={isPending}
            onChange={(e) => onCatatanChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 rounded-full text-sm font-semibold font-body text-primary hover:bg-primary-fixed/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending || !catatan.trim()}
            className="px-5 py-2.5 rounded-full text-sm font-semibold font-body bg-primary-container text-on-primary-container hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Menyimpan..." : "Konfirmasi"}
          </button>
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

  const [lansiaId, setLansiaId] = useState("");
  const [namaObat, setNamaObat] = useState("");
  const [dosis, setDosis] = useState("");
  const [caraPemberian, setCaraPemberian] = useState("Oral");
  const [jadwals, setJadwals] = useState<JadwalObatItem[]>([{ shift: "Pagi", jam: "08:00" }]);

  const RUTE_OPTIONS = ["Oral", "Inhaler", "Injeksi", "Topikal", "Sublingual", "With Food"];
  const SHIFT_LIST: Shift[] = ["Pagi", "Siang", "Sore"];
  const DEFAULT_JAM: Record<Shift, string> = { Pagi: "08:00", Siang: "12:00", Sore: "17:00" };

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
      { lansia_id: lansiaId, nama_obat: namaObat, dosis, cara_pemberian: caraPemberian, keterangan: "", jadwals },
      {
        onSuccess: (result) => {
          if (!result.success) { showError(result.error || "Gagal menambahkan obat"); return; }
          showSuccess("Obat berhasil ditambahkan");
          resetForm();
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            error?.message ?? "Gagal menambahkan obat";
          showError(message);
        },
      }
    );
  }

  return (
    <div className="w-60 shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
          <MedicationOutlinedIcon style={{ fontSize: 18 }} className="text-primary" />
        </div>
        <h2 className="text-sm font-bold font-headline text-on-surface leading-snug">
          Tambah Jadwal Obat Cepat
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium font-body text-on-surface-variant">Lansia</label>
        <DropDown<string>
          placeholder="Pilih lansia..."
          value={lansiaId}
          onChange={setLansiaId}
          options={lansiaList.map((l) => ({ value: l.id, label: l.nama }))}
          disabled={isPending || lansiaLoading}
          label=""
        />
      </div>

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
              {RUTE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <KeyboardArrowDownIcon
              className="absolute right-1 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              style={{ fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium font-body text-on-surface-variant">Schedule Window</label>
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
                  active ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {shift}
              </button>
            );
          })}
        </div>
      </div>

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
const SHIFT_ORDER: Shift[] = ["Pagi", "Siang", "Sore"];

export default function KelolaObat() {
  const { data: jadwalData, isLoading, isError } = useGetJadwalHariIni();
  const { mutate: checklist, isPending: isChecking } = useChecklistObat();
  const { success: showSuccess, error: showError } = useToast();

  // Optimistic: IDs yang sudah diceklis secara lokal
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  // Modal state
  const [modalItem, setModalItem] = useState<JadwalHariIniItem | null>(null);
  const [catatan, setCatatan] = useState("");

  const jadwal = jadwalData?.jadwal ?? {} as Record<Shift, JadwalHariIniItem[]>;
  const tanggalLabel = jadwalData ? `${jadwalData.hari}, ${jadwalData.tanggal}` : "—";

  function openModal(item: JadwalHariIniItem) {
    setModalItem(item);
    setCatatan("");
  }

  function closeModal() {
    if (isChecking) return;
    setModalItem(null);
    setCatatan("");
  }

  function handleChecklist() {
    if (!modalItem || !catatan.trim()) return;

    checklist(
      { jadwal_obat_id: modalItem.jadwal_obat_id, catatan },
      {
        onSuccess: (result) => {
          if (!result.success) {
            showError(result.error || "Gagal mencatat pemberian obat.");
            return;
          }
          // Optimistic update — langsung flip card ke "diberikan"
          setDoneIds((prev) => new Set(prev).add(modalItem.jadwal_obat_id));
          showSuccess("Pemberian obat berhasil dicatat!");
          closeModal();
        },
        onError: (err) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            err?.message ??
            "Gagal mencatat pemberian obat.";
          showError(msg);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* Checklist Modal */}
      {modalItem && (
        <ChecklistModal
          item={modalItem}
          catatan={catatan}
          onCatatanChange={setCatatan}
          onSubmit={handleChecklist}
          onClose={closeModal}
          isPending={isChecking}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-on-surface-variant font-body flex items-center gap-1.5">
            <CalendarTodayOutlinedIcon style={{ fontSize: 14 }} />
            Daftar Periksa Harian &middot; {tanggalLabel}
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
        <div className="flex-1 min-w-0 flex flex-col">
          {isError && (
            <p className="text-sm text-error font-body text-center py-8">
              Gagal memuat jadwal. Coba refresh halaman.
            </p>
          )}
          {SHIFT_ORDER.map((shift) => (
            <JadwalSection
              key={shift}
              shift={shift}
              items={jadwal[shift] ?? []}
              isLoading={isLoading}
              doneIds={doneIds}
              onClickChecklist={openModal}
            />
          ))}
        </div>
        <QuickAddPanel />
      </div>
    </div>
  );
}
