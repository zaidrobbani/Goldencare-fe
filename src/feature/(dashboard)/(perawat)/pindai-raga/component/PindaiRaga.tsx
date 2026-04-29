"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FlashlightOnOutlinedIcon from "@mui/icons-material/FlashlightOnOutlined";
import FlashlightOffOutlinedIcon from "@mui/icons-material/FlashlightOffOutlined";
import FlipCameraAndroidOutlinedIcon from "@mui/icons-material/FlipCameraAndroidOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
type BadgeStatus = "Risiko Rendah" | "Pantau" | "Kritis";
type CondisiStatus = "SEHAT" | "OBSERVASI" | "KRITIS";

interface RiwayatItem {
  id: number;
  title: string;
  date: string;
  description: string;
  badge: BadgeStatus;
  imagePlaceholder?: boolean;
  imageSrc?: string;
  active: boolean;
}

// ── Static Data ────────────────────────────────────────────────────────────────
const RIWAYAT_DATA: RiwayatItem[] = [
  {
    id: 1,
    title: "Memar Lengan Kiri",
    date: "12 Okt, 10:30 Pagi",
    description: "Luka memar kecil akibat benturan ringan pada pintu.",
    badge: "Risiko Rendah",
    imageSrc: undefined,
    imagePlaceholder: true,
    active: true,
  },
  {
    id: 2,
    title: "Kemerahan Tumit Kanan",
    date: "05 Okt, 08:15 Pagi",
    description: "Terlihat sedikit kemerahan pada tumit kanan saat rutinitas perawatan pagi...",
    badge: "Pantau",
    imageSrc: undefined,
    imagePlaceholder: true,
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

const KONDISI_OPTIONS: CondisiStatus[] = ["SEHAT", "OBSERVASI", "KRITIS"];

const badgeConfig: Record<BadgeStatus, string> = {
  "Risiko Rendah": "bg-primary-fixed text-primary",
  Pantau: "bg-tertiary-fixed text-tertiary",
  Kritis: "bg-error-container text-error",
};

const kondisiConfig: Record<CondisiStatus, string> = {
  SEHAT: "text-primary",
  OBSERVASI: "text-tertiary",
  KRITIS: "text-error",
};

// ── Camera Modal ───────────────────────────────────────────────────────────────
interface CameraModalProps {
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [flashOn, setFlashOn] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flashSupported, setFlashSupported] = useState(false);

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    setLoading(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check torch support
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.() as Record<string, unknown> | undefined;
      setFlashSupported(!!(caps && "torch" in caps));
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => await startCamera(facingMode);
    run();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const newVal = !flashOn;
    try {
      await (
        track as MediaStreamTrack & { applyConstraints: (c: object) => Promise<void> }
      ).applyConstraints({
        advanced: [{ torch: newVal } as MediaTrackConstraintSet],
      });
      setFlashOn(newVal);
    } catch {
      // torch not supported silently
    }
  };

  const flipCamera = async () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setFlashOn(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <button
          onClick={onClose}
          className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <CloseOutlinedIcon />
        </button>
        {flashSupported && (
          <button
            onClick={toggleFlash}
            className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            {flashOn ? (
              <FlashlightOnOutlinedIcon className="text-yellow-300" />
            ) : (
              <FlashlightOffOutlinedIcon />
            )}
          </button>
        )}
      </div>

      {/* Camera view */}
      {permissionDenied ? (
        <div className="flex flex-col items-center gap-4 text-white px-8 text-center">
          <NoPhotographyOutlinedIcon style={{ fontSize: 64 }} className="text-white/50" />
          <p className="text-lg font-semibold font-headline">Akses Kamera Ditolak</p>
          <p className="text-sm text-white/70 font-body">
            Izinkan akses kamera di pengaturan browser Anda, lalu coba lagi.
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm font-body"
          >
            Tutup
          </button>
        </div>
      ) : loading ? (
        <div className="text-white/60 font-body text-sm">Memuat kamera...</div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom controls */}
      {!permissionDenied && !loading && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-10 pb-10 pt-6 bg-linear-to-t from-black/70 to-transparent">
          <button
            onClick={flipCamera}
            className="text-white p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <FlipCameraAndroidOutlinedIcon />
          </button>
          {/* Shutter */}
          <button
            onClick={takePhoto}
            className="w-16 h-16 rounded-full bg-white border-4 border-white/40 hover:scale-95 active:scale-90 transition-transform shadow-lg"
          />
          <div className="w-12 h-12" />
        </div>
      )}
    </div>
  );
}

// ── Dropdown ───────────────────────────────────────────────────────────────────
function Select({
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

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl font-body text-sm animate-fade-in">
      <CheckCircleOutlinedIcon fontSize="small" className="text-primary-fixed-dim" />
      {message}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PindaiRaga() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_FILE_SIZE) {
      setToast(
        `File terlalu besar. Maks 10MB, file Anda ${(file.size / (1024 * 1024)).toFixed(1)}MB`
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSave = () => {
    setToast("Kondisi berhasil disimpan!");
    setTimeout(() => {
      setPhoto(null);
      setDeskripsi("");
      setLokasi("");
      setKondisi("");
    }, 300);
  };

  const handleCancel = () => {
    setPhoto(null);
    setDeskripsi("");
    setLokasi("");
    setKondisi("");
  };

  return (
    <>
      {showCamera && (
        <CameraModal
          onClose={() => setShowCamera(false)}
          onCapture={(dataUrl) => {
            setPhoto(dataUrl);
            setShowCamera(false);
          }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
              Pindai Raga
            </h1>
            <p className="text-sm text-on-surface-variant font-body mt-1 max-w-md">
              Rekam dan pantau kondisi fisik Ibu Eleanor Vance. Unggah foto yang jelas dan berikan
              konteks mendetail untuk panduan tim perawat.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container rounded-2xl px-3 py-2 border border-outline-variant shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <AccountCircleOutlinedIcon fontSize="small" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold font-headline text-on-surface leading-tight">
                Eleanor Vance
              </span>
              <span className="text-xs text-on-surface-variant font-body">Room 302</span>
            </div>
            <KeyboardArrowDownIcon fontSize="small" className="text-on-surface-variant ml-1" />
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-5 items-start">
          {/* Left — Form */}
          <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col gap-5">
            <h2 className="text-lg font-bold font-headline text-on-surface">
              Dokumentasikan Kondisi Baru
            </h2>

            {/* Upload / Preview Area */}
            {photo ? (
              <div
                className="relative w-full rounded-xl overflow-hidden border border-outline-variant"
                style={{ height: 220 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </button>
              </div>
            ) : (
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
                    Ketuk untuk memotret atau unggah foto
                  </p>
                  <p className="text-xs text-on-surface-variant font-body mt-0.5">
                    Pastikan pencahayaan baik dan gambar fokus. Ukuran file maksimal 10MB.
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
                placeholder="Deskripsikan kondisi fisik, ukuran, lokasi, dan keluhan nyeri yang disampaikan oleh lansia..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium font-body text-on-surface-variant">
                  Lokasi pada Tubuh
                </label>
                <Select
                  options={LOKASI_OPTIONS}
                  value={lokasi}
                  onChange={setLokasi}
                  placeholder="Pilih lokasi..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium font-body text-on-surface-variant">
                  Jenis Kondisi
                </label>
                <Select
                  options={KONDISI_OPTIONS}
                  value={kondisi}
                  onChange={setKondisi}
                  placeholder="Pilih jenis..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-full text-sm font-semibold font-body text-primary hover:bg-primary-fixed/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-full text-sm font-semibold font-body bg-primary-container text-on-primary-container hover:opacity-90 active:opacity-80 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>

          {/* Right — Riwayat */}
          <div className="w-[260px] shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HistoryOutlinedIcon fontSize="small" className="text-on-surface-variant" />
                <h2 className="text-base font-bold font-headline text-on-surface">
                  Riwayat &amp; Perbandingan
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {RIWAYAT_DATA.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  {/* Dot indicator */}
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <FiberManualRecordIcon
                      style={{ fontSize: 10 }}
                      className={item.active ? "text-primary" : "text-outline-variant"}
                    />
                  </div>

                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant">
                    <ImageOutlinedIcon fontSize="small" className="text-outline" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold font-headline text-on-surface leading-tight">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-body">
                      {item.date}
                    </span>
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

      {/* Removed <style jsx> to prevent hydration mismatch. Use Tailwind utilities for animation and line clamp. */}
    </>
  );
}
