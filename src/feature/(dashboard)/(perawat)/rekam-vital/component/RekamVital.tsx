"use client";

import { useState } from "react";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BadgeLansia from "@/shared/LansiaBadge/BadgeLansia"; 
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
type Status = "NORMAL" | "OBSERVASI" | "KRITIS";

interface Recommendation {
  status: Status;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ── Threshold Logic ────────────────────────────────────────────────────────────
function analyzeVitals(
  sys: number,
  dia: number,
  heartRate: number,
  temp: number,
  glucose: number
): Recommendation {
  const issues: string[] = [];
  let maxSeverity: Status = "NORMAL";

  const escalate = (s: Status) => {
    if (s === "KRITIS") maxSeverity = "KRITIS";
    else if (s === "OBSERVASI" && maxSeverity !== "KRITIS") maxSeverity = "OBSERVASI";
  };

  // Tekanan Darah
  if (sys > 180 || dia > 120) {
    issues.push("tekanan darah sangat tinggi (hipertensi krisis)");
    escalate("KRITIS");
  } else if (sys < 80 || dia < 50) {
    issues.push("tekanan darah sangat rendah");
    escalate("KRITIS");
  } else if (sys > 139 || dia > 89) {
    issues.push("tekanan darah tinggi");
    escalate("OBSERVASI");
  } else if (sys < 90 || dia < 60) {
    issues.push("tekanan darah rendah");
    escalate("OBSERVASI");
  }

  // Detak Jantung
  if (heartRate > 150 || heartRate < 40) {
    issues.push("detak jantung ekstrem");
    escalate("KRITIS");
  } else if (heartRate > 100 || heartRate < 60) {
    issues.push("detak jantung tidak normal");
    escalate("OBSERVASI");
  }

  // Suhu Tubuh
  if (temp > 40 || temp < 35) {
    issues.push("suhu tubuh berbahaya");
    escalate("KRITIS");
  } else if (temp > 37.5) {
    issues.push("suhu tubuh naik");
    escalate("OBSERVASI");
  } else if (temp < 36) {
    issues.push("suhu tubuh rendah");
    escalate("OBSERVASI");
  }

  // Gula Darah
  if (glucose > 400 || glucose < 50) {
    issues.push("gula darah ekstrem");
    escalate("KRITIS");
  } else if (glucose > 200 || glucose < 70) {
    issues.push("gula darah tidak normal");
    escalate("OBSERVASI");
  }

  if (`${maxSeverity}` === "KRITIS") {
    return {
      status: "KRITIS",
      title: issues.length > 1 ? "Kondisi Kritis Terdeteksi" : capitalize(issues[0]),
      description: `Ditemukan indikasi ${issues.join(" dan ")}. Segera hubungi dokter dan berikan penanganan darurat. Pantau kondisi pasien setiap 15 menit.`,
      icon: <WarningAmberOutlinedIcon style={{ fontSize: 32 }} />,
    };
  }

  if (`${maxSeverity}` === "OBSERVASI") {
    return {
      status: "OBSERVASI",
      title: issues.length > 1 ? "Beberapa Parameter Perlu Perhatian" : capitalize(issues[0]),
      description: `Terdeteksi ${issues.join(" dan ")} pada lansia. Lakukan pemantauan ketat selama 4 jam ke depan dan anjurkan untuk banyak minum air putih.`,
      icon: <VisibilityOutlinedIcon style={{ fontSize: 32 }} />,
    };
  }

  return {
    status: "NORMAL",
    title: "Semua Parameter Normal",
    description:
      "Seluruh tanda vital lansia berada dalam rentang normal. Pertahankan pola hidup sehat dan jadwal pemeriksaan rutin.",
    icon: <CheckCircleOutlineOutlinedIcon style={{ fontSize: 32 }} />,
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Status Config ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  Status,
  { badge: string; iconBg: string; iconColor: string; titleColor: string }
> = {
  NORMAL: {
    badge: "bg-primary-fixed-dim text-primary",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
    titleColor: "text-on-surface",
  },
  OBSERVASI: {
    badge: "bg-tertiary-fixed text-tertiary",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
    titleColor: "text-on-surface",
  },
  KRITIS: {
    badge: "bg-error-container text-error",
    iconBg: "bg-error-container",
    iconColor: "text-error",
    titleColor: "text-error",
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  unit?: string;
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
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            onChange(val);
          }}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors pr-8"
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
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temp, setTemp] = useState("");
  const [glucose, setGlucose] = useState("");
  const [description, setDescription] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    setError("");
    const fields = [
      { label: "Sistolik", val: sys },
      { label: "Diastolik", val: dia },
      { label: "Detak Jantung", val: heartRate },
      { label: "Suhu Tubuh", val: temp },
      { label: "Gula Darah", val: glucose },
    ];
    const empty = fields.filter((f) => !f.val.trim());
    if (empty.length > 0) {
      setError(`Harap isi semua field: ${empty.map((f) => f.label).join(", ")}.`);
      return;
    }

    const result = analyzeVitals(
      parseFloat(sys),
      parseFloat(dia),
      parseFloat(heartRate),
      parseFloat(temp),
      parseFloat(glucose)
    );
    setRecommendation(result);
  };

