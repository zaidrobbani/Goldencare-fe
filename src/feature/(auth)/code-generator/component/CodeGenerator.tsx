"use client";

import React, { useState } from "react";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { useGenerateKode } from "@/repository/auth/query";
import type { Roles } from "@/repository/auth/dto";
import type { KodeTipe } from "@/repository/auth/dto";

// ── Role options ───────────────────────────────────────────────────────────────
const ROLE_OPTIONS: {
  value: Extract<Roles, "keluarga" | "pengurus">;
  label: string;
  description: string;
  Icon: SvgIconComponent;
}[] = [
  {
    value: "pengurus",
    label: "Perawat",
    description: "Update health vitals and daily patient progress.",
    Icon: LocalHospitalOutlinedIcon,
  },
  {
    value: "keluarga",
    label: "Keluarga",
    description: "Stay connected with your loved one's care journey.",
    Icon: GroupOutlinedIcon,
  },
];

// ── Tipe options ───────────────────────────────────────────────────────────────
const TIPE_OPTIONS: {
  value: KodeTipe;
  label: string;
  description: string;
}[] = [
  {
    value: "single_use",
    label: "Single Use",
    description: "Kode hanya bisa digunakan satu kali.",
  },
  {
    value: "multiple_use",
    label: "Multiple Use",
    description: "Kode bisa digunakan berkali-kali.",
  },
];

export default function CodeGeneratorPage() {
  const { mutate: generate, isPending } = useGenerateKode();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [role, setRole] = useState<Extract<Roles, "pengurus" | "keluarga"> | null>(null);
  const [tipe, setTipe] = useState<KodeTipe | null>(null);
  const [catatan, setCatatan] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Result state ─────────────────────────────────────────────────────────────
  const [generatedKode, setGeneratedKode] = useState<string | null>(null);
  const [generatedTipe, setGeneratedTipe] = useState<KodeTipe | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleSubmit() {
    setErrorMsg(null);

    if (!role || !tipe) {
      setErrorMsg("Role dan tipe wajib dipilih.");
      return;
    }

    generate(
      { untuk_role: role, tipe, catatan: catatan || undefined },
      {
        onSuccess: (result) => {
          if (result.success) {
            setGeneratedKode(result.data.kode);
            setGeneratedTipe(result.data.tipe);
          } else {
            setErrorMsg(result.error);
          }
        },
        onError: () => {
          setErrorMsg("Terjadi kesalahan. Coba lagi.");
        },
      }
    );
  }

  function handleCopy() {
    if (!generatedKode) return;
    navigator.clipboard.writeText(generatedKode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setErrorMsg(null);

    if (!role || !tipe) {
      setErrorMsg("Role dan tipe wajib dipilih.");
      return;
    }

    generate(
      { untuk_role: role, tipe, catatan: catatan || undefined },
      {
        onSuccess: (result) => {
          if (result.success) {
            setGeneratedKode(result.data.kode);
            setGeneratedTipe(result.data.tipe);
          } else {
            setErrorMsg(result.error);
          }
        },
        onError: () => {
          setErrorMsg("Terjadi kesalahan. Coba lagi.");
        },
      }
    );
  }

  // ── Result view ──────────────────────────────────────────────────────────────
  if (generatedKode) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckOutlinedIcon style={{ fontSize: 40 }} className="text-primary" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold font-headline text-on-surface">
              Kode Berhasil Dibuat!
            </h1>
            <p className="text-sm text-on-surface-variant font-body">
              Bagikan kode ini kepada orang yang ingin kamu undang.
            </p>
          </div>

          {/* Kode card */}
          <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 flex flex-col items-center gap-6">
            {/* Badge tipe */}
            <span className="text-xs font-semibold font-body px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-widest">
              {generatedTipe === "single_use" ? "Single Use" : "Multiple Use"}
            </span>

            {/* Kode besar */}
            <p className="text-5xl font-bold font-headline text-on-surface tracking-[0.2em]">
              {generatedKode}
            </p>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold font-body transition-all cursor-pointer ${
                copied
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {copied ? (
                <>
                  <CheckOutlinedIcon style={{ fontSize: 16 }} />
                  Tersalin!
                </>
              ) : (
                <>
                  <ContentCopyOutlinedIcon style={{ fontSize: 16 }} />
                  Salin Kode
                </>
              )}
            </button>
          </div>

          {/* Generate lagi */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-sm font-semibold font-body text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <AutorenewOutlinedIcon style={{ fontSize: 18 }} />
            Generate Kode Baru
          </button>
        </div>
      </div>
    );
  }

  // ── Form view ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-headline text-on-surface">Code Generator</h1>
          <p className="text-sm text-on-surface-variant font-body">
            Buat kode undangan untuk mengundang pengguna baru.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 flex flex-col gap-6">
          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold font-body text-on-surface">Untuk Role</label>
            <div className="flex flex-col gap-2">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-outline-variant bg-surface-container-low hover:border-primary/50 hover:bg-surface-container"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary/20" : "bg-surface-container"
                      }`}
                    >
                      <opt.Icon
                        style={{ fontSize: 20 }}
                        className={`transition-colors ${
                          isSelected ? "text-primary" : "text-on-surface-variant"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold font-body transition-colors ${
                          isSelected ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-xs font-body text-on-surface-variant">
                        {opt.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipe selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold font-body text-on-surface">Tipe Kode</label>
            <div className="flex gap-2">
              {TIPE_OPTIONS.map((opt) => {
                const isSelected = tipe === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipe(opt.value)}
                    className={`flex-1 flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-outline-variant bg-surface-container-low hover:border-primary/50 hover:bg-surface-container"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold font-body transition-colors ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs font-body text-on-surface-variant">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold font-body text-on-surface">
              Catatan <span className="font-normal text-on-surface-variant">(opsional)</span>
            </label>
            <textarea
              placeholder="Contoh: Untuk keluarga Ibu Siti"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {errorMsg && <p className="text-xs text-error font-body text-center">{errorMsg}</p>}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-primary-container text-on-primary-container font-semibold text-sm font-body py-3.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Membuat Kode..." : "Generate Kode"}
          </button>
        </div>
      </div>
    </div>
  );
}
