"use client";

import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import Webcam from "react-webcam";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FlashlightOnOutlinedIcon from "@mui/icons-material/FlashlightOnOutlined";
import FlashlightOffOutlinedIcon from "@mui/icons-material/FlashlightOffOutlined";
import FlipCameraAndroidOutlinedIcon from "@mui/icons-material/FlipCameraAndroidOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useTambahGaleri } from "@/repository/rekam/query";
import { useGetLansiaByPengurus } from "@/repository/lansia/query";
import { useToast } from "@/shared/Toast/ToastProvider";

// ── Types ──────────────────────────────────────────────────────────────────────
type BadgeStatus = "Risiko Rendah" | "Pantau" | "Kritis";

interface RiwayatItem {
  id: number;
  title: string;
  date: string;
  description: string;
  badge: BadgeStatus;
  imageSrc?: string;
  active: boolean;
}

const RIWAYAT_DATA: RiwayatItem[] = [
  {
    id: 1,
    title: "Memar Lengan Kiri",
    date: "12 Okt, 10:30 Pagi",
    description: "Luka memar kecil akibat benturan ringan pada pintu.",
    badge: "Risiko Rendah",
    active: true,
  },
  {
    id: 2,
    title: "Kemerahan Tumit Kanan",
    date: "05 Okt, 08:15 Pagi",
    description: "Terlihat sedikit kemerahan pada tumit kanan saat rutinitas perawatan pagi...",
    badge: "Pantau",
    active: false,
  },
];

const LOKASI_OPTIONS = [
  "Kepala",
  "Wajah",
  "Leher",
  "Bahu Kiri",
  "Bahu Kanan",
  "Lengan Atas Kiri",
  "Lengan Atas Kanan",
  "Lengan Bawah Kiri",
  "Lengan Bawah Kanan",
  "Tangan Kiri",
  "Tangan Kanan",
  "Dada",
  "Punggung Atas",
  "Punggung Bawah",
  "Perut",
  "Pinggang",
  "Pinggul",
  "Paha Kiri",
  "Paha Kanan",
  "Lutut Kiri",
  "Lutut Kanan",
  "Betis Kiri",
  "Betis Kanan",
  "Pergelangan Kaki Kiri",
  "Pergelangan Kaki Kanan",
  "Kaki Kiri",
  "Kaki Kanan",
  "Tumit Kiri",
  "Tumit Kanan",
];

const badgeConfig: Record<BadgeStatus, string> = {
  "Risiko Rendah": "bg-primary-fixed text-primary",
  Pantau: "bg-tertiary-fixed text-tertiary",
  Kritis: "bg-error-container text-error",
};

// ── Camera Box (inline, bukan fullscreen) ──────────────────────────────────────
interface CameraBoxProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

