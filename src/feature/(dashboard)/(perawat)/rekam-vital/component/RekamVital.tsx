"use client";

import { useState } from "react";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LansiaDropdown from "@/shared/LansiaDropDown/LansiaDropdown";
import { useGetLansiaByPengurus } from "@/repository/lansia/query";
import { useTambahPemeriksaan } from "@/repository/rekam/query";
import { useToast } from "@/shared/Toast/ToastProvider";
import type { PemeriksaanRecommendation } from "@/repository/rekam/dto";

// ── Status Config ──────────────────────────────────────────────────────────────
type StatusUI = "NORMAL" | "OBSERVASI" | "KRITIS";

const statusConfig: Record<
  StatusUI,
  {
    badge: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    icon: React.ReactNode;
  }
> = {
  NORMAL: {
    badge: "bg-primary-fixed-dim text-primary",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
    titleColor: "text-on-surface",
    icon: <CheckCircleOutlineOutlinedIcon style={{ fontSize: 32 }} />,
  },
  OBSERVASI: {
    badge: "bg-tertiary-fixed text-tertiary",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
    titleColor: "text-on-surface",
    icon: <VisibilityOutlinedIcon style={{ fontSize: 32 }} />,
  },
  KRITIS: {
    badge: "bg-error-container text-error",
    iconBg: "bg-error-container",
    iconColor: "text-error",
    titleColor: "text-error",
    icon: <WarningAmberOutlinedIcon style={{ fontSize: 32 }} />,
  },
};