  const cfg = recommendation ? statusConfig[recommendation.status] : null;

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

        {/* Patient Badge */}
        <BadgeLansia />
        
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
                    onChange={(e) => setSys(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-on-surface-variant text-sm font-body shrink-0">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Dia"
                    value={dia}
                    onChange={(e) => setDia(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Detak Jantung */}
              <VitalInput
                label="Detak Jantung (BPM)"
                placeholder="e.g. 72"
                value={heartRate}
                onChange={setHeartRate}
                icon={<MonitorHeartOutlinedIcon style={{ fontSize: 16 }} />}
              />

              {/* Suhu Tubuh */}
              <VitalInput
                label="Suhu Tubuh (°C)"
                placeholder="e.g. 36.8"
                value={temp}
                onChange={setTemp}
                icon={<DeviceThermostatOutlinedIcon style={{ fontSize: 16 }} />}
              />

              {/* Gula Darah */}
              <VitalInput
                label="Gula Darah (mg/dL)"
                placeholder="e.g. 95"
                value={glucose}
                onChange={setGlucose}
                icon={<WaterDropOutlinedIcon style={{ fontSize: 16 }} />}
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
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface font-body placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
            />beranda
            {error && <p className="text-xs text-error font-body mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAnalyze}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container font-semibold text-sm font-body px-5 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity"
              >
                Analyze & Record
                <ArrowForwardIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column — Recommendation */}
        <div className="w-55 shrink-0 bg-surface-container rounded-2xl p-5 flex flex-col gap-4 min-h-80">
          <div className="flex items-center gap-2">
            <SmartToyOutlinedIcon fontSize="small" className="text-on-surface-variant" />
            <h2 className="text-sm font-semibold font-headline text-on-surface leading-tight">
              System Recommendation
            </h2>
          </div>

          {recommendation && cfg ? (
            <div className="flex flex-col items-center gap-3 flex-1">
              {/* Icon Circle */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor} mt-2`}
              >
                {recommendation.icon}
              </div>

              {/* Badge */}
              <span
                className={`text-[10px] font-bold font-label tracking-widest uppercase px-3 py-1 rounded-full ${cfg.badge}`}
              >
                {recommendation.status}
              </span>

              {/* Title */}
              <h3
                className={`text-base font-bold font-headline text-center leading-snug ${cfg.titleColor}`}
              >
                {recommendation.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-on-surface-variant font-body text-center leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 opacity-40">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <VisibilityOutlinedIcon />
              </div>
              <p className="text-xs text-on-surface-variant font-body text-center">
                Isi form dan klik Analyze untuk melihat rekomendasi
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