function CameraBox({ onCapture, onClose }: CameraBoxProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [ready, setReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Check torch support when stream is ready
  const handleUserMedia = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    const track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities?.() as Record<string, unknown> | undefined;
    setFlashSupported(!!(caps && "torch" in caps));
    setPermissionDenied(false);
    setReady(true);
  }, []);

  const handleUserMediaError = useCallback(() => {
    setPermissionDenied(true);
    setReady(true);
  }, []);

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const newVal = !flashOn;
    try {
      await (
        track as MediaStreamTrack & { applyConstraints: (c: object) => Promise<void> }
      ).applyConstraints({ advanced: [{ torch: newVal } as MediaTrackConstraintSet] });
      setFlashOn(newVal);
    } catch {
      // torch not supported
    }
  };

  const flipCamera = () => {
    setFlashOn(false);
    setReady(false);
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const takePhoto = () => {
    const dataUrl = webcamRef.current?.getScreenshot();
    if (dataUrl) onCapture(dataUrl);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-outline-variant bg-black relative">
      {/* Camera view */}
      <div className="relative w-full" style={{ height: 220 }}>
        {!permissionDenied && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.92}
            videoConstraints={{ facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="w-full h-full object-cover"
            style={{
              height: 220,
              transform: facingMode === "user" ? "scaleX(-1)" : "none",
            }}
          />
        )}

        {/* Permission denied overlay */}
        {permissionDenied && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-container text-on-surface-variant px-6 text-center">
            <NoPhotographyOutlinedIcon style={{ fontSize: 40 }} className="text-outline" />
            <p className="text-sm font-semibold font-headline text-on-surface">
              Akses Kamera Ditolak
            </p>
            <p className="text-xs text-on-surface-variant font-body">
              Izinkan akses kamera di pengaturan browser, lalu coba lagi.
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {!ready && !permissionDenied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <p className="text-white/70 text-sm font-body">Memuat kamera...</p>
          </div>
        )}

        {/* Top controls */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <CloseOutlinedIcon style={{ fontSize: 18 }} />
          </button>
          {flashSupported && (
            <button
              onClick={toggleFlash}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              {flashOn ? (
                <FlashlightOnOutlinedIcon style={{ fontSize: 18 }} className="text-yellow-300" />
              ) : (
                <FlashlightOffOutlinedIcon style={{ fontSize: 18 }} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      {!permissionDenied && ready && (
        <div className="flex items-center justify-center gap-8 bg-black py-3">
          <button
            onClick={flipCamera}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <FlipCameraAndroidOutlinedIcon style={{ fontSize: 20 }} />
          </button>
          {/* Shutter */}
          <button
            onClick={takePhoto}
            className="w-12 h-12 rounded-full bg-white border-4 border-white/40 hover:scale-95 active:scale-90 transition-transform shadow-lg"
          />
          <div className="w-9 h-9" />
        </div>
      )}
    </div>
  );
}

// ── Lansia Dropdown ────────────────────────────────────────────────────────────
interface LansiaDropdownProps {
  lansiaList: { id: string; nama: string; room?: string }[];
  selectedId: string;
  onChange: (id: string) => void;
  isLoading: boolean;
}

function LansiaDropdown({ lansiaList, selectedId, onChange, isLoading }: LansiaDropdownProps) {
  const selected = lansiaList.find((l) => l.id === selectedId);

  return (
    <div className="relative">
      <select
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        <option value="" disabled>
          Pilih lansia...
        </option>
        {lansiaList.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nama}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2 bg-surface-container rounded-2xl px-3 py-2 border border-outline-variant cursor-pointer hover:bg-surface-container-high transition-colors">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0">
          <AccountCircleOutlinedIcon fontSize="small" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold font-headline text-on-surface leading-tight truncate">
            {isLoading ? "Memuat..." : (selected?.nama ?? "Pilih Lansia")}
          </span>
          <span className="text-xs text-on-surface-variant font-body">
            {selected ? "Lansia aktif" : "Belum dipilih"}
          </span>
        </div>
        <KeyboardArrowDownIcon fontSize="small" className="text-on-surface-variant ml-1 shrink-0" />
      </div>
    </div>
  );
}

// ── Select Field ───────────────────────────────────────────────────────────────
function SelectField({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm font-body pr-8 focus:outline-none focus:border-primary transition-colors cursor-pointer ${
          value ? "text-on-surface" : "text-outline"
        }`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <KeyboardArrowDownIcon
        fontSize="small"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
      />
    </div>
  );
}

// ── dataUrlToFile helper ───────────────────────────────────────────────────────
function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], filename, { type: mime });
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function PindaiRaga() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: tambahGaleri, isPending } = useTambahGaleri();
  const { data: lansiaList = [], isLoading: lansiaLoading } = useGetLansiaByPengurus();
  const { success: showSuccess, error: showError } = useToast();

  const [selectedLansiaId, setSelectedLansiaId] = useState<string | null>(() => {
  return lansiaList[0]?.id ?? null;
});
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");

  // Auto-select first lansia

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      showError(`File terlalu besar. Maks 10MB.`);
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl: string) => {
    setPhoto(dataUrl);
    setPhotoFile(dataUrlToFile(dataUrl, "capture.jpg"));
    setShowCamera(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSave = () => {
    if (!selectedLansiaId) {
      showError("Pilih lansia terlebih dahulu.");
      return;
    }
    if (!photoFile) {
      showError("Foto wajib diunggah.");
      return;
    }
    if (!lokasi || !deskripsi) {
      showError("Lokasi dan deskripsi wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("lansia_id", selectedLansiaId);
    formData.append("foto", photoFile);
    formData.append("lokasi_luka", lokasi);
    formData.append("deskripsi", deskripsi);

    tambahGaleri(formData, {
      onSuccess: (result) => {
        if (!result.success) {
          showError(result.error || "Gagal menyimpan.");
          return;
        }
        showSuccess("Kondisi berhasil disimpan!");
        handleCancel();
      },
      onError: (err) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          err?.message ??
          "Gagal menyimpan dokumentasi.";
        showError(msg);
      },
    });
  };

  const handleCancel = () => {
    setPhoto(null);
    setPhotoFile(null);
    setDeskripsi("");
    setLokasi("");
    setShowCamera(false);
  };

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
            Pindai Raga
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1 max-w-md">
            Rekam dan pantau kondisi fisik lansia. Unggah foto yang jelas dan berikan konteks
            mendetail untuk panduan tim perawat.
          </p>
        </div>

        {/* Lansia selector */}
        <LansiaDropdown
          lansiaList={lansiaList}
          selectedId={selectedLansiaId!}
          onChange={setSelectedLansiaId}
          isLoading={lansiaLoading}
        />
      </div>

      {/* Body */}
      <div className="flex gap-5 items-start">
        {/* Left — Form */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-lg font-bold font-headline text-on-surface">
            Dokumentasikan Kondisi Baru
          </h2>

          {/* Camera Box (inline) */}
          {showCamera && (
            <CameraBox onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
          )}

          {/* Photo preview */}
          {!showCamera && photo && (
            <div
              className="relative w-full rounded-xl overflow-hidden border border-outline-variant"
              style={{ height: 220 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => {
                  setPhoto(null);
                  setPhotoFile(null);
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </button>
            </div>
          )}

          {/* Upload dropzone */}
          {!showCamera && !photo && (
            <div
              onDrop={handleDrop}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none py-10 ${
                isDragging
                  ? "border-primary bg-primary-fixed/20 scale-[1.01]"
                  : "border-outline-variant bg-surface-container-low hover:border-primary hover:bg-surface-container"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <AddAPhotoOutlinedIcon />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold font-body text-on-surface">
                  Ketuk untuk unggah foto
                </p>
                <p className="text-xs text-on-surface-variant font-body mt-0.5">
                  Pastikan pencahayaan baik dan gambar fokus. Maks 10MB.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCamera(true);
                }}
                className="flex items-center gap-1.5 mt-1 text-primary text-xs font-semibold font-body bg-primary-fixed/30 px-3 py-1.5 rounded-full hover:bg-primary-fixed/50 transition-colors"
              >
                <CameraAltOutlinedIcon style={{ fontSize: 16 }} />
                Buka Kamera
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium font-body text-on-surface-variant">
              Deskripsi &amp; Konteks
            </label>
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              disabled={isPending}
              placeholder="Deskripsikan kondisi fisik, ukuran, lokasi, dan keluhan nyeri..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium font-body text-on-surface-variant">
              Lokasi pada Tubuh
            </label>
            <SelectField
              options={LOKASI_OPTIONS}
              value={lokasi}
              onChange={setLokasi}
              placeholder="Pilih lokasi..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-5 py-2.5 rounded-full text-sm font-semibold font-body text-primary hover:bg-primary-fixed/20 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-5 py-2.5 rounded-full text-sm font-semibold font-body bg-primary-container text-on-primary-container hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {/* Right — Riwayat */}
        <div className="w-[260px] shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <HistoryOutlinedIcon fontSize="small" className="text-on-surface-variant" />
            <h2 className="text-base font-bold font-headline text-on-surface">
              Riwayat &amp; Perbandingan
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {RIWAYAT_DATA.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center pt-1.5 shrink-0">
                  <FiberManualRecordIcon
                    style={{ fontSize: 10 }}
                    className={item.active ? "text-primary" : "text-outline-variant"}
                  />
                </div>
                <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant">
                  <ImageOutlinedIcon fontSize="small" className="text-outline" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-xs font-bold font-headline text-on-surface leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-body">{item.date}</span>
                  <p className="text-[11px] text-on-surface-variant font-body leading-snug line-clamp-2">
                    {item.description}
                  </p>
                  <span
                    className={`self-start text-[10px] font-bold font-label tracking-wide uppercase px-2 py-0.5 rounded-full mt-0.5 ${badgeConfig[item.badge]}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="text-sm font-semibold font-body text-primary text-center hover:underline transition-all mt-1">
            View Full History
          </button>
        </div>
      </div>
    </div>
  );
}