// ── Input Component ────────────────────────────────────────────────────────────
function VitalInput({
  label,
  placeholder,
  value,
  onChange,
  icon,
  unit,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  unit?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-on-surface-variant font-body font-medium">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            onChange(val);
          }}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors pr-8 disabled:opacity-50"
        />
        {icon && (
          <span className="absolute right-3 text-outline pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        {unit && (
          <span className="absolute right-3 text-outline text-xs font-body pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RekamVital() {
  const { data: lansiaList = [], isLoading: lansiaLoading } = useGetLansiaByPengurus();
  const { mutate: tambahPemeriksaan, isPending } = useTambahPemeriksaan();
  const { success: showSuccess, error: showError } = useToast();

  const [selectedLansiaId, setSelectedLansiaId] = useState<string | null>(
    () => lansiaList[0]?.id ?? null
  );
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temp, setTemp] = useState("");
  const [glucose, setGlucose] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [recommendation, setRecommendation] = useState<PemeriksaanRecommendation | null>(null);
  const [resultStatus, setResultStatus] = useState<StatusUI | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!selectedLansiaId) {
      setError("Pilih lansia terlebih dahulu.");
      return;
    }

    const fields = [
      { label: "Sistolik", val: sys },
      { label: "Diastolik", val: dia },
      { label: "Detak Jantung", val: heartRate },
      { label: "Suhu Tubuh", val: temp },
      { label: "Gula Darah", val: glucose },
      { label: "Berat Badan", val: weight },
    ];
    const empty = fields.filter((f) => !f.val.trim());
    if (empty.length > 0) {
      setError(`Harap isi semua field: ${empty.map((f) => f.label).join(", ")}.`);
      return;
    }

    tambahPemeriksaan(
      {
        lansia_id: selectedLansiaId,
        tekanan_darah: `${sys}/${dia}`,
        detak_jantung: parseInt(heartRate),
        suhu_tubuh: parseFloat(temp),
        gula_darah: parseInt(glucose),
        berat_badan: parseFloat(weight),
        keluhan: description,
      },
      {
        onSuccess: (result) => {
          if (!result.success) {
            showError(result.error || "Gagal menyimpan pemeriksaan.");
            return;
          }
          const raw = result.data!.pemeriksaan.status as StatusUI;
          setResultStatus(statusConfig[raw] ? raw : "NORMAL");
          setRecommendation(result.data!.recommendation);
          showSuccess("Pemeriksaan berhasil disimpan!");
        },
        onError: (err) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            err?.message ??
            "Gagal menyimpan pemeriksaan.";
          showError(msg);
        },
      }
    );
  };

  const cfg = resultStatus ? statusConfig[resultStatus] : null;

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
            Rekam Tanda Vital
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Masukkan metrik kesehatan untuk pemeriksaan harian lansia.
          </p>
        </div>

        {/* Lansia Selector */}
        <LansiaDropdown
          lansiaList={lansiaList}
          selectedId={selectedLansiaId!}
          onChange={setSelectedLansiaId}
          isLoading={lansiaLoading}
        />
      </div>

      {/* Body */}
      <div className="flex gap-5 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Pengukuran Klinis Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FavoriteOutlinedIcon fontSize="small" className="text-primary" />
              <h2 className="text-base font-semibold font-headline text-on-surface">
                Pengukuran Klinis
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tekanan Darah */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-body font-medium">
                  Tekanan Darah (mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Sys"
                    value={sys}
                    disabled={isPending}
                    onChange={(e) => setSys(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  <span className="text-on-surface-variant text-sm font-body shrink-0">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Dia"
                    value={dia}
                    disabled={isPending}
                    onChange={(e) => setDia(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Detak Jantung */}
              <VitalInput
                label="Detak Jantung (BPM)"
                placeholder="e.g. 72"
                value={heartRate}
                onChange={setHeartRate}
                disabled={isPending}
                icon={<MonitorHeartOutlinedIcon style={{ fontSize: 16 }} />}
              />

              {/* Suhu Tubuh */}
              <VitalInput
                label="Suhu Tubuh (°C)"
                placeholder="e.g. 36.8"
                value={temp}
                onChange={setTemp}
                disabled={isPending}
                icon={<DeviceThermostatOutlinedIcon style={{ fontSize: 16 }} />}
              />

              {/* Gula Darah */}
              <VitalInput
                label="Gula Darah (mg/dL)"
                placeholder="e.g. 95"
                value={glucose}
                onChange={setGlucose}
                disabled={isPending}
                icon={<WaterDropOutlinedIcon style={{ fontSize: 16 }} />}
              />

              {/* Berat Badan */}
              <VitalInput
                label="Berat Badan (kg)"
                placeholder="e.g. 60"
                value={weight}
                onChange={setWeight}
                disabled={isPending}
                icon={<MonitorWeightOutlinedIcon style={{ fontSize: 16 }} />}
              />
            </div>
          </div>

          {/* Deskripsi Kondisi */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <SubjectOutlinedIcon fontSize="small" className="text-primary" />
              <h2 className="text-base font-semibold font-headline text-on-surface">
                Deskripsi Kondisi Lansia
              </h2>
            </div>
            <textarea
              rows={4}
              placeholder="Catat ketidaknyamanan fisik, perubahan suasana hati, atau keluhan spesifik yang dirasakan lansia..."
              value={description}
              disabled={isPending}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
            />
            {error && <p className="text-xs text-error font-body mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container font-semibold text-sm font-body px-5 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Menyimpan..." : "Analyze & Record"}
                {!isPending && <ArrowForwardIcon fontSize="small" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column — Recommendation */}
        <div className="w-64 shrink-0 bg-surface-container rounded-2xl p-5 flex flex-col gap-4 min-h-80">
          <div className="flex items-center gap-2">
            <SmartToyOutlinedIcon fontSize="small" className="text-on-surface-variant" />
            <h2 className="text-sm font-semibold font-headline text-on-surface leading-tight">
              System Recommendation
            </h2>
          </div>

          {recommendation && cfg ? (
            <div className="flex flex-col gap-3 flex-1">
              {/* Icon + Badge */}
              <div className="flex flex-col items-center gap-2 mt-1">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}
                >
                  {cfg.icon}
                </div>
                <span
                  className={`text-[10px] font-bold font-label tracking-widest uppercase px-3 py-1 rounded-full ${cfg.badge}`}
                >
                  {resultStatus}
                </span>
                <h3 className={`text-sm font-bold font-headline text-center leading-snug ${cfg.titleColor}`}>
                  {recommendation.title}
                </h3>
                <p className="text-xs text-on-surface-variant font-body text-center leading-relaxed">
                  {recommendation.description}
                </p>
              </div>

              {/* Anomalies */}
              {recommendation.anomalies_found.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-bold font-label text-on-surface-variant uppercase tracking-wide">
                    Anomali
                  </p>
                  {recommendation.anomalies_found.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <ErrorOutlineOutlinedIcon
                        style={{ fontSize: 13 }}
                        className="text-warning shrink-0 mt-0.5"
                      />
                      <span className="text-[11px] text-on-surface font-body leading-snug">{a}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Items */}
              {recommendation.action_items.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-bold font-label text-on-surface-variant uppercase tracking-wide">
                    Tindakan
                  </p>
                  {recommendation.action_items.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-primary shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <span className="text-[11px] text-on-surface font-body leading-snug">{a}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up interval */}
              {recommendation.follow_up_interval && (
                <p className="text-[10px] text-on-surface-variant font-body text-center mt-auto">
                  Follow-up: setiap <strong>{recommendation.follow_up_interval}</strong>
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 opacity-40">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <VisibilityOutlinedIcon />
              </div>
              <p className="text-xs text-on-surface-variant font-body text-center">
                Isi form dan klik Analyze & Record untuk melihat rekomendasi dari AI
              </p>
            </div>
          )}

          <p className="text-[10px] text-on-surface-variant font-body text-center leading-relaxed mt-auto opacity-70">
            AI analysis is supplementary. Always rely on clinical judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
