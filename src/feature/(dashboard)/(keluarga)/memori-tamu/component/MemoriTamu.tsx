"use client";

import React from "react";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

// ── Initial Avatar ─────────────────────────────────────────────────────────────
function InitialAvatar({
  name,
  size = 40,
  rounded = "rounded-xl",
  bgClass = "bg-surface-container-high",
  textClass = "text-on-surface-variant",
  textSize = "text-sm",
}: {
  name: string;
  size?: number;
  rounded?: string;
  bgClass?: string;
  textClass?: string;
  textSize?: string;
}) {
  const initials = name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${rounded} ${bgClass} border border-outline-variant flex items-center justify-center shrink-0`}
      style={{ width: size, height: size }}
    >
      <span className={`font-bold font-headline ${textClass} ${textSize}`}>
        {initials}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function KabarPerawatanHarian() {
  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-surface">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-on-surface leading-tight">
            Kabar Perawatan Harian
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Ringkasan perjalanan asuhan Ibu Eleanor hari ini dengan penuh kedamaian.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-primary-container text-on-primary-container font-semibold text-sm font-body px-4 py-2.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm shrink-0"
        >
          <ChatOutlinedIcon fontSize="small" />
          Hubungi Tim Pramurukti
        </button>
      </div>

      {/* ── Top Section ── */}
      <div className="flex gap-5 items-stretch">

        {/* Profile Card */}
        <div className="w-[220px] shrink-0 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 flex flex-col items-center gap-4">
          <InitialAvatar
            name="Eleanor Vance"
            size={100}
            rounded="rounded-2xl"
            bgClass="bg-primary-fixed"
            textClass="text-primary"
            textSize="text-2xl"
          />
          <div className="text-center">
            <p className="text-base font-bold font-headline text-on-surface">
              Eleanor Vance
            </p>
            <p className="text-xs text-on-surface-variant font-body mt-0.5">
              Kamar 102 &middot; Blok A
            </p>
          </div>

          {/* Suasana Hati */}
          <div className="w-full flex items-center gap-2 bg-secondary-container/40 rounded-2xl px-3 py-2.5 border border-outline-variant">
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <SentimentSatisfiedOutlinedIcon
                style={{ fontSize: 16 }}
                className="text-secondary"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-body text-on-surface-variant">
                Suasana Hati Saat Ini
              </span>
              <span className="text-xs font-bold font-headline text-on-surface">
                Tenang &amp; Ceria
              </span>
            </div>
          </div>
        </div>

        {/* Catatan Jaga */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WbSunnyOutlinedIcon fontSize="small" className="text-tertiary" />
              <h2 className="text-base font-bold font-headline text-on-surface">
                Catatan Jaga Hari Ini
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant font-body">
              Hari ini, 24 Okt
            </span>
          </div>

          {/* Quote block */}
          <div className="flex-1 bg-surface-container rounded-2xl p-5 flex flex-col gap-4 relative">
            <FormatQuoteIcon
              className="text-outline-variant absolute top-3 left-3"
              style={{ fontSize: 28 }}
            />
            <p className="text-sm font-body text-on-surface leading-relaxed italic pt-4">
              &quot;Ibu Eleanor melewati pagi yang menyenangkan. Beliau aktif mengikuti sesi terapi seni dan melukis pemandangan taman dengan cat air. Nafsu makannya sangat baik saat makan siang, dan beliau sangat menikmati sajian ayam panggang.&quot;
            </p>
            <div className="flex items-center gap-2.5 mt-auto">
              <InitialAvatar
                name="Maria S"
                size={32}
                rounded="rounded-full"
                bgClass="bg-primary-fixed"
                textClass="text-primary"
                textSize="text-xs"
              />
              <div>
                <p className="text-xs font-bold font-headline text-on-surface leading-tight">
                  Maria S.
                </p>
                <p className="text-[11px] text-on-surface-variant font-body">
                  Pramurukti Utama
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="flex gap-5 items-start">

        {/* Ringkasan Kesehatan */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <HealthAndSafetyOutlinedIcon fontSize="small" className="text-on-surface-variant" />
            <h2 className="text-base font-bold font-headline text-on-surface">
              Ringkasan Kesehatan
            </h2>
          </div>

          <div className="flex gap-4">
            {/* Tekanan Darah */}
            <div className="flex-1 bg-surface-container rounded-2xl p-4 flex flex-col gap-2 border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-body">Tekanan Darah</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-headline text-on-surface">
                  118/76
                </span>
                <span className="text-xs text-on-surface-variant font-body">mmHg</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <CheckCircleOutlinedIcon style={{ fontSize: 14 }} />
                <span className="text-xs font-semibold font-body">Batas normal</span>
              </div>
            </div>

            {/* Obat Pagi */}
            <div className="flex-1 bg-surface-container rounded-2xl p-4 flex flex-col gap-2 border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-body">Obat Pagi</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                  <MedicationOutlinedIcon style={{ fontSize: 16 }} className="text-primary" />
                </div>
                <span className="text-sm font-bold font-headline text-primary">
                  Telah Diminum
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-body">
                Diberikan pada pukul 08:30
              </p>
            </div>
          </div>
        </div>

        {/* Riwayat Kunjungan */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryOutlinedIcon fontSize="small" className="text-on-surface-variant" />
              <h2 className="text-base font-bold font-headline text-on-surface">
                Riwayat Kunjungan
              </h2>
            </div>
            <button className="text-sm font-semibold font-body text-primary hover:underline transition-all">
              Lihat Riwayat Penuh
            </button>
          </div>

          <div className="flex gap-3 items-start bg-surface-container rounded-2xl p-4 border border-outline-variant">
            <InitialAvatar
              name="David Vance"
              size={44}
              rounded="rounded-xl"
              bgClass="bg-tertiary-fixed"
              textClass="text-tertiary"
              textSize="text-sm"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm font-bold font-headline text-on-surface">
                David Vance (Anak)
              </p>
              <p className="text-[11px] text-on-surface-variant font-body">
                Minggu, 22 Okt &middot; 2 Jam
              </p>
              <p className="text-xs text-on-surface-variant font-body leading-snug mt-0.5 italic">
                &quot;Membawa album foto kesukaannya. Kami menghabiskan waktu bernostalgia dengan menyenangkan.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}